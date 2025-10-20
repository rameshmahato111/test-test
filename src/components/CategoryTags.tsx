'use client';
import React from 'react'
import TextWithSeeAll from './TextWithSeeAll'
import HorizontalCardScroll from './HorizontalCardScroll'
import Card from './Cards/Card'
import { citiesApi } from '@/services/api'
import ShimmerHorizontalCards from './shimmers/ShimmerHorizontalCards'
import { useAuth } from '@/contexts/AuthContext'
import DataStateHandler from './StateHandlers/DataStateHandler';
import { useQuery } from '@tanstack/react-query';
import EmptyState from './StateHandlers/EmptyState';

const CategoryTags = ({ category, category_id, city }: { category: string, category_id: number, city?: string }) => {
    const { token } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['category-activities', category_id, city, category],
        queryFn: () => citiesApi.getCategoryActivities({ category_id: category_id, page_size: 10, city: city }, token),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: 0,
    })

    const encodedCategory = encodeURIComponent(category);
    const encodedCity = encodeURIComponent(city || '');
    return (
        <div className='px-4  w-full md:px-8 lg:px-10 mt-16 '>
            <DataStateHandler
                isEmpty={data?.count === 0}
                loadingComponent={<ShimmerHorizontalCards />}
                emptyComponent={null}
            >
                {data && (
                    <>
                        <TextWithSeeAll title={category} seeAllUrl={`/category/?id=${category_id}&category=${encodedCategory}&city=${encodedCity}`} showSeeAll={data?.count > 5} />
                        <HorizontalCardScroll>
                            {data?.results && data.results.map((card: any) => (
                                <Card type={card.type} key={card.id} card={{
                                    id: card.id,
                                    title: card.name,
                                    imageSrc: card.image,
                                    location: card.location,

                                    currency: card.currency,
                                    originalPrice: card.originalPrice.toString(),
                                    farePrice: card.farePrice.toString(),
                                }} />
                            ))}
                        </HorizontalCardScroll>
                    </>
                )}
            </DataStateHandler>

        </div>
    )
}

export default CategoryTags
