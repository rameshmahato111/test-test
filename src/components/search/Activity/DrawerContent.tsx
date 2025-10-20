'use client';
import React, { useCallback, useMemo } from 'react'
import { BudgetFilter, StarFilter, CategoryFilter } from './ActivitySearchFilters';
import DatePicker from '@/components/DatePicker';
import CitySearchPopover from '@/components/settings/CitySearchPopover';
import { CitySearchSuggestions } from '@/types/api/profile';
import { useSearchParams, useRouter } from 'next/navigation';
const DrawerContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Memoize date formatting
    const formatDate = useCallback((date: Date): string => {
        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0')
        ].join('-');
    }, []);
    // Memoize default dates
    const defaultDates = useMemo(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return {
            start: formatDate(today),
            end: formatDate(tomorrow)
        };
    }, [formatDate]);
    const handleDateChange = useCallback((start: Date | null, end: Date | null) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('start_date', start ? formatDate(start) : '');
        params.set('end_date', end ? formatDate(end) : '');
        router.push(`/search?${params.toString()}`);
    }, [formatDate, router, searchParams]);

    const handleCityChange = useCallback((city: CitySearchSuggestions) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('city', city.name);
        params.set('longitude', city.coordinates[1].toString());
        params.set('latitude', city.coordinates[0].toString());
        router.push(`/search?${params.toString()}`);
    }, [router, searchParams]);
    const handleStarChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('star', value);
        router.push(`?${params.toString()}`);
    }

    const handleBudgetChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('budget', value);
        router.push(`?${params.toString()}`);
    }


    const handleCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('category', value);
        router.push(`?${params.toString()}`);
    }
    return (
        <div className='overflow-y-auto h-[calc(100%-80px)] py-6'>
            <div className='w-11/12 lg:hidden mb-5'>

                <DatePicker

                    onDateChange={handleDateChange}
                    startDate={searchParams.get('start_date') ? new Date(searchParams.get('start_date') || '') : null}
                    endDate={searchParams.get('end_date') ? new Date(searchParams.get('end_date') || '') : null}
                    placeholderFirst={defaultDates.start}
                    placeholderSecond={defaultDates.end}
                />
            </div>
            <div className='py-6'>
                <CitySearchPopover
                    className='w-11/12'
                    initialCity={searchParams.get('city') || undefined}
                    onCitySelect={handleCityChange}
                />
            </div>
            <StarFilter selectedStar={searchParams.get('star') || undefined} onChange={handleStarChange} />
            <BudgetFilter selectedBudget={searchParams.get('budget') || undefined} onChange={handleBudgetChange} />
            <CategoryFilter selectedCategory={searchParams.get('category') || undefined} onChange={handleCategoryChange} />
        </div>
    )
}

export default DrawerContent    