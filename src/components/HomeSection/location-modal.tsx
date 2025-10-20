"use client"

import { X, MapPin } from "lucide-react"
import { useState } from "react"

interface Location {
  id: string
  name: string
  region: string
  image: string
}

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectLocation: (location: Location) => void
}

const recentLocations: Location[] = [
  {
    id: "kathmandu",
    name: "Kathmandu",
    region: "Central Region, Nepal",
    image: "/kathmandu-temple.jpg",
  },
  {
    id: "india",
    name: "India",
    region: "Western Region, India",
    image: "/india-taj-mahal.jpg",
  },
]

export default function LocationModal({ isOpen, onClose, onSelectLocation }: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 max-h-96 md:max-h-[500px] overflow-y-auto p-6 md:p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Choose a location</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Use Current Location */}
        <button
          onClick={() => {
            onSelectLocation({ id: "current", name: "Current Location", region: "", image: "" })
            onClose()
          }}
          className="w-full flex items-center gap-3 p-4 mb-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <MapPin className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">Use current location</span>
        </button>

        {/* Recent Locations */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Recent Locations</h3>
          <div className="space-y-3">
            {recentLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => {
                  onSelectLocation(location)
                  onClose()
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <img
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{location.name}</p>
                  <p className="text-sm text-gray-500">{location.region}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
