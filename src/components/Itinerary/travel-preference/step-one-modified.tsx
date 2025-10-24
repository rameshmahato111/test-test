"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TripData } from "@/app/itinerary/page";
import { CitySearchInput } from "../CitySearchInput";
import { CitySearchResult } from "@/services/api/citySearch";
import { useToast } from "@/hooks/use-toast";
import DatePicker from "@/components/DatePicker";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Stop {
  id: string;
  name: string;
}

interface Step1Props {
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
  onNext: () => void;
}

export function Step1({ tripData, updateTripData, onNext }: Step1Props) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [stops, setStops] = useState<Stop[]>([]);
  const [showStops, setShowStops] = useState(false);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    []
  );
  const [selectedDistance, setSelectedDistance] = useState("Medium Drive");
  const [startingLocation, setStartingLocation] = useState(
    tripData.starting_location || ""
  );
  const [destinationLocation, setDestinationLocation] = useState(
    tripData.destination_location || ""
  );
  const [startingCity, setStartingCity] = useState<CitySearchResult | null>(
    null
  );
  const [destinationCity, setDestinationCity] =
    useState<CitySearchResult | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showDemoLocation, setShowDemoLocation] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    tripData.starting_date ? new Date(tripData.starting_date) : null
  );
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  const destinations = [
    { name: "Paris", coordinates: { latitude: 48.8566, longitude: 2.3522 } },
    {
      name: "Hawaii",
      coordinates: { latitude: 19.8968, longitude: -155.5828 },
    },
    { name: "Tokyo", coordinates: { latitude: 35.6762, longitude: 139.6503 } },
    { name: "London", coordinates: { latitude: 51.5074, longitude: -0.1278 } },
  ];
  const weekOptions = ["This Week", "Next Week"];

  // Date handling functions
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      updateTripData({ starting_date: date.toISOString().split("T")[0] });
    }
  };

  // End date removed for now

  const handleWeekSelection = (week: string) => {
    setSelectedWeek(week);
    const today = new Date();
    let startDate = new Date();

    if (week === "This Week") {
      // Start from today's date
      startDate = new Date(today);

      // End on Sunday of this week
      const dayOfWeek = today.getDay();
      const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
      // end date ignored for now
    } else if (week === "Next Week") {
      // Start from Monday of next week
      const dayOfWeek = today.getDay();
      const daysToNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      startDate = new Date(today);
      startDate.setDate(today.getDate() + daysToNextMonday);

      // end date ignored for now
    }

    setStartDate(startDate);
    updateTripData({
      starting_date: startDate.toISOString().split("T")[0],
    });
  };
  const distanceOptions = [
    { label: "Short Drive", distance: "300 km", value: "short" },
    { label: "Medium Drive", distance: "400 km", value: "medium" },
    { label: "Long Drive", distance: "500 km", value: "long" },
  ];

  const addStop = () => {
    if (!showStops) {
      setShowStops(true);
    }
    const newStop = {
      id: (stops.length + 1).toString(),
      name: `Stop ${stops.length + 1} name`,
    };
    setStops([...stops, newStop]);
  };

  const handleNext = () => {
    if (!isAuthenticated) {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("itinerary_draft", JSON.stringify(tripData));
          localStorage.setItem("auth_return_to", "/itinerary?step=1&resume=1&auto=1");
        }
      } catch (e) {
        // ignore storage errors
      }
      const returnTo = encodeURIComponent("/itinerary?step=1&resume=1&auto=1");
      router.replace(`/sign-in?redirectReason=not_logged_in&returnTo=${returnTo}`);
      return;
    }
    onNext();
  };

  const selectDestination = (destinationName: string) => {
    // Find the destination object with coordinates
    const destination = destinations.find(
      (dest) => dest.name === destinationName
    );

    if (destination) {
      // Set the selected destination as the main destination
      setDestinationLocation(destination.name);

      // Update trip data with both location name and coordinates
      updateTripData({
        destination_location: destination.name,
        destination_point: {
          latitude: destination.coordinates.latitude,
          longitude: destination.coordinates.longitude,
        },
      });

      // Also add to selected destinations for visual feedback
      if (!selectedDestinations.includes(destination.name)) {
        setSelectedDestinations([...selectedDestinations, destination.name]);
      }
    }
  };

  const handleStartingCitySelect = (city: CitySearchResult | null) => {
    setStartingCity(city);
    const cityName = city ? city.display_name || city.name : "";
    setStartingLocation(cityName);
    updateTripData({
      starting_location: cityName,
      starting_point: city
        ? {
            latitude: city.coordinates.latitude,
            longitude: city.coordinates.longitude,
          }
        : tripData.starting_point,
    });
  };

  const handleDestinationCitySelect = (city: CitySearchResult | null) => {
    setDestinationCity(city);
    const cityName = city ? city.display_name || city.name : "";
    setDestinationLocation(cityName);
    updateTripData({
      destination_location: cityName,
      destination_point: city
        ? {
            latitude: city.coordinates.latitude,
            longitude: city.coordinates.longitude,
          }
        : tripData.destination_point,
    });
  };

  const handleDistanceSelection = (distance: string) => {
    setSelectedDistance(distance);
    const distanceValue =
      distanceOptions.find((d) => d.label === distance)?.value || "medium";
    updateTripData({ daily_drive_distance: distanceValue });
  };

  const handleLocateMe = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        }
      );

      const { latitude, longitude } = position.coords;

      // Create a mock city object with the current location
      const currentLocation: CitySearchResult = {
        id: "current-location",
        name: "Current Location",
        display_name: "Current Location",
        country: "Unknown",
        coordinates: {
          latitude,
          longitude,
        },
      };

      // Set the current location as starting location
      setStartingCity(currentLocation);
      setStartingLocation("Current Location");
      updateTripData({
        starting_location: "Current Location",
        starting_point: {
          latitude,
          longitude,
        },
      });

      toast({
        title: "Location Found",
        description:
          "Your current location has been set as the starting point.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error getting location:", error);

      // Handle different types of geolocation errors
      let errorTitle = "Location Error";
      let errorDescription =
        "Unable to get your current location. Please enter your location manually.";

      if (error.code === 1) {
        errorTitle = "Location Access Denied";
        errorDescription =
          "Please allow location access in your browser settings or enter your location manually.";
      } else if (error.code === 2) {
        errorTitle = "Location Unavailable";
        errorDescription =
          "Please check your internet connection or enter your location manually.";
      } else if (error.code === 3) {
        errorTitle = "Location Timeout";
        errorDescription =
          "Location request timed out. Please try again or enter your location manually.";
      } else if (error.message?.includes("permissions policy")) {
        errorTitle = "Location Blocked";
        errorDescription =
          "Location access is blocked by browser policy. Use the demo location button or enter your location manually.";
        setShowDemoLocation(true); // Show demo location option for development
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Start From */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Start from
        </label>
        <div className="mb-3">
          <CitySearchInput
            placeholder="Search starting city..."
            value={startingLocation}
            onChange={handleStartingCitySelect}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="border-pink-500 text-pink-500 hover:bg-pink-50 bg-transparent disabled:opacity-50"
          >
            {isLocating ? "Locating..." : "Locate me"}
          </Button>

         
        </div>
      </div>

      {/* Your Destination */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Your Destination
        </label>
        <div className="mb-3">
          <CitySearchInput
            placeholder="Search destination city..."
            value={destinationLocation}
            onChange={handleDestinationCitySelect}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {destinations.map((destination) => (
            <Button
              key={destination.name}
              variant="outline"
              size="sm"
              onClick={() => selectDestination(destination.name)}
              className={cn(
                "border-gray-200 text-gray-700 hover:bg-gray-50",
                selectedDestinations.includes(destination.name) && "bg-gray-100"
              )}
            >
              {destination.name}
            </Button>
          ))}
        </div>

        {/* Stops Section */}
        {showStops && (
          <div className="space-y-3 mb-4">
            {stops.map((stop, index) => (
              <div key={stop.id} className="flex items-center space-x-3 mt-4">
                <span className="text-sm text-gray-600 min-w-12">
                  Stop {index + 1}
                </span>
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={stop.name}
                    className="pl-9 h-10 border-gray-200 text-sm"
                    defaultValue={stop.name}
                  />
                </div>
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() =>
                    setStops(stops.filter((s) => s.id !== stop.id))
                  }
                  className="p-1 text-gray-400 hover:text-pink-500"
                >
                  <Trash className="w-8 h-8 text-white bg-red-500 rounded-full p-2" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          onClick={addStop}
          className="text-pink-500 hover:text-pink-600 hover:bg-pink-50 p-1 h-auto font-normal mt-4"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Stops
        </Button>
      </div>

      {/* Select Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Start Date
        </label>

        {/* Date Range Input Field */}
        <div className="mb-4">
          <DatePicker
            startDate={startDate}
            endDate={null}
            onDateChange={(start, end) => {
              const picked = end ?? start; // if user clicked a second time, use that as the new start
              setStartDate(picked);
              if (picked) {
                updateTripData({
                  starting_date: picked.toISOString().split("T")[0],
                });
              }
              // Clear week selection when custom dates are selected
              if (picked) {
                setSelectedWeek("");
              }
            }}
            placeholderFirst="Start Date"
            placeholderSecond=""
          />
        </div>

        {/* Week Selection Buttons */}
        <div className="flex gap-2">
          {weekOptions.map((week) => (
            <Button
              key={week}
              variant="outline"
              size="sm"
              onClick={() => handleWeekSelection(week)}
              className={cn(
                "border-gray-200 text-gray-700 hover:bg-gray-50",
                selectedWeek === week &&
                  "border-pink-500 text-pink-500 bg-pink-50"
              )}
            >
              {week}
            </Button>
          ))}
        </div>
      </div>

      {/* Daily Travel Distance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Daily travel distance(KMs)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {distanceOptions.map((option) => (
            <Button
              key={option.label}
              variant="outline"
              onClick={() => handleDistanceSelection(option.label)}
              className={cn(
                "h-auto p-4 flex flex-col items-start border-gray-200 hover:bg-gray-50",
                selectedDistance === option.label &&
                  "border-pink-500 bg-pink-50"
              )}
            >
              <span className="font-medium text-gray-900">{option.label}</span>
              <span className="text-sm text-gray-500">{option.distance}</span>
            </Button>
          ))}
        </div>
      </div>

      
      <div className="pt-4 flex justify-end">
        <Button
          onClick={handleNext}
          className=" bg-pink-500 hover:bg-pink-600 text-white "
        >
          Next
        </Button>
      </div>

     
    </div>
  );
}
