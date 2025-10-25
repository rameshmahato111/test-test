"use client"

import React, { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, ChevronDown, Heart, Plus, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type Place = {
  id: string
  title: string
  rating: number
  image: string
}

type Props = {
  // Back-compat: mixed list
  items?: Place[]
  heading?: string
  // New categorized lists: if provided, they drive the category filter
  itemsAttractions?: Place[]
  itemsNightlife?: Place[]
  itemsRestaurants?: Place[]
}

function RatingStars({ value }: { value: number }) {
  // Show value and 5 yellow stars to mimic visual from screenshot
  return (
    <div className="flex items-center gap-1">
      <span className="text-[13px] text-gray-700 font-medium">{value.toFixed(1)}</span>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
    </div>
  )
}

export default function RecommendationItineraryPlaces({ items = [], heading = "More Recommended Places", itemsAttractions = [], itemsNightlife = [], itemsRestaurants = [] }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<"all" | "attractions" | "nightlife" | "restaurants">("all")
  const shortTitle = (t: string = "") => {
    const s = t.toString().trim()
    return s.length > 28 ? s.slice(0, 28) + "…" : s
  }

  // Build the mixed list if categorized props are provided; otherwise fallback to `items`
  const mixedFromCategories = useMemo(() => {
    const groups: Place[][] = []
    if (itemsAttractions?.length) groups.push(itemsAttractions)
    if (itemsNightlife?.length) groups.push(itemsNightlife)
    if (itemsRestaurants?.length) groups.push(itemsRestaurants)
    if (groups.length) {
      // Flatten and ensure unique keys by using a Map
      const uniquePlaces = new Map<string, Place>()
      groups.flat().forEach(place => {
        uniquePlaces.set(place.id, place)
      })
      return Array.from(uniquePlaces.values())
    }
    return items
  }, [items, itemsAttractions, itemsNightlife, itemsRestaurants])

  const filteredByCategory = useMemo(() => {
    switch (category) {
      case "attractions":
        return itemsAttractions?.length ? itemsAttractions : items
      case "nightlife":
        return itemsNightlife?.length ? itemsNightlife : items
      case "restaurants":
        return itemsRestaurants?.length ? itemsRestaurants : items
      default:
        return mixedFromCategories
    }
  }, [category, items, itemsAttractions, itemsNightlife, itemsRestaurants, mixedFromCategories])

  const data = useMemo(() => {
    const q = query.trim().toLowerCase()
    const src = filteredByCategory
    if (!q) return src
    return src.filter((p) => (p.title || "").toLowerCase().includes(q))
  }, [filteredByCategory, query])

  const scrollByCard = (dir: 1 | -1) => {
    const scroller = scrollerRef.current as HTMLDivElement | null
    if (!scroller) return
    const children = Array.from(scroller.children) as HTMLElement[]
    if (children.length === 0) return

    // Determine step based on current viewport: first card is larger
    const firstWidth = children[0].offsetWidth
    const gap = 16 // gap-4
    const step = firstWidth + gap
    scroller.scrollBy({ left: dir * step, behavior: "smooth" })
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Search Row */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 h-12 relative z-0 min-w-0">
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="w-4 h-4" />
          <input
            className="outline-none text-sm placeholder:text-gray-400 flex-1 min-w-0 sm:w-64"
            placeholder="Search near your hotel"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center shrink-0 w-[45%] sm:w-auto min-w-0">
          <Select value={category} onValueChange={(v) => setCategory(v as any)}>
            <SelectTrigger className="w-full sm:w-40 h-9 text-sm truncate">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent
              className="z-40 bg-white border border-gray-200 shadow-2xl pointer-events-auto"
              position="popper"
              side="bottom"
              align="end"
              sideOffset={8}
            >
              <SelectItem className="bg-white hover:bg-gray-50" value="all">All</SelectItem>
              <SelectItem className="bg-white hover:bg-gray-50" value="attractions">Attractions</SelectItem>
              <SelectItem className="bg-white hover:bg-gray-50" value="nightlife">Nightlife</SelectItem>
              <SelectItem className="bg-white hover:bg-gray-50" value="restaurants">Restaurants</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Heading */}
      {data.length > 0 && (
        <h2 className="mt-6 text-xl sm:text-2xl font-semibold text-gray-800">{heading}</h2>
      )}

      {/* Carousel */}
      <div className="relative mt-4">
        {/* Desktop nav buttons */}
        <div className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-[1]">
          <button
            aria-label="Previous"
            onClick={() => scrollByCard(-1)}
            className="h-9 w-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center"
          >
            <span className="sr-only">Previous</span>
            {/* chevron left using rotate */}
            <ChevronDown className="h-5 w-5 text-gray-700 -rotate-90" />
          </button>
        </div>
        <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-[1]">
          <button
            aria-label="Next"
            onClick={() => scrollByCard(1)}
            className="h-9 w-9 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center"
          >
            <span className="sr-only">Next</span>
            <ChevronDown className="h-5 w-5 text-gray-700 rotate-90" />
          </button>
        </div>

        {/* Scroll area with snap and swipe support */}
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-2 pr-12 pl-1 scroll-smooth snap-x snap-mandatory z-0"
        >
          {data.map((place: Place) => (
            <Card
              key={place.id}
              className={`shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(0,0,0,0.08)] snap-start w-[calc(100%-4rem)] sm:min-w-[420px] z-0`}
            >
              <div className="flex">
                {/* Image */}
                <div className={`w-[46%] h-[120px] sm:w-[210px] sm:h-[140px] relative overflow-hidden`}>
                  <Image
                    src={place.image}
                    alt={place.title}
                    fill
                    sizes="(max-width: 640px) 46vw, 210px"
                    className="object-cover"
                    loading="lazy"
                    quality={75}
                  />

                  {/* Like button */}
                  <button className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/95 shadow flex items-center justify-center z-[1]">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[16px] sm:text-[18px] font-semibold text-gray-800 leading-snug whitespace-pre-line" title={place.title}>
                      {shortTitle(place.title)}
                    </h3>
                    <div className="mt-2">
                      <RatingStars value={place.rating} />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-gray-200 flex items-center justify-center shadow-sm bg-white">
                      <Plus className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6 border-t border-gray-200" />
    </div>
  )
}

