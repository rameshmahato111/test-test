'use client'
import React from 'react'
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'
import Image from 'next/image'

const RewardsPage = () => {
    const credits = 20
    const maxCredits = 240

    return (
        <div className="space-y-6">
            <h2 className='text-2xl font-inter text-foreground font-semibold'>Your Current Credits</h2>

            <div className="relative w-44 h-44 mx-auto">
                {/* Circular progress container */}
                <div className="w-full h-full rounded-full bg-primary-100 relative">
                    {/* Progress arc */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `conic-gradient(#FF4083 ${(credits / maxCredits) * 360}deg, transparent 0deg)`,
                            borderRadius: '100%'
                        }}
                    />
                    {/* Inner white circle */}
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center flex-col">
                        <span className="text-4xl font-semibold font-inter text-gray-800">{credits}</span>
                        <span className="text-gray-800 text-sm ">credits</span>
                    </div>

                </div>
            </div>
            <p className='text-gray-800 text-sm text-center'>consectetur adipisicing elit. Maxime harum recusandae hic tempore minima soluta!</p>

            <div>
                <div className='bg-blue-100 text-background rounded-t-xl flex items-end justify-between px-4 h-[160px]'>
                    <div className="h-full flex flex-col justify-center">
                        <p className='text-xs text-gray-10 font-inter pb-1'>You are a</p>
                        <h2 className='text-3xl font-semibold font-inter text-background pb-4'>Explorer</h2>
                        <Link href='/' className='text-xs bg-blue-200 text-center font-inter rounded-md px-2 py-2 font-medium text-background'>
                            Learn more
                        </Link>
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
            </div>


        </div>
    )
}

export default RewardsPage
