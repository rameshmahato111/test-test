'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import AvailabilityCheck from './AvailabilityCheck'
import ActivityAvailabilityContent from './ActivityAvailabilityContent';
import HotelAvailabilityContent from './HotelAvailabilityContent';

import { useSearchDetail } from '@/contexts/SearchDetailContext';
import { detailAdapters } from '@/adapters/detailAdapters';
import { stringArrayToArray } from '@/utils';


interface AvailabilityWrapperProps {
    className?: string;
    id: string;
    position: 'sidebar' | 'main';

}

const AvailabilityWrapper = ({ className, position, id }: AvailabilityWrapperProps) => {

    const searchParams = useSearchParams();
    const { getDetail } = useSearchDetail();

    const type = searchParams.get('type') as 'hotel' | 'activity';
    const cachedData = getDetail(type, id);
    const data = detailAdapters[type](cachedData);
    const [showAvailability, setShowAvailability] = useState(false);


    const contentRef = useRef<HTMLDivElement>(null);

    // const showAvailability = searchParams.get('availability') === 'true';

    // const handleShowAvailability = () => {
    //     const newUrl = new URL(window.location.href);
    //     newUrl.searchParams.set('availability', 'true');
    //     window.history.pushState({}, '', newUrl.toString());
    // };



    useEffect(() => {
        if (showAvailability && position === 'main') {
            contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showAvailability, position]);

    return (
        <div ref={contentRef}>
            <AvailabilityCheck
                id={id}
                startDate={data.checkInDate ? new Date(data.checkInDate) : new Date()}
                endDate={data.checkOutDate ? new Date(data.checkOutDate) : new Date(new Date().setDate(new Date().getDate() + 10))}
                peopleInitialData={{
                    Adults: Number(data.noOfAdults) || 1,
                    Children: Number(data.noOfChildren) || 0,
                    childrenAges: data.agesOfChildren || [],
                    noOfRooms: Number(data.noOfRooms) || 1,
                }}
                originalPrice={data.originalPrice}
                farePrice={data.farePrice}
                type={type}
                className={className}
                price={data.price?.amount.toString() || '0'}
                currency={data.currency || ''}
                onShowAvailabilityContent={() => setShowAvailability(true)}
                showAvailabilityContent={showAvailability}
                paxes={data.paxes || [25]}
            />

            {showAvailability && position === 'main' && (
                type === 'hotel' ? (
                    <HotelAvailabilityContent
                        hotelId={id}
                    />
                ) : (
                    <ActivityAvailabilityContent
                        activityId={id}
                    />
                )
            )}
        </div>
    )
}

export default AvailabilityWrapper 