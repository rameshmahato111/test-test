import React, { memo } from 'react'
import PriceRangeFilter from './PriceRangeFilter'
import ReviewRatingRangeFilter from './ReviewRatingRangeFilter';
import StarFilterSection from './StarFilterSection';
import { useRouter, useSearchParams } from 'next/navigation';



const DrawerContent = memo(({ exchangeRate }: { exchangeRate: number }) => {
    const router = useRouter();
    const searchParams = useSearchParams();


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

    return (
        <div className='overflow-y-auto h-[calc(100%-80px)] py-6 px-4'>
            <PriceRangeFilter
                exchangeRate={exchangeRate}
            />

            <ReviewRatingRangeFilter
                ratingRange={searchParams.get('min_review_rating') != undefined && searchParams.get('max_review_rating') != undefined ? [parseInt(searchParams.get('min_review_rating') || '0'), parseInt(searchParams.get('max_review_rating') || '0')] : [0, 5]}
                onRatingRangeChange={handleReviewRatingChange}
            />
            <StarFilterSection
                title="Hotel Rating"
                value={searchParams.get('hotel_rating') ? parseInt(searchParams.get('hotel_rating') || '0') : 0}
                onChange={handleHotelRatingChange}
            />
        </div>
    )
})

export default DrawerContent;
