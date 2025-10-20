'use client';
import React from 'react'
import TextWithSeeAll from '../TextWithSeeAll'
import HorizontalCardScroll from '../HorizontalCardScroll'
import Card from '../Cards/Card'
import { TRENDING_SECTION_SEE_ALL_URL, TRENDING_SECTION_TITLE } from '@/data/staticData'
import { CardProps } from '@/types'
import { RecommendationAPI } from '@/services/api'
import { Recommendation } from '@/schemas/recommendations'
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import DataStateHandler from '../StateHandlers/DataStateHandler';
import ShimmerHorizontalCards from '../shimmers/ShimmerHorizontalCards';
import ErrorState from '../StateHandlers/ErrorState';
import EmptyState from '../StateHandlers/EmptyState';

const TrendingSection = () => {
    const { token } = useAuth();
    const { data: trending, isLoading, error } = useQuery({
        queryKey: ['trending', token],
        queryFn: () => RecommendationAPI.getTrendings({ page: 1, limit: 10, token }),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: 0,
    });

    const mapToCardProps = (item: Recommendation): CardProps => ({
        imageSrc: item.image,
        id: item.id,
        title: item.name,
        rating: "0",
        location: item.location,

        currency: item.currency,
        originalPrice: item.originalPrice?.toString() ?? "0",
        farePrice: item.farePrice?.toString() ?? "0",
    });
    return (
        <div className="px-4 md:px-8 lg:px-10">
            <TextWithSeeAll title={TRENDING_SECTION_TITLE} seeAllUrl={TRENDING_SECTION_SEE_ALL_URL} />
            <DataStateHandler
                loadingComponent={<ShimmerHorizontalCards />}
                emptyComponent={<EmptyState />}
                errorComponent={<ErrorState message={error?.message || "Error fetching trending"} />}
                isEmpty={trending?.count === 0}
                isLoading={isLoading}
                error={error}
            >

                <HorizontalCardScroll>
                    {trending?.results.map((card) => (
                        <Card type={card.type.toLowerCase()} key={card.id} card={mapToCardProps(card)} />
                    ))}
                </HorizontalCardScroll>

            </DataStateHandler>
        </div>
    )
}

export default TrendingSection
