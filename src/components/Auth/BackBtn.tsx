'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const BackBtn = () => {
    const router = useRouter();
    const handleBackToHome = () => {
        router.back();
    }
    return (
        <Button className='w-full flex items-center justify-start pb-4 hover:text-gray-700 duration-300 gap-2' onClick={handleBackToHome}><ArrowLeftIcon className='w-4 h-4 ' />Back</Button>
    )
}

export default BackBtn
