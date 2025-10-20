import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { currencyService, userCurrencyService } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Currency } from "@/services/api/types/currency";
import { useAuth } from "@/contexts/AuthContext";

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  className?: string;
}

export const popularCurrencies = [
  {
    id: 9,
    code: "AUD",
    description: "Australian Dollar",
    type: "LIBERATE",
    zero_decimal: false,
    two_decimal: true,
    name: "Australian dollar",
    symbol: "AUD",
  },
  {
    id: 149,
    code: "USD",
    description: "US Dollar",
    type: "BOTH",
    zero_decimal: false,
    two_decimal: true,
    name: "United States dollar",
    symbol: "USD",
  },
  {
    id: 65,
    code: "INR",
    description: "Indian Rupee",
    type: "LIBERATE",
    zero_decimal: false,
    two_decimal: true,
    name: "Indian rupee",
    symbol: "INR",
  },
  {
    id: 108,
    code: "NZD",
    description: "New Zealand Dollar",
    type: "LIBERATE",
    zero_decimal: false,
    two_decimal: true,
    name: "New Zealand dollar",
    symbol: "NZD",
  },
  {
    id: 107,
    code: "NPR",
    description: "NEPALESE RUPEE",
    type: "LIBERATE",
    zero_decimal: false,
    two_decimal: true,
    name: "Nepalese rupee",
    symbol: "NPR",
  },
];

const CurrencySelector = ({
  selectedCurrency,
  onCurrencyChange,
  className,
}: CurrencySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectorRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const auth = useAuth();

  // Fetch available currencies
  const { data: currencyData, isLoading: isLoadingCurrencies } = useQuery({
    queryKey: ["currencies"],
    queryFn: () => currencyService.getCurrencies(),
  });

  // Fetch user's currency preference
  const { data: userCurrencyData, isLoading: isLoadingUserCurrency } = useQuery(
    {
      queryKey: ["userCurrency", auth.token],
      queryFn: () =>
        auth.token ? userCurrencyService.getUserCurrency(auth.token) : null,
      enabled: !!auth.token, // Only run query if token exists
    }
  );

  // Mutation for updating user's currency
  const updateCurrencyMutation = useMutation({
    mutationFn: (currencyId: number) => {
      if (!auth.token) throw new Error("No authentication token available");
      return userCurrencyService.updateUserCurrency(auth.token, currencyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCurrency", auth.token] });
    },
  });

  const currencies = currencyData?.results || [];
  const userCurrency = userCurrencyData?.currency;
  const effectiveSelectedCurrency = userCurrency?.code || selectedCurrency;
  const currentCurrency =
    currencies.find((c) => c.code === effectiveSelectedCurrency) ||
    currencies[0];

  const filteredCurrencies = currencies.filter((currency) => {
    if (!currency?.description || !currency?.code) return false;
    return (
      currency.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencySelect = async (currency: Currency) => {
    onCurrencyChange(currency.code);
    setIsOpen(false);
    setSearchQuery("");

    if (!auth.token) {
      console.warn("Cannot update currency: User not authenticated");
      return;
    }

    try {
      await updateCurrencyMutation.mutateAsync(currency.id);
      // Refresh the page after successful currency update
      window.location.reload();
    } catch (error) {
      console.error("Failed to update user currency:", error);
      // You might want to show a toast notification here
    }
  };

  // Show loading state
  if (isLoadingCurrencies || (auth.token && isLoadingUserCurrency)) {
    return (
      <div
        className={cn(
          "px-4 py-2 rounded-lg border border-gray-200 bg-white",
          className
        )}
      >
        <div className="w-8 h-4 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  // Show default USD if no currencies are loaded
  if (!currencies.length) {
    return (
      <div
        className={cn(
          "px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700",
          className
        )}
      >
        USD
      </div>
    );
  }

  return (
    <div ref={selectorRef} className="relative z-50">
      <button
        aria-label="Open currency selector"
        aria-describedby="open-currency-selector-description"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-4 py-2 rounded-lg border border-gray-200 bg-white",
          "text-sm font-medium text-gray-700 hover:border-primary-100",
          className
        )}
      >
        {currentCurrency?.code || "USD"}
      </button>

      {isOpen && (
        <div className="absolute  right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-[320px]">
          {/* Search Box */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search For Currency"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary-400"
              onClick={(e) => e.stopPropagation()}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="max-h-[400px] relative z-50 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary-400 hover:scrollbar-thumb-primary-500">
            <div>
              <h3 className="text-md font-bold text-gray-500 mb-2">
                Popular Currencies
              </h3>
              {popularCurrencies.map((currency) => (
                <button
                  aria-label={`Select ${currency.description}`}
                  aria-describedby="select-currency-description"
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
            <h3 className="text-md font-bold  py-2 text-gray-500 mb-2">
              All Currencies
            </h3>

            <div className="space-y-1 ">
              {filteredCurrencies.map((currency) => (
                <button
                  aria-label={`Select ${currency.description}`}
                  aria-describedby="select-currency-description"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
