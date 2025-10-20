import React from 'react'
import Link from 'next/link';


const MobileGallery = ({ images, id, type }: {
    images: { url: string, label: string }[],
    type: string,
    id: string,

}) => {
    return (
        <div className='block md:hidden'>
            <h4 className='text-xl  pb-4 text-foreground font-semibold'>Gallery</h4>
            <div className='grid grid-cols-3 grid-rows-2 gap-2'>
                {
                    images.map((image, index) => (
                        <div key={`${image.label}-${index}`} className='relative overflow-hidden'>
                            <img src={image.url} alt={image.label} className='w-full h-full object-cover rounded-[4px]' />
                        </div>
                    )).slice(0, 5)
                }
                <div className=''>
                    <Link href={`/detail/${id}/gallery/?type=${type}`} className='relative h-full w-full bg-gray-800 rounded-[4px] flex items-center justify-center'>
                        <span className='text-white text-xs'>View All</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MobileGallery
