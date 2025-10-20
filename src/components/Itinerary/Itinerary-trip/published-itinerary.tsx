"use client"

import React from "react"
import { PublishedCard, type PublishedItem } from "./published-card"
import { Button } from "@/components/ui/button"
import { Pagination } from "./pagination"
import { HotelSearchSection } from "./hotel-search-section"

const CATEGORIES = [
  "All",
  "Adventure",
  "Sports",
  "Wildlife & Nature",
  "NightLife",
  "Family Fun",
  "Local Experiences",
  "Arts & Culture",
  "Wellness",
]

const MOCK_PUBLISHED: PublishedItem[] = [
  {
    id: "1",
    title: "Sydney The Rocks Guided Walking Tour",
    city: "Canberra",
    country: "Australia",
    cityType: "City Trip",
    days: 7,
    nights: 6,
    image: "/images/card-1.png",
    categories: ["Adventure", "NightLife", "Wellness"],
    price: "$52.55",
    rating: "8.5k+",
    likes: "3k+",
  },
  {
    id: "2",
    title: "Sydney The Rocks Guided Walking Tour",
    city: "Canberra",
    country: "Australia",
    cityType: "City Trip",
    days: 7,
    nights: 6,
    image: "/images/card-2.png",
    categories: ["Adventure", "Wellness"],
    price: "$52.55",
    rating: "8.5k+",
    likes: "3k+",
  },
  {
    id: "3",
    title: "Sydney The Rocks Guided Walking Tour",
    city: "Canberra",
    country: "Australia",
    cityType: "City Trip",
    days: 7,
    nights: 6,
    image: "/images/card-3.png",
    categories: ["NightLife", "Arts & Culture"],
    price: "$52.55",
    rating: "8.5k+",
    likes: "3k+",
  },
]

const PublishedItinerary = () => {
  const [selected, setSelected] = React.useState<string>("All")

  const items = React.useMemo(() => {
    if (selected === "All") return MOCK_PUBLISHED
    return MOCK_PUBLISHED.filter((i) => i.categories.includes(selected))
  }, [selected])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((c) => {
          const active = selected === c
          return (
            <Button
              key={c}
              size="sm"
              variant={active ? "default" : "secondary"}
              onClick={() => setSelected(c)}
              className={
                active
                  ? "rounded-full bg-pink-500 hover:bg-pink-600 text-white"
                  : "rounded-full bg-gray-100 text-gray-700 border-0 hover:bg-gray-200"
              }
            >
              {c}
            </Button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PublishedCard key={item.id} item={item} />
        ))}
      </div>

      <div>
        <Pagination currentPage={0} totalPages={0} onPageChange={function (page: number): void {
          
        } }/>
      </div>

      <div>
        <HotelSearchSection/>
      </div>
    </div>
  )
}

export default PublishedItinerary