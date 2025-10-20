'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { Activity, Modalities } from '@/schemas/activities';
import { HotelResult, HotelRoom } from '@/schemas/hotel';
import { ReCheckAvailability } from '@/schemas/re-check';

type DetailType = {
    activities: Record<string, Activity>;
    hotels: Record<string, HotelResult>;
};

interface SearchDetailContextType {
    details: DetailType;
    setActivityDetail: (activity: Activity) => void;
    setHotelDetail: (hotel: HotelResult) => void;
    getDetail: (type: 'hotel' | 'activity', id: string) => Activity | HotelResult | null;
    clearDetails: () => void;
    setHotelRoomsDetail: (hotelId: string, hotelRooms: HotelRoom[], request_id: string, noOfAdults: number, noOfChildren: number, agesOfChildren: number[]) => void;
    setActivityModalitiesDetail: (activityId: string, modalities: Modalities[], request_id: string, paxes: number[]) => void;
    getActivitity: (activityId: string) => Activity | null;
    getHotel: (hotelId: string) => HotelResult | null;
    updateReCheckData: (reCheckData: ReCheckAvailability) => void;
}

const SearchDetailContext = createContext<SearchDetailContextType | undefined>(undefined);

const MAX_ITEMS = 10; // Maximum items to store per type

export function SearchDetailProvider({ children }: { children: React.ReactNode }) {
    const [details, setDetails] = useState<DetailType>({
        activities: {},
        hotels: {},
    });

    const setActivityDetail = (activity: Activity) => {
        setDetails(prev => {
            const activities = { ...prev.activities };

            // Add new activity
            activities[activity.id] = activity;

            // Remove oldest items if exceeding MAX_ITEMS
            const ids = Object.keys(activities);
            if (ids.length > MAX_ITEMS) {
                const idsToRemove = ids.slice(0, ids.length - MAX_ITEMS);
                idsToRemove.forEach(id => delete activities[id]);
            }
            return {
                ...prev,
                activities,
            };
        });
    };

    const setHotelDetail = (hotel: HotelResult) => {
        setDetails(prev => {
            const hotels = { ...prev.hotels };

            hotels[hotel.id] = hotel;

            const ids = Object.keys(hotels);
            if (ids.length > MAX_ITEMS) {
                const idsToRemove = ids.slice(0, ids.length - MAX_ITEMS);
                idsToRemove.forEach(id => delete hotels[id]);
            }

            return {
                ...prev,
                hotels,
            };
        });
    };
    const setHotelRoomsDetail = (hotelId: string, hotelRooms: HotelRoom[], request_id: string, noOfAdults: number, noOfChildren: number, agesOfChildren: number[],) => {
        setDetails(prev => {
            const currentHotel = prev.hotels[hotelId];
            if (!currentHotel) return prev;

            return {
                ...prev,
                hotels: {
                    ...prev.hotels,
                    [hotelId]: {
                        ...currentHotel,
                        noOfAdults,
                        noOfChildren,
                        agesOfChildren,
                        request_id: request_id ? request_id : currentHotel.request_id, rooms: hotelRooms
                    }
                }
            };
        });
    };

    const setActivityModalitiesDetail = (activityId: string, modalities: Modalities[], request_id: string, paxes: number[]) => {
        setDetails(prev => {
            const currentActivity = prev.activities[activityId];
            if (!currentActivity) return prev;

            return {
                ...prev,
                activities: {
                    ...prev.activities,
                    [activityId]: {
                        ...currentActivity,
                        request_id: request_id ? request_id : currentActivity.request_id,
                        modalities: modalities,
                        paxes: paxes
                    }
                }
            };
        });
    };
    const updateReCheckData = (reCheckData: ReCheckAvailability) => {
        setDetails(prev => {
            const currentHotel = prev.hotels[reCheckData.hotel_id];
            if (!currentHotel || !currentHotel.rooms) return prev;

            // Update rooms array with new rate data
            const updatedRooms = currentHotel.rooms.map(room => {
                if (room.id.toString() === reCheckData.room_id) {
                    // Keep the original rates array order, just update the specific rate
                    const updatedRates = room.rates.map(rate => {
                        if (rate.id.toString() === reCheckData.rate_id) {
                            return {
                                ...rate,
                                hasReCheck: reCheckData.data.hasReCheck,
                                net: reCheckData.data.net,
                                originalPrice: reCheckData.data.originalPrice,
                                farePrice: reCheckData.data.farePrice,
                                allotment: reCheckData.data.allotment,
                                cancellationPolicies: reCheckData.data.cancellationPolicies,
                                promotions: reCheckData.data.promotions,
                                taxes: reCheckData.data.taxes,
                                offers: reCheckData.data.offers
                            };
                        }
                        return rate;
                    });

                    return {
                        ...room,
                        rates: updatedRates // This preserves the original order
                    };
                }
                return room;
            });

            return {
                ...prev,
                hotels: {
                    ...prev.hotels,
                    [reCheckData.hotel_id]: {
                        ...currentHotel,
                        rooms: updatedRooms
                    }
                }
            };
        });
    };

    const getActivitity = (activityId: string) => {
        return details.activities[activityId] || null;
    };
    const getHotel = (hotelId: string) => {
        return details.hotels[hotelId] || null;
    };

    const getDetail = (type: 'hotel' | 'activity', id: string) => {
        const collection = type === 'hotel' ? details.hotels : details.activities;
        return collection[id] || null;
    };

    const clearDetails = () => {
        setDetails({ activities: {}, hotels: {} });
    };

    return (
        <SearchDetailContext.Provider value={{
            details,
            setActivityDetail,
            setHotelDetail,
            getDetail,
            clearDetails,
            setHotelRoomsDetail,
            setActivityModalitiesDetail,
            getActivitity,
            getHotel,
            updateReCheckData
        }}>
            {children}
        </SearchDetailContext.Provider>
    );
}

export function useSearchDetail() {
    const context = useContext(SearchDetailContext);
    if (!context) {
        throw new Error('useSearchDetail must be used within SearchDetailProvider');
    }
    return context;
} 