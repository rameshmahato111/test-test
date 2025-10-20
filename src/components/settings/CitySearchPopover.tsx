'use client'

import React, { useState, useCallback, useEffect } from 'react'

import { CitySearchSuggestions } from '@/types/api/profile'
import { ProfileApi } from '@/services/api/profile'
import PopoverWithSearch from '../PopoverWithSearch'

interface CitySearchPopoverProps {

    initialCity?: string
    className?: string
    contentClassName?: string
    onCitySelect: (city: CitySearchSuggestions) => void
}

const CitySearchPopover: React.FC<CitySearchPopoverProps> = ({
    initialCity,
    className,
    contentClassName,
    onCitySelect
}) => {
    const [cities, setCities] = useState<string[]>([])
    const [citiesData, setCitiesData] = useState<CitySearchSuggestions[]>([])

    const fetchInitialCities = useCallback(async () => {
        try {
            const response = await ProfileApi.getCitySearchSuggestions()
            setCitiesData(response.results)
            setCities(response.results.map(city => city.name))
        } catch (error) {
            console.error('Error fetching initial cities:', error)
        }
    }, [])

    const handleSearch = useCallback(async (term: string) => {
        try {
            if (!term.trim()) {
                await fetchInitialCities()
                return
            }
            const response = await ProfileApi.getCitySearchSuggestions(term)
            setCitiesData(response.results)
            setCities(response.results.map(city => city.name))
        } catch (error) {
            console.error('Error searching cities:', error)
        }
    }, [fetchInitialCities])

    const handleSelect = (cityName: string) => {
        const selectedCity = citiesData.find(city => city.name === cityName)
        if (selectedCity) {
            onCitySelect(selectedCity)
        }
    }
    return (
        <PopoverWithSearch
            options={cities}
            placeholder="City"
            initialSelected={initialCity}
            className={className}
            contentClassName={contentClassName}
            value=""
            onOpen={() => fetchInitialCities()}
            onChange={handleSelect}
            onSearch={handleSearch}
        />
    )
}

export default CitySearchPopover 