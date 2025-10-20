import React from "react"
import ClientShareItineraryView from "./client-view"

async function getItinerary(token: string) {
  const res = await fetch(`https://api-v2.exploreden.com/itinify/shares/${encodeURIComponent(token)}/itinerary/`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Failed to load shared itinerary (${res.status})`)
  }
  return res.json()
}

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  let data: any = null
  let error: string | null = null

  try {
    data = await getItinerary(token)
  } catch (e: any) {
    error = e?.message || "Unable to load shared itinerary."
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Shared Itinerary</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">{error}</div>
      </div>
    )
  }

  return <ClientShareItineraryView data={data} token={token} />
}
