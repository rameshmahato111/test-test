'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import FlightSearch from './FlightSearch'
import HotelSearch from './HotelSearch'
import ActivitiesSearch from './ActivitiesSearch'
import { Tabs } from '@/types/enums'
import { useSearch } from '@/hooks/useSearch'
import { ActivityIcon, PlaneIcon } from 'lucide-react'
import { HotelIcon } from 'lucide-react'
import { usePathname } from 'next/navigation';

const HeroSearch = () => {
    const { getSearchParams } = useSearch();
    const pathname = usePathname();
    const searchParams = getSearchParams();

    const isSearchPage = pathname === '/search';
    const initialTab = searchParams?.tab as Tabs || Tabs.Hotel;

    const [activeTab, setActiveTab] = useState<Tabs>(
        isSearchPage && initialTab === Tabs.Flight ? Tabs.Hotel : initialTab
    );
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Remove Flight tab by commenting out, do not delete
    const tabsToShow = isSearchPage
        ? [Tabs.Hotel, Tabs.Activities]
        : [Tabs.Hotel, Tabs.Activities /*, Tabs.Flight */];

    const handleTabChange = (newTab: Tabs) => {
        if (newTab === activeTab) return;

        setIsTransitioning(true);

        // Start exit animation
        setTimeout(() => {
            setActiveTab(newTab);
            // Start enter animation after tab change
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 150);
    };

    const renderTabContent = () => {
        const baseClasses = `transition-all duration-300 ease-in-out ${isTransitioning
            ? 'opacity-0 transform translate-y-2 scale-[0.98]'
            : 'opacity-100 transform translate-y-0 scale-100'
            }`;

        switch (activeTab) {
            case Tabs.Flight:
                return (
                    <div className={baseClasses}>
                        <FlightSearch />
                    </div>
                )
            case Tabs.Hotel:
                return (
                    <div className={baseClasses}>
                        <HotelSearch />
                    </div>
                )
            case Tabs.Activities:
                return (
                    <div className={baseClasses}>
                        <ActivitiesSearch />
                    </div>
                )
            default:
                return null
        }
    }

    const ICONS = {
        [Tabs.Hotel]: <HotelIcon className='w-2 h-2' />,
        [Tabs.Activities]: <ActivityIcon className='w-2 h-2' />,
        [Tabs.Flight]: <PlaneIcon className='w-2 h-2' />,
    }

    return (
        <>
            <div className={`bg-background w-[95%] lg:w-[98%] mx-auto max-w-[1240px] relative py-2  shadow-cardShadow rounded-lg px-4 `}>
                <div className='flex gap-3   justify-center border-b border-gray-200'>
                    {tabsToShow.map((tab) => (
                        <Button
                            key={tab}
                            variant='ghost'
                            className={`pb-3 flex items-center gap-2 capitalize rounded-none transition-all duration-300 ease-in-out ${activeTab === tab
                                ? 'border-b-2 border-primary-400 text-primary-400 transform scale-105'
                                : 'hover:text-primary-300 transform scale-100 hover:scale-102'
                                }`}
                            onClick={() => handleTabChange(tab)}
                        >
                            <span className={`transition-transform duration-200 ${activeTab === tab ? 'scale-110' : 'scale-100'}`}>
                                {ICONS[tab]}
                            </span>
                            {tab}
                        </Button>
                    ))}
                </div>
                {/* <div className=" relative z-50 overflow-hidden"> */}
                {renderTabContent()}
                {/* </div> */}
            </div>

        </>
    )
}

export default HeroSearch


