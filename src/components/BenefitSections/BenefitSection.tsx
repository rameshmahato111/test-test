import React from 'react'

import { BENEFIT_SECTION_CARDS, BENEFIT_SECTION_TITLE } from '@/data/staticData'
import BenefitCard from './BenefitCard'
import TextWithSeeAll from '../TextWithSeeAll'

const BenefitSection = () => {
    return (
        <div className='px-4  md:px-8 lg:px-10 mt-16'>
            <TextWithSeeAll title={BENEFIT_SECTION_TITLE} showSeeAll={false} />

            <div className='overflow-x-auto pb-4 px-2 hide-scrollbar mt-8'>
                <div className='inline-flex gap-10'>

                    {BENEFIT_SECTION_CARDS.map((card) => (
                        <BenefitCard key={card.id} card={card} />
                    ))}
                </div>
            </div>


        </div>
    )
}

export default BenefitSection
