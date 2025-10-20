import React from 'react'
import SideBar from '@/components/settings/SideBar'
import Wrapper from '@/components/Wrapper'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Settings | Exploreden",
    description: "Manage your account settings and preferences.",
    alternates: {
        canonical: "https://exploreden.com.au/settings",
    },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Wrapper className='flex  items-start px-4 md:px-8 lg:px-10 gap-6 my-20'>
            <SideBar />
            <div className='w-full flex-1 px-2 md:px-4 lg:px-9 py-10 bg-background rounded-3xl border border-gray-color-200'>
                <React.Suspense fallback={<div>Loading...</div>}>
                    {children}
                </React.Suspense>
            </div>
        </Wrapper>
    )
}

export default Layout
