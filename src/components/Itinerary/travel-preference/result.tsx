"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export function Results() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="relative h-48 bg-gradient-to-r from-orange-400 to-pink-400 overflow-hidden">
        <img
          src="/desert-road-with-car-and-cacti-sunset-landscape.png"
          alt="Road trip landscape"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 left-4">
          <h1 className="text-white text-xl font-semibold">Road Trip Planner</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 -mt-8 relative z-10">
        <div className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Your Perfect Road Trip!</h2>
            <p className="text-muted-foreground">Here's your personalized itinerary based on your preferences</p>
          </div>

          <div className="space-y-6">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-pink-500" />
                <h3 className="text-xl font-semibold">Day 1</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="font-medium">9:00 AM - Start your journey</div>
                    <div className="text-sm text-muted-foreground">Begin your adventure from the starting point</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="font-medium">12:00 PM - Scenic Stop</div>
                    <div className="text-sm text-muted-foreground">Perfect spot for photos and lunch</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="font-medium">6:00 PM - Arrival</div>
                    <div className="text-sm text-muted-foreground">Check into your accommodation</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-pink-500" />
                <h3 className="text-xl font-semibold">Day 2</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="font-medium">8:00 AM - Adventure Activity</div>
                    <div className="text-sm text-muted-foreground">Based on your interest in Adventure</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="font-medium">2:00 PM - Local Exploration</div>
                    <div className="text-sm text-muted-foreground">Discover hidden gems in the area</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">💡 Pro Tips</h3>
              <ul className="text-sm space-y-1">
                <li>• Check weather conditions before departure</li>
                <li>• Keep your fuel tank above half full</li>
                <li>• Download offline maps for areas with poor signal</li>
                <li>• Pack snacks and water for the journey</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={() => router.push("/")} className="bg-pink-500 hover:bg-pink-600">
              Plan Another Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
