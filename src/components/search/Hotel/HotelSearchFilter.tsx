import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import PriceRangeFilter from './PriceRangeFilter';
import { cn } from '@/lib/utils';
import ReviewRatingRangeFilter from './ReviewRatingRangeFilter';
import StarFilterSection from './StarFilterSection';
import { HotelSearchResponse } from '@/schemas/hotel';
import { useSearchParams, useRouter } from 'next/navigation';
const HotelSearchFilter = memo(({ hotelData, isLoading }: { hotelData: HotelSearchResponse, isLoading: boolean }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currency = hotelData?.results[0]?.currency || 'USD';


    const handleReviewRatingChange = (value: number[] | undefined) => {
        if (value) {
            const params = new URLSearchParams(searchParams);
            params.set('min_review_rating', value[0].toString());
            params.set('max_review_rating', value[1].toString());
            router.push(`?${params.toString()}`);
        } else {
            const params = new URLSearchParams(searchParams);
            params.delete('min_review_rating');
            params.delete('max_review_rating');
            router.push(`?${params.toString()}`);
        }
    };

    const handleHotelRatingChange = (value: number | undefined) => {
        if (value) {
            const params = new URLSearchParams(searchParams);
            params.set('hotel_rating', value?.toString() || '');
            router.push(`?${params.toString()}`);
        } else {
            const params = new URLSearchParams(searchParams);
            params.delete('hotel_rating');
            router.push(`?${params.toString()}`);
        }
    };
    const isFiltersApplied = searchParams.get('minRate') != undefined || searchParams.get('maxRate') != undefined || searchParams.get('min_review_rating') != undefined || searchParams.get('max_review_rating') != undefined || searchParams.get('hotel_rating') != undefined;


    const handleResetFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('minRate');
        params.delete('maxRate');
        params.delete('min_review_rating');
        params.delete('max_review_rating');
        params.delete('hotel_rating');
        router.push(`?${params.toString()}`);
    }
    return (
        <div className='hidden lg:block'>
            <div className="rounded-[16px] bg-background w-full max-w-[300px] py-6 px-4 divide-y border border-gray-200 ">

                <div className="pb-4">

                    <Button
                        disabled={!isFiltersApplied}
                        variant="outline"
                        className={cn(
                            "w-full",
                        )}
                        onClick={() => handleResetFilters()}
                    >
                        Reset Filters
                    </Button>
                </div>

                <PriceRangeFilter
                    isLoading={isLoading}
                    exchangeRate={hotelData?.results[0]?.exchangeRate}
                />

                <ReviewRatingRangeFilter
                    ratingRange={searchParams.get('min_review_rating') != undefined && searchParams.get('max_review_rating') != undefined ? [parseInt(searchParams.get('min_review_rating') || '0'), parseInt(searchParams.get('max_review_rating') || '0')] : [0, 5]}
                    onRatingRangeChange={handleReviewRatingChange}
                />

                <StarFilterSection
                    title="Hotel Rating"
                    value={searchParams.get('hotel_rating') ? parseInt(searchParams.get('hotel_rating') || '0') : undefined}
                    onChange={handleHotelRatingChange}
                />


            </div>
        </div>
    );
});

export default HotelSearchFilter; 