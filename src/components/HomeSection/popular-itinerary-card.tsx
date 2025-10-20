"use client"

import { Heart, Clock, Eye, Share2, MapPin } from "lucide-react"
import { useState } from "react"

interface ItineraryCardProps {
  id: string
  title: string
  image: string
  guide: {
    name: string
    avatar: string
  }
  location: string
  duration: string
  tripType: string
  views: string
  shares: string
  categories: string[]
  price: {
    current: string
    original: string
  }
}

export default function PopularItineraryCard({
  id,
  title,
  image,
  guide,
  location,
  duration,
  tripType,
  views,
  shares,
  categories,
  price,
}: ItineraryCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const categoryColors: Record<string, string> = {
    Adventure: "bg-red-100 text-red-700",
    Nightlife: "bg-purple-100 text-purple-700",
    Wellness: "bg-orange-100 text-orange-700",
    Sports: "bg-blue-100 text-blue-700",
    "Wildlife & Nature": "bg-green-100 text-green-700",
  }

  return (
    <div className="flex-shrink-0 w-full sm:w-96 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />

        {/* Duration Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-700">{duration}</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          aria-label="Add to favorites"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-pink-500 text-pink-500" : "text-gray-600"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Guide Info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={guide.avatar || "/placeholder.svg"}
            alt={guide.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-700">{guide.name}</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{title}</h3>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        {/* Trip Type and Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="text-xs">🏢</span> {tripType}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {views}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            {shares}
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <span
              key={category}
              className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColors[category] || "bg-gray-100 text-gray-700"}`}
            >
              {category}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-pink-500">{price.current}</span>
          <span className="text-sm text-gray-400 line-through">{price.original}</span>
        </div>
      </div>
    </div>
  )
}
