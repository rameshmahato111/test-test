import React from 'react'
import HorizontalCardScroll from './HorizontalCardScroll'
import TextWithSeeAll from './TextWithSeeAll'
import Card from './Cards/Card'


const TitleWithHorizontalCards = ({ title, seeAllUrl, children, showSeeAll = true, className = 'px-4 md:px-8 lg:px-10' }: { title: string, seeAllUrl?: string, children: React.ReactNode, showSeeAll?: boolean, className?: string }) => {
    return (
        <div className={className}>
            <TextWithSeeAll title={title} seeAllUrl={seeAllUrl} showSeeAll={showSeeAll} />
            <HorizontalCardScroll>
                {children}

            </HorizontalCardScroll>

        </div>
    )
}

export default TitleWithHorizontalCards
