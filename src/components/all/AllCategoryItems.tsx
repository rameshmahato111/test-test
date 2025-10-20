'use client';
import React, { useState } from 'react'
import TopCarousel from './TopCarousel'
import Card from '../Cards/Card'
import { useQuery } from '@tanstack/react-query';
import { citiesApi } from '@/services/api';
import DataStateHandler from '../StateHandlers/DataStateHandler';
import EmptyState from '../StateHandlers/EmptyState';
import ShimmerCardGrid from '../shimmers/ShimmerCardGrid';
import ErrorState from '../StateHandlers/ErrorState';
import Wrapper from '../Wrapper';
import CustomPagination from '../CustomPagination';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Categories from '../CategoriesSection/Categories';
import AllCategories from './AllCategories';
import { Input } from '../ui/input';
import { X } from 'lucide-react';

const PAGE_SIZE = 16;

const AllCategoryItems = ({ id, }: { id: number, }) => {
    const searchParams = useSearchParams();
    const { token } = useAuth();
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const page = searchParams.get('page') || '1';
    const category = searchParams.get('category') || '';
    const city = searchParams.get('city') || '';

    const handleSearch = () => {
        setSearchTerm(search);
    };

    const handleClearSearch = () => {
        setSearch('');
        setSearchTerm('');
    };

    const { data, isLoading, error, isFetched } = useQuery({
        queryKey: ['allCategoriesItems', id, page, token, searchTerm, city],
        queryFn: () => citiesApi.getCategoryActivities({ category_id: id, page: parseInt(page), page_size: PAGE_SIZE, city: city }, token),
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })

    return (
        <Wrapper>
            <TopCarousel type='category' title={category || 'All Categories'} />
            <div className='px-4 md:px-8 lg:px-10'>

                <AllCategories selectedCategory={category} city={city} />
                {/* <div className='flex items-center justify-end gap-2 mb-4 md:mb-8 '>
                    <div className='relative'>
                        <Input
                            type="text"
                            placeholder='Search'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className='w-[300px] focus-visible:ring-primary-100 focus-visible:ring-0 border-2  border-gray-600 focus-visible:border-primary-100'
                        />
                        {search && <X onClick={handleClearSearch} className='w-4 h-4 cursor-pointer absolute right-2 top-1/2 -translate-y-1/2' />}
                    </div>
                    <button onClick={handleSearch} className='bg-primary-400 text-white px-4 py-2 rounded-md'>Search</button>
                </div> */}
                <DataStateHandler
                    isLoading={data === undefined || isLoading}
                    error={error}
                    isEmpty={data?.count === 0 || data?.results.length === 0}
                    errorComponent={<ErrorState message={error?.message || 'Unable to get activities'} />}
                    loadingComponent={<ShimmerCardGrid count={10} />}
                    emptyComponent={<EmptyState message='No activities found' />}
                >
                    <div

                        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 pb-12 ${isFetched ? 'opacity-100' : 'opacity-0'}`}>
                        {data && data.results.map((card) => (
                            <Card type={card.type} className='w-full' key={card.id} card={{
                                id: card.id,
                                title: card.name,
                                imageSrc: card.image,
                                location: card.location,
                                currency: card.currency,
                                originalPrice: card.originalPrice || '0',
                                farePrice: card.farePrice || '0',
                            }} />
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

export default AllCategoryItems
