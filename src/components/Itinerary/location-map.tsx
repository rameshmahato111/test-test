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
  weekdayDescriptions?: string[]
}

interface LocationProps {
  latitude?: number
  longitude?: number
  locationName?: string
  locations?: LocationData[]
  onLocationClick?: (location: LocationData) => void
  totalDays?: number
  routeCoordinates?: Array<[number, number]> // Added route coordinates prop
  // New minimal props to only show day's start and end endpoints and navigate on demand
  dayEndpoints?: Array<{ day: number; start: [number, number]; end: [number, number] }>
  navigateTarget?: { latitude: number; longitude: number; locationName?: string; byUserClick?: boolean } | null
  activeDay?: number
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
  dayEndpoints = [],
  navigateTarget = null,
  activeDay,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [navigatedLocationId, setNavigatedLocationId] = useState<string | null>(null)
  const markers = useRef<any[]>([])
  const selectedMarkerRef = useRef<any | null>(null)

  const displayLocations = locations

  // Helpers to follow the actual polyline path
  const findClosestIndex = (coords: [number, number][], target: [number, number]) => {
    let minD = Number.POSITIVE_INFINITY
    let minI = 0
    for (let i = 0; i < coords.length; i++) {
      const dx = coords[i][0] - target[0]
      const dy = coords[i][1] - target[1]
      const d = dx * dx + dy * dy
      if (d < minD) { minD = d; minI = i }
    }
    return minI
  }

  const buildSliceOnRoute = (start: [number, number], end: [number, number]): [number, number][] | null => {
    if (!routeCoordinates || routeCoordinates.length === 0) return null
    const si = findClosestIndex(routeCoordinates, start)
    const ei = findClosestIndex(routeCoordinates, end)
    if (si === ei) return [start, end]
    const [from, to] = si <= ei ? [si, ei] : [ei, si]
    const seg = routeCoordinates.slice(from, to + 1)
    if (seg.length === 0) return [start, end]
    // ensure precise endpoints
    if (seg[0][0] !== start[0] || seg[0][1] !== start[1]) seg.unshift(start)
    const tail = seg[seg.length - 1]
    if (tail[0] !== end[0] || tail[1] !== end[1]) seg.push(end)
    return seg
  }

  const createCustomMarker = (location: LocationData) => {
      const markerElement = document.createElement("div")
      markerElement.className = "custom-marker relative"

      const isStart = location.isStart
      const isNavigated = navigatedLocationId === location.id
      const iconContent = isStart
        ? `<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>`
        : `<span class="text-white font-bold text-sm">${location.order || '?'}</span>`

      // Different styles for navigated location
      const markerSize = isNavigated ? "w-16 h-16" : "w-12 h-12"
      const markerBg = isNavigated ? "bg-blue-500" : "bg-pink-500"
      const markerHover = isNavigated ? "hover:bg-blue-600" : "hover:bg-pink-600"
      const borderColor = isNavigated ? "border-blue-500" : "border-pink-500"
      const pulseClass = isNavigated ? "animate-pulse" : ""

      markerElement.innerHTML = `
        <div class="relative">
          <!-- Travel Time Bubble -->
          ${
            location.travelTime
              ? `
            <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-lg border text-sm text-gray-700 whitespace-nowrap flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              ${location.travelTime}
            </div>
          `
              : ""
          }
          
          <!-- Navigation Indicator -->
          ${isNavigated ? `
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
            </div>
          ` : ""}
          
          <!-- Map Pin -->
          <div class="${markerSize} ${markerBg} rounded-full flex items-center justify-center cursor-pointer ${markerHover} transition-all duration-300 shadow-xl border-4 border-white relative ${pulseClass}">
            ${iconContent}
            <!-- Pin tail -->
            <div class="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-6 border-transparent ${borderColor}"></div>
          </div>
        </div>
      `

      markerElement.addEventListener("click", () => {
        // If parent provided a handler, prefer opening external modal
        if (onLocationClick) {
          onLocationClick(location)
          setSelectedLocation(null)
        } else {
          setSelectedLocation(location)
        }
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

    if (Array.isArray(dayEndpoints) && dayEndpoints.length > 0) {
      centerLng = dayEndpoints[0].start[0]
      centerLat = dayEndpoints[0].start[1]
      zoom = 8
    } else if (routeCoordinates.length > 0) {
      // Use first route coordinate as center
      centerLng = routeCoordinates[0][0]
      centerLat = routeCoordinates[0][1]
    } else if (displayLocations.length > 0) {
      centerLng = displayLocations[0].longitude
      centerLat = displayLocations[0].latitude
    }

    // Create the map
    map.current = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/sauravniraula/clz621qdh00p501pffpf63mg9",
      center: [centerLng, centerLat],
      zoom: zoom,
    })

    // Add navigation controls
    map.current.addControl(new window.mapboxgl.NavigationControl(), "top-right")

    map.current.on("load", () => {
      // Draw ALL days' start->end segments along the actual polyline; no initial markers
      if (Array.isArray(dayEndpoints) && dayEndpoints.length > 0) {
        const allSorted = [...dayEndpoints].sort((a,b)=>a.day-b.day)
        const segFeatures = [] as any[]
        allSorted.forEach((d, i) => {
          const coords = buildSliceOnRoute(d.start, d.end) || [d.start, d.end]
          segFeatures.push({ type: 'Feature', properties: { day: d.day, idx: i }, geometry: { type: 'LineString', coordinates: coords } })
        })
        const fc = { type: 'FeatureCollection', features: segFeatures }
        map.current.addSource('day-segments', { type: 'geojson', data: fc })
        map.current.addLayer({ id: 'day-segments-casing', type: 'line', source: 'day-segments', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#fbcfe8', 'line-width': 10, 'line-opacity': 0.9 } })
        map.current.addLayer({ id: 'day-segments', type: 'line', source: 'day-segments', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#ec4899', 'line-width': 6, 'line-opacity': 0.95 } })
        map.current.addLayer({ id: 'day-segments-dashed', type: 'line', source: 'day-segments', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#ec4899', 'line-width': 6, 'line-opacity': 0.45, 'line-dasharray': [1.2, 1.2] } })

        // Numbered markers for EACH day's START and dot markers for END
        const addNumberMarker = (pt: [number, number], label: string) => {
          const el = document.createElement('div')
          el.className = 'endpoint-marker'
          el.innerHTML = `
            <div class="relative flex items-center justify-center">
              <div class="w-14 h-14 bg-white rounded-full text-pink-600 font-bold text-lg shadow-xl ring-4 ring-pink-500 flex items-center justify-center">${label}</div>
            </div>`
          const mk = new window.mapboxgl.Marker(el, { anchor: 'center' }).setLngLat(pt).addTo(map.current)
          markers.current.push(mk)
        }
        const addDotMarker = (pt: [number, number]) => {
          const el = document.createElement('div')
          el.className = 'endpoint-dot'
          el.innerHTML = `<div class="w-3.5 h-3.5 bg-pink-500 rounded-full ring-2 ring-white shadow"></div>`
          const mk = new window.mapboxgl.Marker(el, { anchor: 'center' }).setLngLat(pt).addTo(map.current)
          markers.current.push(mk)
        }
        // Number each day's START (1..N) and dot each END, then number the FINAL END as N+1
        allSorted.forEach((d, idx) => {
          addNumberMarker(d.start, String(idx + 1))
          // For all but the last day, show end as dot; the last day's end will be numbered below
          if (idx < allSorted.length - 1) {
            addDotMarker(d.end)
          }
        })
        // Add numbered marker for the very last day's END
        const last = allSorted[allSorted.length - 1]
        if (last) {
          addNumberMarker(last.end, String(allSorted.length + 1))
        }

        // Fit bounds to ALL endpoints
        const b = new window.mapboxgl.LngLatBounds()
        allSorted.forEach((d)=>{ b.extend(d.start); b.extend(d.end) })
        map.current.fitBounds(b, { padding: 60 })
      } else {
        // Fallback: show provided routeCoordinates
        if (routeCoordinates.length > 0) {
          const routeData = { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: routeCoordinates } }
          map.current.addSource('route', { type: 'geojson', data: routeData as any })
          map.current.addLayer({ id: 'route', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#ec4899', 'line-width': 4, 'line-opacity': 0.9 } })
          const b = new window.mapboxgl.LngLatBounds()
          routeCoordinates.forEach((c) => b.extend(c))
          map.current.fitBounds(b, { padding: 50 })
        } else {
          map.current.setCenter([centerLng, centerLat])
          map.current.setZoom(zoom)
        }
      }

      setIsLoading(false)
    })

    // Add markers only if locations are available
    if (displayLocations.length > 0) {
      // Sort locations by order to ensure proper numbering
      const sortedLocations = [...displayLocations].sort((a, b) => (a.order || 0) - (b.order || 0))
      
      sortedLocations.forEach((location) => {
        const markerElement = createCustomMarker(location)
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
  }, [routeCoordinates, dayEndpoints]) // recreate only when route polyline or day endpoints change

  useEffect(() => {
    // Only navigate when navigateTarget is set by the parent (user clicked Navigate)
    if (!navigateTarget || !map.current) return
    const { latitude: lat, longitude: lng } = navigateTarget
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

    const centerTo = () => {
      try { console.log('[map] navigateTarget -> flyTo', { lng, lat }) } catch {}
      map.current.flyTo({ center: [lng, lat], zoom: 15, duration: 1200, essential: true })
      setTimeout(() => { try { map.current?.setCenter([lng, lat]) } catch {} }, 1400)
      // place/move selected marker
      try { selectedMarkerRef.current?.remove?.() } catch {}
      selectedMarkerRef.current = null
      const el = document.createElement('div')
      el.className = 'selected-location-marker'
      el.style.zIndex = '1000'
      el.style.pointerEvents = 'none'
      el.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" class="drop-shadow-lg" style="filter: drop-shadow(0 6px 14px rgba(236,72,153,0.45));">
          <path d="M20 10c0 7-8 12-8 12S4 17 4 10a8 8 0 1 1 16 0" fill="#ec4899" stroke="#ffffff" stroke-width="2" />
          <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#ffffff" stroke-width="1" />
        </svg>`
      selectedMarkerRef.current = new window.mapboxgl.Marker(el, { anchor: 'bottom' }).setLngLat([lng, lat]).addTo(map.current)
      try {
        // Fallback visible dot on top in case custom HTML fails to render
        new window.mapboxgl.Marker({ color: '#ec4899' })
          .setLngLat([lng, lat])
          .addTo(map.current)
      } catch {}
    }

    if (typeof map.current.isStyleLoaded === 'function' && !map.current.isStyleLoaded()) {
      map.current.once('idle', centerTo)
    } else {
      centerTo()
    }
  }, [navigateTarget])

  // Recreate markers when navigated location changes
  useEffect(() => {
    // Only applies if POI markers are used (locations provided); otherwise skip to avoid map churn
    if (!map.current || !locations || locations.length === 0) return
    // Remove only POI markers by recreating from locations; endpoint markers remain
    markers.current.forEach(marker => marker.remove())
    markers.current = []
    locations.forEach((location) => {
      const markerElement = createCustomMarker(location)
      const mapboxMarker = new window.mapboxgl.Marker(markerElement)
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current)
      markers.current.push(mapboxMarker)
    })
  }, [navigatedLocationId, locations])



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


        {selectedLocation && !onLocationClick && (
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
                    // Also place or move the selected pink marker at the exact location
                    const lng = selectedLocation.longitude
                    const lat = selectedLocation.latitude
                    try { console.log('[map] in-card Navigate -> marker', { lng, lat }) } catch {}
                    try { selectedMarkerRef.current?.remove?.() } catch {}
                    selectedMarkerRef.current = null
                    const el = document.createElement('div')
                    el.className = 'selected-location-marker'
                    el.style.zIndex = '1000'
                    el.style.pointerEvents = 'none'
                    el.innerHTML = `
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" class="drop-shadow-lg" style="filter: drop-shadow(0 6px 14px rgba(236,72,153,0.45));">
                        <path d="M20 10c0 7-8 12-8 12S4 17 4 10a8 8 0 1 1 16 0" fill="#ec4899" stroke="#ffffff" stroke-width="2" />
                        <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#ffffff" stroke-width="1" />
                      </svg>`
                    selectedMarkerRef.current = new window.mapboxgl.Marker(el, { anchor: 'bottom' })
                      .setLngLat([lng, lat])
                      .addTo(map.current)
                    try {
                      new window.mapboxgl.Marker({ color: '#ec4899' })
                        .setLngLat([lng, lat])
                        .addTo(map.current)
                    } catch {}
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
