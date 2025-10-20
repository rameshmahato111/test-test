'use client'
import { getUserSubscriptionStatus } from '@/services/api/subscription'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
const UserStatus = () => {
    const { token } = useAuth()
    const [userStatus, setUserStatus] = useState<string>('')

    useEffect(() => {
        const getUserStatus = async () => {
            const userStatus = await getUserSubscriptionStatus(token ?? '');
            console.log(userStatus)
            setUserStatus(userStatus.is_active ? 'Adventurer' : 'Explorer')
        }
        if (token) {
            getUserStatus()
        }
    }, [token])
    if (userStatus) {
        return (
            <div>
                <p className='text-sm text-gray-10 font-inter pb-1'>You are a</p>
                <h2 className='text-3xl font-semibold font-inter text-background pb-4'>{userStatus}</h2>
            </div>
        )
    }
    return (
        <div className='flex flex-col items-start justify-center'>
            <p className='text-base text-gray-10 font-inter pb-4'>Login to continue</p>
            <a href='/login' className='text-xl bg-primary-400 px-4 py-2 rounded-md font-medium text-white font-inter'>Login</a>
        </div>
    )
}
export default UserStatus
