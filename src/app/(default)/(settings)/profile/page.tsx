import React from 'react'
import ProfileContent from '@/components/settings/ProfileContent'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Exploreden',
  description: 'Profile | Exploreden',
  keywords: ['Profile', 'Exploreden', 'Profile', 'Exploreden Profile'],
}


const Page = () => {
  return (
    <>
      <ProfileContent />
    </>
  )
}

export default Page
