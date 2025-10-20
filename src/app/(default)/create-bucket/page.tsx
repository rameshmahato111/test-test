import CreateBucket from '@/components/TravelHub/CreateBucket';
import Wrapper from '@/components/Wrapper';
import React from 'react'
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Bucket | Exploreden',
    description: 'Create Bucket | Exploreden',
    keywords: ['Create Bucket', 'Exploreden', 'Create Bucket', 'Exploreden Create Bucket'],
}
const page = async ({ searchParams }: { searchParams: Promise<{ bucketName: string, bucketId: string }> }) => {
    const { bucketName, bucketId } = await searchParams;
    if (!bucketName || !bucketId) {
        return notFound()
    }

    return (
        <Wrapper className='px-4 md:px-8 py-4 md:py-8'>
            <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold text-foreground capitalize'>Add items to {bucketName}</h1>
            <CreateBucket bucketId={bucketId} bucketName={bucketName} />
        </Wrapper>
    )
}

export default page
