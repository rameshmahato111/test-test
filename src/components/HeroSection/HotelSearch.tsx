import React, { useState, useRef, useEffect, useCallback } from "react";
import { Label } from "../ui/label";
import { Hotel, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import SearchSuggestions from "./SearchSuggestions";
import DatePicker from "../DatePicker";
import RoomPeopleSelector from "../RoomPeopleSelector";
import NationalitySelector from "../NationalitySelector";
import { Tabs } from "@/types/enums";
import { useSearch } from "@/hooks/useSearch";
import { validateHotelSearch } from "@/app/validations/hotelSearchValidator";
import { useToast } from "@/hooks/use-toast";
import { stringArrayToArray } from "@/utils";
import { hotelApi } from "@/services/api/hotel";
import { HotelSearchSuggestions } from "@/types/search";

const HotelSearch = () => {
  const { getSearchParams, performSearch } = useSearch();
  const { toast } = useToast();

  // Initialize state from URL params
  const searchParams = getSearchParams();
  // const { setNationality } = useCurrency();

  const [hotelQuery, setHotelQuery] = useState(searchParams?.hotel_query || "");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    searchParams?.start_date ? new Date(searchParams.start_date) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    searchParams?.end_date ? new Date(searchParams.end_date) : null
  );
  const [roomPeopleSelection, setRoomPeopleSelection] = useState({
    no_of_rooms: parseInt(searchParams?.no_of_rooms || "1") || 1,
    no_of_adults: parseInt(searchParams?.no_of_adults || "2") || 2,
    no_of_children: parseInt(searchParams?.no_of_children || "0") || 0,
    ages_of_children: searchParams?.ages_of_children
      ? stringArrayToArray(searchParams.ages_of_children)
      : [],
  });

  const [selectedNationality, setSelectedNationality] = useState(
    searchParams?.nationality || ""
  );

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<HotelSearchSuggestions | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const debouncedFetchSuggestions = useCallback(
    (query: string) => {
      if (!query || !shouldFetch) {
        setFilteredSuggestions(null);
        setShowSuggestions(false);
        return;
      }
      setIsLoading(true);
      hotelApi.getHotelQuerySuggestions(query)
        .then((suggestions) => {
          setFilteredSuggestions(suggestions);
          setShowSuggestions(suggestions && (suggestions.regions.length > 0 || suggestions.hotels.length > 0));
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
          setFilteredSuggestions(null);
          setShowSuggestions(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [shouldFetch]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedFetchSuggestions(hotelQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [hotelQuery, debouncedFetchSuggestions]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHotelQuery(value);
    setShouldFetch(true);
    setShowSuggestions(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setHotelQuery(suggestion);
    setShouldFetch(false);
    setShowSuggestions(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  const handleDateChange = useCallback(
    (newStartDate: Date | null, newEndDate: Date | null) => {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    },
    []
  );

  const handleRoomPeopleChange = (selection: any) => {
    setRoomPeopleSelection({
      no_of_rooms: selection.rooms,
      no_of_adults: selection.adults,
      no_of_children: selection.children,
      ages_of_children: selection.agesOfChildren || [],
    });
  };

  const handleSearch = () => {
    const validationResult = validateHotelSearch({
      hotel_query: hotelQuery,
      start_date: startDate,
      end_date: endDate,
      no_of_rooms: roomPeopleSelection.no_of_rooms,
      adults: roomPeopleSelection.no_of_adults,
      nationality: selectedNationality,

    });
    if (roomPeopleSelection.no_of_children > 0) {
      // Remove if age 0 is accepted
      if (
        roomPeopleSelection.ages_of_children.length === 0 ||
        roomPeopleSelection.ages_of_children.some((age: number) => age === 0)
      ) {
        toast({
          title: "Please select the age of children",
          variant: "destructive",
        });
        return;
      }
    }

    if (!validationResult.isValid) {
      validationResult.errors.forEach((error) => {
        toast({
          title: error,
          variant: "destructive",
        });
      });
      return;
    }
    performSearch({
      tab: Tabs.Hotel,
      hotel_query: hotelQuery,
      start_date: startDate ? startDate.toISOString().split("T")[0] : null,
      end_date: endDate ? endDate.toISOString().split("T")[0] : null,
      no_of_rooms: roomPeopleSelection.no_of_rooms,
      no_of_adults: roomPeopleSelection.no_of_adults,
      no_of_children: roomPeopleSelection.no_of_children,
      ages_of_children: roomPeopleSelection.ages_of_children,
      nationality: selectedNationality,
      sort: "relevance",
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const handleNationalityChange = (nationality: string) => {
  //   setSelectedNationality(nationality);
  //   // setNationality(nationality);
  // };

  return (
    <div className="flex w-full flex-col lg:flex-row justify-center items-center gap-4 py-6 md:py-10">
      <div className="w-full lg:w-[30%] relative" ref={searchRef}>
        <Label htmlFor="destination" className="w-full">
          <div className="flex w-full relative items-center bg-background shadow-searchShadow rounded-lg border px-2 border-gray-200">
            <Hotel className="w-5 h-5 text-gray-400 " />
            <Input
              id="destination"
              placeholder="Location or Hotel name"
              className="border-none font-inter focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background placeholder:text-gray-500 text-sm placeholder:text-sm placeholder:font-normal font-medium"
              value={hotelQuery}
              autoComplete="off"
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            {isLoading && (
              <div className="absolute right-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>
        </Label>
        {showSuggestions && hotelQuery && filteredSuggestions && (
          <SearchSuggestions
            suggestions={filteredSuggestions}
            searchTerm={hotelQuery}
            onSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>
      <div className="w-full lg:w-[25%]">
        <DatePicker
          onDateChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <div className="w-full lg:w-[20%]">
        <RoomPeopleSelector
          onSelectionChange={handleRoomPeopleChange}
          initialSelection={{
            rooms: roomPeopleSelection.no_of_rooms,
            adults: roomPeopleSelection.no_of_adults,
            children: roomPeopleSelection.no_of_children,
            agesOfChildren: roomPeopleSelection.ages_of_children,
          }}
        />
      </div>
      <NationalitySelector
        initialValue={selectedNationality}
        onSelect={setSelectedNationality}
        className="w-full lg:w-[15%]"
      />
      <Button
        className="w-full lg:w-[10%]  bg-primary-400 hover:bg-primary-500 duration-300 text-white rounded-xl text-base font-semibold"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
};

export default HotelSearch;
