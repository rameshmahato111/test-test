
import BookingDetailContent from '@/components/BookingDetails/BookingDetailContent';

import Wrapper from '@/components/Wrapper';
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Booking Detail | Exploreden',
    description: 'Booking Detail | Exploreden',
    keywords: ['Booking Detail', 'Exploreden', 'Booking Detail', 'Exploreden Booking Detail'],
}


const page = async ({ searchParams }: { searchParams: Promise<{ type: string }> }) => {
    const { type } = await searchParams;
    return (
        <Wrapper>
            <BookingDetailContent type={type} />
        </Wrapper>
    )
}

export default page

