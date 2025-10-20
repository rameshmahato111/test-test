import { DOWNLOAD_APP_IMAGES } from '@/data/staticData'
import React from 'react'
import Image from 'next/image'
import DownloadImage from '../../../public/images/download.png'
import { Zap } from 'lucide-react'

const DownloadBanner = () => {
    return (
        <div className='relative pl-4 md:pl-8 lg:pl-10 bg-gradient-to-r from-primary-300 to-primary-400 my-10 h-[360px] overflow-hidden text-background flex justify-between items-center'>


            <div className='flex w-full sm:w-[40%] flex-col items-start justify-start relative z-10'>


                <h2 className='text-2xl md:text-3xl lg:text-4xl font-semibold text-background pb-6 animate-slide-in-left' style={{ animationDelay: '200ms' }}>
                    Your Next Adventure Awaits – Download Our App!
                </h2>

                {/* Feature highlights */}
                <div className="flex flex-col gap-2 mb-6 animate-slide-in-left" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-yellow-300" />
                        <span>Lightning fast booking</span>
                    </div>

                </div>

                <div className='w-full flex justify-start gap-4 animate-slide-in-left' style={{ animationDelay: '600ms' }}>
                    {DOWNLOAD_APP_IMAGES.map((image, index) => (
                        <a
                            href={image.href}
                            target='_blank'
                            rel="noopener noreferrer"
                            key={image.id}
                            className="group relative transform transition-all duration-500 hover:scale-110 hover:-translate-y-2"
                            style={{
                                animationDelay: `${800 + index * 150}ms`,
                                animation: 'slideInUp 0.8s ease-out forwards'
                            }}
                        >
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-white/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-lg transform scale-110"></div>

                            <div className="relative z-10 transform transition-all duration-300 group-hover:rotate-3">
                                <img
                                    src={image.src}
                                    alt="Download app"
                                    className='object-contain transition-all duration-300 group-hover:brightness-110 filter drop-shadow-lg'
                                />
                            </div>

                            {/* Ripple effect */}
                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:animate-ping bg-white/20"></div>
                        </a>
                    ))}
                </div>


            </div>

            {/* Enhanced image section */}
            <div className='hidden sm:w-[60%] sm:flex justify-end h-full relative'>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary-300/50 z-10"></div>
                <Image
                    src={DownloadImage}
                    alt="Download app"
                    className='object-fill h-full w-auto scale-105 transform transition-all duration-700  '
                />

                {/* Floating elements */}
                <div className="absolute top-20 right-20 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-32 right-32 w-6 h-6 bg-yellow-300/50 rounded-full animate-bounce"></div>
            </div>
        </div>
    )
}

export default DownloadBanner
