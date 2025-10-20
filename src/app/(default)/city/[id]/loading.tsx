import React from 'react'
import Wrapper from '@/components/Wrapper'
import ShimmerText from '@/components/shimmers/ShimmerText'
import ShimmerContainer from '@/components/shimmers/ShimmerContainer'
import ShimmerCardGrid from '@/components/shimmers/ShimmerCardGrid'

const Loading = () => {
    return (
        <Wrapper>
            {/* Hero Image Shimmer */}
            <ShimmerContainer width='100%' height='400px' className='mb-8' />

            {/* Categories Section */}
            <div className='px-4 md:px-8 lg:px-10'>
                <div className='mb-10'>
                    <ShimmerText className='h-8 w-48 mb-6' />
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {Array(4).fill(null).map((_, index) => (
                            <ShimmerContainer key={index} width='100%' height='120px' className='rounded-lg' />
                        ))}
                    </div>
                </div>

                {/* Deals Section */}
                <div className='mb-10'>
                    <ShimmerText className='h-8 w-48 mb-6' />
                    <ShimmerCardGrid count={4} />
                </div>

                {/* Trip Planner Banner */}
                <ShimmerContainer width='100%' height='200px' className='rounded-lg mb-10' />

                {/* Recommended Section */}
                <div className='mb-10'>
                    <ShimmerText className='h-8 w-48 mb-6' />
                    <ShimmerCardGrid count={4} />
                </div>

                {/* Category Tags */}
                <div className='flex gap-2 flex-wrap mb-6'>
                    {Array(6).fill(null).map((_, index) => (
                        <ShimmerContainer key={index} width='100px' height='32px' className='rounded-full' />
                    ))}
                </div>
            </div>
        </Wrapper>
    )
}

export default Loading 