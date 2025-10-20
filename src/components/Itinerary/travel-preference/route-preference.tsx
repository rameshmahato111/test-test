"use client"

import { useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Location from "../location-map-new"


export interface RouteOption {
  id: string
  name: string
  duration: string
  locations: string[]
  coordinates: Array<[number, number]>
  mapLocations: Array<{
    id: string
    latitude: number
    longitude: number
    title: string
    address: string
    type: "restaurant" | "attraction" | "hotel" | "activity"
    order: number
  }>
}

// No demo data; routes must be provided from API

export default function RouteSelection({
  routes,
  onConfirm,
  confirmLabel = "Generate Itinerary",
}: {
  routes?: RouteOption[]
  onConfirm?: (selectedRouteId: string) => void
  confirmLabel?: string
}) {
  const options = routes && routes.length > 0 ? routes : []
  const [selectedRoute, setSelectedRoute] = useState<string>(options[0]?.id || "")

  const selectedRouteData = options.find((route) => route.id === selectedRoute)
  // Determine the inactive route (show at most one, prioritized as the first non-selected route)
  const inactiveRouteData = options.find((route) => route.id !== selectedRoute)

  return (
    <>
    <div className="mt-10 bg-gray-50">
      {/* Desktop Layout - Responsive grid with sticky map */}
      <div className="hidden lg:grid grid-cols-2 gap-4 px-4">
        {/* Left Panel - Route Selection */}
        <div className="bg-white p-8 rounded-xl shadow-sm overflow-y-auto max-h-[calc(100vh-180px)]">
          <div className="w-full">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Select a route as per your preference
              </h1>
              <p className="text-gray-600">Select a route as per your preference</p>
            </div>

            <div className="flex gap-6 mb-8">
              {options.length === 0 && (
                <div className="w-full text-center text-gray-500">No routes available. Please go back and try again.</div>
              )}
              {options.map((route) => (
                <div
                  key={route.id}
                  className={`flex-1 p-6 cursor-pointer transition-all duration-200 border-2 rounded-lg ${selectedRoute === route.id
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"}`}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{route.name}</h3>
                      <div className="flex items-center gap-3 text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{route.duration}</span>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                          {route.locations.length} cities
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRoute === route.id
                          ? "border-pink-500 bg-pink-500"
                          : "border-gray-300"}`}
                    >
                      {selectedRoute === route.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {route.locations.map((location, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${selectedRoute === route.id
                              ? "bg-pink-500"
                              : "bg-gray-400"}`} />
                        <span
                          className={`text-sm ${selectedRoute === route.id
                              ? "text-gray-900"
                              : "text-gray-600"}`}
                        >
                          {location}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-4 flex justify-center">
              <Button
                className=" bg-pink-500 hover:bg-pink-600 text-white py-3 text-base font-medium rounded-lg"
                disabled={!selectedRoute}
                onClick={() => selectedRoute && onConfirm?.(selectedRoute)}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Map (sticky) */}
        <div className="rounded-xl overflow-hidden sticky top-6 h-[calc(100vh-180px)] shadow">
          {selectedRouteData && (
            <Location
              locations={selectedRouteData.mapLocations}
              routeCoordinates={selectedRouteData.coordinates}
              inactiveRouteCoordinates={inactiveRouteData?.coordinates || []}
              inactiveLocations={inactiveRouteData?.mapLocations || []}
              latitude={selectedRouteData.mapLocations[0]?.latitude}
              longitude={selectedRouteData.mapLocations[0]?.longitude}
              locationName={selectedRouteData.mapLocations[0]?.title} />
          )}
        </div>
      </div>

      {/* Tablet+Mobile Layout - single block for < lg with map on top using flex-col-reverse */}
      <div className="block lg:hidden ">
        <div className="min-h-[80vh] flex flex-col-reverse gap-4 px-4">
          {/* Routes list (will appear below the map due to flex-col-reverse) */}
          <div className="flex-1 bg-white shadow-lg rounded-xl p-6">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Select a route as per your preference
              </h1>
              <p className="text-gray-600 text-sm">
                Select a route as per your preference
              </p>
            </div>

            {/* Routes list: single column on mobile, horizontal on md */}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              {options.length === 0 && (
                <div className="w-full text-center text-gray-500">No routes available. Please go back and try again.</div>
              )}
              {options.map((route) => (
                <Card
                  key={route.id}
                  className={`w-full md:flex-1 p-3 cursor-pointer transition-all duration-200 border-2 ${selectedRoute === route.id
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200"}`}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {route.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{route.duration}</span>
                        </div>
                        <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                          {route.locations.length} cities
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedRoute === route.id
                          ? "border-pink-500 bg-pink-500"
                          : "border-gray-300"}`}
                    >
                      {selectedRoute === route.id && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    {route.locations.slice(0, 3).map((location, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${selectedRoute === route.id
                              ? "bg-pink-500"
                              : "bg-gray-400"}`} />
                        <span
                          className={`text-xs ${selectedRoute === route.id
                              ? "text-gray-900"
                              : "text-gray-600"}`}
                        >
                          {location}
                        </span>
                      </div>
                    ))}
                    {route.locations.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{route.locations.length - 3} more
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="pt-2">
              <Button
                className=" bg-pink-500 hover:bg-pink-600 text-white py-2 font-medium rounded-lg text-sm w-full"
                disabled={!selectedRoute}
                onClick={() => selectedRoute && onConfirm?.(selectedRoute)}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>

          {/* Map block (will appear above the list due to flex-col-reverse) */}
          <div className="h-[50vh] relative rounded-xl overflow-hidden shadow">
            {selectedRouteData && (
              <Location
                locations={selectedRouteData.mapLocations}
                routeCoordinates={selectedRouteData.coordinates}
                inactiveRouteCoordinates={inactiveRouteData?.coordinates || []}
                inactiveLocations={inactiveRouteData?.mapLocations || []}
                latitude={selectedRouteData.mapLocations[0]?.latitude}
                longitude={selectedRouteData.mapLocations[0]?.longitude}
                locationName={selectedRouteData.mapLocations[0]?.title} />
            )}
          </div>
        </div>
      </div>

      </div>
      </>
  )
}
