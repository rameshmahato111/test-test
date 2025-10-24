"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Users, Heart, Baby, Bike, Car, Truck, Train, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TripData } from "@/app/itinerary/page"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { stepTwoSchema, type StepTwoFormData } from "@/app/validations/itineraryValidator"

interface Step2Props {
  tripData: TripData
  updateTripData: (data: Partial<TripData>) => void
  onNext: () => void
  onBack: () => void
}

export function Step2({ tripData, updateTripData, onNext, onBack }: Step2Props) {
  const [numberOfRooms, setNumberOfRooms] = useState(2)

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<StepTwoFormData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      travel_group_type: tripData.travel_group_type || "solo",
      mode_of_transport: tripData.mode_of_transport || "car",
      travelers_count: tripData.travelers_count || 4,
      number_of_rooms: 2,
    },
    mode: "onChange",
  })

  const watchedGroupType = watch("travel_group_type")
  const watchedTransport = watch("mode_of_transport")
  const watchedTravelersCount = watch("travelers_count")

  // Form submission handler
  const onSubmit: SubmitHandler<StepTwoFormData> = (data) => {
    updateTripData(data)
    onNext()
  }


  const groupTypes = [
    { id: "Solo", label: "Solo", icon: User },
    { id: "Friends", label: "Friends", icon: Users },
    { id: "Couple", label: "Couple", icon: Heart },
    { id: "Family", label: "Family", icon: Baby },
  ]

  const transportModes = [
    { id: "bike", label: "Motorbike", icon: Bike },
    { id: "Car", label: "Car", icon: Car },
    { id: "RV", label: "RV", icon: Truck },
    { id: "Train", label: "Train", icon: Train },
  ]

  const showGroupSizeControls = watchedGroupType === "friends" || watchedGroupType === "family"

  const handleGroupTypeSelect = async (groupType: string) => {
    const lowerGroupType = groupType.toLowerCase()
    setValue("travel_group_type", lowerGroupType)
    updateTripData({ travel_group_type: lowerGroupType })
    await trigger("travel_group_type")
  }

  const handleTransportSelect = async (transport: string) => {
    const lowerTransport = transport.toLowerCase()
    setValue("mode_of_transport", lowerTransport)
    updateTripData({ mode_of_transport: lowerTransport })
    await trigger("mode_of_transport")
  }

  const adjustNumber = async (type: "friends" | "rooms", operation: "increment" | "decrement") => {
    if (type === "friends") {
      const newCount = operation === "increment" ? watchedTravelersCount + 1 : Math.max(1, watchedTravelersCount - 1)
      setValue("travelers_count", newCount)
      updateTripData({ travelers_count: newCount })
      await trigger("travelers_count")
    } else {
      const newCount = operation === "increment" ? numberOfRooms + 1 : Math.max(1, numberOfRooms - 1)
      setNumberOfRooms(newCount)
      setValue("number_of_rooms", newCount)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Hidden inputs for form validation */}
      <input
        type="hidden"
        {...register("travel_group_type", { required: "Please select a travel group type" })}
      />
      <input
        type="hidden"
        {...register("mode_of_transport", { required: "Please select a mode of transport" })}
      />
      <input
        type="hidden"
        {...register("travelers_count", { required: "Number of travelers is required", min: 1 })}
      />
      <input
        type="hidden"
        {...register("number_of_rooms", { min: 1 })}
      />
      {/* Select your travel group type */}
      <div>
        <label className="max-w-lg mx-auto block text-sm font-medium text-gray-700 mb-4">Select your travel group type</label>
        <div className="max-w-lg mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {groupTypes.map((group) => {
            const IconComponent = group.icon
            const isSelected = watchedGroupType === group.id.toLowerCase()
            return (
              <Button
                key={group.id}
                type="button"
                variant="outline"
                onClick={() => handleGroupTypeSelect(group.id)}
                className={cn(
                  "h-24 flex flex-col items-center justify-center border-gray-200 hover:bg-gray-50 space-y-2",
                  isSelected && "border-pink-500 bg-pink-50",
                )}
              >
                <IconComponent
                  className={cn("w-6 h-6", isSelected ? "text-pink-500" : "text-gray-600")}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-pink-500" : "text-gray-700",
                  )}
                >
                  {group.label}
                </span>
              </Button>
            )
          })}
        </div>
        {errors.travel_group_type && (
          <p role="alert" className="text-red-500 text-sm mt-2">{errors.travel_group_type.message}</p>
        )}
      </div>

           {showGroupSizeControls && (
        <div className="max-w-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {watchedGroupType === "friends" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Number of Friends</span>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adjustNumber("friends", "decrement")}
                  className="w-6 h-6 p-0 rounded-full border-gray-300 bg-white hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </Button>
                <span className="text-lg w-8 text-center">{watchedTravelersCount}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adjustNumber("friends", "increment")}
                  className="w-6 h-6 p-0 rounded-full bg-pink-500 border-pink-500 text-white hover:bg-pink-600"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {watchedGroupType === "family" && (
            <>
              {/* Adults */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Number of Adults</span>
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateTripData({
                        adults: Math.max(1, (tripData.adults || 2) - 1),
                      })
                    }
                    className="w-6 h-6 p-0 rounded-full border-gray-300 bg-white hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </Button>
                  <span className="text-lg w-8 text-center">
                    {tripData.adults || 2}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateTripData({
                        adults: (tripData.adults || 2) + 1,
                      })
                    }
                    className="w-6 h-6 p-0 rounded-full bg-pink-500 border-pink-500 text-white hover:bg-pink-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Number of Children</span>
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateTripData({
                        children: Math.max(0, (tripData.children || 0) - 1),
                      })
                    }
                    className="w-6 h-6 p-0 rounded-full border-gray-300 bg-white hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </Button>
                  <span className="text-lg w-8 text-center">
                    {tripData.children || 0}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateTripData({
                        children: (tripData.children || 0) + 1,
                      })
                    }
                    className="w-6 h-6 p-0 rounded-full bg-pink-500 border-pink-500 text-white hover:bg-pink-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Number of Rooms (common for friends and family) */}
          {/* Number of Rooms (common for friends and family) */}
<div className="flex items-center justify-between">
  <span className="text-sm text-gray-700">Number of Rooms</span>
  <div className="flex items-center space-x-3">
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() =>
        updateTripData({
          numberOfRooms: Math.max(1, (tripData.numberOfRooms || 1) - 1),
        })
      }
      className="w-6 h-6 p-0 rounded-full border-gray-300 bg-white hover:bg-gray-50"
    >
      <Minus className="w-4 h-4 text-gray-600" />
    </Button>

    <span className="text-lg font-medium w-8 text-center">
      {tripData.numberOfRooms || 1}
    </span>

    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() =>
        updateTripData({
          numberOfRooms: (tripData.numberOfRooms || 1) + 1,
        })
      }
      className="w-6 h-6 p-0 rounded-full bg-pink-500 border-pink-500 text-white hover:bg-pink-600"
    >
      <Plus className="w-4 h-4" />
    </Button>
  </div>
</div>

        </div>
      )}


      {/* Mode of Transport */}
      <div>
        <label className="max-w-lg mx-auto block text-sm font-medium text-gray-700 mb-4">Mode of Transport</label>
        <div className="max-w-lg mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {transportModes.map((transport) => {
            const IconComponent = transport.icon
            const isSelected = watchedTransport === transport.id.toLowerCase()
            return (
              <Button
                key={transport.id}
                type="button"
                variant="outline"
                onClick={() => handleTransportSelect(transport.id)}
                className={cn(
                  "h-24 flex flex-col items-center justify-center border-gray-200 hover:bg-gray-50 space-y-2",
                  isSelected && "border-pink-500 bg-pink-50",
                )}
              >
                <IconComponent
                  className={cn("w-6 h-6", isSelected ? "text-pink-500" : "text-gray-600")}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-pink-500" : "text-gray-700",
                  )}
                >
                  {transport.label}
                </span>
              </Button>
            )
          })}
        </div>
        {errors.mode_of_transport && (
          <p role="alert" className="text-red-500 text-sm mt-2">{errors.mode_of_transport.message}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-lg mx-auto flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-pink-500 text-pink-500 hover:bg-pink-50 bg-transparent px-8 h-12"
        >
          Back
        </Button>
        <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-8 h-12">
          Next
        </Button>
      </div>
    </form>
  )
}
