"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Search as SearchIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import SearchSuggestions from "@/components/HeroSection/SearchSuggestions";
import DatePicker from "@/components/DatePicker";
import RoomPeopleSelector from "@/components/RoomPeopleSelector";
import { useSearch } from "@/hooks/useSearch";
import { validateHotelSearch } from "@/app/validations/hotelSearchValidator";
import { useToast } from "@/hooks/use-toast";
import { Tabs } from "@/types/enums";
import { hotelApi } from "@/services/api/hotel";
import { HotelSearchSuggestions } from "@/types/search";

export function HotelSearchSection() {
  const { getSearchParams, performSearch } = useSearch();
  const { toast } = useToast();

  // Initialize from URL if available
  const searchParams = getSearchParams();
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
    ages_of_children: [],
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<HotelSearchSuggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedFetchSuggestions = useCallback(
    (query: string) => {
      if (!query || !shouldFetch) {
        setFilteredSuggestions(null);
        setShowSuggestions(false);
        return;
      }
      setIsLoading(true);
      hotelApi
        .getHotelQuerySuggestions(query)
        .then((suggestions) => {
          setFilteredSuggestions(suggestions);
          setShowSuggestions(
            suggestions &&
              (suggestions.regions.length > 0 || suggestions.hotels.length > 0)
          );
        })
        .catch(() => {
          setFilteredSuggestions(null);
          setShowSuggestions(false);
        })
        .finally(() => setIsLoading(false));
    },
    [shouldFetch]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedFetchSuggestions(hotelQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [hotelQuery, debouncedFetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateChange = useCallback(
    (newStart: Date | null, newEnd: Date | null) => {
      setStartDate(newStart);
      setEndDate(newEnd);
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
      nationality: "", // not in this UI
    });

    if (!validationResult.isValid) {
      validationResult.errors.forEach((error) =>
        toast({ title: error, variant: "destructive" })
      );
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
      nationality: "",
      sort: "relevance",
    });
  };

  return (
    <Card className="mb-8 overflow-visible rounded-3xl border border-gray-900/5 shadow bg-[#DFF4FF]">
      <div className="relative">
        {/* Right illustration (md and up) */}
        

        <div className="relative z-10 p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Looking for a place to stay?
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-2xl">
            Say goodbye to bookings on websites, get an all in price for your
            private vacations today.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mb-6">
            <div>
              <div className="text-2xl font-bold text-gray-900">50k+</div>
              <div className="text-sm text-gray-600">Hotels & Stays</div>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <div className="text-2xl font-bold text-gray-900">100k+</div>
              <div className="text-sm text-gray-600">Cities Covered</div>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <div className="text-2xl font-bold text-gray-900">50k+</div>
              <div className="text-sm text-gray-600">Bookings</div>
            </div>
          </div>

          {/* Search row */}
        

          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 max-w-3xl">
            {/* Location */}
            <div className="w-full md:w-[200px] relative z-20" ref={searchRef}>
              <Input
                placeholder="Location or Hotel name"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-gray-500"
                value={hotelQuery}
                onChange={(e) => {
                  setHotelQuery(e.target.value);
                  setShouldFetch(true);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  setShouldFetch(true);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                autoComplete="off"
              />
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}

              {showSuggestions && hotelQuery && filteredSuggestions && (
                <SearchSuggestions
                  suggestions={filteredSuggestions}
                  searchTerm={hotelQuery}
                  onSuggestionClick={(s) => {
                    setHotelQuery(s);
                    setShouldFetch(false);
                    setShowSuggestions(false);
                  }}
                  className="z-30"
                />
              )}
            </div>

            {/* Date */}
            <div className="w-full md:w-[150px]">
              {/* DatePicker renders its own button; we let it fill remaining width */}

              <DatePicker
                onDateChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                singleDate
              />
            </div>

            {/* Guests */}
            <div className="w-full md:w-[220px]">
              <div className="flex-1">
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
            </div>

            {/* Search btn */}
            <Button
              className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl px-6 h-12"
              onClick={handleSearch}
            >
              <SearchIcon className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>
     
          
       
        </div>
      </div>
    </Card>
  );
}
