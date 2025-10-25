"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, ArrowUpDown } from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useState, useEffect, useRef } from "react"
import type { TripData } from "@/app/itinerary/page"
import { CitySearchInput } from "../CitySearchInput"
import { CitySearchResult } from "@/services/api/citySearch"

interface ItineraryStepOneProps {
  tripData: TripData
  updateTripData: (data: Partial<TripData>) => void
  onNext: () => void
  validationErrors: string[]
}

type FormInputs = {
  starting_location: string
  destination_location: string
  starting_date: string
  ending_date: string
}

const dateOptions = [
  { value: "this-week", label: "This Week", icon: Calendar },
  { value: "next-week", label: "Next Week", icon: Calendar },
  { value: "this-month", label: "This Month", icon: Calendar },
]

export function ItineraryStepOne({ tripData, updateTripData, onNext, validationErrors }: ItineraryStepOneProps) {
  const [startingCity, setStartingCity] = useState<CitySearchResult | null>(null)
  const [destinationCity, setDestinationCity] = useState<CitySearchResult | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const datePickerRef = useRef<HTMLDivElement>(null)

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
    }

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDatePicker])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<FormInputs>({
    defaultValues: {
      starting_location: tripData.starting_location || "",
      destination_location: tripData.destination_location || "",
      starting_date: tripData.starting_date || "",
      
    },
    mode: "onChange",
  })

  const watchedStartingLocation = watch("starting_location")
  const watchedDestinationLocation = watch("destination_location")
  const watchedStartingDate = watch("starting_date")
  const watchedEndingDate = watch("ending_date")

  const getDateRangeDisplay = () => {
    if (watchedStartingDate && watchedEndingDate) {
      const startDate = new Date(watchedStartingDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
      const endDate = new Date(watchedEndingDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
      return `${startDate} - ${endDate}`
    }
    return ""
  }

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // Include coordinates in the data
    const formData = {
      ...data,
      starting_point: startingCity ? {
        latitude: startingCity.coordinates.latitude,
        longitude: startingCity.coordinates.longitude,
      } : tripData.starting_point,
      destination_point: destinationCity ? {
        latitude: destinationCity.coordinates.latitude,
        longitude: destinationCity.coordinates.longitude,
      } : tripData.destination_point,
    }
    updateTripData(formData)
    onNext()
  }

  const handleStartingCitySelect = async (city: CitySearchResult | null) => {
    setStartingCity(city)
    const cityName = city ? city.display_name || city.name : ""
    setValue("starting_location", cityName)
    updateTripData({ 
      starting_location: cityName,
      starting_point: city ? {
        latitude: city.coordinates.latitude,
        longitude: city.coordinates.longitude,
      } : tripData.starting_point
    })
    await trigger("starting_location")
  }

  const handleDestinationCitySelect = async (city: CitySearchResult | null) => {
    setDestinationCity(city)
    const cityName = city ? city.display_name || city.name : ""
    setValue("destination_location", cityName)
    updateTripData({ 
      destination_location: cityName,
      destination_point: city ? {
        latitude: city.coordinates.latitude,
        longitude: city.coordinates.longitude,
      } : tripData.destination_point
    })
    await trigger("destination_location")
  }

  const handleSwapLocations = async () => {
    const tempCity = startingCity
    const tempLocation = watchedStartingLocation
    
    setStartingCity(destinationCity)
    setDestinationCity(tempCity)
    
    setValue("starting_location", watchedDestinationLocation)
    setValue("destination_location", tempLocation)
    
    updateTripData({
      starting_location: watchedDestinationLocation,
      destination_location: tempLocation,
      starting_point: destinationCity ? {
        latitude: destinationCity.coordinates.latitude,
        longitude: destinationCity.coordinates.longitude,
      } : tripData.starting_point,
      destination_point: tempCity ? {
        latitude: tempCity.coordinates.latitude,
        longitude: tempCity.coordinates.longitude,
      } : tripData.destination_point,
    })

    // Trigger validation for both fields after swap
    await trigger("starting_location")
    await trigger("destination_location")
  }

  const handleDateSelect = async (date: string) => {
    // Handle preset date options
    const today = new Date()
    let startDate = ""
    let endDate = ""
    
    switch (date) {
      case "This Week":
        startDate = new Date(today).toISOString().split('T')[0]
        endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
      case "Next Week":
        const nextWeekStart = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        startDate = nextWeekStart.toISOString().split('T')[0]
        endDate = new Date(nextWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
      case "This Month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]
        break
    }
    
    if (startDate && endDate) {
      setValue("starting_date", startDate)
      setValue("ending_date", endDate)
      updateTripData({ starting_date: startDate, })
      
      await trigger("starting_date")
      await trigger("ending_date")
      
      // Close the date picker modal if it's open
      setShowDatePicker(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Hidden inputs for form validation */}
      <input
        type="hidden"
        {...register("starting_location", { required: "Please select a starting location" })}
      />
      <input
        type="hidden"
        {...register("destination_location", { required: "Please select a destination location" })}
      />
      <input
        type="hidden"
        {...register("starting_date", { required: "Please select a starting date" })}
      />
      <input
        type="hidden"
        {...register("ending_date", { required: "Please select an ending date" })}
      />
      
      {/* Where to Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Where to</h3>
        
        {/* Starting and Destination Inputs */}
        <div className="space-y-4">
          {/* Input Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Starting Location */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Starting</label>
              <CitySearchInput
                placeholder="Search starting city..."
                value={watchedStartingLocation}
                onChange={handleStartingCitySelect}
                error={!!errors.starting_location}
              />
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleSwapLocations}
                className="p-2 rounded-full border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all"
                title="Swap locations"
              >
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Destination Location */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Destination</label>
              <CitySearchInput
                placeholder="Search destination city..."
                value={watchedDestinationLocation}
                onChange={handleDestinationCitySelect}
                error={!!errors.destination_location}
              />
            </div>
          </div>
          
          {/* Error Messages Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              {errors.starting_location && (
                <p className="text-red-500 text-sm">{errors.starting_location.message}</p>
              )}
            </div>
            <div className="flex items-center justify-center">
              {/* Empty space to align with swap button */}
            </div>
            <div className="flex-1">
              {errors.destination_location && (
                <p className="text-red-500 text-sm">{errors.destination_location.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Date</h3>
        
        {/* Date Range Input */}
        <div className="space-y-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Starting Date - Ending Date"
              value={getDateRangeDisplay()}
              readOnly
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg text-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer ${
                errors.starting_date || errors.ending_date ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {(errors.starting_date || errors.ending_date) && (
            <p className="text-red-500 text-sm">
              {errors.starting_date?.message || errors.ending_date?.message}
            </p>
          )}
        </div>
        
        {/* Quick Date Options */}
        <div className="flex gap-3 max-w-[38.5rem]">
          {dateOptions.map((option) => {
            const Icon = option.icon
            const isSelected = false // We'll determine this based on the actual dates selected
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleDateSelect(option.label)}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all flex items-center justify-start gap-2 ${
                  isSelected 
                    ? "border-pink-500 bg-white text-gray-700" 
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={datePickerRef} className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Select Travel Dates</h3>
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Starting Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Starting Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="date"
                    value={watchedStartingDate}
                    onChange={(e) => {
                      setValue("starting_date", e.target.value)
                      updateTripData({ starting_date: e.target.value })
                      trigger("starting_date")
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Ending Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ending Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="date"
                    value={watchedEndingDate}
                    onChange={(e) => {
                      setValue("ending_date", e.target.value)
                    
                      trigger("ending_date")
                    }}
                    min={watchedStartingDate || new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <ul className="text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <Button 
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg text-lg font-medium"
        >
          Next
        </Button>
      </div>
    </form>
  )
}
