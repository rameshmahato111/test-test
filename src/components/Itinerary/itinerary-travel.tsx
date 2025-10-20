"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Edit2,
  User,
  Share2,
  Calendar,
  DollarSign,
  RotateCcw,
  ChevronDown,
  MapPin,
  Phone,
  Map,
  Navigation,
  MoreVertical,
  Clock,
  Ticket,
  Settings,
  Eye,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import Location from "./location-map"

interface ApiCity {
  name: string
  coordinates: [number, number]
  place_type: string
  next_segment?: {
    name: string
    distance_km: number
    duration_hours: number
  }
  suggested_activities: Array<{
    id: number
    name: string
    description: string
    images?: {
      urls: Array<{
        resource: string
        sizeType: string
      }>
    }
  }>
  suggested_accommodations: Array<{
    id: number
    name: string
    description: string
    address: {
      content: string
      coordinates: {
        latitude: number
        longitude: number
      }
    }
    hotel_images: string
  }>
}

interface ApiDailyPlan {
  day: number
  cities: ApiCity[]
  day_total_distance: number
  day_total_duration: number
}

interface RealApiResponse {
  success: boolean
  itinerary_data: {
    total_distance: number
    total_duration: number
    total_days: number
    route_geometry: {
      coordinates: Array<[number, number]>
      type: string
    }
    daily_plan?: ApiDailyPlan[] // Optional since real API might not have this
    start_date?: string
    end_date?: string
    budget?: string
    travel_group_type?: string
    mode_of_transport?: string
    interests?: string
    daily_drive_distance?: number
  }
}

interface ItineraryStop {
  id: string
  time: string
  title: string
  duration: string
  address: string
  travelTime: string
  travelDistance: string
  type: "contact" | "ticket" | "navigate"
  latitude?: number
  longitude?: number
  description?: string
  image?: string
}

interface MapLocation {
  id: string
  latitude: number
  longitude: number
  title: string
  address: string
  type: "attraction"
  rating: number
  openHours: string
  description: string
  travelTime?: string
  isStart?: boolean
  order: number
}

export default function TravelItineraryWithMap() {
  const [apiData, setApiData] = useState<RealApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likedStops, setLikedStops] = useState<Record<string, boolean>>({})
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number
    longitude: number
    locationName: string
  } | null>(null)

  const convertApiToStops = (dailyPlan: ApiDailyPlan[]): Record<string, ItineraryStop[]> => {
    const result: Record<string, ItineraryStop[]> = {}

    try {
      dailyPlan.forEach((day) => {
        const dayKey = `day${day.day}`
        result[dayKey] = []

        if (day.cities && Array.isArray(day.cities)) {
          day.cities.forEach((city, cityIndex) => {
            // Add city arrival as first stop
            const arrivalHour = 8 + cityIndex * 2
            result[dayKey].push({
              id: `${day.day}-${cityIndex}-arrival`,
              time: `${arrivalHour}:00 ${arrivalHour >= 12 ? "P.M." : "A.M."}`,
              title: `Arrive at ${city.name}`,
              duration: `${arrivalHour}:00 - ${arrivalHour + 1}:00 (1hr)`,
              address: city.name,
              travelTime: city.next_segment ? `${Math.round(city.next_segment.duration_hours * 60)} min` : "0 min",
              travelDistance: city.next_segment ? `(${Math.round(city.next_segment.distance_km)} Km)` : "(0 Km)",
              type: "contact",
              latitude: city.coordinates?.[1],
              longitude: city.coordinates?.[0],
              description: `Welcome to ${city.name}! ${city.place_type || 'A beautiful destination'}`,
            })

            // Add suggested activities
            if (city.suggested_activities && Array.isArray(city.suggested_activities)) {
              city.suggested_activities.forEach((activity, activityIndex) => {
                const startHour = arrivalHour + 1 + activityIndex * 2
                const duration = 1 + Math.floor(Math.random() * 2)

                result[dayKey].push({
                  id: `${day.day}-${cityIndex}-${activityIndex}`,
                  time: `${startHour}:00 ${startHour >= 12 ? "P.M." : "A.M."}`,
                  title: activity.name,
                  duration: `${startHour}:00 - ${startHour + duration}:00 (${duration}hr${duration > 1 ? "s" : ""})`,
                  address: city.name,
                  travelTime: "0 min",
                  travelDistance: "(0 Km)",
                  type:
                    activity.name?.toLowerCase().includes("ticket") || 
                    activity.name?.toLowerCase().includes("museum") ||
                    activity.name?.toLowerCase().includes("park")
                      ? "ticket"
                      : "contact",
                  latitude: city.coordinates?.[1],
                  longitude: city.coordinates?.[0],
                  description: activity.description,
                  image: activity.images?.urls?.[0]?.resource,
                })
              })
            }

            // Add suggested accommodations
            if (
              city.suggested_accommodations &&
              Array.isArray(city.suggested_accommodations) &&
              city.suggested_accommodations.length > 0
            ) {
              const accommodation = city.suggested_accommodations[0]
              result[dayKey].push({
                id: `${day.day}-${cityIndex}-hotel`,
                time: "8:00 P.M.",
                title: accommodation.name,
                duration: "8:00 P.M. - Check-in",
                address: accommodation.address?.content || city.name,
                travelTime: "15 min",
                travelDistance: "(5 Km)",
                type: "contact",
                latitude: accommodation.address?.coordinates?.latitude || city.coordinates?.[1],
                longitude: accommodation.address?.coordinates?.longitude || city.coordinates?.[0],
                description: accommodation.description,
                image: accommodation.hotel_images,
              })
            }
          })
        }
      })
    } catch (error) {
      console.error("[v0] Error converting API to stops:", error)
    }

    return result
  }

  useEffect(() => {
    const storedData = sessionStorage.getItem("itineraryData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        console.log("[v0] Raw API response structure:", JSON.stringify(parsedData, null, 2))

        if (!parsedData.success || !parsedData.itinerary_data) {
          console.error("[v0] Invalid API response structure:", parsedData)
          setError("Invalid API response structure. Please generate a new itinerary.")
          setIsLoading(false)
          return
        }

        setApiData(parsedData)

        if (parsedData.itinerary_data.route_geometry?.coordinates?.length > 0) {
          const firstCoordinate = parsedData.itinerary_data.route_geometry.coordinates[0]
          setSelectedLocation({
            latitude: firstCoordinate[1],
            longitude: firstCoordinate[0],
            locationName: "Trip Starting Point",
          })
        }

        if (parsedData.itinerary_data.daily_plan && Array.isArray(parsedData.itinerary_data.daily_plan)) {
          const initialExpanded: Record<string, boolean> = {}
          parsedData.itinerary_data.daily_plan.forEach((day: ApiDailyPlan, index: number) => {
            initialExpanded[`day${day.day}`] = index === 0
          })
          setExpandedDays(initialExpanded)
        }
      } catch (error) {
        console.error("[v0] Error parsing stored itinerary data:", error)
        setError("Failed to load itinerary data. Please try generating a new itinerary.")
      }
    } else {
      console.log("[v0] No stored data found")
      setError("No itinerary data found. Please generate an itinerary first.")
    }
    setIsLoading(false)
  }, [])

  const mapLocations: MapLocation[] = useMemo(() => {
    if (!apiData?.itinerary_data) {
      console.log("[v0] No API data available for map")
      return []
    }

    try {
      const locations: MapLocation[] = []
      const itineraryData = apiData.itinerary_data

      // Add locations from daily plan if available
      if (itineraryData.daily_plan && Array.isArray(itineraryData.daily_plan)) {
        let order = 0
        itineraryData.daily_plan.forEach((day) => {
          if (day.cities && Array.isArray(day.cities)) {
            day.cities.forEach((city) => {
              if (city.coordinates && Array.isArray(city.coordinates) && city.coordinates.length >= 2) {
                locations.push({
                  id: `city-${day.day}-${city.name}`,
                  latitude: city.coordinates[1],
                  longitude: city.coordinates[0],
                  title: city.name,
                  address: city.name,
                  type: "attraction",
                  rating: 4.5,
                  openHours: "9:00 AM - 6:00 PM",
                  description: city.place_type || `Visit ${city.name}`,
                  travelTime: city.next_segment ? `${Math.round(city.next_segment.duration_hours * 60)} min` : undefined,
                  isStart: order === 0,
                  order: order++,
                })
              }
            })
          }
        })
      }

      // If no daily plan, use route geometry coordinates
      if (locations.length === 0 && itineraryData.route_geometry?.coordinates?.length) {
        const coordinates = itineraryData.route_geometry.coordinates

        if (coordinates.length > 0) {
          const startCoord = coordinates[0]
          locations.push({
            id: "start",
            latitude: startCoord[1],
            longitude: startCoord[0],
            title: "Starting Point",
            address: "Trip Starting Location",
            type: "attraction",
            rating: 4.5,
            openHours: "9:00 AM - 6:00 PM",
            description: "Your journey begins here",
            isStart: true,
            order: 0,
          })
        }

        if (coordinates.length > 1) {
          const endCoord = coordinates[coordinates.length - 1]
          locations.push({
            id: "end",
            latitude: endCoord[1],
            longitude: endCoord[0],
            title: "Destination",
            address: "Trip Destination",
            type: "attraction",
            rating: 4.5,
            openHours: "9:00 AM - 6:00 PM",
            description: "Your journey ends here",
            order: 1,
          })
        }
      }

      console.log("[v0] Generated map locations from API data:", locations)
      return locations
    } catch (error) {
      console.error("[v0] Error generating map locations:", error)
      return []
    }
  }, [apiData])

  const dayStops = useMemo(() => {
    if (!apiData?.itinerary_data?.daily_plan || !Array.isArray(apiData.itinerary_data.daily_plan)) {
      console.log("[v0] No daily plan data available")
      return {}
    }

    return convertApiToStops(apiData.itinerary_data.daily_plan)
  }, [apiData])

  const toggleLike = (stopId: string) => {
    setLikedStops((prev) => ({
      ...prev,
      [stopId]: !prev[stopId],
    }))
  }

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
    console.log(`[v0] ${option} clicked for stop ${stopId}`)
    setOpenDropdown(null)
  }

  const showLocationOnMap = (stop: ItineraryStop) => {
    if (stop.latitude && stop.longitude) {
      setSelectedLocation({
        latitude: stop.latitude,
        longitude: stop.longitude,
        locationName: stop.title,
      })
    }
  }

  const handleLocationClick = (location: any) => {
    console.log("[v0] Location clicked:", location.title)
  }

  const renderTimeline = (stops: ItineraryStop[]) => (
    <div className="space-y-6">
      {stops.map((stop, index) => (
        <div key={stop.id} className="flex gap-4">
          <div className="flex items-start gap-3">
            <div className="text-xs font-medium text-gray-900 w-16 text-right">{stop.time}</div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center relative z-10">
                <MapPin className="w-4 h-4 text-pink-500" />
              </div>
              {index < stops.length - 1 && <div className="w-px h-16 bg-gray-200 mt-2"></div>}
            </div>
          </div>

          <div className="flex-1">
            <div className="p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                {stop.image && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={stop.image || "/placeholder.svg"} alt={stop.title} fill className="object-cover" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white"
                      onClick={() => toggleLike(stop.id)}
                    >
                      <Heart
                        className={`w-3 h-3 ${likedStops[stop.id] ? "fill-pink-500 text-pink-500" : "text-gray-500"}`}
                      />
                    </Button>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-gray-900 text-sm">{stop.title}</h3>
                    <div className="relative">
                      <Button variant="ghost" size="sm" className="p-1 -mt-1" onClick={() => toggleDropdown(stop.id)}>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </Button>

                      {openDropdown === stop.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[180px]">
                          <button
                            onClick={() => handleDropdownOption("Change Time", stop.id)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Clock className="w-4 h-4" />
                            Change Time
                          </button>
                          <button
                            onClick={() => handleDropdownOption("Suggest Alternatives", stop.id)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Settings className="w-4 h-4" />
                            Suggest Alternatives
                          </button>
                          <button
                            onClick={() => handleDropdownOption("View Place Info", stop.id)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Place Info
                          </button>
                          <button
                            onClick={() => handleDropdownOption("Remove", stop.id)}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {stop.description && <p className="text-xs text-gray-600 mb-2 line-clamp-2">{stop.description}</p>}

                  <div className="space-y-1 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{stop.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{stop.address}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      {stop.type === "ticket" ? (
                        <Ticket className="w-4 h-4 text-pink-500" />
                      ) : (
                        <Phone className="w-4 h-4 text-pink-500" />
                      )}
                      <Button size="sm" variant="ghost" className="text-xs text-pink-500 p-1 h-auto">
                        {stop.type === "ticket" ? "Buy Ticket" : "Contact"}
                      </Button>
                    </div>
                    {stop.latitude && stop.longitude && (
                      <div className="flex flex-col items-center gap-1">
                        <Map className="w-4 h-4 text-green-600" />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-green-600 p-1 h-auto"
                          onClick={() => showLocationOnMap(stop)}
                        >
                          Show in Map
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {stop.travelTime} {stop.travelDistance}
                  </span>
                  <Button size="sm" variant="ghost" className="text-xs text-gray-600 p-1 h-auto flex items-center">
                    <Navigation className="w-3 h-3 mr-1" />
                    Navigate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your itinerary...</p>
        </div>
      </div>
    )
  }

  if (error || !apiData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Itinerary Found</h2>
          <p className="text-gray-600 mb-4">
            {error || "No itinerary data available. Please generate an itinerary first."}
          </p>
          <Button onClick={() => (window.location.href = "/")} className="bg-pink-500 hover:bg-pink-600 text-white">
            Generate New Itinerary
          </Button>
        </div>
      </div>
    )
  }

  const itineraryData = apiData.itinerary_data

  if (!itineraryData.daily_plan || !Array.isArray(itineraryData.daily_plan) || itineraryData.daily_plan.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Detailed Itinerary Available</h2>
          <p className="text-gray-600 mb-4">
            The API returned basic trip information but no detailed daily plans.
            <br />
            <span className="text-sm">
              Total Distance: {Math.round(itineraryData.total_distance)} km | Duration:{" "}
              {Math.round(itineraryData.total_duration)} hours | Days: {itineraryData.total_days}
            </span>
          </p>
          <Button onClick={() => (window.location.href = "/")} className="bg-pink-500 hover:bg-pink-600 text-white">
            Generate New Itinerary
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 bg-white">
            <div className="relative h-48 w-full">
              <Image
                src="/desert-road-with-car-and-cacti-sunset-landscape.png"
                alt="Travel landscape"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="px-4 pb-4 lg:pb-8 max-w-4xl mx-auto lg:max-w-none lg:px-6">
              <div className="rounded-lg shadow-sm -mt-6 relative z-10 p-4 mb-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold text-gray-900">
                      {itineraryData.total_days}-Day Road Trip Itinerary
                    </h1>
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-2 rounded-full border border-gray-200">
                      <User className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 rounded-full border border-gray-200">
                      <Share2 className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{itineraryData.total_days} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span>{Math.round(itineraryData.total_distance)} km total</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.round(itineraryData.total_duration)} hours</span>
                  </div>
                  {itineraryData.budget && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{itineraryData.budget}</span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Ready to start</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: "5%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  Total distance:{" "}
                  <span className="font-semibold text-gray-900">{Math.round(itineraryData.total_distance)} km</span>
                </div>
                <Button variant="ghost" size="sm" className="text-pink-500 text-xs">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              </div>

              <div className="space-y-6">
                {Object.entries(dayStops).map(([dayKey, stops]) => {
                  const dayNumber = dayKey.replace("day", "")
                  return (
                    <div key={dayKey}>
                      <Button
                        variant="ghost"
                        onClick={() => toggleDay(dayKey)}
                        className="flex items-center gap-2 p-0 h-auto font-semibold text-gray-900 mb-4 hover:text-pink-600 transition-colors"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expandedDays[dayKey] ? "rotate-0" : "-rotate-90"}`}
                        />
                        Day {dayNumber}
                      </Button>

                      {expandedDays[dayKey] && renderTimeline(stops)}
                    </div>
                  )
                })}
              </div>
            </div>

            {openDropdown && <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />}
          </div>

          <div className="w-full lg:w-1/2 bg-white border-t lg:border-t-0 lg:border-l border-gray-200">
            <div className="h-[400px] lg:h-screen lg:sticky lg:top-0 relative overflow-hidden">
              {selectedLocation && mapLocations.length > 0 && itineraryData.route_geometry?.coordinates && (
                <Location
                  latitude={selectedLocation.latitude}
                  longitude={selectedLocation.longitude}
                  locationName={selectedLocation.locationName}
                  locations={mapLocations}
                  onLocationClick={handleLocationClick}
                  routeCoordinates={itineraryData.route_geometry.coordinates}
                />
              )}
              {(!selectedLocation || mapLocations.length === 0 || !itineraryData.route_geometry?.coordinates) && (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Map className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No map data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
