import React from 'react'
import Wrapper from '@/components/Wrapper'
import ShimmerText from '@/components/shimmers/ShimmerText'
import ShimmerContainer from '@/components/shimmers/ShimmerContainer'
import ShimmerCardGrid from '@/components/shimmers/ShimmerCardGrid'

const Loading = () => {
    return (
        <Wrapper>
            {/* Hero Section */}
            <ShimmerContainer width='100%' height='300px' className='mb-8' />

            <div className='px-4 md:px-8 lg:px-10'>
                {/* Filters Section */}
                <div className='mb-8'>
                    <div className='flex gap-4 flex-wrap'>
                        {Array(4).fill(null).map((_, index) => (
                            <ShimmerContainer key={index} width='120px' height='40px' className='rounded-lg' />
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <ShimmerText className='h-6 w-48 mb-6' />

                {/* Cards Grid */}
                <ShimmerCardGrid count={16} />

                {/* Pagination */}
                <div className='flex justify-center gap-2 mt-8'>
                    {Array(5).fill(null).map((_, index) => (
                        <ShimmerContainer key={index} width='40px' height='40px' className='rounded-lg' />
                    ))}
                </div>
            </div>
        </Wrapper>
    )
}

export default Loading 