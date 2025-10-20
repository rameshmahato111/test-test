import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link';
import { City } from '@/schemas/cities';
import Image from 'next/image';


const CityCard = ({ cityCard, className }: { cityCard: City, className?: string }) => {
  const { id, image, name } = cityCard;
  return (

    <Link prefetch={false} href={`/city/${id}`} className=' py-2 block group hover:-translate-y-1 transition-all duration-300 '>
      <div className={cn('w-[195px]  h-[235px] rounded-[4px] relative overflow-hidden', className)}>
        <Image
          src={image || '/images/default-city.jpeg'}
          alt="city"
          width={195}
          height={235}
          className='w-full h-full object-cover group-hover:scale-105 transition-all duration-300'
        />
        <div className='absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[rgba(19,18,18,0.7)] via-transparent to-transparent'></div>
        <h1 className='text-background text-lg font-semibold absolute bottom-3 left-2'>{name}</h1>
      </div>
    </Link>
  )
}

export default CityCard
