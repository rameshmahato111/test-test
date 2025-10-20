"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Calendar, 
  Car, 
  Users, 
  User, 
  Heart, 
  Mountain, 
  Camera, 
  Music, 
  Utensils, 
  Waves, 
  Bike, 
  Bus,
  DollarSign,
  Clock,
  Navigation,
  Star,
  Loader2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Search
} from "lucide-react"
import type { TripData } from "@/app/itinerary/page"

interface TravelPreferenceFormProps {
  tripData: TripData
  updateTripData: (data: Partial<TripData>) => void
  onGenerate: () => void
  isLoading: boolean
  currentStep: number
  onNext: () => void
  onBack: () => void
  validationErrors: string[]
}

const transportOptions = [
  { value: "car", label: "Car", icon: Car, description: "Road trips" },
  { value: "bike", label: "Bike", icon: Bike, description: "Cycling" },
  { value: "rv", label: "RV", icon: Bus, description: "Camping" },
]

const groupOptions = [
  { value: "solo", label: "Solo", icon: User },
  { value: "couple", label: "Couple", icon: Heart },
  { value: "family", label: "Family", icon: Users },
  { value: "friends", label: "Friends", icon: Users },
]

const interestOptions = [
  { value: "Adventure", label: "Adventure", icon: Mountain },
  { value: "Sports Adventure", label: "Sports", icon: Camera },
  { value: "Music Nightlife", label: "Nightlife", icon: Music },
  { value: "Local Experience", label: "Local Culture", icon: Utensils },
  { value: "Family Fun", label: "Family Fun", icon: Waves },
  { value: "Cultural and Creative", label: "Culture", icon: Camera },
  { value: "Beaches", label: "Beaches", icon: Waves },
  { value: "Wellness and Relaxation", label: "Wellness", icon: Camera },
  { value: "Nature Wildlife", label: "Nature", icon: Mountain },
]

const budgetOptions = [
  { value: "economic", label: "Economic", description: "Budget-friendly" },
  { value: "standard", label: "Standard", description: "Balanced" },
  { value: "luxury", label: "Luxury", description: "Premium" },
]

export function TravelPreferenceForm({ 
  tripData, 
  updateTripData, 
  onGenerate, 
  isLoading, 
  currentStep, 
  onNext, 
  onBack, 
  validationErrors 
}: TravelPreferenceFormProps) {

  const renderStepOne = () => (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Where are you headed?</h3>
        <p className="text-gray-600">Tell us about your journey's starting and ending points</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-pink-200 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-pink-500" />
              Starting Point
            </CardTitle>
            <CardDescription>Where your adventure begins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Enter starting location"
                value={tripData.starting_point.latitude ? "Location selected" : ""}
                onChange={(e) => {
                  // In a real app, this would integrate with a location search API
                  updateTripData({
                    starting_point: { latitude: 41.621980, longitude: -87.670815 }
                  })
                }}
                className="pl-10 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-pink-200 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Navigation className="w-5 h-5 text-pink-500" />
              Destination
            </CardTitle>
            <CardDescription>Where your journey leads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Enter destination"
                value={tripData.destination_point.latitude ? "Location selected" : ""}
                onChange={(e) => {
                  // In a real app, this would integrate with a location search API
                  updateTripData({
                    destination_point: { latitude: 29.398213, longitude: -98.605436 }
                  })
                }}
                className="pl-10 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-pink-200 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-pink-500" />
              Start Date
            </CardTitle>
            <CardDescription>When does your adventure begin?</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={tripData.starting_date}
              onChange={(e) => updateTripData({ starting_date: e.target.value })}
              className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            />
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-pink-200 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-pink-500" />
              End Date
            </CardTitle>
            <CardDescription>When does your journey end?</CardDescription>
          </CardHeader>
         
        </Card>
      </div>

      <Card className="border-2 hover:border-pink-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-pink-500" />
            Daily Drive Distance
          </CardTitle>
          <CardDescription>How far do you want to travel each day?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "short", label: "Short", desc: "2-4 hours" },
              { value: "medium", label: "Medium", desc: "4-6 hours" },
              { value: "long", label: "Long", desc: "6+ hours" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateTripData({ daily_drive_distance: option.value })}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:border-pink-300 ${
                  tripData.daily_drive_distance === option.value 
                    ? "border-pink-500 bg-pink-50" 
                    : "border-gray-200"
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-500">{option.desc}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStepTwo = () => (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">How do you travel?</h3>
        <p className="text-gray-600">Choose your preferred mode of transport and travel style</p>
      </div>

      <Card className="border-2 hover:border-pink-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Car className="w-5 h-5 text-pink-500" />
            Mode of Transport
          </CardTitle>
          <CardDescription>How will you get around?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {transportOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => updateTripData({ mode_of_transport: option.value })}
                  className={`p-6 rounded-xl border-2 transition-all hover:border-pink-300 hover:shadow-md ${
                    tripData.mode_of_transport === option.value 
                      ? "border-pink-500 bg-pink-50 shadow-md" 
                      : "border-gray-200"
                  }`}
                >
                  <Icon className="w-10 h-10 mx-auto mb-3 text-pink-500" />
                  <div className="text-sm font-medium text-center">{option.label}</div>
                  <div className="text-xs text-gray-500 text-center mt-1">{option.description}</div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 hover:border-pink-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-pink-500" />
            Travel Group
          </CardTitle>
          <CardDescription>Who's joining your adventure?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {groupOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => updateTripData({ travel_group_type: option.value })}
                  className={`p-4 rounded-xl border-2 transition-all hover:border-pink-300 hover:shadow-md ${
                    tripData.travel_group_type === option.value 
                      ? "border-pink-500 bg-pink-50 shadow-md" 
                      : "border-gray-200"
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                  <div className="text-sm font-medium text-center">{option.label}</div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 hover:border-pink-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="w-5 h-5 text-pink-500" />
            What interests you?
          </CardTitle>
          <CardDescription>Select activities that match your travel style</CardDescription>
        </CardHeader>
        {/* <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {interestOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => updateTripData({ interests: option.value })}
                  className={`p-4 rounded-xl border-2 transition-all hover:border-pink-300 hover:shadow-md ${
                    tripData.interests === option.value 
                      ? "border-pink-500 bg-pink-50 shadow-md" 
                      : "border-gray-200"
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                  <div className="text-sm font-medium text-center">{option.label}</div>
                </button>
              )
            })}
          </div>
        </CardContent> */}
      </Card>
    </div>
  )

  const renderStepThree = () => (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Final touches</h3>
        <p className="text-gray-600">Set your budget and review your preferences</p>
      </div>

      <Card className="border-2 hover:border-pink-200 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="w-5 h-5 text-pink-500" />
            Budget Preference
          </CardTitle>
          <CardDescription>What's your spending comfort level?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {budgetOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateTripData({ budget: option.value })}
                className={`w-full p-6 rounded-xl border-2 text-left transition-all hover:border-pink-300 hover:shadow-md ${
                  tripData.budget === option.value 
                    ? "border-pink-500 bg-pink-50 shadow-md" 
                    : "border-gray-200"
                }`}
              >
                <div className="font-medium text-lg">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 bg-gradient-to-r from-pink-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-pink-500" />
            Trip Summary
          </CardTitle>
          <CardDescription>Review your preferences before we generate your itinerary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Transport</div>
              <Badge className="bg-pink-100 text-pink-700">
                {transportOptions.find(t => t.value === tripData.mode_of_transport)?.label}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Group</div>
              <Badge className="bg-blue-100 text-blue-700">
                {groupOptions.find(g => g.value === tripData.travel_group_type)?.label}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Interests</div>
              {/* <Badge className="bg-green-100 text-green-700">
                {interestOptions.find(i => i.value === tripData.interests)?.label}
              </Badge> */}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Budget</div>
              <Badge className="bg-purple-100 text-purple-700">
                {budgetOptions.find(b => b.value === tripData.budget)?.label}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Drive Distance</div>
              <Badge className="bg-orange-100 text-orange-700">
                {tripData.daily_drive_distance}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Duration</div>
              {/* <Badge className="bg-cyan-100 text-cyan-700">
                {tripData.starting_date && tripData.ending_date 
                  ? `${tripData.starting_date} - ${tripData.ending_date}`
                  : "Not set"
                }
              </Badge> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-8">
      {validationErrors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <h4 className="text-red-800 font-medium mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Please fix the following issues:
          </h4>
          <ul className="text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {currentStep === 1 && renderStepOne()}
      {currentStep === 2 && renderStepTwo()}
      {currentStep === 3 && renderStepThree()}

      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        {currentStep < 3 ? (
          <Button 
            onClick={onNext} 
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={onGenerate} 
            disabled={isLoading}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Itinerary
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
