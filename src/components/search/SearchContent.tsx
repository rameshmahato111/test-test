
import React from 'react'
import { Tabs } from '@/types/enums';
import ActivitySection from './Activity/ActivitySection';
import HotelSection from './Hotel/HotelSection';
import Link from 'next/link';

const SearchContent = ({ tab }: { tab: string }) => {
    const currentTab = tab;

    if (currentTab === Tabs.Activities) {
        return (
            <ActivitySection />
        );
    }
    else if (currentTab === Tabs.Hotel) {
        return (
            <HotelSection />
        );
    } else {
        return (
            <div className='flex flex-col items-center justify-center h-[60vh]'>
                <h1 className='text-2xl font-bold mb-4'>You have wrong tab</h1>
                <p className='mb-4 text-lg text-center text-gray-500'>Please change the search params and try again</p>
                <Link href="/" prefetch={false} className='text-primary-400 underline'>Go back to home</Link>
            </div>
        );
    }
}

export default SearchContent;


