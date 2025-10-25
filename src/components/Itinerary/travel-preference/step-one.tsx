"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar } from "lucide-react"
import type { TripData } from "@/app/itinerary/page"

interface StepOneProps {
  tripData: TripData
  updateTripData: (data: Partial<TripData>) => void
  onNext: () => void
}

export function StepOne({ tripData, updateTripData, onNext }: StepOneProps) {
  const handleLocationChange = (field: "starting_point" | "destination_point", lat: number, lng: number) => {
    updateTripData({
      [field]: { latitude: lat, longitude: lng },
    })
  }

  return (
    <div className="space-y-6">
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="starting-lat" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Starting Point *
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="starting-lat"
              placeholder="Latitude (e.g., 41.621980)"
              type="number"
              step="any"
              value={tripData.starting_point.latitude || ""}
              onChange={(e) =>
                handleLocationChange(
                  "starting_point",
                  Number.parseFloat(e.target.value) || 0,
                  tripData.starting_point.longitude,
                )
              }
            />
            <Input
              placeholder="Longitude (e.g., -87.670815)"
              type="number"
              step="any"
              value={tripData.starting_point.longitude || ""}
              onChange={(e) =>
                handleLocationChange(
                  "starting_point",
                  tripData.starting_point.latitude,
                  Number.parseFloat(e.target.value) || 0,
                )
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination-lat" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Destination *
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="destination-lat"
              placeholder="Latitude (e.g., 29.398213)"
              type="number"
              step="any"
              value={tripData.destination_point.latitude || ""}
              onChange={(e) =>
                handleLocationChange(
                  "destination_point",
                  Number.parseFloat(e.target.value) || 0,
                  tripData.destination_point.longitude,
                )
              }
            />
            <Input
              placeholder="Longitude (e.g., -98.605436)"
              type="number"
              step="any"
              value={tripData.destination_point.longitude || ""}
              onChange={(e) =>
                handleLocationChange(
                  "destination_point",
                  tripData.destination_point.latitude,
                  Number.parseFloat(e.target.value) || 0,
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Starting Date *
          </Label>
          <Input
            id="start-date"
            type="date"
            value={tripData.starting_date}
            onChange={(e) => updateTripData({ starting_date: e.target.value })}
          />
        </div>

        
      </div>

      <div className="space-y-2">
        <Label>Daily Drive Distance</Label>
        <Select
          value={tripData.daily_drive_distance}
          onValueChange={(value) => updateTripData({ daily_drive_distance: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="long">Long</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} className="bg-pink-500 hover:bg-pink-600">
          Next
        </Button>
      </div>
    </div>
  )
}
