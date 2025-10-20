import React from 'react'
import Link from 'next/link';
import { BucketListResponse } from '@/schemas/wishlist';

const BucketCard = ({ card, className }: { card: BucketListResponse, className?: string }) => {
    const { cover_image, name, item_count, id } = card;
    return (
        <Link prefetch={false} href={`/bucketlist/${id}`} className='h-full'>
            <div className={`bg-background hover:-translate-y-2 my-2 h-full transition-all duration-300 rounded-lg cursor-pointer shadow-cardShadow overflow-hidden relative w-[295px] ${className}`} >
                <div className='relative h-[188px]'>
                    <img src={cover_image || '/images/bucket-image.png'} alt="card" className='w-full h-full object-contain' />
                </div>

                <div className='py-6 px-3'>
                    <h2 className='line-clamp-2 text-xl font-semibold text-gray-800'>{name}</h2>
                    <p className='text-sm font-normal text-gray-600 pt-2'>{item_count} items</p>
                </div>
            </div>
        </Link>
    )
}

export default BucketCard
