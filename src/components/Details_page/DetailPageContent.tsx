'use client';
import { useSearchDetail } from '@/contexts/SearchDetailContext';
import { detailAdapters } from '@/adapters/detailAdapters';
import ShimmerDetailPage from '../shimmers/ShimmerDetailPage';
import Gallery from './TopGallery';
import StartWithRating from './StartWithRating';
import Details from './Details';
import AvailabilityWrapper from './AvailabilityWrapper';
import DataStateHandler from '../StateHandlers/DataStateHandler';
import ErrorState from '../StateHandlers/ErrorState';
import EmptyState from '../StateHandlers/EmptyState';
import { useQuery } from '@tanstack/react-query';
import { detailAPI, RecommendationAPI } from '@/services/api';
import { CommonDetailPageData } from '@/types/details';
import { Activity } from '@/schemas/activities';
import { HotelResult } from '@/schemas/hotel';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

type ValidTypes = 'hotel' | 'activity';

interface DetailPageContentProps {
    id: string;
    type: ValidTypes;
}

const DetailPageContent = ({ id, type }: DetailPageContentProps) => {
    const { token } = useAuth();
    const { getDetail, setActivityDetail, setHotelDetail } = useSearchDetail();

    const { data: apiData, isLoading, isError: isErrorQuery, error } = useQuery<CommonDetailPageData>({
        queryKey: ['detail', type, id, token],
        queryFn: async () => {
            try {
                const cachedData = getDetail(type, id);
                if (cachedData) {
                    return detailAdapters[type](cachedData);
                }
                const response = await detailAPI.getDetail(id, type, token);
                if (type === 'activity') setActivityDetail(response as Activity);
                if (type === 'hotel') setHotelDetail(response as HotelResult);
                return detailAdapters[type](response);
            } catch (error: any) {

                throw new Error(error || `Failed to load ${type} details`);
            }
        },
        staleTime: 5 * 60 * 1000, //  data stale after 5 minutes
        placeholderData: () => {
            const contextData = getDetail(type, id);
            return contextData ? detailAdapters[type](contextData) : undefined;
        }
    });
    // send feedback when user visits the detail page
    useEffect(() => {
        RecommendationAPI.sendFeedback(
            Number(id),
            type,
            "read",
            token!
        );
    }, [id, type, token]);

    return (
        <DataStateHandler
            isLoading={isLoading}
            loadingComponent={<ShimmerDetailPage />}
            emptyComponent={<EmptyState message="No data found" />}
            errorComponent={<ErrorState message={error?.message || ""} />}
            isEmpty={!apiData || Object.keys(apiData).length === 0}
            error={isErrorQuery ? new Error(error?.message || "") : null}
        >
            <div className='px-4 md:px-8 lg:px-10 pt-8 md:pt-16'>
                <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold pb-4'>
                    {apiData?.name || 'Untitled'}
                </h1>
                <StartWithRating rating={apiData?.avg_rating || 0} id={id} type={type} />
                <Gallery
                    type={type}
                    images={apiData?.images?.slice(0, 4) || []}
                    id={id}
                    totalImages={apiData?.images?.length || 0}
                />
                <div className='flex items-start justify-between gap-8 pb-14'>
                    <Details
                        id={id}
                        details={apiData!}
                    />
                    <div className='hidden lg:block'>
                        <AvailabilityWrapper
                            id={id}
                            position='sidebar'
                        />
                    </div>
                </div>
            </div>
        </DataStateHandler>
    );
};

export default DetailPageContent;


