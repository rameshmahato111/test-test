import React from 'react'
import Wrapper from '@/components/Wrapper'
import ShimmerText from '@/components/shimmers/ShimmerText'

const Loading = () => {
    // Create an array of 12 items for the shimmer grid
    const shimmerItems = Array.from({ length: 12 }, (_, i) => i)

    return (
        <Wrapper>
            <div className='px-4 md:px-8 lg:px-10 pt-8 md:pt-16'>
                {/* Title shimmer */}
                <ShimmerText className='h-8 w-[200px] rounded-lg mb-6 animate-pulse' />

                {/* Grid of shimmer blocks */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {shimmerItems.map((index) => (
                        <div
                            key={index}
                            className='aspect-square rounded-lg overflow-hidden'
                        >
                            <div className='w-full h-full bg-primary-50 animate-pulse relative overflow-hidden'>
                                <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Wrapper>
    )
}

export default Loading
