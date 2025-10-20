import { DOWNLOAD_APP_IMAGES } from '@/data/staticData'
import Image from 'next/image'
import Logo from '../../../public/icons/logo.svg'
import { Smartphone, Download, ArrowDown } from 'lucide-react'

const DownloadSection = () => {
    return (
        <div className='w-full lg:w-[20%] '>
            <div className="group">
                <Image
                    priority
                    src={Logo}
                    alt="Exploreden logo"
                    height={0}
                    width={0}
                    className="object-contain h-auto w-auto "
                    unoptimized
                />
            </div>

            <div className="relative mt-4">

                <p className='text-foreground text-base font-normal '>
                    Download the app by clicking the button below:
                </p>

            </div>

            <div className='flex items-center gap-4 mt-4'>
                {DOWNLOAD_APP_IMAGES.map((image, index) => (
                    <a
                        href={image.href}
                        target='_blank'
                        rel="noopener noreferrer"
                        key={image.id}
                        className="group relative transform transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                        style={{
                            animationDelay: `${index * 200}ms`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                    >
                        <div className="absolute inset-0 bg-primary-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                        <img
                            src={image.src}
                            alt="Download app"
                            className='object-contain relative z-10 transition-all duration-300 group-hover:brightness-110 rounded-lg'
                        />

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400/30 to-primary-600/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                    </a>
                ))}
            </div>

            {/* Success indicator */}
            <div className="mt-4 text-sm text-gray-500 opacity-0 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
                <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available on all devices
                </span>
            </div>
        </div>
    )
}

export default DownloadSection
