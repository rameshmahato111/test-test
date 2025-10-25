"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import type { TripData } from "@/app/itinerary/page"

interface ItineraryStepTwoProps {
  tripData: TripData
  updateTripData: (data: Partial<TripData>) => void
  onNext: () => void
  onBack: () => void
  validationErrors: string[]
}

const groupOptions = [
  { value: "solo", label: "Solo", emoji: "👤" },
  { value: "friends", label: "Friends", emoji: "👥✨" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { value: "couple", label: "Couple", emoji: "💕" },
]

const transportOptions = [
  { value: "bike", label: "Bike" },
  { value: "car", label: "Car" },
  { value: "rv", label: "RV" },
  { value: "train", label: "Train" },
]

export function ItineraryStepTwo({ tripData, updateTripData, onNext, onBack, validationErrors }: ItineraryStepTwoProps) {
  const handleTravelerCountChange = (increment: boolean) => {
    const newCount = increment ? tripData.travelers_count + 1 : Math.max(1, tripData.travelers_count - 1)
    updateTripData({ travelers_count: newCount })
  }

  return (
    <div className="space-y-8">
      {/* Travel Group Type Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Select your travel group type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {groupOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateTripData({ travel_group_type: option.value })}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-center ${
                tripData.travel_group_type === option.value 
                  ? "border-pink-500 bg-pink-50" 
                  : "border-gray-200 hover:border-pink-300"
              }`}
            >
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{option.emoji}</div>
              <div className="font-medium text-sm sm:text-base">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* OR Separator */}
      <div className="text-center">
        <span className="text-gray-500 font-medium">OR</span>
      </div>

      {/* Travelers Count Section */}
      <div className="flex items-center justify-center space-x-4 sm:space-x-6">
        <button
          onClick={() => handleTravelerCountChange(false)}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
        
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{tripData.travelers_count}</div>
          <div className="text-xs sm:text-sm text-gray-600">Travelers</div>
        </div>
        
        <button
          onClick={() => handleTravelerCountChange(true)}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-500 flex items-center justify-center hover:bg-pink-600 transition-colors"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>

      {/* Mode of Transport Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Mode of Transport</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {transportOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateTripData({ mode_of_transport: option.value })}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-center ${
                tripData.mode_of_transport === option.value 
                  ? "border-pink-500 bg-pink-50" 
                  : "border-gray-200 hover:border-pink-300"
              }`}
            >
              <div className="font-medium text-sm sm:text-base">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

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

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-pink-500 text-pink-500 hover:bg-pink-50 px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base"
        >
          Back
        </Button>
        
        <Button 
          onClick={onNext} 
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
