import { ASSOCIATED_WITH_LOGOS, ASSOCIATED_WITH_TITLE } from '@/data/staticData'
import React from 'react'

const AssociationSection = () => {
    return (
        <div className='flex items-start lg:items-center flex-col lg:flex-row gap-8 pb-8 border-b border-gray-200'>

            <div className='flex flex-wrap items-center gap-5'>
                {ASSOCIATED_WITH_LOGOS.map((logo) => (
                    <div key={logo.id} className='bg-transparent '>
                        <img src={logo.src} alt={logo.name} className='h-10 w-28  object-contain  ' />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AssociationSection
