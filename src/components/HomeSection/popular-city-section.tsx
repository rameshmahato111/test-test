"use client"

import { ChevronRight } from "lucide-react"
import { useRef } from "react"

interface City {
  id: string
  name: string
  image: string
}

const cities: City[] = [
  {
    id: "tokyo",
    name: "Tokyo",
    image: "/images/city_landscape.jpg",
  },
  {
    id: "sydney",
    name: "Sydney",
    image: "/images/city-1.png",
  },
  {
    id: "perth",
    name: "Perth",
    image: "/images/city-2.png",
  },
  {
    id: "melbourne",
    name: "Melbourne",
    image: "/melbourne-beach-aerial-view.jpg",
  },
  {
    id: "madagascar",
    name: "Madagascar",
    image: "/madagascar-tropical-island-resort.jpg",
  },
  {
    id: "moscow",
    name: "Moscow",
    image: "/moscow-city-skyline.jpg",
  },
]

export default function PopularCities() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const currentScroll = scrollContainerRef.current.scrollLeft
      const targetScroll = direction === "right" ? currentScroll + scrollAmount : currentScroll - scrollAmount

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="w-full px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between md:mb-8">
        <h2 className="text-2xl font-bold md:text-3xl">Popular Cities</h2>
        <a href="#" className="text-sm font-medium text-pink-500 hover:text-pink-600 md:text-base">
          See All
        </a>
      </div>

      {/* Scrollable Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth md:gap-6"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {cities.map((city) => (
            <div
              key={city.id}
              className="flex-shrink-0 w-48 h-56 md:w-56 md:h-64 rounded-lg overflow-hidden cursor-pointer group"
            >
              {/* City Card */}
              <div className="relative w-full h-full">
                <img
                  src={city.image || "/placeholder.svg"}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* City Name */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white md:text-xl">{city.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 md:p-3"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
        </button>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
        div {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
