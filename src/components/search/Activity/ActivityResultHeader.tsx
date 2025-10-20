'use client'
import React, { memo, useCallback, useMemo } from 'react'
import DatePicker from '@/components/DatePicker'
import { useRouter, useSearchParams } from 'next/navigation'
import CitySearchPopover from '@/components/settings/CitySearchPopover'
import { CitySearchSuggestions } from '@/types/api/profile'
import FilterDrawer from '../FilterDrawer'
import DrawerContent from './DrawerContent'

const ActivityResultHeader = memo(() => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get('sort') || 'relevance';

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

    // Sort should be applied immediately
    const handleSortChange = useCallback((value: string) => {
        if (value === currentSort) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        router.push(`/search?${params.toString()}`);
    }, [currentSort, router, searchParams]);

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

    return (
        <div className='flex items-center gap-2 pb-8'>
            <div className='w-full max-w-[230px] hidden lg:block'>
                <DatePicker
                    onDateChange={handleDateChange}
                    startDate={searchParams.get('start_date') ? new Date(searchParams.get('start_date') || '') : null}
                    endDate={searchParams.get('end_date') ? new Date(searchParams.get('end_date') || '') : null}
                    placeholderFirst={defaultDates.start}
                    placeholderSecond={defaultDates.end}
                />
            </div>
            <CitySearchPopover
                className='hidden lg:flex w-[160px]'
                initialCity={searchParams.get('city') || 'Sydney'}
                onCitySelect={handleCityChange}
            />
            {/* <SortBy
                className='hidden lg:block w-[240px] shadow-sm'
                value={currentSort}
                onChange={handleSortChange}
            /> */}
            <div className='block lg:hidden'>
                <FilterDrawer
                    type='activity'
                    Content={<DrawerContent />}
                />
            </div>
        </div>
    )
});

ActivityResultHeader.displayName = 'ActivityResultHeader';



export default ActivityResultHeader;
