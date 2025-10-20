"use client"

import { useState } from "react"
import { RefreshCw, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const generateTimeOptions = () => {
  const times: string[] = []
  for (let hour = 6; hour <= 11; hour++) {
    times.push(`${hour}:00 A.M`)
    times.push(`${hour}:30 A.M`)
  }
  times.push("12:00 P.M")
  times.push("12:30 P.M")
  for (let hour = 1; hour <= 11; hour++) {
    times.push(`${hour}:00 P.M`)
    times.push(`${hour}:30 P.M`)
  }
  return times
}

type DepartureTimeSelectorProps = {
  directionsEnabled?: boolean
  onDirectionsChange?: (value: boolean) => void
}

export function DepartureTimeSelector({
  directionsEnabled: directionsEnabledProp,
  onDirectionsChange,
}: DepartureTimeSelectorProps) {
  const [departureTime, setDepartureTime] = useState("8:00 A.M")
  const [directionsEnabled, setDirectionsEnabled] = useState(
    Boolean(directionsEnabledProp)
  )

  const [showDateWarning, setShowDateWarning] = useState(false)
  const [showTimeChange, setShowTimeChange] = useState(false)
  const [tempTime, setTempTime] = useState("9:00 A.M")

  const timeOptions = generateTimeOptions()

  const handleRefresh = () => {
    // Refresh logic here
    console.log("Refreshing...")
  }

  const handleDepartureTimeClick = () => {
    setShowDateWarning(true)
  }

  const handleConfirmDateChange = () => {
    setShowDateWarning(false)
    setShowTimeChange(true)
  }

  const handleApplyTimeChange = () => {
    setDepartureTime(tempTime)
    setShowTimeChange(false)
  }

  return (
    <div className="max-w-xl p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side - Departure time selector */}
        <div className="text-gray-600 text-sm sm:text-base">
          <span>Departure time: </span>
          <button
            onClick={handleDepartureTimeClick}
            className="font-semibold text-gray-900 underline inline-flex items-center gap-1 hover:text-gray-700 transition-colors"
          >
            {departureTime}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Right side - Refresh and Directions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={handleRefresh}
            className="text-pink-500 hover:text-pink-600 flex items-center gap-1.5 text-sm sm:text-base font-medium transition-colors"
          >
            <RefreshCw className="size-4 sm:size-5" />
            <span>Refresh</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <label htmlFor="directions-toggle" className="text-foreground text-sm sm:text-base whitespace-nowrap">
              Directions
            </label>
            <Switch
              id="directions-toggle"
              checked={directionsEnabledProp ?? directionsEnabled}
              onCheckedChange={(v) => {
                setDirectionsEnabled(v)
                onDirectionsChange?.(v)
                
              }}
            />
          </div>
        </div>
      </div>

      <Dialog open={showDateWarning} onOpenChange={setShowDateWarning}>
        <DialogContent className="sm:max-w-md top-[40%] sm:top-[50%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-left text-xl font-semibold">Need to Change Dates?</DialogTitle>
            <DialogDescription className="text-left text-muted-foreground text-sm sm:text-base pt-2">
              Modifying date can delete the places you have added to your current itinerary.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowDateWarning(false)} className="px-6">
              No, don&apos;t change
            </Button>
            <Button onClick={handleConfirmDateChange} className="px-6 bg-pink-500 hover:bg-pink-600 text-white">
              Yes, delete places
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTimeChange} onOpenChange={setShowTimeChange}>
        <DialogContent className="sm:max-w-md top-[40%] sm:top-[50%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-left text-xl font-semibold">Change Time</DialogTitle>
            <DialogDescription className="sr-only">Select departure time</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-6">
              <Select value={tempTime} onValueChange={setTempTime}>
                <SelectTrigger className="w-full text-base font-medium text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-[6.3rem] overflow-y-auto bg-white">
                  {timeOptions.map((timeOption) => (
                    <SelectItem key={timeOption} value={timeOption} className="text-base">
                      {timeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleApplyTimeChange}
                className="w-full sm:w-auto px-8 bg-pink-500 hover:bg-pink-600 text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
