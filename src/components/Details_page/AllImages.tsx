'use client';
import { detailAdapters } from '@/adapters/detailAdapters';
import { useSearchDetail } from '@/contexts/SearchDetailContext';
import { useRouter } from 'next/navigation';
import React from 'react'

type ValidTypes = 'hotel' | 'activity';
const AllImages = ({ id, type }: { id: string, type: ValidTypes }) => {
    // console.log(id, type);

    let allImages: { url: string, label: string }[] = [];

    const router = useRouter();
    const { getDetail } = useSearchDetail();
    const cachedData = getDetail(type as ValidTypes, id);
    // console.log(cachedData);
    if (!cachedData) {
        router.back();
    } else {

        const data = detailAdapters[type](cachedData);

        allImages = data.images;
    }



    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>

            {allImages.map((image, index) => (
                <div key={index} className='aspect-square overflow-hidden rounded-lg'>
                    <img
                        src={image.url}
                        alt={image.label}
                        className='w-full h-full object-cover'
                    />
                </div>
            ))}
        </div>
    )
}

export default AllImages
