import React from 'react'
import Wrapper from '@/components/Wrapper'
import ShimmerText from '@/components/shimmers/ShimmerText'
import ShimmerContainer from '@/components/shimmers/ShimmerContainer'
import { DUMMY_CARDS } from '@/data/staticData'
import TitleWithHorizontalCards from '@/components/TitleWithHorizontalCards'

const Loading = () => {
    return (
        <Wrapper>
            <div className='px-4 md:px-8 lg:px-10 pt-8 md:pt-16'>
                {/* Title Shimmer */}
                <ShimmerText className='h-14 w-[60%] mb-4' />

                {/* Rating Section Shimmer */}
                <div className='flex items-center gap-2 mb-8'>
                    <ShimmerContainer width='120px' height='24px' />
                    <ShimmerContainer width='80px' height='24px' />
                </div>

                {/* Gallery Shimmer */}
                <div className='grid md:grid-cols-4 gap-2 h-[445px] md:my-14 my-8'>
                    {/* Main large image */}
                    <div className='md:col-span-2 md:row-span-2'>
                        <ShimmerContainer width='100%' height='100%' className='rounded-[4px]' />
                    </div>
                    {/* Smaller images */}
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className='max-md:hidden h-full'>
                            <ShimmerContainer width='100%' height='100%' className='rounded-[4px]' />
                        </div>
                    ))}
                </div>

                {/* Details and Sidebar Section */}
                <div className='flex items-start justify-between gap-8 pb-14'>
                    {/* Details Section */}
                    <div className='flex-1'>
                        {/* Details Header */}
                        <div className='space-y-4 mb-8'>
                            <ShimmerText className='h-6 w-[40%]' />
                            <ShimmerText className='h-4 w-[80%]' />
                            <ShimmerText className='h-4 w-[70%]' />
                        </div>

                        {/* Amenities Section */}
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
                            {Array(6).fill(null).map((_, index) => (
                                <ShimmerText key={index} className='h-4 w-[80%]' />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Availability */}
                    <div className='hidden lg:block w-[380px]'>
                        <ShimmerContainer width='100%' height='400px' className='rounded-lg' />
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Loading 