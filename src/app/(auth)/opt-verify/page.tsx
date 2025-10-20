'use client';
import { Button } from '@/components/ui/button';
import OTPInput from '@/components/ui/otp-input'
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/services/api/auth';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
const page = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({ otp: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (user?.user.email) {
            setEmail(user?.user.email!);
            logout();
        }
    }, [user]);
    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            await authApi.resendOTP(email);
            toast({
                title: 'Code Resent',
                description: 'A new verification code has been sent to your email',
                variant: "success",
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to resend code',
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setIsLoading(true);
        try {
            const response = await authApi.verifyOTP(otp, email);
            router.push('/sign-in');
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to verify OTP',
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='bg-background min-h-screen flex items-center justify-center'>
            <div className="space-y-4 border border-border rounded-lg p-8 w-full max-w-md ">
                <h1 className='text-2xl text-center font-semibold text-foreground pb-4'>Enter Verification Code</h1>
                <OTPInput

                    value={otp}
                    onChange={setOtp}
                    error={!!errors.otp}
                />
                {errors.otp && (
                    <p className="text-red-500 text-sm text-center">{errors.otp}</p>
                )}
                <div className="text-center text-sm">
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-primary-400 hover:underline font-medium"
                        disabled={isLoading}
                    >
                        Resend Code
                    </button>
                </div>
                <Button onClick={handleVerifyOTP} className="w-full text-base font-semibold bg-primary-400 text-white py-2 rounded-md hover:bg-primary-400 transition duration-300">Verify OTP</Button>
            </div>
        </div>
    )
}

export default page
