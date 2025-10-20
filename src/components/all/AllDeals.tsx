import React from 'react'
import Wrapper from '../Wrapper'
import TopCarousel from './TopCarousel'
import ShimmerCardGrid from '../shimmers/ShimmerCardGrid'
import DataStateHandler from '../StateHandlers/DataStateHandler'
import EmptyState from '../StateHandlers/EmptyState'
import { DealsApi } from '@/services/api'
import Card from '../Cards/Card'
import CustomPagination from '../CustomPagination'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
const PAGE_SIZE = 16

const AllDeals = ({ page }: { page: number }) => {
    const { token, isAuthenticated } = useAuth()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['deals', page, isAuthenticated ? token : null],
        queryFn: () => DealsApi.getDeals({ page, pageSize: PAGE_SIZE, token: isAuthenticated ? token : undefined }),
        refetchOnWindowFocus: false,
        staleTime: 0,
        retry: false,

    })

    const mapData = (data: any) => ({
        id: data.id,
        imageSrc: data.image,
        title: data.name,
        rating: '0',
        location: data.location,
        discount: data.discountPCT.toString(),
        showBadge: data.discountPCT > 0,
        originalPrice: data.originalPrice,
        farePrice: data.farePrice,
    })
    return (
        <Wrapper>
            <TopCarousel type="deal" title='All Deals' />
            <div className='px-4 md:px-8 lg:px-10'>

                <DataStateHandler
                    isEmpty={data?.count === 0}
                    isLoading={isLoading}
                    loadingComponent={<ShimmerCardGrid count={PAGE_SIZE} />}
                    emptyComponent={<EmptyState className='h-[80vh]' message={`No Cities Data Found`} />}
                >
                    <div style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(295px, 1fr))' }} className='grid gap-x-6 gap-y-8 pb-12'>
                        {data?.results.map((deal) => (
                            <Card key={deal.id} card={mapData(deal)} className='w-full' type={deal.type} />
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

export default AllDeals
