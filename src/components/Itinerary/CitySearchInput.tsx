"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Search, X } from "lucide-react"
import { searchCities, CitySearchResult } from "@/services/api/citySearch"

interface CitySearchInputProps {
  placeholder: string
  value: string
  onChange: (city: CitySearchResult | null) => void
  className?: string
  error?: boolean
}

export function CitySearchInput({ 
  placeholder, 
  value, 
  onChange, 
  className = "",
  error = false 
}: CitySearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sync external value with internal searchQuery
  useEffect(() => {
    if (value && value !== searchQuery) {
      setSearchQuery(value)
    }
  }, [value])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const selectedLabel = selectedCity?.display_name || selectedCity?.name || ""

      // If the user selected a city and hasn't changed the text, do not reopen or search
      if (selectedLabel && searchQuery === selectedLabel) {
        setSearchResults([])
        setIsOpen(false)
        return
      }

      if (searchQuery.length >= 2) {
        setIsLoading(true)
        const results = await searchCities(searchQuery)
        setSearchResults(results)
        setIsLoading(false)
        setIsOpen(true)
      } else {
        setSearchResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCity])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    const selectedLabel = selectedCity?.display_name || selectedCity?.name || ""
    // If user alters the text away from the selected label, clear the selection
    if (!query || (selectedLabel && query !== selectedLabel)) {
      setSelectedCity(null)
      onChange(null)
    }
  }

  const handleCitySelect = (city: CitySearchResult) => {
    setSelectedCity(city)
    setSearchQuery(city.display_name || city.name)
    onChange(city)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedCity(null)
    setSearchQuery("")
    onChange(null)
    inputRef.current?.focus()
  }

  const handleInputFocus = () => {
    const selectedLabel = selectedCity?.display_name || selectedCity?.name || ""
    // Only open if we either have results and the user is actively editing
    if (searchResults.length > 0 && (!selectedLabel || searchQuery !== selectedLabel)) {
      setIsOpen(true)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={`w-full pl-10 pr-10 py-3 border rounded-lg text-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-[60] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-5 h-5 mx-auto mb-2 animate-spin" />
              Searching cities...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {city.name}
                    </div>
                    {city.country && (
                      <div className="text-sm text-gray-500">
                        {city.country}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No cities found for "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
