"use client";

import React, { useState, useEffect } from "react";
import { currencyService, userCurrencyService } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Currency } from "@/services/api/types/currency";
import { useAuth } from "@/contexts/AuthContext";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { popularCurrencies } from "./CurrencySelector";

interface MobileCurrencySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onCurrencyChange: (currency: string) => void;
  selectedCurrency: string;
}

const MobileCurrencySelector: React.FC<MobileCurrencySelectorProps> = ({
  isOpen,
  onClose,
  onCurrencyChange,
  selectedCurrency,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const auth = useAuth();

  // Fetch available currencies
  const { data: currencyData, isLoading: isLoadingCurrencies } = useQuery({
    queryKey: ["currencies"],
    queryFn: () => currencyService.getCurrencies(),
    staleTime: 300000, // Cache for 5 minutes
  });

  // Fetch user's currency preference
  const { data: userCurrencyData, isLoading: isLoadingUserCurrency } = useQuery(
    {
      queryKey: ["userCurrency", auth.token],
      queryFn: () =>
        auth.token ? userCurrencyService.getUserCurrency(auth.token) : null,
      enabled: !!auth.token,
      staleTime: 300000, // Cache for 5 minutes
    }
  );

  // Mutation for updating user's currency
  const updateCurrencyMutation = useMutation({
    mutationFn: async (currencyId: number) => {
      if (!auth.token) throw new Error("No authentication token available");

      // Get current user preference to preserve country
      let countryId = 1; // Default country ID
      try {
        const currentPreference = await userCurrencyService.getUserCurrency(
          auth.token
        );
        // @ts-ignore
        countryId = currentPreference.country?.id || countryId;
      } catch (error) {
        console.warn("Could not fetch current preference:", error);
      }

      return userCurrencyService.updateUserCurrency(
        auth.token,
        currencyId,
        countryId
      );
    },
    onSuccess: () => {
      // Invalidate both queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["userCurrency", auth.token] });
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
  });

  const currencies = currencyData?.results || [];
  const userCurrency = userCurrencyData?.currency;
  const effectiveSelectedCurrency = userCurrency?.code || selectedCurrency;

  const filteredCurrencies = currencies.filter((currency) => {
    if (!currency?.description || !currency?.code) return false;
    return (
      currency.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Update local currency when user currency changes
  useEffect(() => {
    if (userCurrency?.code && userCurrency.code !== selectedCurrency) {
      onCurrencyChange(userCurrency.code);
    }
  }, [userCurrency, selectedCurrency, onCurrencyChange]);

  const handleCurrencySelect = async (currency: Currency) => {
    try {
      await updateCurrencyMutation.mutateAsync(currency.id);
      window.location.reload();
      onCurrencyChange(currency.code);
      onClose();
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to update user currency:", error);
    }
  };

  // Show loading state
  if (isLoadingCurrencies || (auth.token && isLoadingUserCurrency)) {
    return (
      <div
        className={`fixed inset-0 bg-white z-[60] transform ${isOpen ? "translate-y-0" : "translate-y-full"
          } transition-transform duration-300 ease-in-out h-[100dvh]`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Currency</h2>
          <button

            onClick={onClose}
            aria-label="Close currency selector"
            aria-describedby="close-currency-selector-description"
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="w-full h-12 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 bg-white z-[60] transform ${isOpen ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-300 ease-in-out h-[100dvh]`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Currency</h2>
          <button
            onClick={onClose}
            aria-label="Close currency selector"
            aria-describedby="close-currency-selector-description"
            className="hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for Currency"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
        </div>
        <div className=" overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary-400 hover:scrollbar-thumb-primary-500">
          <div className="p-4">
            <h3 className="text-md font-bold  text-gray-500 mb-2">
              Popular Currencies
            </h3>
            {popularCurrencies.map((currency) => (
              <button
                key={currency.id}
                onClick={() => handleCurrencySelect(currency)}
                className={cn(
                  "w-full px-4 py-3 text-sm text-left rounded-lg transition-colors",
                  "flex items-center justify-between",
                  currency.code === effectiveSelectedCurrency
                    ? "bg-pink-50"
                    : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {currency.description
                      ?.split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </span>
                  {currency.code === effectiveSelectedCurrency && (
                    <span className="text-primary-400 bg-primary-50 rounded-full p-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <span className="text-gray-500">{currency.code}</span>
              </button>
            ))}
          </div>

          {/* Currency List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-md font-bold text-gray-500 mb-2">
                All Currencies
              </h3>
              {filteredCurrencies.map((currency) => (
                <button
                  key={currency.id}
                  onClick={() => handleCurrencySelect(currency)}
                  className={cn(
                    "w-full flex justify-between items-center py-3 px-2 rounded-lg transition-colors",
                    currency.code === effectiveSelectedCurrency
                      ? "bg-pink-50"
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {currency.description
                        ?.split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                    {currency.code === effectiveSelectedCurrency && (
                      <span className="text-primary-400 bg-primary-50 rounded-full p-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500">{currency.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCurrencySelector;
