"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Mountain, Moon, MapPin, CircleDot, Theater, Waves, Users, PawPrint, DollarSign, Wallet, Banknote, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TripData } from "@/app/itinerary/page"

interface StepThreeProps {
  tripData: TripData
  updateTripData: (data: Partial<TripData>) => void
  onBack: () => void
  onGenerate: () => void
  isLoading: boolean
}

const interestOptions = [
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "nightlife", label: "Nightlife", icon: Moon },
  { id: "local_experience", label: "Local Experience", icon: MapPin },
  { id: "sports", label: "Sports", icon: CircleDot },
  { id: "art_and_culture", label: "Arts & Culture", icon: Theater },
  { id: "relaxation", label: "Relaxation", icon: Waves },
  { id: "family_fun", label: "Family Fun", icon: Users },
  { id: "natural_wildlife", label: "Nature Wildlife", icon: PawPrint },
]

const budgetOptions = [
  { 
    id: "economic", 
    label: "Economic", 
    icon: DollarSign, 
    symbol: "$",
    description: "Budget-friendly options"
  },
  { 
    id: "standard", 
    label: "Standard", 
    icon: Wallet, 
    symbol: "$$$",
    description: "Balanced comfort and cost"
  },
  { 
    id: "luxury", 
    label: "Luxury", 
    icon: Banknote, 
    symbol: "$$$$",
    description: "Premium experiences"
  },
]

export function StepThree({ tripData, updateTripData, onBack, onGenerate, isLoading }: StepThreeProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    Array.isArray(tripData.interests) ? tripData.interests : []
  )

  const handleInterestToggle = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      // Remove if already selected
      const newInterests = selectedInterests.filter((id: string) => id !== interestId)
      setSelectedInterests(newInterests)
      updateTripData({ interests: newInterests })
    } else {
      // Add only if we haven't reached the maximum of 3
      if (selectedInterests.length < 3) {
        const newInterests = [...selectedInterests, interestId]
        setSelectedInterests(newInterests)
        updateTripData({ interests: newInterests })
      }
    }
  }

  const handleBudgetSelect = (budgetId: string) => {
    updateTripData({ budget: budgetId })
  }

  const canProceed = selectedInterests.length >= 1 && tripData.budget

  return (
    <div className="relative sm:max-w-lg max-w-xs mx-auto space-y-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          <p className="text-lg font-medium text-gray-700">Generating your itinerary...</p>
          <p className="text-sm text-gray-500 text-center">This may take a few moments</p>
        </div>
      )}

      {/* Interests Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Select your Interests <span className="text-gray-500 font-normal">(1-3 selections)</span>
        </h3>
        <div className=" grid sm:grid-cols-4  grid-cols-2 gap-3 sm:gap-4">
          {interestOptions.map((interest) => {
            const IconComponent = interest.icon
            const isSelected = selectedInterests.includes(interest.id)
            const isDisabled = !isSelected && selectedInterests.length >= 3
            
            return (
              <button
                key={interest.id}
                onClick={() => handleInterestToggle(interest.id)}
                disabled={isDisabled || isLoading}
                className={cn(
                  "aspect-square p-2 sm:p-4 rounded-lg border-2 duration-200 flex flex-col items-center justify-center space-y-2 transition-all",
                  isSelected
                    ? "border-pink-500 text-pink-500 hover:scale-105"
                    : isDisabled
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 hover:scale-105"
                )}
              >
                <IconComponent className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6", 
                  isSelected ? "text-pink-500" : isDisabled ? "text-gray-300" : "text-gray-600"
                )} />
                <span className={cn(
                  "text-xs sm:text-sm font-medium text-center leading-tight",
                  isSelected ? "text-pink-500" : isDisabled ? "text-gray-300" : "text-gray-700"
                )}>
                  {interest.label}
                </span>
              </button>
            )
          })}
        </div>
       
      </div>

      {/* Budget Selection */}
      <div className="md:max-w-sm max-w-xs mx-start space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Select your Budget</h3>
        <div className="grid sm:grid-cols-3 grid-cols-2 gap-3 sm:gap-4">
          {budgetOptions.map((budget) => {
            const IconComponent = budget.icon
            const isSelected = tripData.budget === budget.id
            
            return (
              <button
                key={budget.id}
                onClick={() => handleBudgetSelect(budget.id)}
                disabled={isLoading}
                className={cn(
                  "aspect-square p-2 sm:p-4 rounded-lg border-2 duration-200 flex flex-col items-center justify-center space-y-1 hover:scale-105",
                  isSelected
                    ? "border-pink-500 text-pink-500"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                )}
              >
                <IconComponent className={cn("w-5 h-5 sm:w-6 sm:h-6", isSelected ? "text-pink-500" : "text-gray-600")} />
                <span className={cn(
                  "text-xs sm:text-sm font-medium text-center leading-tight",
                  isSelected ? "text-pink-500" : "text-gray-700"
                )}>
                  {budget.label}
                </span>
                <span className={cn(
                  "text-xs font-medium leading-none",
                  isSelected ? "text-pink-500" : "text-gray-500"
                )}>
                  {budget.symbol}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="w-[74px] h-[52px] border-pink-500 text-pink-500 hover:bg-pink-50 bg-transparent rounded-xl"
          >
            Back
          </Button>
          <Button 
            onClick={onGenerate} 
            className="w-[118px] h-[52px] bg-pink-500 hover:bg-pink-600 text-white rounded-xl" 
            disabled={!canProceed}
          >
            Generate
          </Button>
      </div>
    </div>
  )
}
