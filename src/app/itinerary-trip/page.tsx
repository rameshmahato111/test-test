"use client"
import React, { Suspense } from "react"
import { HotelSearchSection } from "@/components/Itinerary/Itinerary-trip/hotel-search-section"
import { Pagination } from "@/components/Itinerary/Itinerary-trip/pagination"
import { SectionHeader } from "@/components/Itinerary/Itinerary-trip/section-header"
import { TripCard } from "@/components/Itinerary/Itinerary-trip/trip-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Search, ChevronDown, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import PublishedItinerary from "@/components/Itinerary/Itinerary-trip/published-itinerary"

// Dummy data for trips
const ongoingTrips = [
  {
    id: "1",
    title: "Powerhouse Bungee Jump",
    location: "Sydney",
    startDate: "12th Aug",
    endDate: "15th Aug",
    price: "$52.55",
    rating: 5.0,
    image: "/images/card-1.png",
    isFavorite: false,
  },
  {
    id: "2",
    title: "Sydney Opera House Tour",
    location: "Sydney",
    startDate: "14th Aug",
    endDate: "15th Aug",
    price: "$52.55",
    rating: 5.0,
    image: "/images/card-2.png",
    isFavorite: false,
  },
  {
    id: "3",
    title: "Kayaking by the Bay",
    location: "Sydney",
    startDate: "15th Aug",
    endDate: "16th Aug",
    price: "$52.55",
    rating: 5.0,
    image: "/images/card-3.png",
    isFavorite: false,
  },
  {
    id: "4",
    title: "Bondi Farmhouse Tour",
    location: "Sydney",
    startDate: "12th Aug",
    endDate: "15th Aug",
    price: "$52.55",
    rating: 5.0,
    image: "/images/city-1.png",
    isFavorite: false,
  },
]

const upcomingTrips = [
  {
    id: "5",
    title: "Opera House Kayak Expedition",
    location: "Sydney",
    startDate: "12th Aug",
    endDate: "15th Aug",
    price: "$52.55",
    rating: 5.0,
    image: "/images/city-2.png",
    isFavorite: false,
  },
  {
    id: "6",
    title: "Sydney Skydiving Thrills",
    location: "Sydney",
    startDate: "12th Aug",
    endDate: "15th Aug",
    price: "$52.55",
    rating: 5.0,
    image: "/images/city-1.png",
    isFavorite: false,
  },
  {
    id: "7",
    title: "Sydney City Trip",
    location: "Sydney",
    startDate: "12th Aug",
    endDate: "16th Aug",
    price: "$52.55",
    rating: 5.0,
    image: "/images/city-1.png",
    isFavorite: false,
  },
  {
    id: "8",
    title: "Harbour Cliff Rock Climbing",
    location: "Sydney",
    startDate: "12th Aug",
    endDate: "15th Aug",
    price: "$52.55",
    rating: 5.0,
    image: "/images/city-1.png",
    isFavorite: false,
  },
]

const completedTrips = [
  {
    id: "9",
    title: "Blue Mountains Hiking",
    location: "Sydney",
    startDate: "1st Aug",
    endDate: "3rd Aug",
    price: "$45.00",
    rating: 5.0,
    image: "/images/city-1.png",
    isFavorite: true,
  },
  {
    id: "10",
    title: "Harbour Bridge Climb",
    location: "Sydney",
    startDate: "5th Aug",
    endDate: "5th Aug",
    price: "$89.99",
    rating: 5.0,
    image: "/images/city-1.png",
    isFavorite: false,
  },
]

export default function Home() {
  const upcomingRef = React.useRef<HTMLDivElement | null>(null)
  const completedRef = React.useRef<HTMLDivElement | null>(null)
  const [activeTab, setActiveTab] = React.useState<"my-trips" | "published">("my-trips")

  const getStepSize = (el: HTMLDivElement): number => {
    const cards = el.querySelectorAll('[data-trip-card]') as NodeListOf<HTMLElement>
    if (cards && cards.length >= 2) {
      const a = cards[0].getBoundingClientRect()
      const b = cards[1].getBoundingClientRect()
      // Distance from start of one card to the next (includes gap)
      return Math.max(1, Math.round(b.left - a.left))
    }
    const first = cards[0]
    const width = first ? first.getBoundingClientRect().width : 320
    const gap = 16 // fallback gap consistent with "gap-4"
    return width + gap
  }

  const scrollSnap = (ref: React.RefObject<HTMLDivElement | null>, dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const cards = Array.from(el.querySelectorAll('[data-trip-card]')) as HTMLElement[]
    if (cards.length === 0) return
    const current = el.scrollLeft
    const epsilon = 1 // tolerance for float rounding

    if (dir === 1) {
      // Find the first card whose start is after the current scrollLeft
      const next = cards.find((c) => c.offsetLeft > current + epsilon)
      const target = next ? next.offsetLeft : cards[cards.length - 1].offsetLeft
      el.scrollTo({ left: target, behavior: 'smooth' })
    } else {
      // Find the last card whose start is before the current scrollLeft
      const prev = [...cards].reverse().find((c) => c.offsetLeft < current - epsilon)
      const target = prev ? prev.offsetLeft : 0
      el.scrollTo({ left: target, behavior: 'smooth' })
    }
  }

  return (
    <Suspense fallback={null}>
    <div className="min-h-screen bg-gray-50">
      {/* Header with background image */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <Image src="/images/hero_image.png" alt="Tropical beach header" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Itineraries</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation tabs */}
        <div className="flex items-center gap-4 mb-6">
          {/* Tabs with baseline under them */}
          <div className="flex-1 flex items-center gap-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("my-trips")}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
                activeTab === "my-trips"
                  ? "text-pink-600 border-pink-500"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              My Trips
            </button>
            <button
              onClick={() => setActiveTab("published")}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
                activeTab === "published"
                  ? "text-pink-600 border-pink-500"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Published
            </button>
          </div>
          <div>
            <Link href={'/itinerary'}>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create new itinerary
              </Button>
            </Link>
          </div>
        </div>

       
  
       

        

        {activeTab === "my-trips" ? (
          <>
            {/* Upcoming trips */}
            <div className="mb-8">
              <SectionHeader
                title="Upcoming"
                onPrev={() => scrollSnap(upcomingRef, -1)}
                onNext={() => scrollSnap(upcomingRef, 1)}
              />
              <div className="relative">
                <div
                  ref={upcomingRef}
                  className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth pr-2"
                >
                  {upcomingTrips.map((trip) => (
                    <div
                      key={trip.id}
                      data-trip-card
                      className="flex-shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-1/3"
                    >
                      <TripCard {...trip} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Hotel search section */}
            <HotelSearchSection />
            {/* Completed trips */}
            <div className="mb-8">
              <SectionHeader
                title="My Completed Trips"
                onPrev={() => scrollSnap(completedRef, -1)}
                onNext={() => scrollSnap(completedRef, 1)}
              />
              <div className="relative">
                <div
                  ref={completedRef}
                  className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth pr-2"
                >
                  {completedTrips.map((trip) => (
                    <div
                      key={trip.id}
                      data-trip-card
                      className="flex-shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-1/3"
                    >
                      <TripCard {...trip} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <PublishedItinerary />
        )}
      </div>
    </div>
    </Suspense>
  )
}
