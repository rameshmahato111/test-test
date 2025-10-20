"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DealCard, type Deal } from "./deal-card"

const categories = ["Hotel", "Local Experience", "Wildlife & Nature", "food", "Wellness", "Family Fun"]

const deals: Deal[] = [
  {
    id: "1",
    title: "Room in hotel in Pokhara",
    image: "/images/city_landscape.jpg",
    rating: 4.5,
    location: "Pokhara",
    originalPrice: 65.55,
    discountedPrice: 52.55,
    discount: 10,
    credits: 14,
    onbooking: true,
  },
  {
    id: "2",
    title: "Majestic Lake Front Hotel & Suites...",
    image: "/images/city-1.png",
    rating: 4.5,
    location: "Pokhara",
    originalPrice: 65.55,
    discountedPrice: 52.55,
    discount: 10,
    credits: 14,
    onbooking: true,
  },
  {
    id: "3",
    title: "Entire rental unit in Temple Resort",
    image: "/images/city-2.png",
    rating: 4.5,
    location: "Pokhara",
    originalPrice: 65.55,
    discountedPrice: 52.55,
    discount: 10,
    credits: 14,
    onbooking: true,
  },
  {
    id: "4",
    title: "Pokhara Aagantuk Hotel...",
    image: "/images/default-city.jpeg",
    rating: 4.5,
    location: "Pokhara",
    originalPrice: 65.55,
    discountedPrice: 52.55,
    discount: 10,
    credits: 14,
    onbooking: true,
  },
  {
    id: "5",
    title: "Mountain View Resort & Spa",
    image: "/images/default-landscape.png",
    rating: 4.5,
    location: "Pokhara",
    originalPrice: 65.55,
    discountedPrice: 52.55,
    discount: 10,
    credits: 14,
    onbooking: true,
  },
  {
    id: "6",
    title: "Riverside Boutique Hotel",
    image: "/boutique-hotel-riverside-view.jpg",
    rating: 4.5,
    location: "Pokhara",
    originalPrice: 65.55,
    discountedPrice: 52.55,
    discount: 10,
    credits: 14,
    onbooking: true,
  },
]

export function TopDealsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340 // card width + gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Top Deals</h2>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")} className="h-10 w-10 rounded-lg">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")} className="h-10 w-10 rounded-lg">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className="rounded-full px-6 whitespace-nowrap hover:bg-gray-100 bg-transparent"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Deals Carousel */}
      <div ref={scrollContainerRef} className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  )
}
