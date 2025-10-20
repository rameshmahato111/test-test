"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ChevronDown, DollarSign, Edit, EllipsisVertical } from "lucide-react";
import { ShareItinerary } from "@/components/Itinerary/share-itinerary";
import DatePicker from "@/components/DatePicker";
import { useAuth } from "@/contexts/AuthContext";
import { getHeaders } from "@/services/headers";
import { Input } from "@/components/ui/input";
import { tokenKey } from "@/lib/localStorage";
import { Description } from "@radix-ui/react-dialog";

type Props = {
  heroSrc?: string;
  totalDays: number;
  startDate?: string;
  endDate?: string;
  budget?: string;
  totalCost: number;
  totalCurrency?: string;
  itineraryId?: string;
  onBudgetChange?: (budget: string) => void;
};

const ItineraryHeaderCard: React.FC<Props> = ({
  heroSrc = "/images/hero_image.png",
  totalDays,
  startDate,
  endDate,
  budget,
  totalCost,
  totalCurrency,
  itineraryId,
  onBudgetChange,
}) => {
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [localStart, setLocalStart] = React.useState<Date | null>(
    startDate ? new Date(startDate) : null
  );
  const [localEnd, setLocalEnd] = React.useState<Date | null>(
    endDate ? new Date(endDate) : null
  );
  const [localBudget, setLocalBudget] = React.useState<string>(budget || "Standard");
  const [localHero, setLocalHero] = React.useState<string>(heroSrc);
  const [savingDays, setSavingDays] = React.useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { token: ctxToken } = useAuth() as any;
  const [localTitle, setLocalTitle] = React.useState<string>(`${totalDays}-Day Itinerary`);
  const [titleOpen, setTitleOpen] = React.useState<boolean>(false);
  const [imageOpen, setImageOpen] = React.useState<boolean>(false);
  const [titleDraft, setTitleDraft] = React.useState<string>(`${totalDays}-Day Itinerary`);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [savingTitle, setSavingTitle] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLocalStart(startDate ? new Date(startDate) : null);
  }, [startDate]);
  React.useEffect(() => {
    setLocalEnd(endDate ? new Date(endDate) : null);
  }, [endDate]);
  React.useEffect(() => {
    setLocalBudget(budget || "Standard");
  }, [budget]);
  // Intentionally do not sync localHero/localTitle from props after mount.
  // Server GET will hydrate persisted values, avoiding prop overrides.

  React.useEffect(() => {
    try {
      if (!itineraryId) return;
      const raw = sessionStorage.getItem(`itinerary_meta_${itineraryId}`);
      if (!raw) return;
      const meta = JSON.parse(raw);
      if (typeof meta?.title === "string" && meta.title) setLocalTitle(meta.title);
      if (typeof meta?.image === "string" && meta.image) setLocalHero(meta.image);
    } catch {}
  }, [itineraryId]);

  const apiBase = "https://api-v2.exploreden.com";
  const normalizeBearer = (raw?: string) => (raw ? String(raw).replace(/["'\s]/g, "").trim() : "");
  const getTokenNow = React.useCallback(() => {
    if (typeof window === "undefined") return ctxToken as string | undefined;
    return (
      (ctxToken as string | undefined) ||
      localStorage.getItem("authToken") ||
      (tokenKey ? localStorage.getItem(tokenKey) : null) ||
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      undefined
    );
  }, [ctxToken]);

  const patchItineraryJson = async (id: string | number, body: Record<string, any>) => {
    const url = `${apiBase}/itinify/itineraries/${id}/`;
    const tokenNow = getTokenNow();
    const h1 = getHeaders(tokenNow || undefined, true);
    let res = await fetch(url, { method: "PATCH", headers: h1, body: JSON.stringify(body) });
    if (res.status === 401 && tokenNow) {
      const h2: Record<string, string> = { ...h1, Authorization: `Bearer ${normalizeBearer(tokenNow)}` };
      res = await fetch(url, { method: "PATCH", headers: h2, body: JSON.stringify(body) });
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Failed to update itinerary (${res.status})`);
    }
    return res.json().catch(() => ({}));
  };

  const patchItineraryImage = async (id: string | number, file: File) => {
    const url = `${apiBase}/itinify/itineraries/${id}/`;
    const tokenNow = getTokenNow();
    const form = new FormData();
    form.append("image", file);
    const h1 = getHeaders(tokenNow || undefined, false);
    let res = await fetch(url, { method: "PATCH", headers: h1, body: form });
    if (res.status === 401 && tokenNow) {
      const h2: Record<string, string> = { ...h1, Authorization: `Bearer ${normalizeBearer(tokenNow)}` };
      res = await fetch(url, { method: "PATCH", headers: h2, body: form });
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Image update failed (${res.status})`);
    }
    return res.json().catch(() => ({}));
  };

  const refreshFromServer = React.useCallback(async () => {
    try {
      if (!itineraryId) return;
      const url = `${apiBase}/itinify/itineraries/${itineraryId}/`;
      const tokenNow = getTokenNow();
      const h1 = getHeaders(tokenNow || undefined, true);
      let res = await fetch(url, { method: "GET", headers: h1, cache: "no-store" });
      if (res.status === 401 && tokenNow) {
        const h2: Record<string, string> = { ...h1, Authorization: `Bearer ${normalizeBearer(tokenNow)}` };
        res = await fetch(url, { method: "GET", headers: h2, cache: "no-store" });
      }
      if (!res.ok) return;
      const data = await res.json().catch(() => ({} as any));
      const img = data?.image || data?.hero_image || data?.cover_image || data?.cover_image_url || data?.cover || data?.thumbnail;
      const title = data?.title || data?.name || data?.itinerary_title;
      if (typeof img === "string" && img) setLocalHero(img);
      if (typeof title === "string" && title) setLocalTitle(title);
    } catch {}
  }, [apiBase, getTokenNow, itineraryId]);

  React.useEffect(() => {
    void (async () => {
      await refreshFromServer();
    })();
  }, [refreshFromServer]);

  const handleEditTitle = async () => {
    try {
      if (!itineraryId) return;
      if (!titleDraft || !titleDraft.trim()) return;
      setSavingTitle(true);
      let resp: any = null;
      try {
        resp = await patchItineraryJson(itineraryId, { title: titleDraft.trim() });
      } catch (e1) {
        resp = await patchItineraryJson(itineraryId, { name: titleDraft.trim() });
      }
      const rTitle = resp?.title || resp?.name || titleDraft.trim();
      if (rTitle) setLocalTitle(String(rTitle));
      await refreshFromServer();
      try {
        const meta = { title: String(rTitle), image: localHero };
        sessionStorage.setItem(`itinerary_meta_${itineraryId}`, JSON.stringify(meta));
      } catch {}
      setTitleOpen(false);
    } catch (e: any) {
      alert(e?.message || "Failed to update title.");
    } finally {
      setSavingTitle(false);
    }
  };

  const onClickImageEdit = () => {
    if (!itineraryId) return;
    setImageOpen(true);
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !itineraryId) return;
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } catch (e: any) {
      alert(e?.message || "Failed to upload image.");
      setImageFile(null);
      setImagePreview(null);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Client-side PDF generator for the itinerary
  const handleDownloadPdf = async () => {
    try {
      const root = document.getElementById("itinerary-pdf-root");
      if (!root) return;

      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // Temporarily elevate background for consistent capture
      const previousBg = root.style.backgroundColor;
      root.style.backgroundColor = "#ffffff";

      const canvas = await html2canvas(root, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.clientWidth,
      });

      root.style.backgroundColor = previousBg;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth; // fit width
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
      position = -pageHeight;

      // Additional pages
      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
        position -= pageHeight;
      }

      const fileName = `${totalDays}-day-itinerary.pdf`;
      pdf.save(fileName);
    } catch (e) {
      console.error("PDF export failed", e);
    }
  };

  return (
    <div className="relative">
      <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-[320px] xl:h-[360px]">
        <Image
          src={localHero}
          alt="city-image"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          className="object-cover"
          priority
        />
        {itineraryId ? (
          <button
            type="button"
            onClick={onClickImageEdit}
            className="absolute top-4 right-4 z-30 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-700 shadow px-2 py-2"
            aria-label="Edit cover image"
            disabled={uploadingImage}
          >
            <Edit className="w-4 h-4" />
          </button>
        ) : null}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileSelected}
        />
        {uploadingImage ? (
          <div className="absolute inset-0 z-20 bg-black/20 flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : null}
      </div>

      <div className="absolute bottom-0 inset-x-0 mx-auto transform translate-y-1/2 w-[90%] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl z-20">
        <div className="bg-white shadow-xl rounded-2xl">
          <div className="p-3 sm:p-5 lg:p-6">
            {/* Title + Price */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                  {localTitle}
                </h1>
                {itineraryId ? (
                  <button
                    type="button"
                    onClick={() => setTitleOpen(true)}
                    className="inline-flex items-center justify-center rounded-md hover:bg-gray-100 p-1"
                    aria-label="Edit total days"
                    disabled={savingTitle}
                  >
                    <Edit className="w-4 h-4 text-gray-700" />
                  </button>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-sm sm:text-base md:text-base lg:text-lg font-semibold">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                <span>{`${totalCurrency ? totalCurrency + " " : ""}${Number(totalCost).toLocaleString()}`}</span>
              </div>
            </div>

            {/* Date and Budget selectors */}
            <div className="flex flex-col lg:flex-row lg:flex-nowrap gap-2 sm:gap-3 md:gap-4 mb-5 md:mb-6">
              {/* Date Picker trigger (popover) */}
              <div className="w-full lg:w-auto">
                <DatePicker
                  startDate={localStart}
                  endDate={localEnd}
                  onDateChange={(s, e) => {
                    setLocalStart(s);
                    setLocalEnd(e);
                  }}
                  placeholderFirst="Start Date"
                  placeholderSecond="End Date"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full lg:w-auto flex items-center gap-1.5 text-gray-600 bg-white text-[10px] sm:text-xs md:text-sm lg:text-base"
                  >
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-gray-400" />
                    {localBudget}
                    <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-[3000] w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-[0_12px_28px_rgba(0,0,0,0.12)]" align="start" sideOffset={8}>
                  <DropdownMenuItem
                    className="rounded-lg"
                    onClick={() => {
                      setLocalBudget("Economic");
                      if (typeof onBudgetChange === "function") onBudgetChange("Economic");
                    }}
                  >
                    Economic
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-lg"
                    onClick={() => {
                      setLocalBudget("Standard");
                      if (typeof onBudgetChange === "function") onBudgetChange("Standard");
                    }}
                  >
                    Standard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-lg"
                    onClick={() => {
                      setLocalBudget("Luxury");
                      if (typeof onBudgetChange === "function") onBudgetChange("Luxury");
                    }}
                  >
                    Luxury
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Progress + Share + More */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-5 md:mb-6">
              <div className="flex-1 bg-gray-200 rounded-full h-1 sm:h-1.5 md:h-2">
                <div className="bg-pink-500 h-1 sm:h-1.5 md:h-2 rounded-full" style={{ width: "10%" }} />
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600">10%</span>
              <div className="flex gap-2">
                <div>
                  <ShareItinerary itineraryId={itineraryId as any} />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 w-9 h-9 sm:w-10 sm:h-10 border border-slate-300 rounded-full flex items-center justify-center"
                  aria-label="More options"
                  onClick={() => setMoreOpen(true)}
                >
                  <EllipsisVertical className="w-4 h-4 text-slate-700" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More actions modal */}
      <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
        <DialogContent className="w-[92vw] max-w-[92vw] sm:max-w-xs rounded-2xl p-0">
          <Description></Description>
          <DialogHeader className="sr-only">
            <DialogTitle>More</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={() => setMoreOpen(false)}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span className="font-medium">Publish</span>
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setMoreOpen(false);
                handleDownloadPdf();
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              <span className="font-medium">Download as PDF</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={titleOpen} onOpenChange={(v) => { setTitleOpen(v); if (!v) setTitleDraft(localTitle); }}>
        <DialogContent className="w-[92vw] max-w-[92vw] sm:max-w-sm rounded-2xl">
          <Description></Description>
          <DialogHeader>
            <DialogTitle>Edit Title</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} placeholder="Enter title" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setTitleOpen(false); setTitleDraft(localTitle); }}>Cancel</Button>
              <Button onClick={handleEditTitle} disabled={savingTitle || !titleDraft.trim()}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={imageOpen} onOpenChange={(v) => { setImageOpen(v); if (!v) { setImageFile(null); setImagePreview(null); } }}>
        <DialogContent className="w-[92vw] max-w-[92vw] sm:max-w-sm rounded-2xl">
          <Description></Description>
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelected} />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
            ) : null}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setImageOpen(false); setImageFile(null); setImagePreview(null); }}>Cancel</Button>
              <Button onClick={async () => {
                try {
                  if (!itineraryId || !imageFile) return;
                  setUploadingImage(true);
                  const resp = await patchItineraryImage(itineraryId, imageFile);
                  const img = resp?.image || resp?.hero_image || resp?.cover_image || resp?.cover_image_url || resp?.cover || resp?.thumbnail;
                  if (typeof img === "string" && img) setLocalHero(img);
                  else if (imagePreview) setLocalHero(imagePreview);
                  await refreshFromServer();
                  try {
                    const meta = { title: localTitle, image: typeof img === "string" && img ? img : (imagePreview || localHero) };
                    sessionStorage.setItem(`itinerary_meta_${itineraryId}`, JSON.stringify(meta));
                  } catch {}
                  setImageOpen(false);
                  setImageFile(null);
                  setImagePreview(null);
                } catch (e: any) {
                  alert(e?.message || "Failed to update image.");
                } finally {
                  setUploadingImage(false);
                }
              }} disabled={uploadingImage || !imageFile}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItineraryHeaderCard;
