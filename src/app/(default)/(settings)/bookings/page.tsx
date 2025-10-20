'use client';

import { useAuth } from '@/hooks/useAuth';
import { MyBookingApi } from '@/services/api/my-booking';
import BookingCard from '@/components/settings/bookings/BookingCard';
import ActivityBookingCard from '@/components/settings/bookings/ActivityBookingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hotel, Compass } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import BookingCardShimmer from '@/components/settings/bookings/BookingCardShimmer';
import ErrorState from '@/components/StateHandlers/ErrorState';
import EmptyState from '@/components/StateHandlers/EmptyState';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const ITEMS_PER_PAGE = 10;

const BookingsPage = () => {
    const { token } = useAuth();
    const [hotelPage, setHotelPage] = useState(1);

    const [
        { data: hotelBookings, isLoading: isHotelsLoading, error: hotelsError, refetch: refetchHotels },
        { data: activityBookings, isLoading: isActivitiesLoading, error: activitiesError },
        { data: existingReviewsInfo, isLoading: isExistingReviewsInfoLoading, error: existingReviewsInfoError }
    ] = useQueries({
        queries: [
            {
                queryKey: ['hotelBookings', token, hotelPage],
                queryFn: () => MyBookingApi.getHotelBookings(token!, hotelPage, ITEMS_PER_PAGE),
                enabled: !!token,
                staleTime: 0,
                retry: false,
                refetchOnWindowFocus: false
            },
            {
                queryKey: ['activityBookings', token],
                queryFn: () => MyBookingApi.getActivityBookings(token!),
                enabled: !!token,
                staleTime: 0,
                retry: false,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['existingReviewsInfo', token],
                queryFn: () => MyBookingApi.getExistingReviewsInfoByUser(token!),
                enabled: !!token,
                staleTime: 0,
                retry: false,
                refetchOnWindowFocus: false,
            }
        ]
    });

    const loadMoreHotels = () => {
        setHotelPage(prev => prev + 1);
    };



    const isLoading = isHotelsLoading || isActivitiesLoading;
    // const isLoading = isHotelsLoading;
    if (isLoading && !hotelBookings && !activityBookings) {
        // if (isLoading && !hotelBookings) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl text-foreground font-semibold">My Bookings</h1>
                {[1, 2, 3].map((i) => (
                    <BookingCardShimmer key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 lg:px-4 px-0">
            <h1 className="text-xl sm:text-2xl text-foreground font-semibold">My Bookings</h1>

            <Tabs defaultValue="hotels" className="w-full">
                <div className="relative">
                    <TabsList className="w-full flex h-auto p-0 bg-transparent overflow-x-auto">
                        <TabsTrigger
                            value="hotels"
                            className="relative flex items-center gap-2 px-4 pb-4 pt-2 text-sm sm:text-base font-medium border-0 rounded-none bg-transparent hover:text-primary-400 data-[state=active]:text-primary-400 data-[state=active]:shadow-none data-[state=active]:bg-transparent whitespace-nowrap before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-1 before:bg-primary-400 before:opacity-0 data-[state=active]:before:opacity-100"
                        >
                            <Hotel className="w-4 sm:w-5 h-4 sm:h-5" />
                            Hotels
                            {!isHotelsLoading && (
                                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary-50 text-primary-600">
                                    {hotelBookings?.count}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="activities"
                            className="relative flex items-center gap-2 px-4 pb-4 pt-2 text-sm sm:text-base font-medium border-0 rounded-none bg-transparent hover:text-primary-400 data-[state=active]:text-primary-400 data-[state=active]:shadow-none data-[state=active]:bg-transparent whitespace-nowrap before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-1 before:bg-primary-400 before:opacity-0 data-[state=active]:before:opacity-100"
                        >
                            <Compass className="w-4 sm:w-5 h-4 sm:h-5" />
                            Activities
                            {!isActivitiesLoading && (
                                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary-50 text-primary-600">
                                    {activityBookings?.count}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
                </div>

                <TabsContent value="hotels" className="space-y-6 mt-6">
                    {isHotelsLoading ? (
                        [1, 2, 3].map((i) => (
                            <BookingCardShimmer key={i} />
                        ))
                    ) : hotelsError ? (
                        <ErrorState message="Failed to load hotel bookings." />
                    ) : hotelBookings?.count === 0 ? (
                        <EmptyState message="No hotel bookings found." />
                    ) : (
                        <>
                            {hotelBookings?.results.map((booking) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    existingReviews={existingReviewsInfo || {}}
                                />
                            ))}
                            {hotelBookings && hotelBookings.next && (
                                <div className="flex justify-center mt-6">
                                    <Button
                                        onClick={loadMoreHotels}
                                        variant="outline"
                                        className="w-full max-w-[200px]"
                                        disabled={isHotelsLoading}
                                    >
                                        {isHotelsLoading ? 'Loading...' : 'Load More'}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>

                <TabsContent value="activities" className="space-y-6 mt-6">
                    {isActivitiesLoading ? (
                        [1, 2, 3].map((i) => (
                            <BookingCardShimmer key={i} />
                        ))
                    ) : activitiesError ? (
                        <ErrorState message={activitiesError.message || 'Failed To Load Activities bookings.'} />
                    ) : activityBookings?.count === 0 ? (
                        <EmptyState message="No activity bookings found." />
                    ) : (
                        activityBookings?.results.map((booking) => (
                            <ActivityBookingCard
                                key={booking.id}
                                booking={booking}
                                existingReviews={existingReviewsInfo || {}}
                            />
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BookingsPage;
