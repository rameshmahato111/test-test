

import PickInterets from '@/components/Auth/PickInterets';
import Wrapper from '@/components/Wrapper'
import { InterestService } from '@/services/api/interest';
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pick Interest | Exploreden',
    description: 'Pick Interest, Pick your interest and let us plan your trip',
    keywords: ['Pick Interest', 'Exploreden', 'Pick Interest', 'Exploreden Pick Interest'],
}

const page = async () => {
    const choices = await InterestService.getChoices();

    return (
        <Wrapper className='px-4 md:px-8 lg:px-10 min-h-screen flex justify-center items-center'>
            <div className='max-w-[700px] w-full'>
                <h1 className='text-3xl font-semibold text-foreground pb-5'>Tell us your travel preferences</h1>
                <p className='text-lg font-normal text-gray-800'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>
                <PickInterets choices={choices} />
            </div>
        </Wrapper>
    )
}

export default page
