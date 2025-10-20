import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useBooking } from "@/contexts/BookingContext";
import RoomCarousel from "./RoomCarousel";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { HotelRoom, Rate, Offer } from "@/schemas/hotel";
import { useSearchDetail } from "@/contexts/SearchDetailContext";
import EmptyState from "../StateHandlers/EmptyState";
import { detailAPI } from "@/services/api";
import { formatNumberWithCommas } from "@/utils";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const HotelAvailabilityContent = ({ hotelId }: { hotelId: string }) => {
  const [selectedRates, setSelectedRates] = useState<Record<number, Rate>>({});
  const { dispatch } = useBooking();
  const { token } = useAuth();
  const router = useRouter();
  const { getHotel, updateReCheckData } = useSearchDetail();
  const hotel = getHotel(hotelId);
  const [isDiscounted, setIsDiscounted] = useState(true);
  const handleRateSelect = (roomId: number, rate: Rate) => {
    setSelectedRates((prev) => ({
      ...prev,
      [roomId]: rate,
    }));
  };

  useEffect(() => {
    if (hotel?.rooms.length) {
      const initialSelectedRates: Record<number, Rate> = {};
      hotel.rooms.forEach((room) => {
        if (room.rates.length > 0) {
          initialSelectedRates[room.id] = room.rates[0];
        }
      });
      setSelectedRates(initialSelectedRates);
    }
  }, [hotel]);

  // Group rates by boardName to handle duplicates
  const groupRatesByBoard = (rates: Rate[]) => {
    const groupedRates = rates.reduce((acc, rate, index) => {
      if (!acc[rate.boardName]) {
        acc[rate.boardName] = [];
      }
      // Store the original index to maintain order
      acc[rate.boardName].push({
        ...rate,
        originalIndex: index,
      });
      return acc;
    }, {} as Record<string, (Rate & { originalIndex: number })[]>);

    return Object.entries(groupedRates).map(([boardName, rates]) => ({
      boardName,
      // Sort by original index instead of net amount to maintain order
      rates: rates.sort((a, b) => a.originalIndex - b.originalIndex),
    }));
  };

  // Safe way to get offer amount
  const getOfferText = (offer: Offer): string => {
    let offerText = "";
    if (offer.name) {
      offerText += `${offer.name} `;
    }
    if (offer.amount) {
      offerText += `${offer.amount} `;
    }
    if (offer.user_currency) {
      offerText += `${offer.user_currency} `;
    }
    return offerText;
  };

  const handleBookNow = (room: HotelRoom, rate: Rate) => {
    if (!token) {
      toast({
        title: "Please login to book now",
        description: "You must be logged in to book now",
        variant: "warning",
      });
      return;
    }
    dispatch({
      type: "SET_HOTEL_BOOKING",
      payload: {
        type: "hotel",
        requestId: hotel?.request_id || "",
        hotelId,
        itemName: hotel?.name || "",
        itemImage: room.images.length > 0 ? room.images[0].path : "",
        currency: hotel?.currency || "",
        noOfRooms: Number(hotel?.noOfRooms) || 1,
        noOfAdults: Number(hotel?.noOfAdults) || 1,
        noOfChildren: Number(hotel?.noOfChildren) || 0,
        agesOfChildren: hotel?.agesOfChildren || [],
        checkIn: hotel?.checkInDate || "",
        checkOut: hotel?.checkOutDate || "",
        address: hotel?.address || "",
        rooms: [
          {
            roomId: room.id,
            roomName: room.name,
            rateId: rate.id,
            taxes: rate.taxes,
            boardCode: rate.boardCode,
            net: rate.net,
            originalPrice: rate.originalPrice || "",
            farePrice: rate.farePrice || "",
            price: rate.net,
            cancellationPolicy: rate.cancellationPolicies,
            offers: rate.offers,
          },
        ],
      },
    });
    router.push(`/booking-detail/?type=hotel`);
  };
  const romanNumber = (num: number) => {
    const roman = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
      "XIII",
      "XIV",
      "XV",
      "XVI",
      "XVII",
      "XVIII",
      "XIX",
      "XX",
    ];
    return roman[num - 1];
  };
  const handleReCheckAvailability = async (room: HotelRoom, rate: Rate) => {

    try {
      toast({
        title: "Re-checking availability",
        description: "Please wait while we re-check the availability",
        variant: "default",
      });
      const response = await detailAPI.reCheckHotelAvailability(
        {
          hotel_id: hotelId,
          request_id: hotel?.request_id || "",
          rate_id: rate.id,
          room_id: room.id,
        },
        token || ""
      );

      // Update the context with re-check data
      updateReCheckData(response);

      // Update the selected rate if it's currently selected
      if (selectedRates[room.id]?.id === rate.id) {
        setSelectedRates((prev) => ({
          ...prev,
          [room.id]: {
            ...prev[room.id],
            hasReCheck: false,
            net: response.data.net,
            originalPrice: response.data.originalPrice,
            farePrice: response.data.farePrice,
            allotment: response.data.allotment,
            cancellationPolicies: response.data.cancellationPolicies,
            promotions: response.data.promotions,
            taxes: response.data.taxes,
            offers: response.data.offers,
          },
        }));
      }

      toast({
        title: "Availability Updated",
        description: "Room rate has been updated successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to re-check availability",
        variant: "destructive",
      });
    }
  };



  return (
    <div className="py-10">
      <div className="flex items-center justify-between">

        <h2 className="text-3xl font-semibold text-gray-800 pb-5 md:pb-8">
          Select Room
        </h2>
        <div className="flex items-center gap-2">
          <Label className="text-base text-gray-700">Toggle me for Discount</Label>
          <Switch id="discount-toggle" checked={isDiscounted} onCheckedChange={setIsDiscounted} className="data-[state=checked]:bg-primary-400 rounded-lg bg-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotel?.rooms.map((room) => (
          <div
            key={room.id}
            className="border border-gray-200 bg-background rounded-xl overflow-hidden"
          >
            <RoomCarousel images={room.images} roomId={room.id} />

            <div className="flex flex-col pb-4 px-4 gap-2">
              <h3 className="text-lg md:text-xl pt-4 pb-2 font-semibold text-foreground capitalize">
                {room.name}
              </h3>
              <div className="border-b border-gray-200 pb-1">
                <h5 className="text-sm font-medium text-gray-800">
                  Select your room type
                </h5>
                <div className="flex gap-3 flex-wrap py-4">
                  {groupRatesByBoard(room.rates).map(({ boardName, rates }) =>
                    rates.map((rate, index) => {
                      return (
                        <button
                          aria-label={`Select ${boardName} ${romanNumber(index + 1)}`}
                          aria-describedby="select-rate-description"
                          key={rate.id}
                          onClick={() => handleRateSelect(room.id, rate)}
                          className={`rounded-lg border px-2 py-1 text-xs font-normal
                                                    ${selectedRates[room.id]
                              ?.id === rate.id
                              ? "border-primary-400 bg-primary-50 text-primary-600"
                              : "border-gray-200 text-gray-800"
                            }`}
                        >
                          {rates.length > 1
                            ? `${boardName} ${romanNumber(index + 1)}`
                            : boardName}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
              {/* Promotions */}
              {selectedRates[room.id] &&
                selectedRates[room.id].promotions &&
                selectedRates[room.id]?.promotions!.length > 0 && (
                  <div className=" flex items-center justify-between gap-2">
                    {selectedRates[room.id]?.promotions?.map(
                      (promotion, index) => (
                        <div key={index} className="flex flex-col gap-1">
                          <p className="text-xs  font-normal text-gray-700">
                            {promotion.name}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              {/* Offers */}
              {selectedRates[room.id]?.offers && (
                <p className="text-xs text-green-600">
                  {selectedRates[room.id]?.offers?.map((offer, index) => (
                    <span key={index}>
                      {getOfferText(offer)}
                      <br />
                    </span>
                  ))}
                </p>
              )}

              <div className="pb-3 pt-3 flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-xs md:text-sm font-normal text-gray-700">
                    {selectedRates[room.id]
                      ? ` ${selectedRates[room.id].boardName}`
                      : ` Select rate`}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  {selectedRates[room.id] ? (
                    isDiscounted ? (
                      <React.Fragment>
                        <span className="text-base md:text-lg font-semibold text-gray-800">
                          {hotel?.currency} {formatNumberWithCommas(parseFloat(selectedRates[room.id].farePrice || "0"))}
                        </span>
                        {selectedRates[room.id].originalPrice && selectedRates[room.id].farePrice && (
                          <span className="text-xs text-green-600 font-medium">
                            You save {hotel?.currency} {formatNumberWithCommas(Math.max(0, parseFloat(selectedRates[room.id].originalPrice || "0") - parseFloat(selectedRates[room.id].farePrice || "0")))} on this room
                          </span>
                        )}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <span className="text-base md:text-lg font-semibold text-gray-800">
                          {hotel?.currency} {formatNumberWithCommas(parseFloat(selectedRates[room.id].originalPrice || "0"))}
                        </span>
                        {selectedRates[room.id].farePrice && selectedRates[room.id].originalPrice && (
                          <span className="text-base md:text-lg font-medium text-gray-400 line-through">
                            {hotel?.currency} {formatNumberWithCommas(parseFloat(selectedRates[room.id].farePrice || "0"))}
                          </span>
                        )}
                      </React.Fragment>
                    )
                  ) : (
                    <span className="text-base md:text-lg font-semibold text-gray-800">Select rate</span>
                  )}
                </div>
              </div>

              {/* Rate Comments */}
              {selectedRates[room.id] &&
                selectedRates[room.id]?.rateCommentsId &&
                selectedRates[room.id]?.rateCommentsId?.map(
                  (comment, index) => {
                    return (
                      <p
                        key={index}
                        className="text-xs text-green-400 font-medium"
                      >
                        {comment.comments[0].description}
                      </p>
                    );
                  }
                )}
              {/* Cancellation Policy Display */}
              {selectedRates[room.id]?.cancellationPolicies &&
                selectedRates[room.id]?.cancellationPolicies?.length > 0 && (
                  <div className="text-xs font-medium">
                    {(() => {
                      const policies = selectedRates[room.id]?.cancellationPolicies || [];
                      const hasCancellationFee = policies.some(policy =>
                        policy.amount && parseFloat(policy.amount) > 0
                      );


                      if (hasCancellationFee) {
                        return (
                          <p className="text-red-500">
                            No Free Cancellation
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-green-500">
                            Free Cancellation Available
                          </p>
                        );
                      }
                    })()}
                  </div>
                )
              }
              {/* Re-Check Availability */}
              {selectedRates[room.id]?.hasReCheck && (
                <Button
                  onClick={() =>
                    handleReCheckAvailability(room, selectedRates[room.id])
                  }
                  variant="outline"
                  className="w-full"
                >
                  Re-Check Availability
                </Button>
              )}
              <Button
                onClick={() => {
                  const selectedRate = selectedRates[room.id];
                  if (!selectedRate) return;
                  handleBookNow(room, selectedRate);
                }}
                disabled={
                  !selectedRates[room.id] || selectedRates[room.id]?.hasReCheck
                }
                className="w-full bg-primary-400 text-white rounded-lg hover:bg-primary-500 text-base font-semibold duration-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Now
              </Button>
            </div>
          </div>
        ))}
        {hotel?.rooms.length === 0 && (
          <EmptyState message="No rooms available" />
        )}
      </div>
    </div>
  );
};

export default HotelAvailabilityContent;
