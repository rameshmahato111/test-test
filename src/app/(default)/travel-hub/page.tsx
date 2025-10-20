import React from 'react'
import Wrapper from '@/components/Wrapper'
import TravelHubPage from '@/components/TravelHub/TravelHubPage';
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Travel Hub | Exploreden',
    description: 'Travel Hub | Exploreden',
    keywords: ['Travel Hub', 'Exploreden', 'Travel', 'Exploreden Travel Hub'],
}

const TravelHub = () => {
    return (
        <Wrapper>
            <TravelHubPage />
        </Wrapper>
    )
}

export default TravelHub;
