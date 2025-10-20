'use client';
import { useSearchParams } from "next/navigation";
import ActivitySearchFilters from "./ActivitySearchFilters";
import DataStateHandler from "@/components/StateHandlers/DataStateHandler";
import ErrorState from "@/components/StateHandlers/ErrorState";
import ActivitySearchResults from "./ActivitySearchResults";
import EmptyState from "@/components/StateHandlers/EmptyState";
import { Inbox } from "lucide-react";
import ShimmerCard from "@/components/shimmers/ShimmerCard";
import { useQuery } from "@tanstack/react-query";
import { ActivityApi } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
const ActivitySection = () => {
    const { token } = useAuth();
    const searchParams = useSearchParams();
    const { data, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['activity-search', searchParams.toString(), token],
        queryFn: () => ActivityApi.searchActivities({
            query: searchParams.get('query') || '',
            sort: searchParams.get('sort') || '',
            start_date: searchParams.get('start_date') || '',
            end_date: searchParams.get('end_date') || '',
            star: searchParams.get('star') || '',
            budget: searchParams.get('budget') || '',
            category: searchParams.get('category') || '',
            city: searchParams.get('city') || '',
            longitude: searchParams.get('longitude') || '',
            latitude: searchParams.get('latitude') || '',
            page: searchParams.get('page') || '1'
        }, token),
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    });

    return (
        <div className='px-4 md:px-8 lg:px-10 -translate-y-10'>
            <div className='flex md:items-center flex-col md:flex-row gap-6 justify-between pb-10 pt-12 md:pt-2'>
                <h1 className='text-lg lg:text-3xl font-semibold text-foreground'>
                    {searchParams.get('query') ? `Results for "${searchParams.get('query')}"` : 'All Results'}
                </h1>
                {/* <SortBy
                    className='block lg:hidden'
                    value={searchParams?.get('sort') || 'relevance'}
                    onChange={(value) => {
                        const newParams = new URLSearchParams(searchParams?.toString() || '');
                        newParams.set('sort', value);
                        router.push(`/search?${newParams.toString()}`);
                    }}
                /> */}
            </div>
            <div className='flex items-start lg:gap-8 xl:gap-16'>
                <ActivitySearchFilters
                />
                <DataStateHandler
                    error={queryError}
                    isLoading={queryLoading}
                    isEmpty={data?.count === 0}
                    emptyComponent={<EmptyState className='flex-1' message={'No results found. Change your search and try again'} icon={<Inbox className="w-12 h-12" />} />}
                    loadingComponent={<ActivitySearchResultLoading />}
                    errorComponent={<ErrorState className='flex-1' message={queryError?.message || 'Something went wrong. Try again later'} />}
                >
                    <ActivitySearchResults result={data} />
                </DataStateHandler>
            </div>
        </div>
    );
}
export default ActivitySection;


const ActivitySearchResultLoading = () => {
    return <div className='flex-1 grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <ShimmerCard key={index} className='w-full' />
        ))}
    </div>
}