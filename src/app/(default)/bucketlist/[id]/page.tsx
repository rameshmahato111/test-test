import BucketContent from '@/components/TravelHub/BucketContent';
import Wrapper from '@/components/Wrapper';
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bucketlist | Exploreden',
    description: 'Bucketlist | Exploreden',
    keywords: ['Bucketlist', 'Exploreden', 'Bucketlist', 'Exploreden Bucketlist'],
}


const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    return (
        <Wrapper>
            <BucketContent bucketId={parseInt(id)} />
        </Wrapper>
    )
}

export default page
