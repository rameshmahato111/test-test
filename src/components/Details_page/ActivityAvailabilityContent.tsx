import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useBooking } from "@/contexts/BookingContext";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Modalities } from "@/schemas/activities";
import { useSearchDetail } from "@/contexts/SearchDetailContext";
import icons from "currency-icons";
import { Switch } from "../ui/switch";

const ActivityAvailabilityContent = ({
  activityId,
}: {
  activityId: string;
}) => {
  const { token } = useAuth();
  const router = useRouter();
  const { dispatch } = useBooking();
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const { getActivitity } = useSearchDetail();
  const activity = getActivitity(activityId);
  const [isDiscounted, setIsDiscounted] = useState(true);


  const handleBookNow = (modality: Modalities, rate: any) => {
    if (!token) {
      toast({
        title: "Please login to book now",
        description: "You must be logged in to book now",
        variant: "warning",
      });
      return;
    }
    const adults = activity?.paxes.filter((age) => age >= 18).length;
    const children = activity?.paxes.filter((age) => age < 18).length;

    dispatch({
      type: "SET_ACTIVITY_BOOKING",
      payload: {
        type: "activity",
        requestId: activity?.request_id || "",
        address: activity?.country || "",
        activityId,
        modalityId: modality.id,
        rateId: rate.id,
        rateDetails: rate.rateDetails,
        itemName: activity?.name || "",
        itemImage: activity?.images[0]?.urls[0]?.resource || "",
        currency: activity?.currency || "",
        noOfAdults: adults || 1,
        noOfChildren: children || 0,
        paxes: activity?.paxes || [],
        questions: modality.questions || [],
        answers: [],
      },
    });
    router.push(`/booking-detail/?type=activity`);
  };


  const isModalitySelected = (modalityId: string) => {
    // Check if the selected menu starts with the current modality's ID
    return selectedMenu.startsWith(modalityId);
  };

  const getSelectedRate = (modalityId: string, selectedMenu: string) => {
    if (!selectedMenu) return null;
    const [selectedModalityId, selectedRateId] = selectedMenu.split("-");

    if (modalityId !== selectedModalityId) return null;

    const modality = activity?.modalities.find(
      (m) => m.id.toString() === selectedModalityId
    );
    return modality?.rates.find((r) => r.id.toString() === selectedRateId);
  };

  const getTotalPrice = (modality: Modalities) => {
    if (isDiscounted) {
      const selectedRate = getSelectedRate(modality.id.toString(), selectedMenu);
      if (!selectedRate)
        return modality.rates[0].rateDetails[0].totalAmount?.farePrice;

      return selectedRate.rateDetails[0].totalAmount?.farePrice;
    } else {
      const selectedRate = getSelectedRate(modality.id.toString(), selectedMenu);
      if (!selectedRate)
        return modality.rates[0].rateDetails[0].totalAmount?.originalPrice;

      return selectedRate.rateDetails[0].totalAmount?.originalPrice;
    }
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <p></p>
        <div className="flex items-center gap-2">
          <Label className="text-base text-gray-700">Toggle me for Discount</Label>
          <Switch id="discount-toggle" checked={isDiscounted} onCheckedChange={setIsDiscounted} className="data-[state=checked]:bg-primary-400 rounded-lg bg-gray-400" />
        </div>
      </div>
      {activity?.modalities.map((modality, index) => (
        <div
          key={modality.id}
          className=" border border-gray-200 rounded-2xl p-4 bg-background"
        >
          <h3 className="text-xl font-semibold pb-1 text-foreground">
            {modality.name}
          </h3>
          <p className="text-base font-normal text-gray-700">
            {modality.duration.value} {modality.duration.metric}
          </p>

          <RadioGroup
            value={selectedMenu}
            onValueChange={setSelectedMenu}
            className="space-y-4 py-4"
          >
            {modality.rates.map((rate) => (
              <Label
                key={`${modality.id}-${rate.id}`}
                htmlFor={`${modality.id}-${rate.id}`}
                className={`block border rounded-lg p-3 cursor-pointer transition-colors 
                                ${selectedMenu === `${modality.id}-${rate.id}`
                    ? "border-primary-400"
                    : "border-gray-200"
                  }`}
              >
                <div className="flex items-center gap-2 pb-2">
                  <RadioGroupItem
                    value={`${modality.id}-${rate.id}`}
                    id={`${modality.id}-${rate.id}`}
                    className="text-primary-400"
                  />
                  <span className="text-sm text-gray-800 font-medium">
                    {rate.rateCode}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm font-medium text-gray-700  py-2">
                  <div className="space-y-1">
                    <p>
                      Session & Language:{" "}
                      {rate.rateDetails[0].sessions[0] &&
                        rate.rateDetails[0].sessions[0].name}
                      ,{" "}
                      {rate.rateDetails[0].languages[0] &&
                        rate.rateDetails[0].languages[0].description}
                    </p>

                    <p>
                      Price: {icons[activity.currency]?.symbol}{" "}
                      {rate.rateDetails[0].totalAmount &&
                        isDiscounted ? rate.rateDetails[0].totalAmount.farePrice : rate.rateDetails[0].totalAmount.originalPrice}{" "}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      Minimum Duration:{" "}
                      {rate.rateDetails[0].minimumDuration.value}{" "}
                      {rate.rateDetails[0].minimumDuration.metric}
                    </p>
                    <p>
                      Maximum Duration:{" "}
                      {rate.rateDetails[0].maximumDuration.value}{" "}
                      {rate.rateDetails[0].maximumDuration.metric}
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm font-medium text-gray-700  py-2">
                  {modality.amountsFrom.map((amount, index) => {
                    return (
                      <div key={`${amount.paxType}-${index}`}>
                        {amount.paxType} ({amount.ageFrom} - {amount.ageTo}):{" "}
                        {icons[activity.currency]?.symbol} {isDiscounted ? amount.farePrice : amount.originalPrice}
                        {/* <p className="mt-3">
                          Box Office Amount:{" "}
                          <span className="font-semibold line-through">
                            {" "}
                            {icons[activity.currency]?.symbol}{" "}
                            {amount.boxOfficeAmount}
                          </span>{" "}
                        </p> */}
                      </div>
                    );
                  })}
                </div>
                {/* Free Cancellation Notice */}
                {rate.freeCancellation ? (
                  <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2 text-sm text-green-700 mt-1  ">
                    <Check size={16} className="text-green-500" />
                    Free cancellation
                  </div>
                ) : (
                  <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-sm text-red-400 mt-1 ">
                    Does not have free cancellation.
                  </div>
                )}
              </Label>
            ))}
          </RadioGroup>

          {/* Total Price Section */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {icons[activity.currency]?.symbol}
                {getTotalPrice(modality)}
              </p>
              <p className="text-xs text-gray-500">
                1 unit price * Total People
              </p>
            </div>
            <div className="flex gap-2">

              <Button
                disabled={!isModalitySelected(modality.id.toString())}
                onClick={() => {
                  const selectedRate = getSelectedRate(
                    modality.id.toString(),
                    selectedMenu
                  );
                  if (selectedRate) {
                    handleBookNow(modality, selectedRate);
                  }
                }}
                className="bg-primary-400 px-10 text-white hover:bg-primary-500"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityAvailabilityContent;
