import React from 'react'
import Wrapper from '@/components/Wrapper'
import HeroSearch from '@/components/HeroSection/HeroSearch'
import SearchContent from '@/components/search/SearchContent'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Search Travel Destinations & Experiences - Exploreden',
    description: 'Search and discover amazing travel destinations, experiences, and deals worldwide. Find the perfect trip, compare prices, and book your next adventure with Exploreden.',
    keywords: [
        'travel search',
        'destination search',
        'travel experiences',
        'vacation search',
        'trip finder',
        'travel deals',
        'destination finder',
        'holiday search',
        'adventure search',
        'travel booking search'
    ],

    alternates: {
        canonical: 'https://exploreden.com.au/search',
    },
}

const Page = async ({ searchParams }: { searchParams: Promise<{ tab: string }> }) => {
    const params = await searchParams;
    const currentTab = params?.tab;

    return (
        <>
            <Wrapper>
                <div className='relative z-40'>
                    <div className='h-[133px] bg-primary-400' />
                    <div className={`translate-y-[-100px]`}>
                        <HeroSearch />
                    </div>
                </div>
                <div className='z-10 mt-10'>
                    <SearchContent tab={currentTab} />
                </div>
            </Wrapper>
        </>
    )
}

export default Page
