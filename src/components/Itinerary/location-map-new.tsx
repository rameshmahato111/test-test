"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { MapPin, X, Phone, Ticket, Navigation, Clock, Star, Calendar, DollarSign, Users, Globe, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LocationData {
  id: string
  latitude: number
  longitude: number
  title: string
  address: string
  type: "restaurant" | "attraction" | "hotel" | "activity"
  rating?: number
  priceRange?: string
  openHours?: string
  description?: string
  image?: string
  travelTime?: string
  isStart?: boolean
  order?: number
}

interface LocationProps {
  latitude?: number
  longitude?: number
  locationName?: string
  locations?: LocationData[]
  onLocationClick?: (location: LocationData) => void
  totalDays?: number
  routeCoordinates?: Array<[number, number]> // Added route coordinates prop
  inactiveRouteCoordinates?: Array<[number, number]> // Optional inactive route to render in gray
  inactiveLocations?: LocationData[] // Optional inactive locations to render as gray markers
  showCityLabels?: boolean // Show text labels below markers
}

declare global {
  interface Window {
    mapboxgl: any
  }
}

const Location: React.FC<LocationProps> = ({
  latitude = 48.1374,
  longitude = 11.5755,
  locationName = "Munich City Center",
  locations = [],
  onLocationClick,
  totalDays = 3,
  routeCoordinates = [], // Added route coordinates parameter
  inactiveRouteCoordinates = [], // New: inactive route
  inactiveLocations = [], // New: inactive locations
  showCityLabels = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [navigatedLocationId, setNavigatedLocationId] = useState<string | null>(null)
  const markers = useRef<any[]>([])

  const displayLocations = locations

  const createCustomMarker = (location: LocationData, index: number, variant: 'active' | 'inactive' = 'active') => {
      const markerElement = document.createElement("div")
      markerElement.className = "custom-marker relative"

      const isStart = location.isStart
      const isNavigated = navigatedLocationId === location.id
      const markerNumber = index + 1

      // Use numbered circles for route display
      const iconContent = `<span class="text-white font-bold text-lg">${markerNumber}</span>`

      // Styling variants
      const isInactive = variant === 'inactive'
      const markerBg = isInactive
        ? "bg-gray-400"
        : (isNavigated ? "bg-pink-600" : "bg-pink-500")
      const markerHover = isInactive ? "hover:bg-gray-500" : "hover:bg-pink-600"
      const pulseClass = isNavigated ? "animate-pulse" : ""

      const labelHtml = showCityLabels ? `
          <!-- City name label below marker (optional, matching image style) -->
          <div class="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium ${isInactive ? 'text-gray-500' : 'text-gray-700'} whitespace-nowrap">
            ${location.title}
          </div>
      ` : ''

      markerElement.innerHTML = `
        <div class="relative flex items-center justify-center">
          <!-- Main circular marker matching the image style -->
          <div class="w-12 h-12 ${markerBg} rounded-full flex items-center justify-center cursor-pointer ${markerHover} transition-all duration-300 shadow-lg border-3 border-white relative ${pulseClass}">
            ${iconContent}
          </div>
          
          <!-- Navigation Indicator -->
          ${isNavigated ? `
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
          ` : ""}
          
          ${labelHtml}
        </div>
      `

      markerElement.addEventListener("click", () => {
        setSelectedLocation(location)
        onLocationClick?.(location)
      })

      return markerElement
    }

  useEffect(() => {
    if (!mapContainer.current || !window.mapboxgl) return

    window.mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

    // Determine center coordinates
    let centerLng = longitude
    let centerLat = latitude
    let zoom = 9

    if (displayLocations.length > 0) {
      // Use first location as center if available
      centerLng = displayLocations[0].longitude
      centerLat = displayLocations[0].latitude
    } else if (routeCoordinates.length > 0) {
      // Use first route coordinate as center
      centerLng = routeCoordinates[0][0]
      centerLat = routeCoordinates[0][1]
    }

    map.current = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/sauravniraula/clz621qdh00p501pffpf63mg9",
      center: [centerLng, centerLat],
      zoom: zoom,
    })

    // Add navigation controls
    map.current.addControl(new window.mapboxgl.NavigationControl(), "top-right")

    map.current.on("load", () => {
      // Create location markers with proper numbering
      locations.forEach((location, index) => {
        const markerElement = createCustomMarker(location, index)
        const mapboxMarker = new window.mapboxgl.Marker(markerElement)
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current)
        
        markers.current.push(mapboxMarker)
      })
      
      // Create route line - prioritize routeCoordinates if available, otherwise use location coordinates
      const routeData = routeCoordinates.length > 0 ? routeCoordinates : locations.map(location => [location.longitude, location.latitude])
      
      // Inactive route (gray) should be drawn first so the active pink route appears on top
      if (inactiveRouteCoordinates && inactiveRouteCoordinates.length > 1) {
        const inactiveGeoJSON = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: inactiveRouteCoordinates,
          },
        }

        map.current.addSource("inactive-route", {
          type: "geojson",
          data: inactiveGeoJSON,
        })

        map.current.addLayer({
          id: "inactive-route",
          type: "line",
          source: "inactive-route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#9CA3AF", // Gray-400
            "line-width": 3,
            "line-opacity": 0.7,
          },
        })
      }

      if (routeData.length > 1) {
        const routeGeoJSON = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: routeData,
          },
        }

        map.current.addSource("route", {
          type: "geojson",
          data: routeGeoJSON,
        })

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ec4899", // Pink color to match the image
            "line-width": 4,
            "line-opacity": 0.9,
          },
        })
      }

      // Fit bounds to show the entire route(s)
      if (routeCoordinates.length > 1 || (inactiveRouteCoordinates && inactiveRouteCoordinates.length > 1)) {
        const bounds = new window.mapboxgl.LngLatBounds()
        ;(routeCoordinates || []).forEach((coord) => bounds.extend(coord))
        ;(inactiveRouteCoordinates || []).forEach((coord) => bounds.extend(coord))
        map.current.fitBounds(bounds, { padding: 50 })
      } else if (locations.length > 0 || (inactiveLocations && inactiveLocations.length > 0)) {
        const bounds = new window.mapboxgl.LngLatBounds()
        locations.forEach((location) => bounds.extend([location.longitude, location.latitude]))
        ;(inactiveLocations || []).forEach((location) => bounds.extend([location.longitude, location.latitude]))
        map.current.fitBounds(bounds, { padding: 50 })
      } else if (displayLocations.length > 0) {
        const bounds = new window.mapboxgl.LngLatBounds()
        displayLocations.forEach((location) => {
          bounds.extend([location.longitude, location.latitude])
        })
        map.current.fitBounds(bounds, { padding: 50 })
      } else {
        // If no locations or route, just center on the provided coordinates
        map.current.setCenter([centerLng, centerLat])
        map.current.setZoom(zoom)
      }

      setIsLoading(false)
    })

    // Add markers only if locations are available
    if (displayLocations.length > 0) {
      // Sort locations by order to ensure proper numbering
      const sortedLocations = [...displayLocations].sort((a, b) => (a.order || 0) - (b.order || 0))
      
      sortedLocations.forEach((location, index) => {
        const markerElement = createCustomMarker(location, index, 'active')
        const marker = new window.mapboxgl.Marker(markerElement)
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current)

        markers.current.push(marker)
      })
    }

    // Add inactive route markers (gray)
    if (inactiveLocations && inactiveLocations.length > 0) {
      const sortedInactive = [...inactiveLocations].sort((a, b) => (a.order || 0) - (b.order || 0))
      sortedInactive.forEach((location, index) => {
        const markerElement = createCustomMarker(location, index, 'inactive')
        const marker = new window.mapboxgl.Marker(markerElement)
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current)

        markers.current.push(marker)
      })
    }

    // Cleanup
    return () => {
      markers.current.forEach((marker) => marker.remove())
      markers.current = []
      if (map.current) map.current.remove()
    }
  }, [displayLocations, routeCoordinates, inactiveRouteCoordinates, inactiveLocations]) // Only recreate map when locations or route change

  useEffect(() => {
    if (map.current && latitude && longitude) {
      // Find the matching location and set it as navigated
      const matchingLocation = locations.find(loc => 
        Math.abs(loc.latitude - latitude) < 0.001 && 
        Math.abs(loc.longitude - longitude) < 0.001
      )
      if (matchingLocation) {
        setNavigatedLocationId(matchingLocation.id)
      }
      
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 16, // Increased zoom level for more precise location
        duration: 1500, // Slightly longer animation for better visibility
        essential: true // This ensures the animation is not interrupted
      })
    }
  }, [latitude, longitude, locationName, locations])

  // Recreate markers when navigated location changes
  useEffect(() => {
    if (map.current && markers.current.length > 0) {
      // Remove existing markers
      markers.current.forEach(marker => marker.remove())
      markers.current = []
      
      // Recreate markers with updated styles
      locations.forEach((location, index) => {
        const markerElement = createCustomMarker(location, index, 'active')
        const mapboxMarker = new window.mapboxgl.Marker(markerElement)
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current)
        
        markers.current.push(mapboxMarker)
      })

      // Re-add inactive markers
      if (inactiveLocations && inactiveLocations.length > 0) {
        const sortedInactive = [...inactiveLocations].sort((a, b) => (a.order || 0) - (b.order || 0))
        sortedInactive.forEach((location, index) => {
          const markerElement = createCustomMarker(location, index, 'inactive')
          const mapboxMarker = new window.mapboxgl.Marker(markerElement)
            .setLngLat([location.longitude, location.latitude])
            .addTo(map.current)
          markers.current.push(mapboxMarker)
        })
      }
    }
  }, [navigatedLocationId, locations, inactiveLocations])



  const getTypeIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return <Phone className="w-4 h-4" />
      case "attraction":
        return <Ticket className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-1 h-full overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <div className="w-full h-full bg-gray-200 animate-pulse">
              <div
                className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
                style={{
                  backgroundSize: "400% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400 flex flex-col items-center">
                <svg
                  className="animate-spin h-8 w-8 mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Loading map...</span>
              </div>
            </div>
          </div>
        )}
        <div
          ref={mapContainer}
          className={`w-full h-full ${isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}`}
        />


        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl border p-4 z-20 max-w-sm mx-auto">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{selectedLocation.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{selectedLocation.address}</p>
                {selectedLocation.order && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">
                      Stop #{selectedLocation.order}
                    </span>
                    {selectedLocation.isStart && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        Starting Point
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" className="p-1 -mt-1" onClick={() => setSelectedLocation(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {selectedLocation.description && (
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{selectedLocation.description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              {selectedLocation.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{selectedLocation.rating}</span>
                </div>
              )}
              {selectedLocation.openHours && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{selectedLocation.openHours}</span>
                </div>
              )}
              {selectedLocation.travelTime && (
                <div className="flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  <span>{selectedLocation.travelTime}</span>
                </div>
              )}
              {selectedLocation.priceRange && <span className="font-medium">{selectedLocation.priceRange}</span>}
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-xs bg-transparent"
                onClick={() => {
                  // Handle contact/booking functionality
                  console.log("Contact/Book clicked for:", selectedLocation.title)
                }}
              >
                {getTypeIcon(selectedLocation.type)}
                <span className="ml-1">{selectedLocation.type === "restaurant" ? "Contact" : "Book"}</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-xs bg-transparent"
                onClick={() => {
                  // Fly to the location on the current map and mark as navigated
                  if (map.current && selectedLocation) {
                    setNavigatedLocationId(selectedLocation.id)
                    map.current.flyTo({
                      center: [selectedLocation.longitude, selectedLocation.latitude],
                      zoom: 16,
                      duration: 1500,
                      essential: true
                    })
                  }
                }}
              >
                <Navigation className="w-3 h-3 mr-1" />
                Navigate
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Location
