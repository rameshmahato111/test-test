import React, { useMemo, useEffect } from 'react'
import SortBy from '../SortBy'
import HotelResultCard from '@/components/Cards/HotelResultCard'
import FilterDrawer from '../FilterDrawer'
import DrawerContent from './DrawerContent'
import { useRouter, useSearchParams } from 'next/navigation'
import CustomPagination from '@/components/CustomPagination'
import { useSearchDetail } from '@/contexts/SearchDetailContext'
import { DataWithCount } from '@/types'
import { cn } from '@/lib/utils'
import { HotelResult as HotelResultSchema } from '@/schemas/hotel'

interface HotelResultProps {
    data: DataWithCount<HotelResultSchema>;
    isFetching?: boolean;
}

const HotelResult = ({ data, isFetching }: HotelResultProps) => {
    const params = useSearchParams();
    const router = useRouter();
    const { setHotelDetail } = useSearchDetail();

    const totalPages = useMemo(() =>
        data?.count ? Math.ceil(data.count / 10) : 1,
        [data?.count]);


    return (
        <div className='flex-1'>
            <div className='flex mb-6 lg:hidden items-center gap-2 md:gap-4'>
                <FilterDrawer type='hotel' className='text-center' Content={<DrawerContent exchangeRate={data.results[0].exchangeRate ?? 1} />} />
            </div>
            <div className='flex items-center justify-between pb-6 md:pb-10'>
                <h1 className={cn(
                    'text-lg lg:text-xl xl:text-2xl font-semibold text-foreground',
                    isFetching && 'opacity-70'
                )}>
                    {data?.count || 0} Results {params?.get('hotel_query') ? `for "${params.get('hotel_query')}"` : ''}
                </h1>

            </div>

            <div className={cn(
                'flex flex-col gap-6 items-start pb-10',
                isFetching && 'opacity-70'
            )}>
                {data.results?.map((hotel) => (
                    <HotelResultCard
                        key={hotel.id}
                        card={hotel}
                        onClick={() => {
                            setHotelDetail({ ...hotel, request_id: data.request_id });
                            router.push(`/detail/${hotel.id}/?type=hotel`);
                        }}
                    />
                ))}
            </div>

            {data?.count > 10 && (
                <CustomPagination
                    totalPages={totalPages}

                />
            )}
        </div>
    )
}

export default React.memo(HotelResult);
