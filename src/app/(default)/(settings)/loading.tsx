import React from 'react'
import Wrapper from '@/components/Wrapper'
import ShimmerText from '@/components/shimmers/ShimmerText'
import ShimmerContainer from '@/components/shimmers/ShimmerContainer'

const Loading = () => {
    return (
        <Wrapper>
            <div className='px-4 md:px-8 lg:px-10 py-8'>
                <div className='max-w-4xl mx-auto'>
                    {/* Header Section */}
                    <div className='mb-8'>
                        <ShimmerText className='h-8 w-48 mb-4' />
                        <ShimmerText className='h-4 w-96' />
                    </div>

                    {/* Settings Navigation */}
                    <div className='flex gap-4 mb-8 overflow-x-auto pb-2'>
                        {Array(5).fill(null).map((_, index) => (
                            <ShimmerContainer
                                key={index}
                                width='120px'
                                height='40px'
                                className='rounded-lg shrink-0'
                            />
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className='bg-white rounded-lg p-6 shadow-sm'>
                        {/* Form Fields */}
                        <div className='space-y-6'>
                            {/* Profile Section */}
                            <div className='flex items-center gap-4 mb-8'>
                                <ShimmerContainer
                                    width='100px'
                                    height='100px'
                                    className='rounded-full shrink-0'
                                />
                                <div className='flex-1'>
                                    <ShimmerText className='h-6 w-48 mb-2' />
                                    <ShimmerText className='h-4 w-72' />
                                </div>
                            </div>

                            {/* Form Fields */}
                            {Array(6).fill(null).map((_, index) => (
                                <div key={index} className='space-y-2'>
                                    <ShimmerText className='h-4 w-32' />
                                    <ShimmerContainer
                                        width='100%'
                                        height='48px'
                                        className='rounded-lg'
                                    />
                                </div>
                            ))}

                            {/* Action Buttons */}
                            <div className='flex gap-4 pt-4'>
                                <ShimmerContainer
                                    width='120px'
                                    height='48px'
                                    className='rounded-lg'
                                />
                                <ShimmerContainer
                                    width='120px'
                                    height='48px'
                                    className='rounded-lg'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Loading
