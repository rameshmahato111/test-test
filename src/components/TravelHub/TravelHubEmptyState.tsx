import React from 'react'
import { Button } from '../ui/button'
import { EmptyStateProps } from '@/types'
import Link from 'next/link'




const TravelHubEmptyState = ({ emptyState }: { emptyState: EmptyStateProps }) => {
    const { title, description, image, buttonText, showButton = true } = emptyState
    return (
        <div className='max-w-[370px] mx-auto text-center py-10'>
            <img src={image} alt="empty state" className='w-full h-full' />
            <h4 className='text-2xl font-semibold text-foreground font-inter pt-8'>{title}</h4>
            <p className='text-sm font-normal text-gray-700  pt-3 pb-5'>{description}</p>
            {showButton && <Button className='bg-primary-400 text-background hover:bg-primary-500 font-semibold text-base duration-300 px-4'>
                <Link href={buttonText === 'Explore Now' ? '/' : ''}>{buttonText}</Link>
            </Button>}
        </div>
    )
}

export default TravelHubEmptyState
