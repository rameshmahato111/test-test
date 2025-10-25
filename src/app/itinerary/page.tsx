"use client"

import { useState, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TravelItinerary } from "@/components/Itinerary/itinerary";
import { Step1 } from "@/components/Itinerary/travel-preference/step-one-modified";
import { Step2 } from "@/components/Itinerary/travel-preference/step-two";
import { StepThree } from "@/components/Itinerary/travel-preference/step-three";
import { ProgressBar } from "@/components/Itinerary/travel-preference/progress-bar";
import RouteSelection, { type RouteOption } from "@/components/Itinerary/travel-preference/route-preference";
import { MapPin, Users, Star } from "lucide-react"
import { getHeaders } from "@/services/headers";
import { useAuth } from "@/contexts/AuthContext";
import { tokenKey, getFromLocalStorage, removeFromLocalStorage } from "@/lib/localStorage";
export interface TripData {
  starting_point: { latitude: number; longitude: number }
  destination_point: { latitude: number; longitude: number }
  starting_date: string
 
  budget: string
  travel_group_type: string
  mode_of_transport: string
  interests: string[]
  daily_drive_distance: string
  travelers_count: number
  selected_location: string
  selected_date: string
  starting_location: string
  destination_location: string
  stops?: Array<{ latitude: number; longitude: number; name?: string }>
  children?: number,
  adults?: number,
  numberOfRooms?: number,
  route_uuid?: string

}

const steps = [
  {
    number: 1,
    title: "Set Your Starting Point",
    description: "Enter your location to get the best route suggestions.",
    active: false,
    completed: false
  },
  {
    number: 2,
    title: "Choose Group & Travel Style",
    description: "Tell us your group size and travel preferences for a tailored experience.",
    active: false,
    completed: false
  },
  {
    number: 3,
    title: "Pick Your Travel Type",
    description: "Select the kind of trip you want, and we'll map it out for you.",
    active: false,
    completed: false
  }
]

function RoadTripPlannerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStep = Number.parseInt(searchParams.get("step") || "1")
  const showResults = searchParams.get("results") === "true"

  const [tripData, setTripData] = useState<TripData>({
    starting_point: { latitude: 0, longitude: 0 },
    destination_point: { latitude: 0, longitude: 0 },
    starting_date: "",
   
    budget: "economic",
    travel_group_type: "solo",
    mode_of_transport: "car",
    interests: [],
    daily_drive_distance: "medium",
    travelers_count: 1,
    selected_location: "",
    selected_date: "",
    starting_location: "",
    destination_location: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([])
  const [showRouteSelection, setShowRouteSelection] = useState(false)
  const { token: ctxToken, isAuthenticated } = useAuth();

  const updateTripData = (data: Partial<TripData>) => {
    setTripData((prev) => ({ ...prev, ...data }))
    setValidationErrors([])
  }

  // Update step states for progress bar
  const updatedSteps = steps.map((step, index) => ({
    ...step,
    active: step.number === currentStep,
    completed: step.number < currentStep
  }))

  const validateStep = (step: number): string[] => {
    const errors: string[] = []

    if (step === 1) {
      if (!tripData.starting_location) {
        errors.push("Please select a starting location")
      }
      if (!tripData.destination_location) {
        errors.push("Please select a destination location")
      }
      if (!tripData.starting_point.latitude || !tripData.starting_point.longitude) {
        errors.push("Please enter starting point coordinates")
      }
      if (!tripData.destination_point.latitude || !tripData.destination_point.longitude) {
        errors.push("Please enter destination point coordinates")
      }
      if (!tripData.starting_date) {
        errors.push("Please select a starting date")
      }
     
    }

    return errors
  }

  const getPossibleRoutes = async () => {
    const payload = {
      starting_point: {
        latitude: tripData.starting_point.latitude,
        longitude: tripData.starting_point.longitude,
      },
      destination_point: {
        latitude: tripData.destination_point.latitude,
        longitude: tripData.destination_point.longitude,
      },
      daily_drive_distance: (tripData.daily_drive_distance || "MEDIUM").toUpperCase(),
      ...(Array.isArray(tripData.stops) && tripData.stops.length > 0
        ? { via_points: tripData.stops.map((s) => ({ latitude: s.latitude, longitude: s.longitude })) }
        : {}),
    }

    try {
      setIsLoading(true)
      const urlRoutes = "https://api-v2.exploreden.com/itinify/road-trip/get_possible_routes/"
      const tokenNow = typeof window !== 'undefined'
        ? (ctxToken || localStorage.getItem('authToken') || localStorage.getItem(tokenKey))
        : ctxToken
      const h1 = getHeaders(tokenNow || undefined)
      let response = await fetch(urlRoutes, {
        method: "POST",
        headers: h1,
        body: JSON.stringify(payload),
      })
      if (response.status === 401) {
        const h2: Record<string, string> = { ...h1 }
        const auth = h1["Authorization"] as string | undefined
        if (auth && auth.startsWith("Token ")) {
          h2["Authorization"] = `Bearer ${auth.slice(6)}`
        }
        response = await fetch(urlRoutes, {
          method: "POST",
          headers: h2,
          body: JSON.stringify(payload),
        })
      }
      if (!response.ok) {
        const errText = await response.text()
        throw new Error(errText || "Failed to fetch routes")
      }
      const data = await response.json()
      const apiRoutes: any[] = Array.isArray(data) ? data : (Array.isArray(data?.routes) ? data.routes : [])
      const mapped: RouteOption[] = apiRoutes.map((r: any, idx: number) => {
        const cities: any[] = Array.isArray(r?.cities_along_route) ? r.cities_along_route : []
        const locations = cities.map((c: any) => c?.name).filter(Boolean)

        let coords: Array<[number, number]> = []
        if (r?.geometry?.coordinates && Array.isArray(r.geometry.coordinates)) {
          coords = r.geometry.coordinates
            .filter((coord: any) => Array.isArray(coord) && coord.length === 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number')
            .map((coord: any) => [coord[0], coord[1]] as [number, number])
        } else {
          coords = cities
            .map((c: any) => c?.coordinates)
            .filter((arr: any) => Array.isArray(arr) && arr.length === 2)
            .map((arr: any) => [arr[0], arr[1]] as [number, number])
        }

        const duration = typeof r?.duration_hours === "number" ? `${r.duration_hours.toFixed(2)} hrs` : ""
        const distance = typeof r?.distance_km === "number" ? `${r.distance_km.toFixed(0)} km` : ""

        return {
          id: r.route_uuid || r.id || `route-${idx + 1}`,
          name: r.route_id || r.name || `Route ${idx + 1}`,
          duration: `${duration} (${distance})`,
          locations,
          coordinates: coords,
          mapLocations: cities.map((c: any, i: number) => ({
            id: c?.name ? `${c.name}-${i}` : `${i}`,
            latitude: Array.isArray(c?.coordinates) ? c.coordinates[1] : undefined,
            longitude: Array.isArray(c?.coordinates) ? c.coordinates[0] : undefined,
            title: c?.name || `Stop ${i + 1}`,
            address: c?.place_type || "",
            type: "attraction" as const,
            order: i + 1,
          })).filter((m: any) => typeof m.latitude === 'number' && typeof m.longitude === 'number'),
        }
      })
      setRouteOptions(mapped)
      setShowRouteSelection(true)
    } catch (error) {
      console.error("[Step 1] get_possible_routes error:", error)
      alert(`Failed to load possible routes: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRouteConfirm = (selectedRouteId: string) => {
    setTripData((prev) => ({ ...prev, route_uuid: selectedRouteId }))
    setShowRouteSelection(false)
    router.push(`?step=2`)
  }

  const [resumeHandled, setResumeHandled] = useState(false)
  const [autoAdvanced, setAutoAdvanced] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (resumeHandled) return
      if (!isAuthenticated) return
      const resume = await getFromLocalStorage("itinerary_resume_after_login")
      if (resume !== "true") return
      const draftStr = await getFromLocalStorage("itinerary_step1_draft")
      if (draftStr) {
        try {
          const draft = JSON.parse(draftStr)
          setTripData((prev) => ({ ...prev, ...draft }))
        } catch {}
      }
      removeFromLocalStorage("itinerary_step1_draft")
      removeFromLocalStorage("itinerary_resume_after_login")
      setResumeHandled(true)
    }
    run()
  }, [isAuthenticated, resumeHandled])

  useEffect(() => {
    if (!resumeHandled) return
    if (autoAdvanced) return
    if (currentStep !== 1) return
    const errs = validateStep(1)
    if (errs.length === 0) {
      setAutoAdvanced(true)
      // Proceed exactly as if user clicked Next on Step 1
      nextStep()
    }
  }, [resumeHandled, autoAdvanced, currentStep, tripData])

  const nextStep = async () => {
    const errors = validateStep(currentStep)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    if (currentStep === 1) {
      await getPossibleRoutes()
      return
    }

    if (currentStep < 3) {
      setValidationErrors([])
      router.push(`?step=${currentStep + 1}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setValidationErrors([])
      router.push(`?step=${currentStep - 1}`)
    }
  }

  const generateItinerary = async () => {
    const allErrors = validateStep(1)
    if (allErrors.length > 0) {
      setValidationErrors(allErrors)
      alert("Please fill in all required fields before generating your itinerary.")
      return
    }

    setIsLoading(true)
    try {
      const isSolo = (tripData.travel_group_type || "").toLowerCase() === "solo"
      const payload = {
        route_uuid: tripData.route_uuid || "",
        starting_date: tripData.starting_date || new Date().toISOString().split("T")[0],
        budget: tripData.budget,
        travel_group_type: tripData.travel_group_type,
        no_of_children: isSolo ? 0 : (tripData.children || 0),
        no_of_adults: isSolo ? 1 : (tripData.adults || 0),
        no_of_rooms: isSolo ? 1 : (tripData.numberOfRooms || 0),
        mode_of_transport: tripData.mode_of_transport,
        interests: Array.isArray(tripData.interests) ? tripData.interests : (typeof (tripData as any).interests === 'string' ? (tripData as any).interests.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
        daily_drive_distance: (tripData.daily_drive_distance || "medium").toLowerCase(),
        ...(Array.isArray(tripData.stops) && tripData.stops.length > 0
          ? { via_points: tripData.stops.map((s) => ({ latitude: s.latitude, longitude: s.longitude })) }
          : {}),
        ...(Array.isArray(tripData.stops) && tripData.stops.length > 0
          ? { stops: tripData.stops.map((s) => ({ latitude: s.latitude, longitude: s.longitude, name: s.name || '' })) }
          : {}),
      }

      const urlCreate = "https://api-v2.exploreden.com/itinify/road-trip/create_itinerary/"
      const tokenNow2 = typeof window !== 'undefined'
        ? (ctxToken || localStorage.getItem('authToken') || localStorage.getItem(tokenKey))
        : ctxToken
      const hCreate1 = getHeaders(tokenNow2 || undefined)
      let response = await fetch(urlCreate, {
        method: "POST",
        headers: hCreate1,
        body: JSON.stringify(payload),
      })
      if (response.status === 401) {
        const hCreate2: Record<string, string> = { ...hCreate1 }
        const auth = hCreate1["Authorization"] as string | undefined
        if (auth && auth.startsWith("Token ")) {
          hCreate2["Authorization"] = `Bearer ${auth.slice(6)}`
        }
        response = await fetch(urlCreate, {
          method: "POST",
          headers: hCreate2,
          body: JSON.stringify(payload),
        })
      }

      if (response.ok) {
        const data = await response.json()

        // Normalize to the structure expected by TravelItinerary
        let normalized: any = data
        // New backend shape: { success, message, itinerary: { id, username, user_id, request_data, itinerary_data } }
        if (data && typeof data === "object" && "success" in data && "itinerary" in data) {
          const it: any = (data as any).itinerary || {}
          const d: any = it.itinerary_data || {}

          // Build daily_plan from itinerary_data.daily_schedules -> checkpoints
          const dailyPlan = Array.isArray(d.daily_schedules)
            ? d.daily_schedules.map((sched: any, i: number) => {
                const cities = Array.isArray(sched.checkpoints)
                  ? sched.checkpoints
                      .filter((cp: any) => Array.isArray(cp?.coordinate) && cp.coordinate.length === 2)
                      .map((cp: any) => {
                        // Map hotel list if activity is hotel
                        const hotels = (cp.activity === 'hotel' && Array.isArray(cp.hotels)) ? cp.hotels : []
                        const mappedAccommodations = hotels.map((h: any) => ({
                          id: Number.isFinite(Number(h?.id)) ? Number(h.id) : 0,
                          name: h?.name || 'Hotel',
                          description: h?.description || '',
                          address: {
                            content: h?.city || '',
                            coordinates: {
                              latitude: Number(h?.location?.latitude) || Number(cp?.coordinate?.[1]) || 0,
                              longitude: Number(h?.location?.longitude) || Number(cp?.coordinate?.[0]) || 0,
                            }
                          },
                          hotel_images: h?.image || '',
                        }))

                        return ({
                          name: cp.q || cp.activity || `Stop ${cp.index || ''}`,
                          coordinates: [cp.coordinate[0], cp.coordinate[1]] as [number, number],
                          place_type: cp.activity || "",
                          next_segment: undefined,
                          suggested_activities: [],
                          suggested_restaurants: [],
                          suggested_attractions: [],
                          suggested_accommodations: mappedAccommodations,
                        })
                      })
                  : []
                return {
                  day: i + 1,
                  cities,
                  day_total_distance: typeof sched.daily_driving_distance === "number" ? sched.daily_driving_distance : 0,
                  day_total_duration: typeof sched.duration_hours === "number" ? sched.duration_hours : 0,
                }
              })
            : []

          // Fallback route geometry from checkpoints if not provided
          const routeCoordsFromPlan: Array<[number, number]> = dailyPlan.length
            ? dailyPlan.flatMap((dp: any) => (Array.isArray(dp.cities) ? dp.cities.map((c: any) => c.coordinates) : []))
            : []

          const summary = d.route_summary || {}
          normalized = {
            success: true,
            itinerary_id: it.id,
            itinerary_data: {
              total_distance: typeof summary.total_distance_km === "number" ? summary.total_distance_km : 0,
              total_duration: typeof summary.total_duration_hours === "number" ? summary.total_duration_hours : 0,
              total_days: typeof d.total_days === "number" ? d.total_days : (Array.isArray(d.daily_schedules) ? d.daily_schedules.length : 0),
              route_geometry: {
                coordinates: Array.isArray(d.route_geometry?.coordinates) && d.route_geometry.coordinates?.length
                  ? d.route_geometry.coordinates
                  : routeCoordsFromPlan,
                type: d.route_geometry?.type || "LineString",
              },
              daily_plan: dailyPlan,
              raw_daily_schedules: Array.isArray(d.daily_schedules) ? d.daily_schedules : [],
              start_date: (it.request_data && it.request_data.starting_date) || d.starting_date || undefined,
              budget: (it.request_data && it.request_data.budget) || d.budget || undefined,
              travel_group_type: (it.request_data && it.request_data.travel_group_type) || d.travel_group_type || undefined,
              mode_of_transport: (it.request_data && it.request_data.mode_of_transport) || d.mode_of_transport || undefined,
              interests: (it.request_data && it.request_data.interests) || d.interests || undefined,
              daily_drive_distance: (it.request_data && it.request_data.daily_drive_distance) || d.daily_driving_distance || undefined,
            },
            message: (data as any).message,
          }
        }

        // Clear any stale data then save the normalized structure
        sessionStorage.removeItem("itineraryData")
        sessionStorage.setItem("itineraryData", JSON.stringify(normalized))
        router.push("?results=true")
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("[create_itinerary] API Error:", errorData)
        const message = (errorData && (errorData.message || errorData.detail || errorData.error)) || response.statusText
        alert(`Failed to generate itinerary: ${message}`)
      }
    } catch (error) {
      console.error("[v0] Network/Parse Error:", error)
      alert(`Error generating itinerary: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (showResults) {
    return <TravelItinerary />
  }

  // Dedicated full-width view for Route Selection (hides progress bar/sidebar entirely)
  if (currentStep === 1 && showRouteSelection) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-0">
            <RouteSelection
              routes={routeOptions}
              onConfirm={handleRouteConfirm}
              confirmLabel="Select Route"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Progress Bar */}
      <ProgressBar steps={updatedSteps} isMobile={true} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Progress Bar (Desktop) */}
          <div className="lg:col-span-1">
            <ProgressBar steps={updatedSteps} isMobile={false} />
          </div>

          {/* Right Content - Form */}
          <div className="lg:col-span-2">
            <div className="p-6">
              {currentStep === 1 && (
                <Step1 
                  tripData={tripData}
                  updateTripData={updateTripData}
                  onNext={nextStep} 
                />
              )}

              {currentStep === 2 && (
                <Step2 
                  tripData={tripData}
                  updateTripData={updateTripData}
                  onNext={nextStep} 
                  onBack={prevStep} 
                />
              )}

              {currentStep === 3 && (
                <StepThree 
                  tripData={tripData} 
                  updateTripData={updateTripData} 
                  onGenerate={generateItinerary}
                  onBack={prevStep}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RoadTripPlanner() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RoadTripPlannerContent />
    </Suspense>
  )
}
