'use client';
import React from 'react'
import Card from '../Cards/Card'
import { CardProps } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query';
import { RecommendationAPI } from '@/services/api';
import { useSearchParams } from 'next/dist/client/components/navigation';
import CustomPagination from '../CustomPagination';
import DataStateHandler from '../StateHandlers/DataStateHandler';
import ShimmerCardGrid from '../shimmers/ShimmerCardGrid';
import { Inbox } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Recommendation } from '@/schemas/recommendations';
import Wrapper from '../Wrapper';
import TopCarousel from './TopCarousel';
const ITEMS_PER_PAGE = 16;
const AllRecommendation = () => {
    const { token } = useAuth();
    const searchParams = useSearchParams();
    const page = searchParams.get('page') || '1';
    const category = searchParams.get('category') || '';
    const { data, isLoading, isError } = useSuspenseQuery({
        queryKey: category ? ['recommended', category, page] : ['recommended', page],
        queryFn: () => {
            if (!token) {
                throw new Error('User login is required to view recommendations');
            }
            if (category) {
                return RecommendationAPI.getRecommendedItemsByCategory(token!, category.toUpperCase(), page)
            }
            return RecommendationAPI.getRecommendedItems({ token: token!, limit: ITEMS_PER_PAGE, page })
        },
        retry: 1,
    })
    return (
        <Wrapper>
            <TopCarousel type='recommended' title='All Recommended' />
            <div className='px-4 md:px-8 lg:px-10'>

                <DataStateHandler
                    isLoading={isLoading}
                    isEmpty={data?.results.length === 0}
                    error={isError ? new Error("Failed to load recommendations") : null}
                    loadingComponent={<ShimmerCardGrid count={8} className='pt-8' />}
                    emptyComponent={<div className="text-center py-10">
                        <Inbox className='w-16 h-16 text-primary-300 mx-auto' />
                        <p className=" text-base text-gray-800">No recommendations available</p>
                        <p className='text-sm text-gray-400'>We couldn't find any recommendations for you. Please try again later.</p>
                    </div>}
                >
                    <div

                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 pb-12'
                    >
                        {data?.results.map((card) => (
                            <Card key={card.id} type='hotel' className='w-full' card={mapToCardProps(card)} />
                        ))}
                    </div>
                    {data?.count && data?.count > ITEMS_PER_PAGE && <CustomPagination totalPages={Math.ceil(data?.count / ITEMS_PER_PAGE)} />}
                </DataStateHandler>
            </div>
        </Wrapper>
    )
}

export default AllRecommendation

const mapToCardProps = (item: Recommendation): CardProps => ({
    imageSrc: item.image,
    id: item.id,
    title: item.name,
    rating: "0",
    location: item.location,
    currency: item.currency,
    originalPrice: item.originalPrice || "0",
    farePrice: item.farePrice || "0",
});

