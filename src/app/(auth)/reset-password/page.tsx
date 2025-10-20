'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Wrapper from '@/components/Wrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/services/api';
import Loader from '@/components/Loader';
import OTPInput from '@/components/ui/otp-input';
import { Eye, EyeOff, ArrowLeft, Mail, KeyRound } from 'lucide-react';

interface FormErrors {
    email?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
}

type Step = 'request-otp' | 'verify-otp' | 'set-password';

const ResetPasswordPage = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [step, setStep] = useState<Step>('request-otp');
    const { toast } = useToast();
    const router = useRouter();

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (step === 'request-otp') {
            if (!email || !email.includes('@')) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (step === 'verify-otp') {
            if (!otp || otp.length !== 6) {
                newErrors.otp = 'Please enter the 6-digit code';
            }
        }

        if (step === 'set-password') {
            if (!newPassword || newPassword.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }
            if (newPassword !== confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            switch (step) {
                case 'request-otp':
                    await authApi.resetPassword(email);
                    setStep('verify-otp');
                    toast({
                        title: 'Code Sent Successfully',
                        description: 'Please check your email for the verification code',
                        variant: "success",
                    });
                    break;

                case 'verify-otp':
                    setStep('set-password');

                    break;

                case 'set-password':
                    await authApi.resetPasswordConfirm(email, otp, newPassword);
                    toast({
                        title: 'Success!',
                        description: 'Your password has been reset successfully',
                        variant: "success",
                    });
                    router.push('/sign-in');
                    break;
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'An error occurred',
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

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

    const getStepContent = () => {
        switch (step) {
            case 'request-otp':
                return {
                    title: 'Reset Your Password',
                    subtitle: 'Enter your email address and we\'ll send you a verification code'
                };
            case 'verify-otp':
                return {
                    title: 'Enter Verification Code',
                    subtitle: `We've sent a 6-digit code to ${email}`
                };
            case 'set-password':
                return {
                    title: 'Create New Password',
                    subtitle: 'Your new password must be different from previous passwords'
                };
        }
    };

    const content = getStepContent();

    return (
        <Wrapper className='bg-background min-h-screen flex items-center justify-center'>
            <div className="w-full max-w-md px-8 py-10 bg-background rounded-lg shadow-cardShadow">
                {step !== 'request-otp' && (
                    <button
                        type="button"
                        onClick={() => setStep(step === 'verify-otp' ? 'request-otp' : 'verify-otp')}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>
                )}

                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-primary-50 rounded-full mb-4">
                        {step === 'request-otp' && <Mail className="w-6 h-6 text-primary-400" />}
                        {step === 'verify-otp' && <Mail className="w-6 h-6 text-primary-400" />}
                        {step === 'set-password' && <KeyRound className="w-6 h-6 text-primary-400" />}
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground">{content.title}</h1>
                    <p className="text-gray-600 mt-2">{content.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 'request-otp' && (
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className={`mt-2 focus-visible:ring-primary-400 focus-visible:ring-1 focus-visible:ring-offset-0 w-full px-3 py-2 border placeholder:border-gray-300 text-foreground font-medium text-base rounded-md ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>
                    )}

                    {step === 'verify-otp' && (
                        <div className="space-y-4">
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
                        </div>
                    )}

                    {step === 'set-password' && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="new-password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        autoComplete="off"
                                        className={`mt-2 focus-visible:ring-primary-400 focus-visible:ring-1 focus-visible:ring-offset-0 w-full px-3 py-2 border placeholder:border-gray-300 text-foreground font-medium text-base rounded-md ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        autoComplete="off"
                                        className={`mt-2 focus-visible:ring-primary-400 focus-visible:ring-1 focus-visible:ring-offset-0 w-full px-3 py-2 border placeholder:border-gray-300 text-foreground font-medium text-base rounded-md ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-primary-400 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' :
                            step === 'request-otp' ? 'Send Code' :
                                step === 'verify-otp' ? 'Verify Code' :
                                    'Reset Password'}
                    </Button>
                </form>

                {step === 'request-otp' && (
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/sign-in')}
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
            {isLoading && <Loader />}
        </Wrapper>
    );
};

export default ResetPasswordPage;
