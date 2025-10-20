'use client';
import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'

import { googleAuthApi } from '@/services/api/';
import Loader from '@/components/Loader';
import BackBtn from '@/components/Auth/BackBtn';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);



    const handleLoginWithGoogle = async () => {
        try {
            setLoading(true);
            const authUrl = await googleAuthApi.getAuthUrl();
            setLoading(false);
            window.location.href = authUrl;
        } catch (error) {
            console.error('Failed to get Google auth URL:', error);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-background  min-h-screen flex items-center justify-center'>
            <div className="w-full max-w-md px-4 py-10">
                <BackBtn />
                <div className="shadow-cardShadow rounded-2xl bg-background border border-gray-100 p-8">
                    <Image unoptimized src="/images/login_map.png" className='mx-auto w-auto h-auto' alt="Login page Map Animation" width={300} height={240} />
                    <Image
                        onClick={handleLoginWithGoogle}
                        src="/images/login_with_google.png"
                        className='mx-auto mt-16 mb-6 w-full cursor-pointer h-auto'
                        alt="Login with Google"
                        width={0}
                        height={240}
                        unoptimized
                    />
                    <div className="text-center my-8 border-b relative">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-6 text-foreground">Or</span>
                    </div>

                    <Link href="/sign-in" className="w-full block text-center bg-primary-400 text-base hover:bg-primary-500 duration-300 text-background py-2 rounded-md font-semibold mb-4">
                        Log In With Email
                    </Link>

                    <div className="text-center text-sm">
                        <span className="text-gray-600">Don't have an account? </span>
                        <Link prefetch={false} href="/register" className="text-primary-400 font-semibold">Sign Up</Link>
                    </div>
                </div>
            </div>
            {loading && <Loader />}
        </div>
    )
}

export default LoginPage
