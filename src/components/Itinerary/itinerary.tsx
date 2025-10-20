"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import ItineraryCard from "@/components/Itinerary/travel-preference/itinerary-card";


import {
  Calendar,
  
  ChevronDownIcon,
  MapPin,
 
  Scaling as Walking,
  
} from "lucide-react";

import ItineraryHeaderCard from "@/components/Itinerary/ItineraryHeaderCard";
import RecommendationItineraryPlaces, {
  type Place as RecPlace,
} from "@/components/Itinerary/travel-preference/recommendation-itinerary-places";
import Location from "./location-map";



import { CostSummary } from "./travel-preference/cost-summary";
import { HotelDetailsModal } from "./travel-preference/itinerary-card-details";

import { DepartureTimeSelector } from "./departure-time";
import ItineraryEngagement from "@/components/Itinerary/itinerary-engagement";

// API Data Interfaces
interface ApiCity {
  name: string;
  coordinates: [number, number];
  place_type: string;
  next_segment?: {
    name: string;
    distance_km: number;
    duration_hours: number;
  };
  suggested_activities: Array<{
    id: number;
    name: string;
    description: string;
    images?: {
      urls: Array<{
        resource: string;
        sizeType: string;
      }>;
    };
  }>;
  suggested_restaurants: Array<{
    name: string;
    address: string;
    rating: number;
    user_rating_count: number;
    primary_type: string;
    types: string[];
    website?: string;
    location: {
      latitude: number;
      longitude: number;
    };
    photos?: Array<{
      name: string;
      widthPx: number;
      heightPx: number;
    }>;
    opening_hours?: any;
    source: string;
    parking_info?: {
      available: boolean;
      is_free: boolean;
      distance_meters: number;
      price_per_hour: number;
      parking_types: string[];
    };
  }>;
  suggested_attractions: Array<{
    name: string;
    address: string;
    rating: number;
    user_rating_count: number;
    primary_type: string;
    types: string[];
    website?: string;
    location: {
      latitude: number;
      longitude: number;
    };
    photos?: Array<{
      name: string;
      widthPx: number;
      heightPx: number;
    }>;
    opening_hours?: any;
    source: string;
    parking_info?: {
      available: boolean;
      is_free: boolean;
      distance_meters: number;
      price_per_hour: number;
      parking_types: string[];
    };
  }>;
  suggested_accommodations: Array<{
    id: number;
    name: string;
    description: string;
    address: {
      content: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    hotel_images: string;
  }>;
}

interface ApiDailyPlan {
  day: number;
  cities: ApiCity[];
  day_total_distance: number;
  day_total_duration: number;
}

interface RealApiResponse {
  success: boolean;
  // Existing normalized structure used by the UI
  itinerary_data: {
    total_distance: number;
    total_duration: number;
    total_days: number;
    route_geometry: {
      coordinates: Array<[number, number]>;
      type: string;
    };
    daily_plan?: ApiDailyPlan[];
    start_date?: string;
    end_date?: string;
    budget?: string;
    travel_group_type?: string;
    mode_of_transport?: string;
    interests?: string;
    daily_drive_distance?: number;
    // Added: raw schedules straight from API for recommendations, etc.
    raw_daily_schedules?: any[];
  };
  // Optional alternate raw payload from new API
  data?: any;
}

interface ItineraryStop {
  id: string;
  time: string;
  title: string;
  duration: string;
  address: string;
  travelTime: string;
  travelDistance: string;
  type: "contact" | "ticket" | "navigate";
  latitude?: number;
  longitude?: number;
  description?: string;
  image?: string;
  price?: string;
  rating?: number;
  openingHours?: string;
  tickets?: string;
  capacity?: string;
  contact?: string;
  website?: string;
  // For alternatives: source checkpoint index and activity type
  cpIndex?: number;
  cpActivityType?: string;
}

interface MapLocation {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  type: "attraction" | "restaurant" | "hotel" | "activity";
  rating: number;
  openHours: string;
  description: string;
  travelTime?: string;
  isStart?: boolean;
  order: number;
  image?: string;
  weekdayDescriptions?: string[];
}

export function TravelItinerary() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [apiData, setApiData] = useState<RealApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedStops, setLikedStops] = useState<Record<string, boolean>>({});
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    locationName: string;
  } | null>(null);
  // Only allow marker details after user clicked Navigate
  const [allowMapDetails, setAllowMapDetails] = useState(false);
  // When user clicks a marker on the map
  const [selectedMapPlace, setSelectedMapPlace] = useState<{
    id: string;
    title: string;
    rating?: number;
    address?: string;
    image?: string;
    openingHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  } | null>(null);
  const [selectedStopDetails, setSelectedStopDetails] =
    useState<ItineraryStop | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [showDateWarning, setShowDateWarning] = useState(false);
  const [showTimeChange, setShowTimeChange] = useState(false);
  const [departureTime, setDepartureTime] = useState("8:00 A.M");
  const [tempStartTime, setTempStartTime] = useState("9:00 A.M");
  const [tempEndTime, setTempEndTime] = useState("9:00 A.M");
  const [directionsEnabled, setDirectionsEnabled] = useState(false);
  // Tabs state and section refs
  const [activeTab, setActiveTab] = useState<
    "itinerary" | "budget" | "bookings" | "engagement"
  >("itinerary");
  const itineraryTopRef = useRef<HTMLDivElement>(null);
  const bookingsRef = useRef<HTMLDivElement>(null);
  const engagementRef = useRef<HTMLDivElement>(null);

  // Ref for cost summary section
  const costSummaryRef = useRef<HTMLDivElement>(null);

  const scrollToEl = (el: HTMLElement | null) => {
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // If opened from a shared link, suppress the itinerary form/modal
  useEffect(() => {
    try {
      const mode = sessionStorage.getItem("itineraryViewMode");
      if (mode === "shared") setIsModalOpen(false);
    } catch {}
  }, []);
  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === "itinerary") scrollToEl(itineraryTopRef.current);
    if (tab === "bookings") scrollToEl(bookingsRef.current);
    // Do not scroll for engagement; show UI inline below tabs
    // Do not scroll for budget; show UI inline below tabs
  };

  // On initial load after data is available, scroll into the itinerary section once
  const [initialScrolled, setInitialScrolled] = useState(false);
  useEffect(() => {
    if (!isLoading && apiData && !initialScrolled) {
      setActiveTab("itinerary");
      scrollToEl(itineraryTopRef.current);
      setInitialScrolled(true);
    }
  }, [isLoading, apiData, initialScrolled]);

  // Safe number helper
  const cpSafeNumber = (v: any, fallback: number = 0): number => {
    const n = Number(v);
    return Number.isFinite(n) && !Number.isNaN(n) ? n : fallback;
  };

  // Helper function to format time properly
  const formatTime = (hour24: number): string => {
    if (hour24 >= 24) {
      hour24 = hour24 % 24; // Wrap around to next day
    }

    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? "P.M." : "A.M.";
    return `${hour12}:00 ${period}`;
  };

  // Helper: format hour/minute to 12h label like 7:00 AM
  const formatHourMinute = (hour: number, minute: number): string => {
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return "—";
    const h = Math.max(0, Math.min(23, Math.floor(hour)));
    const m = Math.max(0, Math.min(59, Math.floor(minute)));
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const period = h >= 12 ? "PM" : "AM";
    const mm = m.toString().padStart(2, "0");
    return `${h12}:${mm} ${period}`;
  };

  // Helper: build today's opening label from Google-like openingHours
  const buildTodayOpeningLabel = (openingHours: any): string | undefined => {
    try {
      if (!openingHours) return undefined;
      const periods = Array.isArray(openingHours.periods)
        ? openingHours.periods
        : [];
      if (periods.length === 0) return undefined;
      const today = new Date().getDay(); // 0=Sun .. 6=Sat (Google also uses 0=Sun)
      const todayPeriod = periods.find((p: any) => p?.open?.day === today);
      if (!todayPeriod || !todayPeriod.open || !todayPeriod.close)
        return "Closed today";
      const oh = Number(todayPeriod.open.hour);
      const om = Number(todayPeriod.open.minute);
      const ch = Number(todayPeriod.close.hour);
      const cm = Number(todayPeriod.close.minute);
      const openLabel = formatHourMinute(oh, om);
      const closeLabel = formatHourMinute(ch, cm);
      const openMin = oh * 60 + om;
      const closeMin = ch * 60 + cm;
      let diff = closeMin - openMin;
      if (!Number.isFinite(diff) || diff <= 0)
        return `${openLabel} - ${closeLabel}`;
      const dh = Math.floor(diff / 60);
      const dm = diff % 60;
      const dur = `${dh > 0 ? `${dh}h` : ""}${dh > 0 && dm > 0 ? " " : ""}${
        dm > 0 ? `${dm}m` : ""
      }`.trim();
      const statusPrefix =
        openingHours.openNow === false ? "Closed now" : "Open now";
      return `${statusPrefix} · ${openLabel} - ${closeLabel}${
        dur ? ` (${dur})` : ""
      }`;
    } catch {
      return undefined;
    }
  };

  const convertApiToStops = (
    dailyPlan: ApiDailyPlan[]
  ): Record<string, ItineraryStop[]> => {
    const result: Record<string, ItineraryStop[]> = {};

    try {
      dailyPlan.forEach((day) => {
        const dayKey = `day${day.day}`;
        result[dayKey] = [];

        if (day.cities && Array.isArray(day.cities)) {
          day.cities.forEach((city, cityIndex) => {
            // Add city arrival as first stop
            const arrivalHour = 8 + cityIndex * 2;
            result[dayKey].push({
              id: `${day.day}-${cityIndex}-arrival`,
              time: formatTime(arrivalHour),
              title: `Arrive at ${city.name}`,
              duration: `${formatTime(arrivalHour)} - ${formatTime(
                arrivalHour + 1
              )} (1hr)`,
              address: city.name,
              travelTime: city.next_segment
                ? `${Math.round(city.next_segment.duration_hours * 60)} min`
                : "0 min",
              travelDistance: city.next_segment
                ? `(${Math.round(city.next_segment.distance_km)} Km)`
                : "(0 Km)",
              type: "contact",
              latitude: city.coordinates?.[1],
              longitude: city.coordinates?.[0],
              description: `Welcome to ${city.name}! ${
                city.place_type || "A beautiful destination"
              }`,
            });

            // Add suggested activities
            if (
              city.suggested_activities &&
              Array.isArray(city.suggested_activities)
            ) {
              city.suggested_activities.forEach((activity, activityIndex) => {
                const startHour = arrivalHour + 1 + activityIndex * 2;
                const duration = 1 + Math.floor(Math.random() * 2);

                // Get the best quality image
                const bestImage =
                  activity.images?.urls?.find(
                    (url) => url.sizeType === "LARGE"
                  ) ||
                  activity.images?.urls?.find(
                    (url) => url.sizeType === "MEDIUM"
                  ) ||
                  activity.images?.urls?.[0];

                result[dayKey].push({
                  id: `${day.day}-${cityIndex}-activity-${activityIndex}`,
                  time: formatTime(startHour),
                  title: activity.name,
                  duration: `${formatTime(startHour)} - ${formatTime(
                    startHour + duration
                  )} (${duration}hr${duration > 1 ? "s" : ""})`,
                  address: city.name,
                  travelTime: "0 min",
                  travelDistance: "(0 Km)",
                  type:
                    activity.name?.toLowerCase().includes("ticket") ||
                    activity.name?.toLowerCase().includes("museum") ||
                    activity.name?.toLowerCase().includes("park") ||
                    activity.name?.toLowerCase().includes("tour")
                      ? "ticket"
                      : "contact",
                  latitude: city.coordinates?.[1],
                  longitude: city.coordinates?.[0],
                  description: activity.description,
                  image: bestImage?.resource,
                  rating: 4.5,
                  price: "$45,856",
                });
              });
            }

            // Add suggested attractions
            if (
              city.suggested_attractions &&
              Array.isArray(city.suggested_attractions)
            ) {
              city.suggested_attractions.forEach(
                (attraction, attractionIndex) => {
                  const startHour =
                    arrivalHour +
                    1 +
                    (city.suggested_activities?.length || 0) * 2 +
                    attractionIndex * 2;
                  const duration = 1 + Math.floor(Math.random() * 2);

                  result[dayKey].push({
                    id: `${day.day}-${cityIndex}-attraction-${attractionIndex}`,
                    time: formatTime(startHour),
                    title: attraction.name,
                    duration: `${formatTime(startHour)} - ${formatTime(
                      startHour + duration
                    )} (${duration}hr${duration > 1 ? "s" : ""})`,
                    address: attraction.address,
                    travelTime: "0 min",
                    travelDistance: "(0 Km)",
                    type: "ticket",
                    latitude: attraction.location?.latitude,
                    longitude: attraction.location?.longitude,
                    description: `${
                      attraction.primary_type
                    } - ${attraction.types?.join(", ")}`,
                    image: attraction.photos?.[0]?.name
                      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${attraction.photos[0].name}&key=YOUR_API_KEY`
                      : undefined,
                    rating: attraction.rating,
                    price: attraction.parking_info?.price_per_hour
                      ? `$${Math.round(
                          attraction.parking_info.price_per_hour
                        )}/hr`
                      : undefined,
                  });
                }
              );
            }

            // Add suggested restaurants
            if (
              city.suggested_restaurants &&
              Array.isArray(city.suggested_restaurants)
            ) {
              city.suggested_restaurants.forEach(
                (restaurant, restaurantIndex) => {
                  const startHour = 12 + restaurantIndex * 2; // Lunch and dinner times
                  const duration = 1;

                  result[dayKey].push({
                    id: `${day.day}-${cityIndex}-restaurant-${restaurantIndex}`,
                    time: formatTime(startHour),
                    title: restaurant.name,
                    duration: `${formatTime(startHour)} - ${formatTime(
                      startHour + duration
                    )} (${duration}hr)`,
                    address: restaurant.address,
                    travelTime: "0 min",
                    travelDistance: "(0 Km)",
                    type: "contact",
                    latitude: restaurant.location?.latitude,
                    longitude: restaurant.location?.longitude,
                    description: `${
                      restaurant.primary_type
                    } - ${restaurant.types?.join(", ")}`,
                    image: restaurant.photos?.[0]?.name
                      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.photos[0].name}&key=YOUR_API_KEY`
                      : undefined,
                    rating: restaurant.rating,
                    price: restaurant.parking_info?.price_per_hour
                      ? `$${Math.round(
                          restaurant.parking_info.price_per_hour
                        )}/hr`
                      : undefined,
                  });
                }
              );
            }

            // Add suggested accommodations
            if (
              city.suggested_accommodations &&
              Array.isArray(city.suggested_accommodations) &&
              city.suggested_accommodations.length > 0
            ) {
              const accommodation = city.suggested_accommodations[0];
              result[dayKey].push({
                id: `${day.day}-${cityIndex}-hotel`,
                time: "8:00 P.M.",
                title: accommodation.name,
                duration: "8:00 P.M. - Check-in",
                address: accommodation.address?.content || city.name,
                travelTime: "15 min",
                travelDistance: "(5 Km)",
                type: "contact",
                latitude:
                  accommodation.address?.coordinates?.latitude ||
                  city.coordinates?.[1],
                longitude:
                  accommodation.address?.coordinates?.longitude ||
                  city.coordinates?.[0],
                description: accommodation.description,
                image: accommodation.hotel_images,
                rating: 4.5,
                price: "$120",
              });
            }
          });
        }
      });
    } catch (error) {
      console.error("[v0] Error converting API to stops:", error);
    }

    return result;
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("itineraryData");
    if (storedData) {
      try {
        const parsedData: RealApiResponse | any = JSON.parse(storedData);
        console.log(
          "[v0] Raw API response structure:",
          JSON.stringify(parsedData, null, 2)
        );

        // Normalize if response is of the new shape: { success, data: { daily_schedules: [...] } }
        let normalized: RealApiResponse | null = null;

        if (
          parsedData &&
          parsedData.success &&
          parsedData.data &&
          !parsedData.itinerary_data
        ) {
          const dailySchedules: any[] = Array.isArray(
            parsedData.data.daily_schedules
          )
            ? parsedData.data.daily_schedules
            : [];

          // Build route coordinates by chaining checkpoints across days
          const routeCoordinates: Array<[number, number]> =
            dailySchedules.flatMap((day: any) =>
              (Array.isArray(day.checkpoints) ? day.checkpoints : [])
                .filter(
                  (cp: any) =>
                    Array.isArray(cp?.coordinate) && cp.coordinate.length === 2
                )
                .map(
                  (cp: any) =>
                    [Number(cp.coordinate[0]), Number(cp.coordinate[1])] as [
                      number,
                      number
                    ]
                )
            );

          const dailyPlan: ApiDailyPlan[] = dailySchedules.map(
            (day: any, idx: number) => {
              const checkpoints: any[] = Array.isArray(day.checkpoints)
                ? day.checkpoints
                : [];

              const cities: ApiCity[] = checkpoints.map((cp: any) => {
                const lat = Number(cp?.coordinate?.[1]);
                const lng = Number(cp?.coordinate?.[0]);

                // Map Google-like place objects inside activities into suggested_attractions for our UI
                const activities: any[] = Array.isArray(cp.activities)
                  ? cp.activities
                  : [];
                const mappedAttractions = activities
                  .filter((a) => a && (a.displayName || a.name))
                  .map((a) => ({
                    name: a.displayName || a.name,
                    address: a.formattedAddress || "",
                    rating: typeof a.rating === "number" ? a.rating : 4.0,
                    user_rating_count: 0,
                    primary_type: a.primaryType || "",
                    types: [],
                    website: a.websiteUri,
                    location: {
                      latitude: Number(a?.location?.latitude) || lat,
                      longitude: Number(a?.location?.longitude) || lng,
                    },
                    photos: Array.isArray(a.photos) ? a.photos : [],
                    opening_hours: a.openingHours,
                    source: a.source || "google_places",
                    parking_info: undefined,
                  }));

                return {
                  name:
                    activities?.[0]?.displayName ||
                    cp.q ||
                    `Stop ${cp.index || "?"}`,
                  coordinates: [lng, lat],
                  place_type: cp.activity || "activity",
                  next_segment: undefined,
                  suggested_activities: [],
                  suggested_restaurants: [],
                  suggested_attractions: mappedAttractions,
                  suggested_accommodations: [],
                };
              });

              return {
                day: Number(cpSafeNumber(idx + 1)),
                cities,
                day_total_distance: Number(day.daily_driving_distance) || 0,
                day_total_duration: Number(day.duration_hours) || 0,
              };
            }
          );

          normalized = {
            success: true,
            itinerary_data: {
              total_distance: dailyPlan.reduce(
                (sum, d) => sum + (d.day_total_distance || 0),
                0
              ),
              total_duration: dailyPlan.reduce(
                (sum, d) => sum + (d.day_total_duration || 0),
                0
              ),
              total_days:
                Number(parsedData.data.total_days) || dailyPlan.length || 0,
              route_geometry: {
                coordinates: routeCoordinates,
                type: "LineString",
              },
              daily_plan: dailyPlan,
              raw_daily_schedules: dailySchedules,
            },
          };
        }

        // Use normalized if available else expect legacy shape
        const finalData: RealApiResponse | any = normalized || parsedData;

        if (!finalData.success || !finalData.itinerary_data) {
          console.error("[v0] Invalid API response structure:", parsedData);
          setError(
            "Invalid API response structure. Please generate a new itinerary."
          );
          setIsLoading(false);
          return;
        }

        setApiData(finalData);

        // Do not set selectedLocation on initial load; navigation should only occur on explicit user action

        if (
          finalData.itinerary_data.daily_plan &&
          Array.isArray(finalData.itinerary_data.daily_plan)
        ) {
          const initialExpanded: Record<string, boolean> = {};
          finalData.itinerary_data.daily_plan.forEach(
            (day: ApiDailyPlan, index: number) => {
              initialExpanded[`day${day.day}`] = index === 0;
            }
          );
          setExpandedDays(initialExpanded);
        }
      } catch (error) {
        console.error("[v0] Error parsing stored itinerary data:", error);
        setError(
          "Failed to load itinerary data. Please try generating a new itinerary."
        );
      }
    } else {
      console.log("[v0] No stored data found");
      setError("No itinerary data found. Please generate an itinerary first.");
    }
    setIsLoading(false);
  }, []);

  // Early helpers to avoid temporal dead zone when used above later definitions
  const photoNameFrom = (entity?: any): string | undefined => {
    try {
      if (!entity) return undefined;
      const photos = (entity as any).photos ?? (entity as any).photo;
      if (!photos) return undefined;
      if (Array.isArray(photos)) return photos[0]?.name;
      if (typeof photos === "object") return (photos as any).name;
      if (typeof photos === "string") return photos;
      return undefined;
    } catch {
      return undefined;
    }
  };

  const photoUrlFrom = (photoName?: string): string => {
    if (photoName) {
      const encoded = encodeURIComponent(photoName);
      return `https://api-v2.exploreden.com/itinify/maps/photo-proxy/?place_id=${encoded}&max_width=600&max_height=600`;
    }
    return "/images/card-1.png";
  };

  const mapLocations: MapLocation[] = useMemo(() => {
    if (!apiData?.itinerary_data) {
      console.log("[v0] No API data available for map");
      return [];
    }

    try {
      const locations: MapLocation[] = [];
      const itineraryData = apiData.itinerary_data;

      // Add locations from daily plan if available
      if (itineraryData.daily_plan && Array.isArray(itineraryData.daily_plan)) {
        let order = 1; // Start from 1 instead of 0
        itineraryData.daily_plan.forEach((day) => {
          if (day.cities && Array.isArray(day.cities)) {
            day.cities.forEach((city) => {
              // Add main city location
              if (
                city.coordinates &&
                Array.isArray(city.coordinates) &&
                city.coordinates.length >= 2
              ) {
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
                  travelTime: city.next_segment
                    ? `${Math.round(city.next_segment.duration_hours * 60)} min`
                    : undefined,
                  isStart: order === 1, // First location is start
                  order: order++,
                });
              }

              // Add suggested attractions
              if (
                city.suggested_attractions &&
                Array.isArray(city.suggested_attractions)
              ) {
                city.suggested_attractions.forEach((attraction) => {
                  if (
                    attraction.location?.latitude &&
                    attraction.location?.longitude
                  ) {
                    locations.push({
                      id: `attraction-${day.day}-${attraction.name}`,
                      latitude: attraction.location.latitude,
                      longitude: attraction.location.longitude,
                      title: attraction.name,
                      address: attraction.address,
                      type: "attraction",
                      rating: attraction.rating,
                      openHours: "9:00 AM - 6:00 PM",
                      description: `${
                        attraction.primary_type
                      } - ${attraction.types?.join(", ")}`,
                      order: order++,
                      image: photoUrlFrom(photoNameFrom(attraction)),
                      weekdayDescriptions: Array.isArray(
                        attraction?.opening_hours?.weekdayDescriptions
                      )
                        ? attraction.opening_hours.weekdayDescriptions
                        : undefined,
                    });
                  }
                });
              }

              // Add suggested restaurants
              if (
                city.suggested_restaurants &&
                Array.isArray(city.suggested_restaurants)
              ) {
                city.suggested_restaurants.forEach((restaurant) => {
                  if (
                    restaurant.location?.latitude &&
                    restaurant.location?.longitude
                  ) {
                    locations.push({
                      id: `restaurant-${day.day}-${restaurant.name}`,
                      latitude: restaurant.location.latitude,
                      longitude: restaurant.location.longitude,
                      title: restaurant.name,
                      address: restaurant.address,
                      type: "restaurant",
                      rating: restaurant.rating,
                      openHours: "11:00 AM - 10:00 PM",
                      description: `${
                        restaurant.primary_type
                      } - ${restaurant.types?.join(", ")}`,
                      order: order++,
                      image: photoUrlFrom(photoNameFrom(restaurant)),
                      weekdayDescriptions: Array.isArray(
                        restaurant?.opening_hours?.weekdayDescriptions
                      )
                        ? restaurant.opening_hours.weekdayDescriptions
                        : undefined,
                    });
                  }
                });
              }
            });
          }
        });
      }

      // If no daily plan, use route geometry coordinates
      if (
        locations.length === 0 &&
        itineraryData.route_geometry?.coordinates?.length
      ) {
        const coordinates = itineraryData.route_geometry.coordinates;

        if (coordinates.length > 0) {
          const startCoord = coordinates[0];
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
          });
        }

        if (coordinates.length > 1) {
          const endCoord = coordinates[coordinates.length - 1];
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
          });
        }
      }

      console.log("[v0] Generated map locations from API data:", locations);
      return locations;
    } catch (error) {
      console.error("[v0] Error generating map locations:", error);
      return [];
    }
  }, [apiData]);

  // Handle marker click from the map
  const handleMapMarkerClick = (loc: any) => {
    try {
      console.log("[map] marker clicked", loc);
    } catch {}
    // Only show details if user has navigated to a place
    if (!allowMapDetails || !selectedLocation) return;

    // Build details from real API checkpoints/activities
    const rawDays: any[] = Array.isArray(
      apiData?.itinerary_data?.raw_daily_schedules
    )
      ? (apiData as any).itinerary_data.raw_daily_schedules
      : [];

    const targetLat = Number(loc?.latitude);
    const targetLng = Number(loc?.longitude);

    let found: any | null = null;
    for (const day of rawDays) {
      const cps: any[] = Array.isArray(day?.checkpoints) ? day.checkpoints : [];
      for (const cp of cps) {
        const acts: any[] = Array.isArray(cp?.activities) ? cp.activities : [];
        for (const a of acts) {
          const alat = Number(a?.location?.latitude);
          const alng = Number(a?.location?.longitude);
          // Match by proximity or name fallback
          const byCoord =
            Number.isFinite(alat) &&
            Number.isFinite(alng) &&
            Math.abs(alat - targetLat) < 1e-4 &&
            Math.abs(alng - targetLng) < 1e-4;
          const byName =
            (a?.displayName || "").toString().trim().toLowerCase() ===
            (loc?.title || "").toString().trim().toLowerCase();
          if (byCoord || byName) {
            found = a;
            break;
          }
        }
        if (found) break;
      }
      if (found) break;
    }

    if (!found) {
      // Fallback to what we have from marker
      setSelectedMapPlace({
        id: loc?.id,
        title: loc?.title || loc?.locationName || "Place",
        rating: typeof loc?.rating === "number" ? loc.rating : undefined,
        address: loc?.address,
        image: loc?.image,
        openingHours: loc?.weekdayDescriptions
          ? { weekdayDescriptions: loc.weekdayDescriptions }
          : undefined,
      });
      return;
    }

    // Extract details from real activity
    const title = found.displayName || loc?.title || "Place";
    const address = found.formattedAddress || loc?.address;
    const rating =
      typeof found.rating === "number"
        ? found.rating
        : typeof loc?.rating === "number"
        ? loc.rating
        : undefined;
    const weekdayDescriptions = Array.isArray(
      found?.openingHours?.weekdayDescriptions
    )
      ? found.openingHours.weekdayDescriptions
      : Array.isArray(loc?.weekdayDescriptions)
      ? loc.weekdayDescriptions
      : undefined;
    const photoName = ((): string | undefined => {
      const p = found?.photos;
      if (!p) return undefined;
      if (Array.isArray(p)) return p[0]?.name;
      if (typeof p === "object") return p.name;
      if (typeof p === "string") return p;
      return undefined;
    })();
    const image = photoName ? photoUrlFrom(photoName) : loc?.image;

    setSelectedMapPlace({
      id: loc?.id,
      title,
      rating,
      address,
      image,
      openingHours: weekdayDescriptions ? { weekdayDescriptions } : undefined,
    });
  };

  // Track when Navigate is triggered or cleared
  useEffect(() => {
    // If a navigate target exists, allow details; else disable
    setAllowMapDetails(!!selectedLocation);
    if (!selectedLocation) setSelectedMapPlace(null);
  }, [selectedLocation]);

  // Memoize day start/end endpoints used by the map to avoid recreating the map on non-navigation UI updates
  const dayEndpoints = useMemo(() => {
    const rawDays: any[] = Array.isArray(
      apiData?.itinerary_data?.raw_daily_schedules
    )
      ? apiData!.itinerary_data.raw_daily_schedules
      : [];
    return rawDays
      .map((d: any, idx: number) => {
        const s = d?.route_info?.start_coordinate;
        const e = d?.route_info?.end_coordinate;
        if (
          Array.isArray(s) &&
          s.length === 2 &&
          Array.isArray(e) &&
          e.length === 2
        ) {
          return {
            day: idx + 1,
            start: [Number(s[0]), Number(s[1])] as [number, number],
            end: [Number(e[0]), Number(e[1])] as [number, number],
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{
      day: number;
      start: [number, number];
      end: [number, number];
    }>;
  }, [apiData?.itinerary_data?.raw_daily_schedules]);

  // Track selection per checkpoint to drive Cost Summary updates (must be before cost useMemo)
  const [selectedAltByCp, setSelectedAltByCp] = useState<
    Record<string, number>
  >({});
  const cpKey = (day: number, cpIdx: number, actType: string) =>
    `${day}-${cpIdx}-${(actType || "").toLowerCase()}`;

  const incrementAlternativeWithContext = (
    stopId: string,
    day: number,
    cpIdx: number,
    actType: string,
    max: number
  ) => {
    if (max <= 0) return;
    // Update card cycling index
    setAltIndexByStop((prev) => {
      const current = prev[stopId] || 0;
      const next = (current + 1) % max;
      return { ...prev, [stopId]: next };
    });
    // Update checkpoint selection used by costs
    const key = cpKey(day, cpIdx, actType);
    setSelectedAltByCp((prev) => {
      const current = prev[key] || 0;
      const next = (current + 1) % max;
      return { ...prev, [key]: next };
    });
  };

  // Cost summary: compute on every render to preserve hook order
  const { costItems, totalCost, totalCurrency } = useMemo(() => {
    const rawDays: any[] = Array.isArray(
      apiData?.itinerary_data?.raw_daily_schedules
    )
      ? (apiData as any).itinerary_data.raw_daily_schedules
      : [];
    type CostItem = {
      id: number;
      day: string;
      activities: number;
      hotel: number;
      other: number;
    };
    const items: CostItem[] = [];
    let grand = 0;
    let currency: string | undefined;
    rawDays.forEach((day: any, idx: number) => {
      let activities = 0;
      let hotel = 0;
      try {
        const cps: any[] = Array.isArray(day?.checkpoints)
          ? day.checkpoints
          : [];
        cps.forEach((cp: any, cpIdx: number) => {
          const actType = (cp?.activity || "").toString().toLowerCase();
          if (actType === "hotel") {
            const hotelArr: any[] = Array.isArray(cp?.hotels)
              ? cp.hotels
              : Array.isArray(cp?.hotel)
              ? cp.hotel
              : [];
            if (hotelArr.length > 0) {
              const selIdx = Math.max(
                0,
                Math.min(
                  hotelArr.length - 1,
                  selectedAltByCp[cpKey(idx + 1, cpIdx, "hotel")] ?? 0
                )
              );
              const h = hotelArr[selIdx];
              const amt = Number(h?.originalPrice ?? h?.minPrice);
              if (Number.isFinite(amt)) {
                hotel += amt;
                if (!currency && h?.currency) currency = h.currency;
              }
            }
          }
          if (actType === "activity") {
            const acts: any[] = Array.isArray(cp?.activities)
              ? cp.activities
              : [];
            if (acts.length > 0) {
              const selIdx = Math.max(
                0,
                Math.min(
                  acts.length - 1,
                  selectedAltByCp[cpKey(idx + 1, cpIdx, "activity")] ?? 0
                )
              );
              const a0 = acts[selIdx];
              const aAmtRaw = a0?.originalPrice ?? a0?.minPrice;
              const aAmt = Number(aAmtRaw);
              if (Number.isFinite(aAmt)) activities += aAmt;
            }
          }
        });
      } catch {}
      const item = {
        id: idx + 1,
        day: `Day ${Number(idx + 1)}`,
        activities,
        hotel,
        other: 0,
      };
      items.push(item);
      grand += activities + hotel;
    });
    return { costItems: items, totalCost: grand, totalCurrency: currency };
  }, [apiData?.itinerary_data?.raw_daily_schedules, selectedAltByCp]);

  // Helper to build ExploreDen photo-proxy URL or fallback image
  const getFirstPhotoName = (entity?: any): string | undefined => {
    if (!entity) return undefined;
    // Prefer 'photos' field; can be array or single object per API variants
    const photos = entity.photos ?? entity.photo;
    if (!photos) return undefined;
    if (Array.isArray(photos)) return photos[0]?.name;
    if (typeof photos === "object") return (photos as any).name;
    if (typeof photos === "string") return photos;
    return undefined;
  };

  const getPhotoUrl = (photoName?: string): string => {
    if (photoName) {
      const encoded = encodeURIComponent(photoName);
      // Use backend proxy, widths are hints for better quality in cards
      return `https://api-v2.exploreden.com/itinify/maps/photo-proxy/?place_id=${encoded}&max_width=600&max_height=600`;
    }
    return "/images/card-1.png";
  };

  // Map any place-like object from API to RecPlace
  const mapToRecPlace = (a: any, idPrefix: string, idx: number): RecPlace => ({
    id: `${idPrefix}-${idx}`,
    title: a?.displayName || a?.name || a?.title || a?.q || "Recommended Place",
    rating: typeof a?.rating === "number" ? a.rating : 4.5,
    image: getPhotoUrl(getFirstPhotoName(a)),
  });

  // Build primary UI stops directly from the raw API checkpoints so titles come from activities[0].displayName
  const convertRawSchedulesToStops = (
    raw: any[]
  ): Record<string, ItineraryStop[]> => {
    const result: Record<string, ItineraryStop[]> = {};
    try {
      raw.forEach((day: any, dayIdx: number) => {
        const dayKey = `day${dayIdx + 1}`;
        result[dayKey] = [];
        const checkpoints: any[] = Array.isArray(day?.checkpoints)
          ? day.checkpoints
          : [];
        const templates: any[] = Array.isArray(day?.template)
          ? day.template
          : [];

        checkpoints.forEach((cp: any, cpIdx: number) => {
          const activityType = (cp?.activity || "").toString().toLowerCase();

          // Pull lists from cp
          const activities = Array.isArray(cp?.activities) ? cp.activities : [];
          const firstAct = activities.length > 0 ? activities[0] : null;
          const restaurantList = Array.isArray(cp?.restaurant)
            ? cp.restaurant
            : Array.isArray(cp?.restaurants)
            ? cp.restaurants
            : [];
          const firstRest =
            restaurantList && restaurantList.length > 0
              ? restaurantList[0]
              : null;
          const hotelList = Array.isArray(cp?.hotel)
            ? cp.hotel
            : Array.isArray(cp?.hotels)
            ? cp.hotels
            : [];
          const firstHotel =
            hotelList && hotelList.length > 0 ? hotelList[0] : null;

          // Time/duration: prefer cp fields; if missing, fallback to template at same index
          let timeLabel =
            typeof cp?.time === "string" && cp.time.trim().length > 0
              ? cp.time
              : "";
          let durationText =
            typeof cp?.duration === "string" && cp.duration.trim().length > 0
              ? cp.duration
              : "";
          if (!timeLabel || !durationText) {
            const tpl = templates[cpIdx];
            if (tpl) {
              if (!timeLabel && typeof tpl.time === "string")
                timeLabel = tpl.time;
              if (!durationText && typeof tpl.duration === "string")
                durationText = tpl.duration;
            }
          }
          if (!timeLabel) timeLabel = formatTime(9 + cpIdx);

          // Distance from start in KM, if provided
          const distanceKmRaw = Number(cp?.distance_from_start_km);
          const distanceText = Number.isFinite(distanceKmRaw)
            ? `${distanceKmRaw.toFixed(1)} Km`
            : "—";

          // Special handling for driving
          if (activityType === "driving" || cp?.is_driving) {
            const lat = Number(cp?.coordinate?.[1]);
            const lng = Number(cp?.coordinate?.[0]);
            result[dayKey].push({
              id: `${dayIdx + 1}-${cpIdx + 1}-drive`,
              time: timeLabel,
              title: cp?.q ? `Driving: ${cp.q}` : "Driving to next location",
              duration: durationText,
              address: "",
              travelTime: durationText || "—",
              travelDistance: distanceText,
              type: "navigate",
              latitude: Number.isFinite(lat) ? lat : undefined,
              longitude: Number.isFinite(lng) ? lng : undefined,
              description: "driving",
              image: "/banners/car.png",
              price: undefined,
              rating: undefined,
              openingHours: undefined,
              tickets: undefined,
              capacity: undefined,
              contact: undefined,
              website: undefined,
              cpIndex: cpIdx,
              cpActivityType: "driving",
            });
            return;
          }

          // Choose primary place based on activity type preference
          let primaryPlace: any = null;
          if (activityType === "restaurant") {
            primaryPlace = firstRest || firstAct || firstHotel;
          } else if (activityType === "hotel") {
            primaryPlace = firstHotel || firstAct || firstRest;
          } else {
            // default to activity; if empty, then restaurant; final fallback hotel around 6 PM
            primaryPlace = firstAct || firstRest || firstHotel;
          }

          // If still nothing, try a 6 PM hotel fallback (common check-in time)
          if (!primaryPlace) {
            const tl = (timeLabel || "").toLowerCase();
            const isSixPm = tl.includes("6:00") && tl.includes("pm");
            if (isSixPm && firstHotel) primaryPlace = firstHotel;
          }

          const title =
            primaryPlace?.displayName ||
            primaryPlace?.name ||
            cp?.q ||
            `Stop ${cp?.index || cpIdx + 1}`;
          const address =
            primaryPlace?.formattedAddress ||
            primaryPlace?.address ||
            (typeof primaryPlace?.location === "string"
              ? primaryPlace.location
              : "");
          const lat = Number(
            primaryPlace?.location?.latitude ?? cp?.coordinate?.[1]
          );
          const lng = Number(
            primaryPlace?.location?.longitude ?? cp?.coordinate?.[0]
          );
          const rating =
            typeof primaryPlace?.rating === "number"
              ? primaryPlace.rating
              : undefined;
          const website = primaryPlace?.websiteUri || primaryPlace?.website;
          // If hotel object provides direct image URL, use it; else use Google photo proxy
          const image = primaryPlace?.image
            ? primaryPlace.image
            : getPhotoUrl(getFirstPhotoName(primaryPlace));
          // Compute price if hotel provides minPrice/currency
          let priceText: string | undefined = undefined;
          if (
            primaryPlace &&
            (primaryPlace.type === "hotel" ||
              activityType === "hotel" ||
              (primaryPlace.minPrice && primaryPlace.currency))
          ) {
            const amt = Number(primaryPlace.minPrice);
            const formatted = Number.isFinite(amt)
              ? amt.toLocaleString()
              : String(primaryPlace.minPrice);
            priceText = `${primaryPlace.currency || ""} ${formatted}`.trim();
          }

          // Build opening label for the chosen primary place (activity/restaurant/hotel)
          const openingLabel = buildTodayOpeningLabel(
            primaryPlace?.openingHours
          );

          result[dayKey].push({
            id: `${dayIdx + 1}-${cpIdx + 1}-cp`,
            time: timeLabel,
            title,
            // Show today's opening window if available, else fallback to checkpoint duration
            duration: openingLabel || durationText,
            address,
            travelTime: durationText || "—",
            travelDistance: distanceText,
            type: "contact",
            latitude: Number.isFinite(lat) ? lat : undefined,
            longitude: Number.isFinite(lng) ? lng : undefined,
            description:
              firstAct?.primaryType ||
              firstRest?.primaryType ||
              firstHotel?.primaryType ||
              cp?.activity ||
              undefined,
            image,
            price: priceText,
            rating,
            openingHours: undefined,
            tickets: undefined,
            capacity: undefined,
            contact: undefined,
            website,
            cpIndex: cpIdx,
            cpActivityType: activityType,
          });
        });
      });
    } catch (e) {
      console.error("[v0] Error converting raw schedules to stops:", e);
    }
    return result;
  };

  const dayStops = useMemo(() => {
    // Prefer building from raw_daily_schedules to ensure titles come from checkpoints.activities[0].displayName
    if (
      apiData?.itinerary_data?.raw_daily_schedules &&
      Array.isArray(apiData.itinerary_data.raw_daily_schedules)
    ) {
      const stops = convertRawSchedulesToStops(
        apiData.itinerary_data.raw_daily_schedules
      );
      if (Object.keys(stops).length > 0) return stops;
    }

    if (
      !apiData?.itinerary_data?.daily_plan ||
      !Array.isArray(apiData.itinerary_data.daily_plan)
    ) {
      console.log("[v0] No daily plan data available");
      return {};
    }

    return convertApiToStops(apiData.itinerary_data.daily_plan);
  }, [apiData]);

 

  // Suggest Alternatives: track index per stop id
  const [altIndexByStop, setAltIndexByStop] = useState<Record<string, number>>(
    {}
  );

  const incrementAlternative = (stopId: string, max: number) => {
    if (max <= 0) return;
    setAltIndexByStop((prev) => {
      const current = prev[stopId] || 0;
      const next = (current + 1) % max;
      return { ...prev, [stopId]: next };
    });
  };

  // (moved selectedAltByCp + helpers above)

  // Build display fields from a place-like object
  const buildDisplayFromPlace = (
    place: any,
    activityType: string | undefined
  ) => {
    const title =
      place?.displayName || place?.name || place?.title || "Recommended Place";
    const address =
      place?.formattedAddress ||
      place?.address ||
      place?.city ||
      (typeof place?.location === "string" ? place.location : "");
    const image = place?.image
      ? place.image
      : getPhotoUrl(getFirstPhotoName(place));
    const rating = typeof place?.rating === "number" ? place.rating : undefined;
    let priceText: string | undefined;
    // Prefer originalPrice when available (hotel pricing), otherwise fallback to minPrice
    if (
      place &&
      (place.type === "hotel" ||
        activityType === "hotel" ||
        place.minPrice ||
        place.originalPrice)
    ) {
      const rawAmt = place.originalPrice ?? place.minPrice;
      const amt = Number(rawAmt);
      const formatted = Number.isFinite(amt)
        ? amt.toLocaleString()
        : String(rawAmt);
      priceText = `${place.currency || ""} ${formatted}`.trim();
    }
    // Prefer clean, short description if available
    const rawDesc: string = (place?.description || "").toString();
    const desc = rawDesc ? cleanHtmlText(rawDesc) : undefined;
    return { title, address, image, rating, priceText, description: desc };
  };

  const toggleDay = (day: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const showLocationOnMap = (stop: ItineraryStop) => {
    console.log("showLocationOnMap called with:", stop);
    const lat = Number(stop.latitude);
    const lng = Number(stop.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      console.log("Setting selected location:", {
        latitude: lat,
        longitude: lng,
        locationName: stop.title,
      });
      setSelectedLocation({
        latitude: lat,
        longitude: lng,
        locationName: stop.title,
      });

      // Scroll to the map section first
      setTimeout(() => {
        const mapElement = document.querySelector(".bg-pink-100");
        if (mapElement) {
          mapElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100); // Small delay to ensure the map updates first
    } else {
      console.log(
        "No valid coordinates available for:",
        stop.title,
        stop.latitude,
        stop.longitude
      );
    }
  };

  const showStopDetails = (stop: ItineraryStop) => {
    try {
      console.log("[details] selecting stop:", {
        id: stop.id,
        time: stop.time,
        title: stop.title,
        cpIndex: stop.cpIndex,
        cpActivityType: stop.cpActivityType,
      });
    } catch {}
    setSelectedStopDetails(stop);
  };

  // Helper function to clean HTML tags from text
  const cleanHtmlText = (text: string): string => {
    return text
      .replace(/<[^>]*>/g, "") // Remove all HTML tags
      .replace(/&nbsp;/g, " ") // Replace &nbsp; with regular spaces
      .replace(/&amp;/g, "&") // Replace &amp; with &
      .replace(/&lt;/g, "<") // Replace &lt; with <
      .replace(/&gt;/g, ">") // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .trim();
  };

 


  

 

  // Resolve the raw primary place for the currently selected stop (for modal details)
  const resolveSelectedPrimaryPlace = (): any | undefined => {
    try {
      if (!selectedStopDetails) return undefined;
      const rawDays: any[] = Array.isArray(
        apiData?.itinerary_data?.raw_daily_schedules
      )
        ? apiData!.itinerary_data.raw_daily_schedules
        : [];

      // Derive day index from id: supports formats like "1-3", "day1-3", or stores dayIndex directly
      const id = String(selectedStopDetails.id || "");
      let dayIdx: number | undefined;
      // match day<number>
      const mDay = id.match(/day(\d+)/i);
      if (mDay && mDay[1]) {
        dayIdx = Number(mDay[1]) - 1;
      } else {
        const firstSeg = id.split("-")[0];
        const n = Number(firstSeg);
        if (Number.isFinite(n) && n > 0) dayIdx = n - 1;
      }

      // Fallback if not parsed: try to use a day label if present on the stop
      if (
        dayIdx === undefined &&
        typeof (selectedStopDetails as any).day === "number"
      ) {
        const d = (selectedStopDetails as any).day;
        if (Number.isFinite(d) && d > 0) dayIdx = d - 1;
      }

      const rawDay = dayIdx !== undefined ? rawDays[dayIdx] : undefined;
      if (!rawDay) return undefined;

      // Determine checkpoint index: prefer explicit cpIndex, else parse from id second segment, else match by time/activity
      let cpIdx =
        typeof (selectedStopDetails as any).cpIndex === "number"
          ? (selectedStopDetails as any).cpIndex
          : -1;
      if (cpIdx < 0) {
        const segs = id.split("-");
        if (segs.length > 1) {
          const maybeCp = Number(segs[1]);
          // ids are stored as 1-based; convert to 0-based index
          if (Number.isFinite(maybeCp) && maybeCp > 0) cpIdx = maybeCp - 1;
        }
      }

      let rawCp = cpIdx >= 0 ? rawDay?.checkpoints?.[cpIdx] : undefined;
      if (!rawCp) {
        // Match by time and activity when index not present
        const targetTime = (selectedStopDetails as any).time;
        const targetAct = ((selectedStopDetails as any).cpActivityType || "")
          .toString()
          .toLowerCase();
        const checkpoints: any[] = Array.isArray(rawDay?.checkpoints)
          ? rawDay.checkpoints
          : [];
        rawCp = checkpoints.find((cp) => {
          const cpTime = cp?.time;
          const cpAct = (cp?.activity || "").toString().toLowerCase();
          return (
            (!!targetTime ? cpTime === targetTime : true) &&
            (!!targetAct ? cpAct === targetAct : true)
          );
        });
      }
      if (!rawCp) return undefined;

      const activityType = (
        rawCp?.activity ||
        (selectedStopDetails as any).cpActivityType ||
        ""
      )
        .toString()
        .toLowerCase();
      const activities = Array.isArray(rawCp?.activities)
        ? rawCp.activities
        : [];
      const restaurantList = Array.isArray(rawCp?.restaurant)
        ? rawCp.restaurant
        : Array.isArray(rawCp?.restaurants)
        ? rawCp.restaurants
        : [];
      const hotelList = Array.isArray(rawCp?.hotel)
        ? rawCp.hotel
        : Array.isArray(rawCp?.hotels)
        ? rawCp.hotels
        : [];

      const selTitle = (selectedStopDetails as any).title || "";
      const matchByTitle = (arr: any[], keys: string[]): any | null => {
        if (!Array.isArray(arr)) return null;
        const t = selTitle.toLowerCase();
        return (
          arr.find((p) => {
            const candidate = keys
              .map((k) => (p?.[k] || "") as string)
              .find(Boolean) as string;
            return (
              typeof candidate === "string" && candidate.toLowerCase() === t
            );
          }) || null
        );
      };

      // Prefer exact title match within the activity type bucket
      if (activityType === "activity") {
        const exact = matchByTitle(activities, ["displayName", "name"]);
        if (exact) return exact;
        return (
          activities[0] ||
          matchByTitle(restaurantList, ["displayName", "name"]) ||
          restaurantList?.[0] ||
          matchByTitle(hotelList, ["name", "displayName"]) ||
          hotelList?.[0] ||
          undefined
        );
      }
      if (activityType === "restaurant") {
        const exact = matchByTitle(restaurantList, ["displayName", "name"]);
        if (exact) return exact;
        return (
          restaurantList?.[0] ||
          matchByTitle(activities, ["displayName", "name"]) ||
          activities[0] ||
          matchByTitle(hotelList, ["name", "displayName"]) ||
          hotelList?.[0] ||
          undefined
        );
      }
      if (activityType === "hotel") {
        const exact = matchByTitle(hotelList, ["name", "displayName"]);
        if (exact) return exact;
        return (
          hotelList?.[0] ||
          matchByTitle(activities, ["displayName", "name"]) ||
          activities[0] ||
          matchByTitle(restaurantList, ["displayName", "name"]) ||
          restaurantList?.[0] ||
          undefined
        );
      }
      // Default fallback order
      return (
        matchByTitle(activities, ["displayName", "name"]) ||
        activities[0] ||
        matchByTitle(restaurantList, ["displayName", "name"]) ||
        restaurantList?.[0] ||
        matchByTitle(hotelList, ["name", "displayName"]) ||
        hotelList?.[0] ||
        undefined
      );
    } catch {
      return undefined;
    }
  };

  const handleLocationClick = (location: any) => {
    console.log("[v0] Location clicked:", location.title);
  };

  // Function to scroll to cost summary section
  const scrollToCostSummary = () => {
    if (costSummaryRef.current) {
      costSummaryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !apiData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Itinerary Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error ||
              "No itinerary data available. Please generate an itinerary first."}
          </p>
          <Button
            onClick={() => (window.location.href = "/itinerary")}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            Generate New Itinerary
          </Button>
        </div>
      </div>
    );
  }

  const itineraryData = apiData.itinerary_data;

  if (
    !itineraryData.daily_plan ||
    !Array.isArray(itineraryData.daily_plan) ||
    itineraryData.daily_plan.length === 0
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Detailed Itinerary Available
          </h2>
          <p className="text-gray-600 mb-4">
            The API returned basic trip information but no detailed daily plans.
            <br />
            <span className="text-sm">
              Total Distance: {Math.round(itineraryData.total_distance)} km |
              Duration: {Math.round(itineraryData.total_duration)} hours | Days:{" "}
              {itineraryData.total_days}
            </span>
          </p>
          <Button
            onClick={() => (window.location.href = "/itinerary")}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            Generate New Itinerary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div id="itinerary-pdf-root" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 px-2 sm:px-4">
      <div className="min-h-screen bg-white p-2 sm:p-4 order-2 md:order-1 min-w-0 mx-auto w-full sm:max-w-2xl lg:max-w-none">
        <ItineraryHeaderCard
          totalDays={itineraryData.total_days}
          startDate={itineraryData.start_date}
          endDate={itineraryData.end_date}
          budget={itineraryData.budget}
          totalCost={totalCost}
          totalCurrency={totalCurrency}
          itineraryId={(apiData as any)?.itinerary_id}
        />
        {/* Spacer to offset the overlaid header card */}
        <div className="mt-36 sm:mt-40 md:mt-48 lg:mt-56">
        <div ref={itineraryTopRef} />
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6 border-b">
          <div className="flex w-full flex-wrap gap-4 sm:gap-6">
            <button
              onClick={() => handleTabClick("itinerary")}
              className={`px-1 py-2 text-[13px] sm:text-base font-medium ${
                activeTab === "itinerary"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-500 hover:text-pink-500"
              }`}
            >
              Itinerary
            </button>
            <button
              onClick={() => handleTabClick("budget")}
              className={`px-1 py-2 text-[13px] sm:text-base font-medium ${
                activeTab === "budget"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-500 hover:text-pink-500"
              }`}
            >
              Budget
            </button>
            <button
              onClick={() => handleTabClick("bookings")}
              className={`px-1 py-2 text-[13px] sm:text-base font-medium ${
                activeTab === "bookings"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-500 hover:text-pink-500"
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => handleTabClick("engagement")}
              className={`px-1 py-2 text-[13px] sm:text-base font-medium ${
                activeTab === "engagement"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-500 hover:text-pink-500"
              }`}
            >
              Engagement
            </button>
          </div>
        </div>
        {activeTab === "engagement" ? (
          <div className="max-w-6xl mx-auto w-full">
            <ItineraryEngagement />
          </div>
        ) : activeTab === "budget" ? (
          <div className="max-w-6xl mx-auto w-full">
            <CostSummary items={costItems} currency={totalCurrency} />
          </div>
        ) : (
          <>
            <DepartureTimeSelector
              directionsEnabled={directionsEnabled}
              onDirectionsChange={setDirectionsEnabled}
            />
            <div className="w-full">
          <div className="p-3 sm:p-0">
            {Object.entries(dayStops).map(([dayKey, stops]) => {
              const dayNumber = dayKey.replace("day", "");
              // Build recommendations for this day from raw_daily_schedules
              const rawSched: any =
                apiData?.itinerary_data?.raw_daily_schedules?.[
                  Number(dayNumber) - 1
                ];
              // Prefer hotel_area_suggestions from API when available
              // Build categorized recommendation arrays
              let recAttr: RecPlace[] = [];
              let recNight: RecPlace[] = [];
              let recRest: RecPlace[] = [];
              if (
                rawSched?.hotel_area_suggestions &&
                typeof rawSched.hotel_area_suggestions === "object"
              ) {
                const hasAttrs = Array.isArray(
                  rawSched.hotel_area_suggestions?.attractions
                );
                const hasNight = Array.isArray(
                  rawSched.hotel_area_suggestions?.nightlife
                );
                const hasRests = Array.isArray(
                  rawSched.hotel_area_suggestions?.restaurants
                );
                if (hasAttrs) {
                  recAttr = rawSched.hotel_area_suggestions.attractions
                    .filter(
                      (a: any) =>
                        a && (a.displayName || a.name || a.title || a.q)
                    )
                    .map((a: any, idx: number) =>
                      mapToRecPlace(a, `${dayKey}-attr`, idx)
                    );
                }
                if (hasNight) {
                  recNight = rawSched.hotel_area_suggestions.nightlife
                    .filter(
                      (a: any) =>
                        a && (a.displayName || a.name || a.title || a.q)
                    )
                    .map((a: any, idx: number) =>
                      mapToRecPlace(a, `${dayKey}-night`, idx)
                    );
                }
                if (hasRests) {
                  recRest = rawSched.hotel_area_suggestions.restaurants
                    .filter(
                      (a: any) =>
                        a && (a.displayName || a.name || a.title || a.q)
                    )
                    .map((a: any, idx: number) =>
                      mapToRecPlace(a, `${dayKey}-rest`, idx)
                    );
                }
                // Older shape: array
              } else if (Array.isArray(rawSched?.hotel_area_suggestions)) {
                const arr: any[] = rawSched.hotel_area_suggestions;
                const mapped = arr
                  .filter(
                    (a: any) => a && (a.displayName || a.name || a.title || a.q)
                  )
                  .map((a: any, idx: number) =>
                    mapToRecPlace(a, `${dayKey}-hotel`, idx)
                  );
                // No category info; treat as mixed
                recAttr = mapped;
                recNight = mapped;
                recRest = mapped;
              }

              // If still empty, scan each checkpoint for cp.hotel_area_suggestions and categorize
              if (
                recAttr.length + recNight.length + recRest.length === 0 &&
                Array.isArray(rawSched?.checkpoints)
              ) {
                const collectedAttr: any[] = [];
                const collectedNight: any[] = [];
                const collectedRest: any[] = [];
                rawSched.checkpoints.forEach((cp: any) => {
                  const hs = cp?.hotel_area_suggestions;
                  if (!hs) return;
                  if (typeof hs === "object") {
                    if (Array.isArray(hs?.attractions))
                      collectedAttr.push(...hs.attractions);
                    if (Array.isArray(hs?.nightlife))
                      collectedNight.push(...hs.nightlife);
                    if (Array.isArray(hs?.restaurants))
                      collectedRest.push(...hs.restaurants);
                  } else if (Array.isArray(hs)) {
                    // No category; push to mixed later
                    collectedAttr.push(...hs);
                  }
                });
                if (collectedAttr.length) {
                  recAttr = collectedAttr
                    .filter(
                      (a: any) =>
                        a && (a.displayName || a.name || a.title || a.q)
                    )
                    .map((a: any, idx: number) =>
                      mapToRecPlace(a, `${dayKey}-cp-attr`, idx)
                    );
                }
                if (collectedNight.length) {
                  recNight = collectedNight
                    .filter(
                      (a: any) =>
                        a && (a.displayName || a.name || a.title || a.q)
                    )
                    .map((a: any, idx: number) =>
                      mapToRecPlace(a, `${dayKey}-cp-night`, idx)
                    );
                }
                if (collectedRest.length) {
                  recRest = collectedRest
                    .filter(
                      (a: any) =>
                        a && (a.displayName || a.name || a.title || a.q)
                    )
                    .map((a: any, idx: number) =>
                      mapToRecPlace(a, `${dayKey}-cp-rest`, idx)
                    );
                }
              }

              // Mixed data initially (existing behavior)
              const recItemsWithFallback: RecPlace[] = [
                ...recAttr,
                ...recNight,
                ...recRest,
              ];
              const recHeading: string = "Near your hotel area";
              return (
                <div key={dayKey} className="mb-6">
                  <div className="flex items-center gap-2 mb-6">
                    <ChevronDownIcon
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform cursor-pointer ${
                        expandedDays[dayKey] ? "rotate-0" : "-rotate-90"
                      }`}
                      onClick={() => toggleDay(dayKey)}
                    />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Day {dayNumber}
                    </h2>
                  </div>

                  {expandedDays[dayKey] && (
                    <div className="space-y-6">
                      {stops
                        .filter(
                          (s) =>
                            (s.cpActivityType || "").toLowerCase() !==
                              "driving" && s.type !== "navigate"
                        )
                        .map((stop, index) => (
                          <div key={stop.id} className="relative z-20">
                            {/* Time and Activity */}
                            <div className="flex gap-2 sm:gap-4 mb-6">
                              <div className="flex flex-col items-center "></div>

                              <div className="flex-1">
                                {(() => {
                                  // Compute alternative item (if any) for this stop
                                  let overrideTitle = stop.title;
                                  let overrideAddress = stop.address;
                                  let overrideImage =
                                    stop.image || "/images/city-1.png";
                                  let overrideRating =
                                    typeof stop.rating === "number"
                                      ? stop.rating
                                      : undefined;
                                  let overridePrice: string | undefined =
                                    stop.price;

                                  const cpIdx =
                                    typeof stop.cpIndex === "number"
                                      ? stop.cpIndex
                                      : -1;
                                  const actType = (
                                    stop.cpActivityType || ""
                                  ).toLowerCase();
                                  const rawCp =
                                    cpIdx >= 0
                                      ? rawSched?.checkpoints?.[cpIdx]
                                      : undefined;
                                  let altList: any[] = [];
                                  if (
                                    rawCp &&
                                    actType &&
                                    actType !== "driving"
                                  ) {
                                    if (actType === "restaurant") {
                                      if (Array.isArray(rawCp?.restaurant))
                                        altList = rawCp.restaurant;
                                      else if (
                                        Array.isArray(rawCp?.restaurants)
                                      )
                                        altList = rawCp.restaurants;
                                    } else if (actType === "hotel") {
                                      if (Array.isArray(rawCp?.hotel))
                                        altList = rawCp.hotel;
                                      else if (Array.isArray(rawCp?.hotels))
                                        altList = rawCp.hotels;
                                    } else {
                                      if (Array.isArray(rawCp?.activities))
                                        altList = rawCp.activities;
                                    }
                                  }

                                  const max = Array.isArray(altList)
                                    ? altList.length
                                    : 0;
                                  if (max > 0) {
                                    const altIdx =
                                      (altIndexByStop[stop.id] || 0) % max;
                                    const chosen = altList[altIdx];
                                    const built = buildDisplayFromPlace(
                                      chosen,
                                      actType
                                    );
                                    const builtOpeningLabelForAlt =
                                      buildTodayOpeningLabel(
                                        chosen?.openingHours
                                      );
                                    overrideTitle =
                                      built.title || overrideTitle;
                                    overrideAddress =
                                      built.address || overrideAddress;
                                    overrideImage =
                                      built.image || overrideImage;
                                    overrideRating =
                                      typeof built.rating === "number"
                                        ? built.rating
                                        : overrideRating;
                                    overridePrice =
                                      built.priceText || overridePrice;

                                    // Render card with onSuggestAlternative
                                    return (
                                      <ItineraryCard
                                        travelMeta={`${
                                          stop.travelTime || "—"
                                        } (${(
                                          stop.travelDistance || "—"
                                        ).replace(/[()]/g, "")})`}
                                        showDirections={directionsEnabled}
                                        timeLabel={stop.time}
                                        imageSrc={overrideImage}
                                        title={overrideTitle}
                                        address={overrideAddress}
                                        durationText={
                                          builtOpeningLabelForAlt || stop.duration
                                        }
                                        priceText={
                                          overridePrice
                                            ? `${overridePrice} per person`
                                            : undefined
                                        }
                                        rating={overrideRating}
                                        ctaKind={
                                          stop.type === "ticket"
                                            ? "ticket"
                                            : "details"
                                        }
                                        latitude={Number(
                                          chosen?.location?.latitude ??
                                            rawCp?.coordinate?.[1] ??
                                            stop.latitude
                                        )}
                                        longitude={Number(
                                          chosen?.location?.longitude ??
                                            rawCp?.coordinate?.[0] ??
                                            stop.longitude
                                        )}
                                        startLatitude={Number(rawCp?.coordinate?.[1])}
                                        startLongitude={Number(rawCp?.coordinate?.[0])}
                                        onViewParking={(p) => {
                                          setSelectedLocation({
                                            latitude: p.latitude,
                                            longitude: p.longitude,
                                            locationName: p.name,
                                          });
                                          // Smoothly scroll map into view, mirroring Navigate behavior
                                          setTimeout(() => {
                                            const mapElement =
                                              document.querySelector(
                                                ".bg-pink-100"
                                              );
                                            if (mapElement) {
                                              mapElement.scrollIntoView({
                                                behavior: "smooth",
                                                block: "center",
                                              });
                                            }
                                          }, 100);
                                        }}
                                        onNavigate={() => {
                                          const altLat = Number(
                                            chosen?.location?.latitude ??
                                              rawCp?.coordinate?.[1]
                                          );
                                          const altLng = Number(
                                            chosen?.location?.longitude ??
                                              rawCp?.coordinate?.[0]
                                          );
                                          const mergedStop = {
                                            ...stop,
                                            title: overrideTitle,
                                            address: overrideAddress,
                                            image: overrideImage,
                                            rating: overrideRating,
                                            price: overridePrice,
                                            latitude: Number.isFinite(altLat)
                                              ? altLat
                                              : stop.latitude,
                                            longitude: Number.isFinite(altLng)
                                              ? altLng
                                              : stop.longitude,
                                          };
                                          showLocationOnMap(mergedStop);
                                        }}
                                        onCta={() => {
                                          const altLat = Number(
                                            chosen?.location?.latitude ??
                                              rawCp?.coordinate?.[1]
                                          );
                                          const altLng = Number(
                                            chosen?.location?.longitude ??
                                              rawCp?.coordinate?.[0]
                                          );
                                          const mergedStop = {
                                            ...stop,
                                            title: overrideTitle,
                                            address: overrideAddress,
                                            image: overrideImage,
                                            rating: overrideRating,
                                            price: overridePrice,
                                            description: built.description,
                                            duration:
                                              builtOpeningLabelForAlt ||
                                              stop.duration,
                                            latitude: Number.isFinite(altLat)
                                              ? altLat
                                              : stop.latitude,
                                            longitude: Number.isFinite(altLng)
                                              ? altLng
                                              : stop.longitude,
                                          };
                                          showStopDetails(mergedStop);
                                        }}
                                        onSuggestAlternative={() =>
                                          incrementAlternativeWithContext(
                                            stop.id,
                                            Number(dayNumber),
                                            cpIdx,
                                            actType,
                                            max
                                          )
                                        }
                                      />
                                    );
                                  }

                                  // No alternatives: render default card without handler
                                  return (
                                    <ItineraryCard
                                      travelMeta={`${
                                        stop.travelTime || "—"
                                      } (${(stop.travelDistance || "—").replace(
                                        /[()]/g,
                                        ""
                                      )})`}
                                      showDirections={directionsEnabled}
                                      timeLabel={stop.time}
                                      imageSrc={
                                        stop.image || "/images/city-1.png"
                                      }
                                      title={stop.title}
                                      address={stop.address}
                                      durationText={stop.duration}
                                      priceText={
                                        stop.price
                                          ? `${stop.price} per person`
                                          : undefined
                                      }
                                      rating={
                                        typeof stop.rating === "number"
                                          ? stop.rating
                                          : undefined
                                      }
                                      ctaKind={
                                        stop.type === "ticket"
                                          ? "ticket"
                                          : "details"
                                      }
                                      latitude={Number(stop.latitude)}
                                      longitude={Number(stop.longitude)}
                                      startLatitude={Number(rawCp?.coordinate?.[1])}
                                      startLongitude={Number(rawCp?.coordinate?.[0])}
                                      onViewParking={(p) =>
                                        setSelectedLocation({
                                          latitude: p.latitude,
                                          longitude: p.longitude,
                                          locationName: p.name,
                                        })
                                      }
                                      onNavigate={() => showLocationOnMap(stop)}
                                      onCta={() => showStopDetails(stop)}
                                    />
                                  );
                                })()}

                                {/* Dynamic reusable ItineraryCard */}
                              </div>
                            </div>
                          </div>
                        ))}
                      {/* Recommendations carousel always at end of day */}
                     
                      {recItemsWithFallback.length > 0 && (
                       
                        <RecommendationItineraryPlaces
                          items={recItemsWithFallback}
                          itemsAttractions={recAttr}
                          itemsNightlife={recNight}
                          itemsRestaurants={recRest}
                          heading={recHeading}
                        />
                      )}
                      </div>
                  
                   
                  )}
                  
                
                </div>
              );
            })}
          </div>
          </div>
          
        {/* Anchors for Bookings and Engagement sections */}
        <div ref={bookingsRef} className="mt-10" />
        <div ref={engagementRef} className="mt-10" />
        </>
        )}
      </div>

      

      {/* Compact and Beautiful Details Modal */}
      {selectedStopDetails && (
        <HotelDetailsModal
          key={`${selectedStopDetails.id}-${selectedStopDetails.time}-${selectedStopDetails.title}`}
          open={!!selectedStopDetails}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedStopDetails(null);
              setShowFullDescription(false);
            }
          }}
          details={(() => {
            const primary = resolveSelectedPrimaryPlace();
            try {
              console.log(
                "[details] resolved primary openingHours for",
                selectedStopDetails?.title,
                primary?.openingHours
              );
            } catch {}
            return selectedStopDetails
              ? {
                  title: selectedStopDetails.title,
                  rating: selectedStopDetails.rating,
                  time: selectedStopDetails.time,
                  duration: selectedStopDetails.duration,
                  description:
                    selectedStopDetails.description ||
                    selectedStopDetails.duration,
                  images: selectedStopDetails?.image
                    ? [
                        {
                          src: selectedStopDetails.image,
                          alt: selectedStopDetails.title,
                        },
                      ]
                    : [],
                  openingHours: primary?.openingHours
                    ? {
                        openNow: primary.openingHours.openNow,
                        weekdayDescriptions: Array.isArray(
                          primary.openingHours.weekdayDescriptions
                        )
                          ? primary.openingHours.weekdayDescriptions
                          : undefined,
                      }
                    : undefined,
                }
              : undefined;
          })()}
        />
      )}

      {/* Marker click modal */}
      {selectedMapPlace && (
        <HotelDetailsModal
          key={`marker-${selectedMapPlace.id}`}
          open={!!selectedMapPlace}
          onOpenChange={(open) => {
            if (!open) setSelectedMapPlace(null);
          }}
          details={{
            title: selectedMapPlace.title,
            rating: selectedMapPlace.rating,
            time: undefined,
            duration: undefined,
            description: selectedMapPlace.address,
            images: selectedMapPlace.image
              ? [{ src: selectedMapPlace.image, alt: selectedMapPlace.title }]
              : [],
            openingHours: selectedMapPlace.openingHours,
          }}
        />
      )}

 
    </div>
    <div className="relative bg-pink-100 h-96 sm:h-[26rem] md:h-[32rem] p-2 sm:p-5 order-1 md:order-2 overflow-hidden lg:overflow-auto rounded-xl lg:rounded-2xl min-w-0 mx-auto w-full sm:max-w-2xl lg:max-w-none lg:sticky lg:top-0 lg:h-[calc(100dvh-4rem)] xl:h-[calc(100dvh-3rem)]">
        {mapLocations.length > 0 &&
        itineraryData.route_geometry?.coordinates ? (
          (() => {
            // Determine active day from expandedDays; fallback to Day 1
            const expandedDayNumbers = Object.entries(expandedDays)
              .filter(([, v]) => v)
              .map(([k]) => Number(k.replace("day", "")));
            const activeDay = expandedDayNumbers[0] || 1;

            return (
              <Location
                latitude={selectedLocation?.latitude || 27.714186}
                longitude={selectedLocation?.longitude || 85.31094}
                locationName={
                  selectedLocation?.locationName || "Default Location"
                }
                // Do NOT show all POI markers initially. Only show a marker for the navigated location after Navigate.
                locations={
                  allowMapDetails && selectedLocation
                    ? [
                        {
                          id: "nav-target",
                          latitude: selectedLocation.latitude,
                          longitude: selectedLocation.longitude,
                          title: selectedLocation.locationName,
                          address: "",
                          type: "activity",
                          rating: 0,
                          openHours: "",
                          description: "",
                          order: 1,
                        },
                      ]
                    : []
                }
                onLocationClick={handleMapMarkerClick}
                routeCoordinates={itineraryData.route_geometry.coordinates}
                totalDays={itineraryData.total_days}
                dayEndpoints={dayEndpoints}
                activeDay={activeDay}
                navigateTarget={
                  selectedLocation
                    ? {
                        latitude: selectedLocation.latitude,
                        longitude: selectedLocation.longitude,
                        locationName: selectedLocation.locationName,
                      }
                    : null
                }
              />
            );
          })()
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No map data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
    