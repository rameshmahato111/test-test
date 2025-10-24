'use client';
import React, { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import Wrapper from '@/components/Wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import Image from 'next/image'

import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/Loader';

import { googleAuthApi } from '@/services/api/index';
import { loginUser } from '@/actions/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import BackBtn from '@/components/Auth/BackBtn';

interface LoginState {
    success: boolean;
    error: string | null;
    token: string | null;
}

const initialState: LoginState = {
    success: false,
    error: null,
    token: null,
}
const SignInPage = () => {
    const [state, formAction, isPending] = useActionState(loginUser, initialState);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter()

    const { login } = useAuth();
    const { toast } = useToast();

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            const authUrl = await googleAuthApi.getAuthUrl();
            window.location.href = authUrl;
        } catch (error) {
            setIsGoogleLoading(false);
            console.error('Failed to get Google auth URL:', error);
            toast({
                title: 'Failed to initialize Google login',
                description: error instanceof Error ? error.message : 'Failed to initialize Google login',
                variant: "error",
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    React.useEffect(() => {
        if (state.success && state.token) {
            // Login will handle the redirection based on user state
            login(state.token);
            toast({
                title: 'Login successful!',
                variant: "success",
            });
        } else if (state.error) {
            toast({
                title: 'Login failed',
                description: state.error,
                variant: "error",
            });
        }
    }, [state]);

    React.useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                const reason = params.get('redirectReason');
                if (reason === 'not_logged_in') {
                    toast({
                        title: 'You are not logged in user',
                        variant: 'error',
                    });
                }
            }
        } catch (e) {
            // ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper className='bg-background min-h-screen flex items-center justify-center'>

            <div className="w-full max-w-md px-8 py-10 bg-background rounded-lg shadow-cardShadow">
                <BackBtn />
                <h1 className="text-2xl text-foreground font-semibold mb-6">Log In</h1>
                <form action={formAction}>
                    <div className="mb-6">
                        <Label htmlFor="email" className="block text-base font-medium text-gray-800 mb-3">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder='Email'
                            className="focus-visible:ring-primary-400 w-full px-3 py-2 border placeholder:border-gray-300 text-foreground font-medium text-base rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="password" className="block text-base font-medium text-gray-800 mb-3">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder='Password'
                            name="password"
                            autoComplete="off"
                            className="focus-visible:ring-primary-400 w-full px-3 py-2 border placeholder:border-gray-300 text-foreground font-medium text-base rounded-md"
                        />
                    </div>
                    <div className="text-sm mb-6">
                        <Link
                            href="/reset-password"
                            prefetch={false}
                            className="text-gray-600 hover:underline"
                        >
                            Forgot Your Password?
                        </Link>
                    </div>
                    {state.error && <p className='text-sm font-medium text-red-500 text-center pb-2'>"{state.error}"</p>}
                    <Button type="submit" className="w-full text-base font-semibold bg-primary-400 text-white py-2 rounded-md hover:bg-primary-400 transition duration-300">
                        Log In
                    </Button>
                </form>
                <div className="text-center my-8 border-b relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-6 text-foreground">Or</span>
                </div>

                <Image
                    priority
                    src="/images/login_with_google.png"
                    className='mx-auto w-full cursor-pointer h-auto'
                    alt="Login with Google"
                    width={0}
                    height={240}
                    unoptimized
                    onClick={handleGoogleLogin}
                />
            </div>
            {(isPending || isGoogleLoading) && <Loader />}
        </Wrapper>
    )
}

export default SignInPage
