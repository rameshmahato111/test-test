"use client";
import React, { useEffect, useState } from "react";
import PeopleSelector from "../PeopleSelector";
import AgeSelector from "../AgeSelector";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import DatePicker from "../DatePicker";
import { useSearchDetail } from "@/contexts/SearchDetailContext";
import { detailAPI } from "@/services/api/detail";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { formatNumberWithCommas } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import NationalitySelector from "../NationalitySelector";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useSearchParams } from "next/navigation";

type PeopleSelectionType = {
  Adults: number;
  Children: number;
  childrenAges?: number[];
  noOfRooms?: number;
};

interface AvailabilityCheckProps {
  startDate: Date | null;
  endDate: Date | null;
  className?: string;
  onShowAvailabilityContent: () => void;
  showAvailabilityContent: boolean;
  price: string;
  currency?: string;
  peopleInitialData: PeopleSelectionType;
  type: "hotel" | "activity";
  id: string;
  originalPrice?: string;
  farePrice?: string;
  paxes: number[];
}

const AvailabilityCheck = ({
  className,
  onShowAvailabilityContent,
  originalPrice,
  farePrice,
  currency = "AUD",
  startDate,
  endDate,
  peopleInitialData,
  type = "activity",
  id,
  paxes,
}: AvailabilityCheckProps) => {
  const [selectedDate, setSelectedDate] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  } | null>({
    startDate,
    endDate,
  });
  const { token } = useAuth();
  const { setNationality, nationality } = useCurrency();
  const [selectedAges, setSelectedAges] = useState<number[]>(paxes || [25]);
  const [peopleSelection, setPeopleSelection] = useState<PeopleSelectionType>({
    Adults: Number(peopleInitialData.Adults),
    Children: Number(peopleInitialData.Children),
    childrenAges: peopleInitialData.childrenAges || [],

  });
  const [selectedNationality, setSelectedNationality] = useState(nationality || "");
  const [isLoading, setIsLoading] = useState(false);

  const peopleOptions = [
    { label: "Adults", value: 1, min: 1, max: 10 },
    { label: "Children", value: 0, max: 10 },
  ];

  const handleNationalityChange = (nationality: string) => {
    setSelectedNationality(nationality);
    setNationality(nationality);
  }

  const { setHotelRoomsDetail, setActivityModalitiesDetail } =
    useSearchDetail();

  const checkHotelAvailability = async () => {
    if (
      isLoading ||
      type !== "hotel" ||
      !selectedDate?.startDate ||
      !selectedDate?.endDate ||
      !id
    ) {

      return;
    }
    if (peopleSelection.childrenAges?.some((age) => age === 0)) {
      toast({
        title: "Please enter ages for all children",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const filteredChildrenAges =
        peopleSelection.childrenAges?.filter((age) => age > 0) || [];

      if (!selectedNationality && nationality) {
        toast({
          title: "Please select nationality",
          variant: "error",
        });
        return;
      }

      const response = await detailAPI.checkHotelAvailability(
        {
          hotel_id: id,
          check_in_date: format(selectedDate.startDate, "yyyy-MM-dd"),
          check_out_date: format(selectedDate.endDate, "yyyy-MM-dd"),
          no_of_rooms: Number(peopleInitialData.noOfRooms || 1),
          no_of_adults: Number(peopleSelection.Adults),
          no_of_children: filteredChildrenAges.length,
          ages_of_children: filteredChildrenAges,
          nationality: selectedNationality || nationality || "",
        },
        token
      );
      if (response.data && response.request_id) {
        setHotelRoomsDetail(
          id,
          response.data.rooms,
          response.request_id,
          Number(peopleSelection.Adults),
          peopleSelection.Children,
          peopleSelection.childrenAges ?? []
        );
      } else {
        toast({
          title: "No availability",
          description: `No ${type} found for the ${selectedDate.startDate} - ${selectedDate.endDate} with ${peopleSelection.Adults} adults and ${filteredChildrenAges.length} children`,
          variant: "error",
        });
        setHotelRoomsDetail(
          id,
          [],
          response.request_id || "",
          Number(peopleSelection.Adults),
          peopleSelection.Children,
          peopleSelection.childrenAges ?? []
        );
      }

      onShowAvailabilityContent();
    } catch (error) {
      console.error("Error checking availability:", error);
    } finally {
      setIsLoading(false);

    }
  };
  const checkActivityAvailability = async () => {
    if (
      type !== "activity" ||
      !selectedDate?.startDate ||
      !selectedDate?.endDate ||
      !id
    )
      return;
    setIsLoading(true);
    try {
      const response = await detailAPI.checkActivityAvailability(
        {
          activity_id: id,
          from_date: format(selectedDate.startDate, "yyyy-MM-dd"),
          to_date: format(selectedDate.endDate, "yyyy-MM-dd"),
          paxes: selectedAges,
        },
        token
      );

      if (
        response.data &&
        Object.keys(response.data).length > 0 &&
        response.request_id
      ) {
        setActivityModalitiesDetail(
          id,
          response.data.modalities,
          response.request_id,
          selectedAges
        );

        onShowAvailabilityContent();
      } else {
        toast({
          title: "No availability",
          description: `No availability found for the selected dates`,
          variant: "error",
        });
        setActivityModalitiesDetail(
          id,
          [],
          response.request_id || "",
          selectedAges
        );
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast({
        title: "Error",
        description: "Failed to check availability",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = () => {
    if (type === "hotel") {
      checkHotelAvailability();
    } else {
      checkActivityAvailability();
    }

  };

  useEffect(() => {
    setSelectedNationality(nationality || "");
    handleCheck();
  }, []);
  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setSelectedDate({ startDate, endDate });
  };

  const handlePeopleChange: React.Dispatch<
    React.SetStateAction<PeopleSelectionType>
  > = (newSelection) => {
    const finalSelection =
      typeof newSelection === "function"
        ? newSelection(peopleSelection)
        : newSelection;

    setPeopleSelection(finalSelection);
  };

  const handleAgeChange = (ages: number[]) => {
    setSelectedAges(ages);
  };

  return (
    <div
      className={cn(
        "w-[350px] px-1 flex flex-col md:px-4 py-4 md:py-6 rounded-[10px] shadow-cardShadow",
        className
      )}
    >
      <div className="flex gap-4 mt-2 mb-4">
        {originalPrice && <div className="flex-1  justify-start border rounded-md py-2 flex flex-col items-start  px-4 bg-white">
          <span className="text-gray-500 text-[10px] font-poppins font-medium">Regular Price</span>
          <span className="text-base font-bold text-gray-800 ">
            {formatNumberWithCommas(parseFloat(originalPrice))} {" "}{currency}
          </span>

        </div>}
        {farePrice && originalPrice && <div className="flex-1  relative rounded-md py-2 flex flex-col items-start justify-between px-4 bg-primary-400">
          <span className="text-white text-[10px] font-poppins font-medium">Discounted</span>
          <span className="text-base font-bold text-white ">
            {formatNumberWithCommas(parseFloat(farePrice))} {" "}{currency}
          </span>

        </div>}
      </div>

      {/* <p className="text-xs font-medium text-gray-700 pb-1">from</p>
      <h5 className="text-xl font-semibold text-gray-800 pb-5">
        {currency} {formatNumberWithCommas(parseFloat(price))}
      </h5> */}



      <h3 className="text-base font-semibold text-gray-800 pb-3">
        Select Date
      </h3>

      <DatePicker
        startDate={selectedDate?.startDate || null}
        endDate={selectedDate?.endDate || null}
        onDateChange={handleDateChange}
      />

      <h3 className="text-base font-semibold text-gray-800 pb-3 pt-4">
        {type === "hotel" ? "Select Guests" : "Select Ages"}
      </h3>

      {type === "hotel" ? (
        // @ts-ignore
        <PeopleSelector<PeopleSelectionType>
          initialSelection={peopleSelection}
          onSelectionChange={handlePeopleChange}
          options={peopleOptions}
        />
      ) : (
        <AgeSelector
          onAgeChange={handleAgeChange}
          selectedAges={selectedAges}
          maxSelections={10}
        />
      )}

      {type === 'hotel' && (
        <NationalitySelector
          initialValue={selectedNationality}
          onSelect={handleNationalityChange}
          className="w-full mt-4"
        />

      )}

      <Button
        className="w-full mt-6 bg-primary-400 text-background font-semibold py-3 text-base rounded-xl"
        onClick={handleCheck}
        disabled={
          !selectedDate ||
          (type === "activity" && selectedAges.length === 0) ||
          isLoading
        }
      >
        {isLoading ? "Checking..." : "Check Availability"}
      </Button>

    </div>
  );
};

export default AvailabilityCheck;
