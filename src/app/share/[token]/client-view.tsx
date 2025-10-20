"use client"

import React, { useEffect, useState } from "react"
import { TravelItinerary } from "@/components/Itinerary/itinerary"

function normalizeForTravelItinerary(raw: any) {
  try {
    if (!raw) return null
    // If already in expected final format
    if (raw.success && raw.itinerary_data) return raw

    // Prefer the normalization path in TravelItinerary: success + data.daily_schedules
    if (raw.success && raw.data && Array.isArray(raw.data.daily_schedules)) {
      return {
        success: true,
        data: {
          daily_schedules: raw.data.daily_schedules,
          total_days: raw.data.total_days ?? raw.data.daily_schedules.length ?? 0,
        },
      }
    }
    if (Array.isArray(raw.daily_schedules)) {
      return {
        success: true,
        data: {
          daily_schedules: raw.daily_schedules,
          total_days: raw.total_days ?? raw.daily_schedules.length ?? 0,
        },
      }
    }

    // If wrapped under data.itinerary_data
    if (raw.success && raw.data && raw.data.itinerary_data) {
      // If data.itinerary_data contains daily_schedules, prefer data.daily_schedules path
      const ids = raw.data.itinerary_data
      if (Array.isArray(ids?.daily_schedules)) {
        return {
          success: true,
          data: {
            daily_schedules: ids.daily_schedules,
            total_days: ids.total_days ?? ids.daily_schedules.length ?? 0,
          },
        }
      }
      return { success: true, itinerary_data: raw.data.itinerary_data }
    }
    // If the API directly returns the itinerary_data-like shape
    if (raw.itinerary_data) {
      // If itinerary_data contains daily_schedules, prefer data.daily_schedules path
      if (Array.isArray(raw.itinerary_data.daily_schedules)) {
        return {
          success: true,
          data: {
            daily_schedules: raw.itinerary_data.daily_schedules,
            total_days:
              raw.itinerary_data.total_days ?? raw.itinerary_data.daily_schedules.length ?? 0,
          },
        }
      }
      return { success: true, itinerary_data: raw.itinerary_data }
    }
    // Fallback: treat raw as itinerary_data
    return { success: true, itinerary_data: raw }
  } catch {
    return null
  }
}

export default function ClientShareItineraryView({ data, token }: { data: any; token: string }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      // Log raw data for debugging the shared itinerary payload
      // eslint-disable-next-line no-console
      console.log("[share] raw itinerary data:", data)
    } catch {}
    const normalized = normalizeForTravelItinerary(data)
    if (normalized) {
      try {
        sessionStorage.setItem("itineraryData", JSON.stringify(normalized))
        sessionStorage.setItem("itineraryViewMode", "shared")
        if (token) sessionStorage.setItem("share_token", token)
      } catch {}
    }
    setReady(true)
  }, [data])

  if (!ready) {
    return (
      <div className="mx-auto max-w-4xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Shared Itinerary</h1>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">Loading…</div>
      </div>
    )
  }

  return <TravelItinerary />
}
