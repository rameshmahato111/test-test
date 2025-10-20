import React from 'react'

import { BenefitCardProps } from '@/types'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'

const BenefitCard = ({ card }: { card: BenefitCardProps }) => {
    return (
        <div className='text-center min-w-[320px] '>
            <Image loading='lazy' src={card.imageSrc} alt={card.title} className='w-[318px] h-[235px] mx-auto' width={318} height={235} />
            <h3 className='text-2xl text-center font-semibold text-foreground font-inter pt-8 pb-3'>{card.title}</h3>
            <p className='text-sm font-normal text-gray-700 text-center text-balance'>{card.description}</p>
            <Link href={'/rewards/'} prefetch={false} className='px-8 py-2 block w-fit bg-gray-100 border border-gray-200 hover:bg-gray-300 duration-300 font-semibold text-base text-foreground mt-7 mx-auto'>Learn More</Link>
        </div>
    )
}

export default BenefitCard
