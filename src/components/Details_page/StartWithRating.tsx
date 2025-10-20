import React from 'react'
import Stars from './Stars'
import { useSearchDetail } from '@/contexts/SearchDetailContext';
import { Loader2 } from 'lucide-react';

interface StartWithRatingProps {
    id: string;
    type: string;
    rating: number;
}

const StartWithRating: React.FC<StartWithRatingProps> = ({ rating, id, type }) => {
    const { getHotel } = useSearchDetail();
    const hotel = type === 'hotel' ? getHotel(id) : null;
    const hotelbedsReview = hotel?.reviews?.find(review => review.type === 'HOTELBEDS');

    return (
        <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
                <Stars rating={hotelbedsReview?.rate || rating} />
                <p className='text-sm md:text-base font-semibold text-yellow-50'>
                    {(hotelbedsReview?.rate || rating)?.toFixed(1) || '0.0'}
                </p>
            </div>
            <p className='text-sm md:text-base font-normal underline text-gray-700'>
                {`${hotelbedsReview?.reviewCount || 0} reviews`}
            </p>
        </div>
    )
}

export default StartWithRating
