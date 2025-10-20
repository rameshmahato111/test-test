import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MenuSection from './MenuSection'
import { supportSettingsConfig } from '@/configs/settings-menu'
import { userSettingsConfig } from '@/configs/settings-menu'
import UserStatus from './UserStatus'

const SideBar = () => {
    return (
        <div className='hidden md:block  md:max-w-[300px] md:min-w-[300px] xl:max-w-[400px] w-full rounded-xl shadow-cardShadow'>
            <div className='bg-blue-100 text-background rounded-t-xl flex items-end justify-between px-4 h-[160px]'>
                <div className="h-full flex flex-col justify-center">

                    <UserStatus />
                    {/* <Link href='' className='text-xs bg-blue-200 text-center font-inter rounded-md px-2 py-2 font-medium text-background'>
                        Learn more
                    </Link> */}
                </div>
                <div className='relative w-[40%] h-[128px]'>
                    <Image
                        src='/illustrations/explorer.png'
                        className='object-contain'
                        alt='profile bg'
                        sizes='100%'
                        fill
                    />
                </div>
            </div>

            <div className='rounded-b-xl bg-background border-l border-r border-b border-gray-color-200 py-6 px-3'>
                <MenuSection
                    title={userSettingsConfig.title}
                    items={userSettingsConfig.items}
                />
                <MenuSection
                    title={supportSettingsConfig.title}
                    items={supportSettingsConfig.items}
                />
            </div>
        </div>
    )
}

export default SideBar
