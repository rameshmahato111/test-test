'use client';
import React from 'react'
import { useSearchParams } from 'next/navigation';
import DataStateHandler from '@/components/StateHandlers/DataStateHandler';
import ErrorState from '@/components/StateHandlers/ErrorState';
import EmptyState from '@/components/StateHandlers/EmptyState';
import { Inbox } from 'lucide-react';
import HotelResult from './HotelResult';
import HotelSearchFilter from './HotelSearchFilter';
import { useQuery } from '@tanstack/react-query';
import { hotelApi } from '@/services/api/hotel';
import ShimmerButton from '@/components/shimmers/ShimmerButton';
import ShimmerContainer from '@/components/shimmers/ShimmerContainer';
import ShimmerText from '@/components/shimmers/ShimmerText';
import { stringArrayToArray } from '@/utils';
import { useAuth } from '@/hooks/useAuth';

const HotelSearchResultLoading = () => {
    return <div className='flex flex-1 flex-col gap-4'>
        {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className='grid grid-cols-1 md:grid-cols-3 gap-6  shadow-cardShadow rounded-lg overflow-hidden bg-background w-full'>
                {/* Image section */}
                <div className='relative overflow-hidden max-h-[270px] sm:max-h-[320px] lg:max-h-[280px] col-span-1'>
                    <ShimmerContainer width='100%' height='280px' />
                </div>

                {/* Content section */}
                <div className='col-span-1 md:col-span-2 py-4 px-2'>
                    {/* Title */}
                    <ShimmerText className='w-3/4 h-8 mb-3' />

                    {/* Icons with text */}
                    <div className='flex gap-2 md:gap-2 flex-wrap pb-4 md:pb-6'>
                        <ShimmerText className='w-24 h-5' />

                        <ShimmerText className='w-24 h-5' />
                    </div>

                    {/* Room info box */}
                    <div className='p-3 w-[98%] xl:w-[95%] bg-gray-50 rounded-xl pb-5 border border-gray-color-100 flex flex-col md:flex-row gap-2 justify-between'>
                        <div>
                            <ShimmerText className='w-32 h-4 mb-2' />
                            <ShimmerText className='w-40 h-4 mb-2' />

                        </div>
                        <div className='flex flex-col items-end'>
                            <ShimmerText className='w-24 h-6 mb-2' />
                            <ShimmerText className='w-40 h-4 mb-4' />
                            <ShimmerButton className='w-full md:w-40' />
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
}

const HotelSection = () => {
    const searchParams = useSearchParams();
    const { token } = useAuth();
    const query = searchParams.get('hotel_query');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const no_of_rooms = searchParams.get('no_of_rooms');
    const nationality = searchParams.get('nationality');
    const no_of_adults = searchParams.get('no_of_adults');
    const no_of_children = searchParams.get('no_of_children');
    const page = searchParams.get('page');
    const sort = searchParams.get('sort');
    const bed_type = searchParams.get('bed_type');
    const hotel_rating = searchParams.get('hotel_rating');
    const meal_plan = searchParams.get('meal_plan');
    const reservation_policy = searchParams.get('reservation_policy');
    const minRate = searchParams.get('minRate');
    const maxRate = searchParams.get('maxRate');
    const min_review_rating = searchParams.get('min_review_rating');
    const max_review_rating = searchParams.get('max_review_rating');

    // Create a stable ages_of_children value
    const parsedAgesOfChildren = React.useMemo(() => {
        const agesParam = searchParams.get('ages_of_children');
        if (!agesParam) return [];

        try {
            // Properly decode the URL-encoded array string
            const decodedParam = decodeURIComponent(agesParam);
            return stringArrayToArray(decodedParam);
        } catch (e) {
            console.error('Error parsing ages_of_children:', e);
            return [];
        }
    }, [searchParams]);

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['hotel-search', query, start_date, end_date, no_of_rooms, nationality, no_of_adults, no_of_children, page, sort, bed_type, hotel_rating, meal_plan, reservation_policy, minRate, maxRate, min_review_rating, max_review_rating, parsedAgesOfChildren, token],
        queryFn: () => hotelApi.searchHotels({
            hotel_query: query || '',
            start_date: start_date || '',
            end_date: end_date || '',
            no_of_rooms: parseInt(no_of_rooms || '1'),
            nationality: nationality || '',
            no_of_adults: parseInt(no_of_adults || '1'),
            no_of_children: parseInt(no_of_children || '0'),
            page: parseInt(page || '1'),
            sort: sort || '',
            ages_of_children: parsedAgesOfChildren,
            filters: {
                hotel_rating: parseInt(hotel_rating || '0'),
                minRate: minRate ? parseInt(minRate || '0') : undefined,
                maxRate: maxRate ? parseInt(maxRate || '0') : undefined,
                min_review_rating: parseInt(min_review_rating || '0'),
                max_review_rating: parseInt(max_review_rating || '0'),
            }
        }, token),
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return (
        <div className='px-4 flex items-start gap-5 xl:gap-10 md:px-8 lg:px-10 -translate-y-10'>
            <HotelSearchFilter isLoading={isLoading} hotelData={data!} />
            <DataStateHandler
                isLoading={isLoading}
                error={error}
                isEmpty={!isLoading && data?.results.length === 0}
                emptyComponent={
                    <EmptyState
                        className='flex-1'
                        message='No hotels found. Try adjusting your search criteria.'
                        icon={<Inbox className="w-12 h-12" />}
                    />
                }
                loadingComponent={<HotelSearchResultLoading />}
                errorComponent={
                    <ErrorState
                        className='flex-1'
                        message={error?.message || 'Failed to load hotels. Please try again.'}
                    />
                }
            >
                <HotelResult
                    data={data!}
                    isFetching={isFetching}
                />
            </DataStateHandler>
        </div>
    );
}

export default HotelSection;