import Link from 'next/link'
import React from 'react'
import Wrapper from '@/components/Wrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Page Not Found - Exploreden',
    description: 'The page you are looking for could not be found. Return to Exploreden homepage to continue exploring amazing travel destinations and experiences.',
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: 'Page Not Found - Exploreden',
        description: 'The page you are looking for could not be found. Return to explore amazing travel destinations.',
        url: 'https://exploreden.com.au/404',
    },
}

const NotFound = () => {
    return (
        <Wrapper>
            <div className='min-h-[80vh] flex flex-col items-center justify-center px-4 md:px-8 lg:px-10'>
                <div className='text-center'>
                    <h1 className='text-6xl font-bold text-primary-600 mb-4'>404</h1>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Page Not Found</h2>
                    <p className='text-gray-600 mb-8'>
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                    <Link
                        href='/'
                        className='inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors'
                    >
                        Go Back Home
                    </Link>
                </div>

                {/* Optional: Add some visual elements */}
                <div className='mt-12 text-gray-400 text-9xl font-bold opacity-10 select-none'>
                    404
                </div>
            </div>
        </Wrapper>
    )
}

export default NotFound 