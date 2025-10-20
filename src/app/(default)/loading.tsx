import React from 'react'
import Wrapper from '@/components/Wrapper'
import ShimmerText from '@/components/shimmers/ShimmerText'
import ShimmerContainer from '@/components/shimmers/ShimmerContainer'
import ShimmerCardGrid from '@/components/shimmers/ShimmerCardGrid'

const Loading = () => {
    return (
        <Wrapper>
            {/* Announcement Shimmer */}
            <ShimmerContainer width='100%' height='50px' className='mb-4' />

            {/* Hero Section Shimmer */}
            <div className='px-4 md:px-8 lg:px-10'>
                <ShimmerContainer width='100%' height='500px' className='rounded-2xl mb-10' />
            </div>

            {/* Categories Section */}
            <div className='px-4 md:px-8 lg:px-10 mb-10'>
                <ShimmerText className='h-8 w-48 mb-6' />
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {Array(8).fill(null).map((_, index) => (
                        <ShimmerContainer key={index} width='100%' height='120px' className='rounded-lg' />
                    ))}
                </div>
            </div>

            {/* Trending Section */}
            <div className='px-4 md:px-8 lg:px-10 mb-10'>
                <ShimmerText className='h-8 w-48 mb-6' />
                <ShimmerCardGrid count={4} />
            </div>

            {/* Deals Section */}
            <div className='px-4 md:px-8 lg:px-10 mb-10'>
                <ShimmerText className='h-8 w-48 mb-6' />
                <ShimmerCardGrid count={4} />
            </div>

            {/* Trip Planner Banner */}
            <div className='px-4 md:px-8 lg:px-10 mb-10'>
                <ShimmerContainer width='100%' height='200px' className='rounded-lg' />
            </div>

            {/* Tour Packages Section */}
            <div className='px-4 md:px-8 lg:px-10 mb-10'>
                <ShimmerText className='h-8 w-48 mb-6' />
                <ShimmerCardGrid count={4} />
            </div>

            {/* Cities Section */}
            <div className='px-4 md:px-8 lg:px-10 mb-10'>
                <ShimmerText className='h-8 w-48 mb-6' />
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {Array(4).fill(null).map((_, index) => (
                        <ShimmerContainer key={index} width='100%' height='200px' className='rounded-lg' />
                    ))}
                </div>
            </div>

            {/* Benefits Section */}
            <div className='px-4 md:px-8 lg:px-10 mb-10'>
                <ShimmerText className='h-8 w-48 mb-6' />
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {Array(3).fill(null).map((_, index) => (
                        <ShimmerContainer key={index} width='100%' height='150px' className='rounded-lg' />
                    ))}
                </div>
            </div>

            {/* Download Banner */}
            <div className='px-4 md:px-8 lg:px-10'>
                <ShimmerContainer width='100%' height='200px' className='rounded-lg' />
            </div>
        </Wrapper>
    )
}

export default Loading 