'use client'
import React from 'react'
import TopCarousel from './TopCarousel'
import Wrapper from '../Wrapper'
import DataStateHandler from '../StateHandlers/DataStateHandler'
import ShimmerCardGrid from '../shimmers/ShimmerCardGrid'
import EmptyState from '../StateHandlers/EmptyState'
import { RecommendationAPI } from '@/services/api'
import Card from '../Cards/Card'
import CustomPagination from '../CustomPagination'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'

const PAGE_SIZE = 16
const AllTrending = ({ page }: { page: number }) => {
    const { token, isAuthenticated } = useAuth()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['trendings', page, isAuthenticated ? token : null],
        queryFn: () => RecommendationAPI.getTrendings({ page, limit: PAGE_SIZE, token: isAuthenticated ? token : undefined }),
        refetchOnWindowFocus: false,
        staleTime: 0,
        retry: false,

    })
    const mapData = (data: any) => ({
        id: data.object_id,
        imageSrc: data.image,
        title: data.name,
        rating: "0",
        location: data.location,
        price: data.minPrice,
        currency: data.currency,
        originalPrice: data.originalPrice || "0",
        farePrice: data.farePrice || "0",
    })
    return (
        <Wrapper>
            <TopCarousel type="trending" title='All Trendings' />
            <div className='px-4 md:px-8 lg:px-10'>

                <DataStateHandler
                    isEmpty={data?.count === 0}
                    isLoading={isLoading}
                    loadingComponent={<ShimmerCardGrid count={PAGE_SIZE} />}
                    emptyComponent={<EmptyState className='h-[80vh]' message={`No Cities Data Found`} />}
                >
                    <div style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(295px, 1fr))' }} className='grid gap-x-6 gap-y-8 pb-12'>
                        {data?.results.map((trending) => (
                            <Card key={trending.id} className='w-full' card={mapData(trending)} type={trending.type} />
                        ))}
                    </div>
                    {data?.count && data?.count > PAGE_SIZE && (
                        <CustomPagination totalPages={Math.ceil(data?.count / PAGE_SIZE)} />
                    )}
                </DataStateHandler>
            </div>
        </Wrapper>
    )
}

export default AllTrending
