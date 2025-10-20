"use client"

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState } from "react"
import LocationModal from "./location-modal"
import PopularItineraryCard from "./popular-itinerary-card"


interface Location {
  id: string
  name: string
  region: string
  image: string
}

const filters = [
  "All",
  "Adventure",
  "Sports",
  "Wildlife & Nature",
  "food",
  "Wellness",
  "Family Fun",
  "Local Experiences",
]

const itineraries = [
  {
    id: "1",
    title: "Sydney The Rocks Guided Walking Tour",
    image: "/images/city-1.png",
    guide: { name: "John Doe", avatar: "/john-doe-avatar.jpg" },
    location: "Canberra, Australia",
    duration: "7 Days 6 Nights",
    tripType: "City Trip",
    views: "8.5 k+",
    shares: "3k+",
    categories: ["Adventure", "Nightlife", "Wellness"],
    price: { current: "$52.55", original: "$465.55" },
  },
  {
    id: "2",
    title: "Zambia Waterfall Guided Tour",
    image: "images/city-2.png",
    guide: { name: "Jenny Doe", avatar: "/jenny-doe-avatar.jpg" },
    location: "Canberra, Australia",
    duration: "7 Days 6 Nights",
    tripType: "Road Trip",
    views: "8.5 k+",
    shares: "3k+",
    categories: ["Adventure", "Wellness"],
    price: { current: "$52.55", original: "$465.55" },
  },
  {
    id: "3",
    title: "Sydney The Rocks Guided Walking Tour",
    image: "/images/default-city.jpeg",
    guide: { name: "Linda Doe", avatar: "/linda-doe-avatar.jpg" },
    location: "Canberra, Australia",
    duration: "7 Days 6 Nights",
    tripType: "City Trip",
    views: "8.5 k+",
    shares: "3k+",
    categories: ["Wellness"],
    price: { current: "$52.55", original: "$465.55" },
  },
]

export default function PopularItineraries() {
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    id: "sydney",
    name: "Sydney",
    region: "",
    image: "",
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("All")
  const filterScrollRef = useRef<HTMLDivElement>(null)
  const itineraryScrollRef = useRef<HTMLDivElement>(null)

  const filteredItineraries = itineraries.filter((itinerary) => {
    if (selectedFilter === "All") return true
    return itinerary.categories.includes(selectedFilter)
  })

  const scrollFilters = (direction: "left" | "right") => {
    if (filterScrollRef.current) {
      const scrollAmount = 200
      const currentScroll = filterScrollRef.current.scrollLeft
      const targetScroll = direction === "right" ? currentScroll + scrollAmount : currentScroll - scrollAmount

      filterScrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      })
    }
  }

  const scrollItineraries = (direction: "left" | "right") => {
    if (itineraryScrollRef.current) {
      const isMobile = window.innerWidth < 768
      const scrollAmount = isMobile ? 320 : 400
      const currentScroll = itineraryScrollRef.current.scrollLeft
      const targetScroll = direction === "right" ? currentScroll + scrollAmount : currentScroll - scrollAmount

      itineraryScrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl md:text-3xl font-bold">Popular Itineraries in</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors"
          >
            <span className="text-2xl md:text-3xl font-bold">{selectedLocation.name}</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollItineraries("left")}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scrollItineraries("right")}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <div
          ref={filterScrollRef}
          className="flex gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-2"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                selectedFilter === filter ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Hide scrollbar */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
          div {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      <div className="relative">
        <div
          ref={itineraryScrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden scroll-smooth pb-2"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {filteredItineraries.map((itinerary) => (
            <div key={itinerary.id} className="flex-shrink-0 w-full sm:w-96">
              <PopularItineraryCard {...itinerary} />
            </div>
          ))}
        </div>

        {/* Hide scrollbar */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
          div {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={(location) => setSelectedLocation(location)}
      />
    </section>
  )
}
