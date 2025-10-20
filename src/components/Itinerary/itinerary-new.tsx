"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Edit2,
  Share2,
  MoreVertical,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Car,
  Footprints,
  Navigation,
  RotateCcw,
  ChevronDown,
  Ticket,
  Eye,
} from "lucide-react"
import Image from "next/image"
import LocationMapNew from "./location-map-new"


interface ItineraryStop {
  id: string
  time: string
  title: string
  location: string
  timeSlot: string
  duration: string
  price: string
  rating: number
  image: string
  type: "ticket" | "details"
  travelTime: string
  travelDistance: string
  transportMode: string
  transportCost: string
  walkingTime: string
  walkingDistance: string
}

interface MapLocation {
  id: string
  latitude: number
  longitude: number
  title: string
  address: string
  type: "restaurant" | "attraction" | "hotel"
  rating: number
  reviews: Array<{
    name: string
    date: string
    rating: number
    source: string
    text: string
  }>
}

export default function ItineraryNew() {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({ day1: true })
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)

  // Mock data for the new design
  const itineraryData = {
    title: "3-Day Munich Itinerary",
    dates: "12th Aug - 15th Aug",
    package: "Standard",
    progress: 10,
    budget: "$900",
    departureTime: "8:00 am"
  }

  const dayStops: Record<string, ItineraryStop[]> = {
    day1: [
      {
        id: "1",
        time: "9:00 A.M.",
        title: "Sky Walk Tower",
        location: "Sydney Avenue Street",
        timeSlot: "11-12:45",
        duration: "1hr 45min",
        price: "$45,856 per person",
        rating: 5.0,
        image: "/images/card-1.png",
        type: "ticket",
        travelTime: "7 min",
        travelDistance: "(10 km)",
        transportMode: "Purple Express",
        transportCost: "$4.50/hr",
        walkingTime: "9 min",
        walkingDistance: "(200 m)"
      },
      {
        id: "2",
        time: "11:00 A.M.",
        title: "Light Bavarian breakfast",
        location: "Sydney Avenue Street",
        timeSlot: "11-12:45",
        duration: "1hr 45min",
        price: "$45,856 per person",
        rating: 5.0,
        image: "/images/card-2.png",
        type: "details",
        travelTime: "7 min",
        travelDistance: "(10 km)",
        transportMode: "Art Museum Parking",
        transportCost: "Free",
        walkingTime: "5 min",
        walkingDistance: "(200 m)"
      }
    ]
  }

  const mapLocations: MapLocation[] = [
    {
      id: "1",
      latitude: 48.1374,
      longitude: 11.5755,
      title: "Sky Walk Tower",
      address: "Sydney Avenue Street, Munich",
      type: "attraction",
      rating: 5.0,
      reviews: [
        {
          name: "James Watson",
          date: "Aug 5, 2025",
          rating: 5,
          source: "from Google",
          text: "Incredible sightseeing that you must see at least once in your life! It was more spectacular in real life. We bought tickets to go to the top of the tower."
        },
        {
          name: "William Watson",
          date: "Aug 5, 2025",
          rating: 3,
          source: "from Google",
          text: "It was great to see Paris again from the second floor of Eiffel tower. It wasn't too crowded. We walked up the stairs."
        }
      ]
    }
  ]

  const toggleDay = (day: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  const toggleDropdown = (stopId: string) => {
    setOpenDropdown(openDropdown === stopId ? null : stopId)
  }

  const handleDropdownOption = (option: string, stopId: string) => {
    console.log(`${option} clicked for stop ${stopId}`)
    setOpenDropdown(null)
  }

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location)
  }

  const renderTimeline = (stops: ItineraryStop[]) => (
    <div className="space-y-8">
      {stops.map((stop, index) => (
        <div key={stop.id} className="flex gap-6">
          {/* Time and Timeline */}
          <div className="flex items-start gap-4">
            <div className="text-sm font-medium text-gray-900 w-24 text-right">{stop.time}</div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center relative z-10">
                <MapPin className="w-4 h-4 text-pink-500" />
              </div>
              {index < stops.length - 1 && <div className="w-px h-24 bg-gray-200 mt-2"></div>}
            </div>
          </div>

          {/* Main Content Card */}
          <div className="flex-1">
            <div className="rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
              <div className="flex gap-6 p-6">
                {/* Image Section with Icon Overlay */}
                <div className="relative w-28 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={stop.image} alt={stop.title} fill className="object-cover" />
                  
                  {/* Building/Burger Icon Overlay - Top Left */}
                  <div className="absolute top-2 left-2 w-7 h-7 bg-pink-500 rounded flex items-center justify-center">
                    {stop.type === "ticket" ? (
                      <Ticket className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white text-sm font-bold">🍔</span>
                    )}
                  </div>
                  
                  {/* Star Rating - Bottom Left */}
                  <div className="absolute bottom-2 left-2 bg-pink-500 text-white text-sm px-3 py-1 rounded flex items-center gap-1">
                    <Star className="w-4 h-4 fill-white" />
                    {stop.rating}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{stop.title}</h3>
                    <div className="relative">
                      <Button variant="ghost" size="sm" className="p-1 -mt-1" onClick={() => toggleDropdown(stop.id)}>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </Button>

                      {openDropdown === stop.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[200px]">
                          <button
                            onClick={() => handleDropdownOption("Change Time", stop.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Clock className="w-4 h-4" />
                            Change Time
                          </button>
                          <button
                            onClick={() => handleDropdownOption("Suggest Alternatives", stop.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <span className="text-pink-500">✨</span>
                            Suggest Alternatives
                          </button>
                          <button
                            onClick={() => handleDropdownOption("Remove", stop.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            🗑️
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{stop.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{stop.timeSlot} • {stop.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{stop.price}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mb-4">
                    {stop.type === "ticket" ? (
                      <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-6 py-3 rounded-lg flex items-center gap-2">
                        <Ticket className="w-4 h-4" />
                        Buy Ticket
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-pink-500 border-pink-500 hover:bg-pink-50 text-sm px-6 py-3 rounded-lg flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Travel Information Below Card */}
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm pt-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">{stop.travelTime} {stop.travelDistance}</span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-gray-600 p-1 h-auto flex items-center">
                    <Navigation className="w-4 h-4 mr-1" />
                    Navigate
                  </Button>
                </div>
                
                {/* Parking Options */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">P</span>
                  </div>
                  <span className="text-pink-500 text-sm font-medium">
                    {stop.transportMode} ({stop.transportCost})
                  </span>
                </div>
                
                {/* Walking Option */}
                <div className="mt-3 flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 text-sm">{stop.walkingTime} {stop.walkingDistance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
  
      <div className="max-w-full">
        <div className="flex flex-col lg:flex-row">
          {/* Left Column - Itinerary - 50% Width */}
          <div className="w-full lg:w-1/2 bg-white">
            {/* Header Banner */}
            <div className="relative h-48 w-full">
              <Image
                src="/images/hero_bg.png"
                alt="Travel landscape"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="px-8 pb-8 max-w-6xl mx-auto lg:max-w-none">
              {/* Main Info Card */}
              <div className="rounded-lg shadow-sm -mt-6 relative z-10 p-6 mb-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-gray-900">
                      {itineraryData.title}
                    </h1>
                    <Edit2 className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{itineraryData.budget}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{itineraryData.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span>{itineraryData.package}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{itineraryData.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-pink-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${itineraryData.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Share and Menu */}
                <div className="flex items-center justify-end gap-3">
                  <Button variant="ghost" size="sm" className="p-2 rounded-full border border-gray-200">
                    <Share2 className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 rounded-full border border-gray-200">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center border-b border-gray-200 mb-6">
                <button className="px-6 py-3 text-sm font-medium border-b-2 border-pink-500 text-pink-600">
                  Itinerary
                </button>
                <button className="px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                  Budget
                </button>
              </div>

              {/* Departure Time */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  Departure time: {itineraryData.departureTime}
                </div>
                <Button variant="ghost" size="sm" className="text-pink-500 text-sm">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Regenerate
                </Button>
              </div>

              {/* Itinerary Content */}
              <div className="space-y-8">
                {Object.entries(dayStops).map(([dayKey, stops]) => {
                  const dayNumber = dayKey.replace("day", "")
                  return (
                    <div key={dayKey}>
                      <div className="flex items-center justify-between mb-6">
                        <Button
                          variant="ghost"
                          onClick={() => toggleDay(dayKey)}
                          className="flex items-center gap-3 p-0 h-auto font-semibold text-lg text-gray-900 hover:text-pink-600 transition-colors"
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${expandedDays[dayKey] ? "rotate-0" : "-rotate-90"}`}
                          />
                          Day {dayNumber}
                        </Button>
                        
                        {/* Parking Options Button */}
                        <Button variant="ghost" size="sm" className="text-pink-500 text-sm p-0 h-auto hover:bg-pink-50">
                          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded text-sm mr-2">P</span>
                          Parking Options
                        </Button>
                      </div>

                      {expandedDays[dayKey] && renderTimeline(stops)}
                    </div>
                  )
                })}
              </div>
            </div>

            {openDropdown && <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />}
          </div>

          {/* Right Column - Map - 50% Width */}
         

          
          {/* <div className="w-full lg:w-1/2 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 h-72">
            <div className="h-[900px] relative overflow-hidden">
              <LocationMapNew
                locations={mapLocations}
                onLocationClick={handleLocationClick}
                selectedLocation={selectedLocation}
                onCloseLocation={() => setSelectedLocation(null)}
              />
            </div>
          </div> */}
         
        </div>
      </div>
   
  )
}
