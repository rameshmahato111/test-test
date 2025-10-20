import React from 'react'
import Wrapper from '../Wrapper'
import TopCarousel from './TopCarousel'
import { citiesApi } from '@/services/api/cities';
import CityCard from '../City/CityCard';
import CustomPagination from '../CustomPagination';
import DataStateHandler from '../StateHandlers/DataStateHandler';
import ShimmerCardGrid from '../shimmers/ShimmerCardGrid';
import EmptyState from '../StateHandlers/EmptyState';
const PAGE_SIZE = 40

const AllCitites = async ({ page }: { page: number }) => {
    const data = await citiesApi.getAllCities(PAGE_SIZE, page)
    return (
        <Wrapper>
            <TopCarousel type="city" title='Cities' />
            <div className='px-4 md:px-8 lg:px-10'>

                <DataStateHandler
                    isEmpty={data?.count === 0}
                    loadingComponent={<ShimmerCardGrid count={PAGE_SIZE} />}
                    emptyComponent={<EmptyState className='h-[80vh]' message={`No Cities Data Found`} />}
                >

                    <div
                        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))' }}
                        className='grid  gap-x-6 gap-y-8 pb-12'>
                        {data?.results.map((city) => (
                            <CityCard className='w-full' key={city.id} cityCard={city} />
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

export default AllCitites
