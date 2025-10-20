import Link from 'next/link'
import React from 'react'

const Gallery = ({ images, id, totalImages, type }: {
    images: { url: string, label: string }[],
    type: string,
    id: string,
    totalImages: number
}) => {
    // https://photos.hotelbeds.com/giata/bigger/${image.path}
    return (
        <div className='grid md:grid-cols-4 gap-2 h-[445px] md:my-14 my-8'>
            {/* Main large image */}
            <div className='md:col-span-2 md:row-span-2 relative overflow-hidden'>
                <img
                    src={images[0].url}
                    alt={images[0].label}
                    className='w-full h-full object-cover rounded-[4px] object-center'
                />
            </div>

            {/* Smaller images */}
            {images.slice(1).map((image, index) => (
                <div key={index} className='relative max-md:hidden overflow-hidden'>
                    <img
                        src={image.url}
                        alt={image.label}
                        className='w-full h-full object-cover rounded-[4px]'
                    />
                </div>
            ))}

            {/* "View more" button */}
            {totalImages > 4 && <Link prefetch={false} href={`/detail/${id}/gallery/?type=${type}`} className='relative max-md:hidden bg-gray-800 rounded-[4px] flex items-center justify-center'>
                <button aria-label="View more" aria-describedby="view-more-description" className='text-white font-semibold'>
                    View {totalImages - 4}+ More
                </button>
            </Link>}
        </div>
    )
}

export default Gallery
