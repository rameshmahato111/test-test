"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Share2Icon, X, Globe } from "lucide-react"
import { getHeaders } from "@/services/headers"
import { useAuth } from "@/contexts/AuthContext"
import { Checkbox } from "@/components/ui/checkbox"

type Permission = "view" | "edit" | 'anyone' | string

type ItineraryShare = {
  id: number
  shared_with_email: string | null
  permission: Permission
  share_token: string
  created_at: string
  updated_at: string
}

export function ShareItinerary({ itineraryId }: { itineraryId: string | number }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shares, setShares] = useState<ItineraryShare[]>([])
  const [shareMode, setShareMode] = useState<"edit" | "view">("view")
  const [shareUrl, setShareUrl] = useState("")
  const [publishToItinify, setPublishToItinify] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const { token: ctxToken } = useAuth() as any
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)

  const tokenNow = useMemo(() => {
    if (typeof window === "undefined") return ctxToken
    return (
      ctxToken ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      undefined
    ) as string | undefined
  }, [ctxToken])

  const apiBase = "https://api-v2.exploreden.com"
  const postShareUrl = `${apiBase}/itinify/itineraries/${itineraryId}/share/`
  const listSharesUrl = `${apiBase}/itinify/itineraries/${itineraryId}/shares/`
  const updateShareUrl = (shareToken: string) => `${apiBase}/itinify/shares/${shareToken}/update_itinerary/`

  const normalizeBearer = (raw?: string) =>
    (raw ? String(raw).replace(/["'\s]/g, "").trim() : "")

  const fetchShares = async (): Promise<{ items: ItineraryShare[]; url: string }> => {
    try {
      if (!itineraryId) return { items: [], url: "" }
      const h1 = getHeaders(tokenNow || undefined)
      const res = await fetch(listSharesUrl, { headers: h1, method: "GET" })
      if (res.status === 401 && tokenNow) {
        const h2 = { ...h1, Authorization: `Bearer ${normalizeBearer(tokenNow)}` }
        const res2 = await fetch(listSharesUrl, { headers: h2, method: "GET" })
        if (!res2.ok) throw new Error(`Failed to fetch shares: ${res2.status}`)
        const data = (await res2.json()) as ItineraryShare[]
        const items = Array.isArray(data) ? data : []
        setShares(items)
        const url = deriveShareUrl(items)
        if (url) setShareUrl(url)
        return { items, url: url || "" }
      }
      if (!res.ok) throw new Error(`Failed to fetch shares: ${res.status}`)
      const data = (await res.json()) as ItineraryShare[]
      const items = Array.isArray(data) ? data : []
      setShares(items)
      const url = deriveShareUrl(items)
      if (url) setShareUrl(url)
      return { items, url: url || "" }
    } catch (e: any) {
      setShares([])
      toast({
        title: "Unable to load shares",
        description: e?.message || "Please try again.",
        variant: "destructive",
      })
      return { items: [], url: "" }
    }
  }

  const deriveShareUrl = (items: ItineraryShare[]) => {
    const first = items?.[0]
    const token = first?.share_token
    if (!token) return ""
    const origin = typeof window !== "undefined" ? window.location.origin : "https://exploreden.com"
    return `${origin}/share/${token}`
  }

  const handlePublish = async () => {
    try {
      setLoading(true)
      const body = JSON.stringify({
        shared_with_email: null,
        permission: "anyone",
      })
      const h1 = getHeaders(tokenNow || undefined)
      let res = await fetch(postShareUrl, { method: "POST", headers: h1, body })
      if (res.status === 401 && tokenNow) {
        const h2 = { ...h1, Authorization: `Bearer ${normalizeBearer(tokenNow)}` }
        res = await fetch(postShareUrl, { method: "POST", headers: h2, body })
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `Publish failed (${res.status})`)
      }
      await fetchShares()
      toast({ title: "Itinerary published", description: `Public link created (anyone with the link can view).` })
    } catch (e: any) {
      toast({ title: "Publish failed", description: e?.message || "Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvite = async () => {
    try {
      if (!email) {
        toast({ title: "Email required", description: "Enter an email to share with edit access." })
        return
      }
      setSending(true)
      const body = JSON.stringify({
        shared_with_email: email,
        permission: "edit",
      })
      const h1 = getHeaders(tokenNow || undefined)
      let res = await fetch(postShareUrl, { method: "POST", headers: h1, body })
      if (res.status === 401 && tokenNow) {
        const h2 = { ...h1, Authorization: `Bearer ${normalizeBearer(tokenNow)}` }
        res = await fetch(postShareUrl, { method: "POST", headers: h2, body })
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `Invite failed (${res.status})`)
      }
      const created = (await res.json()) as ItineraryShare | null
      try {
        const token = created?.share_token
        if (token) {
          const h3 = getHeaders(tokenNow || undefined)
          let res2 = await fetch(updateShareUrl(token), { method: "PATCH", headers: h3, body: JSON.stringify({}) })
          if (res2.status === 401 && tokenNow) {
            const h4 = { ...h3, Authorization: `Bearer ${normalizeBearer(tokenNow)}` }
            res2 = await fetch(updateShareUrl(token), { method: "PATCH", headers: h4, body: JSON.stringify({}) })
          }
          if (res2.status === 405) {
            // Fallback to PUT if PATCH not allowed
            const h5 = getHeaders(tokenNow || undefined)
            let res3 = await fetch(updateShareUrl(token), { method: "PUT", headers: h5, body: JSON.stringify({}) })
            if (res3.status === 401 && tokenNow) {
              const h6 = { ...h5, Authorization: `Bearer ${normalizeBearer(tokenNow)}` }
              await fetch(updateShareUrl(token), { method: "PUT", headers: h6, body: JSON.stringify({}) })
            }
          }
        }
      } catch {
        // ignore non-fatal update failures
      }
      await fetchShares()
      setEmail("")
      toast({ title: "Invite sent", description: "User can edit this itinerary." })
    } catch (e: any) {
      toast({ title: "Invite failed", description: e?.message || "Please try again.", variant: "destructive" })
    } finally {
      setSending(false)
    }
  }

  const handleCopy = async () => {
    try {
      if (!shareUrl) {
        toast({ title: "No link yet", description: "Publish to generate a link." })
        return
      }
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err: any) {
      toast({ title: "Copy failed", description: err?.message || "Please try again.", variant: "destructive" })
    }
  }

  const handleSocialShare = (platform: string) => {
    const url = shareUrl || deriveShareUrl(shares)
    if (!url) {
      toast({ title: "No link yet", description: "Publish to generate a link." })
      return
    }
    const encodedUrl = encodeURIComponent(url)
    const text = encodeURIComponent("Check out this itinerary!")
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${text}`,
      instagram: `https://www.instagram.com/`,
    }
    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400")
    }
  }

  const autoCreateTried = useRef(false)

  useEffect(() => {
    if (!open) {
      autoCreateTried.current = false
      return
    }
    const init = async () => {
      const { url } = await fetchShares()
      if (!url && !autoCreateTried.current) {
        autoCreateTried.current = true
        await handlePublish()
      }
    }
    void init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, itineraryId])

  return (
    <>
      <Button variant="ghost" size="sm" className="p-1 sm:p-2" onClick={() => setOpen(true)}>
        <Share2Icon className="w-3 h-3 sm:w-4 sm:h-4" />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 sm:mb-8 flex items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">Share Itinerary</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
            </div>

            <div className="mb-6 flex gap-3 sm:gap-4">
              <button
                onClick={() => setShareMode("edit")}
                className={`flex-1 rounded-xl py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                  shareMode === "edit"
                    ? "bg-white text-gray-900 shadow-md ring-2 ring-gray-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Can Edit
              </button>
              <button
                onClick={() => setShareMode("view")}
                className={`flex-1 rounded-xl py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                  shareMode === "view"
                    ? "bg-white text-gray-900 shadow-md ring-2 ring-gray-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                View Only
              </button>
            </div>

            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3">
              {shareMode === "view" ? (
                <>
                  <Input
                    value={shareUrl}
                    readOnly
                    placeholder="Your share link will appear here"
                    className="h-12 sm:h-14 flex-1 rounded-xl border-gray-200 bg-gray-50 px-4 sm:px-5 text-xs sm:text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                  <Button
                    onClick={handleCopy}
                    className="h-12 sm:h-14 rounded-xl bg-pink-500 px-5 sm:px-7 text-sm sm:text-base font-medium text-white hover:bg-pink-600 transition-colors"
                    disabled={!shareUrl}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    onClick={() => shareUrl && window.open(shareUrl, "_blank")}
                    className="h-12 sm:h-14 rounded-xl bg-gray-900 px-5 sm:px-7 text-sm sm:text-base font-medium text-white hover:bg-black transition-colors"
                    disabled={!shareUrl}
                    variant="secondary"
                  >
                    View
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to grant edit access"
                    className="h-12 sm:h-14 flex-1 rounded-xl border-gray-200 bg-white px-4 sm:px-5 text-xs sm:text-sm text-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                  <Button
                    onClick={handleSendInvite}
                    className="h-12 sm:h-14 rounded-xl bg-pink-500 px-5 sm:px-7 text-sm sm:text-base font-medium text-white hover:bg-pink-600 transition-colors"
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send Invite"}
                  </Button>
                </>
              )}
            </div>

            <div className="mb-6 sm:mb-8">
              <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-gray-700">Share using</h3>
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                <button onClick={() => handleSocialShare("facebook")} className="flex flex-col items-center gap-2 sm:gap-3 transition-transform hover:scale-110">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#1877F2]">
                    <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700">Facebook</span>
                </button>
                <button onClick={() => handleSocialShare("whatsapp")} className="flex flex-col items-center gap-2 sm:gap-3 transition-transform hover:scale-110">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366]">
                    <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700">WhatsApp</span>
                </button>
                <button onClick={() => handleSocialShare("x")} className="flex flex-col items-center gap-2 sm:gap-3 transition-transform hover:scale-110">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-black">
                    <svg className="h-5 w-5 sm:h-7 sm:w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700">X</span>
                </button>
                <button onClick={() => handleSocialShare("telegram")} className="flex flex-col items-center gap-2 sm:gap-3 transition-transform hover:scale-110">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#0088cc]">
                    <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700">Telegram</span>
                </button>
                <button onClick={() => handleSocialShare("instagram")} className="flex flex-col items-center gap-2 sm:gap-3 transition-transform hover:scale-110">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]">
                    <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.072 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.61-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700">Instagram</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3">
                
                <label htmlFor="publish" className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-base">Publish my itinerary to Itinify.</span>
                </label>
              </div>
              <Button onClick={handlePublish} className="w-full sm:w-auto h-11 sm:h-12 rounded-xl bg-pink-500 px-7 sm:px-9 text-sm sm:text-base font-medium text-white hover:bg-pink-600 transition-colors" disabled={loading}>
                Publish
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

