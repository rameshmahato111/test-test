"use client";

import React, { useEffect, useState } from "react";
import SearchablePopoverSelector from "./SearchablePopoverSelector";
import { countriesApi } from "@/services/api/countries";
import { useCurrency } from "@/contexts/CurrencyContext";

interface NationalitySelectorProps {
  onSelect: (nationality: string) => void;
  initialValue?: string;
  className?: string;
}

const NationalitySelector: React.FC<NationalitySelectorProps> = ({
  onSelect,
  initialValue,
  className = "",
}) => {

  const [countries, setCountries] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { setNationality, nationality } = useCurrency();
  useEffect(() => {
    if (initialValue) {
      setNationality(initialValue);
    }
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await countriesApi.getCountries();

        // Create a Map to store unique countries by name
        const uniqueCountries = new Map();
        response.results.forEach((country) => {
          const normalizedName = country.name.trim().toLowerCase();
          // Only add if we haven't seen this name before, or if we have but the current code is "better"
          if (
            !uniqueCountries.has(normalizedName) ||
            (country.code.length === 2 &&
              uniqueCountries.get(normalizedName).value.length > 2)
          ) {
            uniqueCountries.set(normalizedName, {
              value: country.code,
              label: country.name.trim(),
            });
          }
        });
        setCountries(
          Array.from(uniqueCountries.values()).sort((a, b) =>
            a.label.localeCompare(b.label)
          )
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();

  }, []);
  useEffect(() => {
    const getClientLocation = async () => {
      if (initialValue?.length === 0) {
        const res = await fetch("https://ipinfo.io/json");
        const locationData = await res.json();
        onSelect(locationData.country);
        setNationality(locationData.country);
      }
    };
    if (!initialValue && !nationality) {
      getClientLocation();
    } else if (nationality) {
      onSelect(nationality);
    } else if (initialValue) {
      onSelect(initialValue);
      setNationality(initialValue);
    }
  }, []);

  const handleNationalityChange = (nationality: string) => {
    onSelect(nationality);
    setNationality(nationality);
  }


  if (loading) {
    return (
      <div className="animate-pulse max-w-[200px] h-10 bg-gray-200 rounded-lg w-full" />
    );
  }

  return (
    <SearchablePopoverSelector
      options={countries}
      placeholder="Nationality"
      initialValue={initialValue}
      onSelect={handleNationalityChange}
      className={className}
      searchPlaceholder="Search nationality..."
    />
  );
};

export default NationalitySelector;
