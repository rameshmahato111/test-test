'use client'

import React, { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import Wrapper from '@/components/Wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'



import OTPVerificationModal from '@/components/Auth/OTPVerificationModal'
import { verifyUserOTP, registerUser } from '@/actions/auth'
import Loader from '@/components/Loader'
import { useToast } from '@/hooks/use-toast'
import BackBtn from '@/components/Auth/BackBtn'
import Image from 'next/image'
import { googleAuthApi } from '@/services/api/google-auth'

const initialState = {
    error: null,
    success: false,
    data: null,
}

const RegisterPage = () => {
    const [state, formAction, isPending] = useActionState(registerUser, initialState)
    const router = useRouter()
    const [showOtpModal, setOtpModal] = useState(false);
    const [email, setEmail] = useState('');
    const { toast } = useToast();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

    const handleVerify = async (otp: string) => {
        try {
            const result = await verifyUserOTP(otp, email);
            if (result.success) {
                toast({
                    title: 'OTP verification successful!',
                    description: 'Redirecting to sign-in page...',
                    variant: "success",
                });
                router.push('/sign-in');
            } else {
                toast({
                    title: 'Verification failed',
                    description: result.error || 'Verification failed',
                    variant: "error",
                });
            }
        } catch (error) {
            toast({
                title: 'An error occurred during verification',
                description: error instanceof Error ? error.message : 'An error occurred during verification',
                variant: "error",
            });
        }
    };

    const handleClose = () => {
        setOtpModal(false);
    };

    React.useEffect(() => {
        if (state.success) {
            toast({
                title: 'Registration successful! Please verify your email.',
                variant: "success",
            });
            setOtpModal(true);
        } else if (state.error) {
            toast({
                title: 'Registration failed',
                description: state.error,
                variant: "error",
            });
        }
    }, [state])

    return (
        <Wrapper className='bg-background min-h-screen flex items-center justify-center'>
            <div className="w-full max-w-md px-8 py-10 bg-background rounded-lg shadow-cardShadow">
                <BackBtn />
                <h1 className="text-2xl text-foreground font-semibold mb-6">Register</h1>
                <form action={formAction}>
                    <div className="mb-6">
                        <Label htmlFor="email" className="block text-base font-medium text-gray-800 mb-3">Email</Label>
                        <Input type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            id="email" name="email" placeholder='Email' required className="focus-visible:ring-primary-400 w-full px-3 py-2 border placeholder:border-gray-300 text-foreground font-medium text-base rounded-md" />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="username" className="block text-base font-medium text-gray-800 mb-3">Username</Label>
                        <Input type="text" id="username" name="username" placeholder='Username' required className="focus-visible:ring-primary-400 w-full px-3 py-2 border placeholder:border-gray-300 text-foreground font-medium text-base rounded-md" />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="password" className="block text-base font-medium text-gray-800 mb-3">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder='Password'
                            required
                            autoComplete="off"
                            className="focus-visible:ring-primary-400 w-full px-3 py-2 border placeholder:border-gray-300 text-foreground font-medium text-base rounded-md"
                        />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="reenterPassword" className="block text-base font-medium text-gray-800 mb-3">Re-enter Password</Label>
                        <Input
                            type="password"
                            id="reenterPassword"
                            name="reenterPassword"
                            placeholder='Re-enter Password'
                            required
                            autoComplete="off"
                            className="focus-visible:ring-primary-400 w-full px-3 py-2 border placeholder:border-gray-300 text-foreground font-medium text-base rounded-md"
                        />
                    </div>
                    <Button type="submit" className="w-full text-base font-semibold bg-primary-400 text-white py-2 rounded-md hover:bg-primary-400 transition duration-300">
                        Register
                    </Button>
                    <div className='mt-6'>
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
                </form>
            </div>
            {
                showOtpModal && <OTPVerificationModal
                    isOpen={showOtpModal}
                    onClose={handleClose}
                    onVerify={handleVerify}
                    email={email}
                />
            }
            {
                isPending && <Loader />

            }
        </Wrapper>
    )
}

export default RegisterPage

