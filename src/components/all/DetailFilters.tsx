'use client'

import { useSlugFilters } from '@/hooks/useSlugFilters';
import DatePicker from '../DatePicker';
import CitySearchPopover from '../settings/CitySearchPopover';
import { useState } from 'react';
import { CitySearchSuggestions } from '@/types/api/profile';

const DetailFilters = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
        if (startDate && endDate) {
            setStartDate(startDate);
            setEndDate(endDate);
        }
    }
    const handleCitySelect = (city: CitySearchSuggestions) => {
        setSelectedCity(city.name);
    }
    return (

        <div className='flex flex-col sm:flex-row gap-4 pb-5'>
            <div className='max-w-[260px]'>

                <DatePicker onDateChange={handleDateChange} startDate={startDate} endDate={endDate} />
            </div>
            <CitySearchPopover onCitySelect={handleCitySelect} />
        </div>
    );
};

export default DetailFilters;
