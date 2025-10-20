import React from 'react'
import Wrapper from '@/components/Wrapper'
import ShimmerText from '@/components/shimmers/ShimmerText'
import ShimmerContainer from '@/components/shimmers/ShimmerContainer'
import ShimmerCardGrid from '@/components/shimmers/ShimmerCardGrid'

const Loading = () => {
    return (
        <Wrapper>
            <div className='px-4 md:px-8 lg:px-10 pt-8'>
                {/* Search Filters Shimmer */}
                <div className='flex gap-4 mb-8'>
                    <ShimmerContainer width='200px' height='40px' className='rounded-lg' />
                    <ShimmerContainer width='150px' height='40px' className='rounded-lg' />
                    <ShimmerContainer width='180px' height='40px' className='rounded-lg' />
                </div>

                {/* Results Count Shimmer */}
                <ShimmerText className='h-6 w-48 mb-6' />

                {/* Results Grid */}
                <div className='grid gap-6'>
                    {Array(5).fill(null).map((_, index) => (
                        <ShimmerContainer key={index} width='100%' height='200px' className='rounded-lg' />
                    ))}
                </div>
            </div>
        </Wrapper>
    )
}

export default Loading 