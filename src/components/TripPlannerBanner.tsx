import { DOWNLOAD_APP_IMAGES } from '@/data/staticData'
import React from 'react'

const TripPlannerBanner = () => {
  return (
    <div className='px-4 md:px-8 lg:px-10 bg-[url("/banners/trip-planner-bg.png")] bg-cover bg-center bg-no-repeat h-[220px] md:h-[280px] lg:h-[340px] rounded-xl my-10 md:my-16 flex items-end justify-between relative overflow-hidden' >
      <div className='w-[85%] sm:w-[60%] md:w-[50%] h-full flex flex-col justify-center gap-4'>
        <div className='space-y-3 relative z-10'>
          <h2 className='text-[22px] md:text-[28px] text-background  lg:text-4xl font-semibold  leading-tight'>AI Trip Road Planner to Create Your Perfect Journey</h2>
          <p className='text-sm md:text-base text-background font-medium'>Download our mobile app to access our advanced AI trip planner</p>
        </div>
        <div className='flex gap-4'>

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
      <div className='absolute right-0 bottom-0 w-[45%] md:w-auto'>
        <img
          src="/banners/car.png"
          alt="Road trip vehicle"
          className='object-contain pb-4 hidden md:block'
        />
      </div>
      {/* Add a subtle gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none'></div>
    </div>
  )
}

export default TripPlannerBanner    