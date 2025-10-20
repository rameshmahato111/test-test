'use client';
import { useEffect, useState } from 'react';
import Wrapper from '@/components/Wrapper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBooking, isHotelBooking, isActivityBooking } from '@/contexts/BookingContext';
import HotelPayment from '@/components/Payment/HotelPayment';
import ActivityPayment from '@/components/Payment/ActivityPayment';
import Loader from '@/components/Loader';

const PaymentPage = () => {
    const { state } = useBooking();
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingType = searchParams.get('type') || 'hotel';
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!state.bookingDetails || !state.passengerDetails) {
            router.push('/');
        }
    }, [state.bookingDetails, router]);

    if (!state.bookingDetails || !state.passengerDetails) {
        return null;
    }

    return (
        <>
            <Wrapper>
                <div className='h-[133px] bg-primary-400' />
                <div className='-translate-y-[80px] px-4 md:px-8'>
                    {bookingType === 'hotel' && isHotelBooking(state.bookingDetails) ? (
                        <HotelPayment
                            hotelBookingDetails={state.bookingDetails}
                            passengerDetails={state.passengerDetails}
                            setIsLoading={setIsLoading}
                        />
                    ) : isActivityBooking(state.bookingDetails) && (
                        <ActivityPayment
                            activityBookingDetails={state.bookingDetails}
                            passengerDetails={state.passengerDetails}
                            setIsLoading={setIsLoading}
                        />
                    )}
                </div>
            </Wrapper>
            {isLoading && <Loader />}
        </>
    );
};

export default PaymentPage;

