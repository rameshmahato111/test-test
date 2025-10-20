'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import Loader from '@/components/Loader';
import { googleAuthApi } from '@/services/api/index';
import { useToast } from '@/hooks/use-toast';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const { toast } = useToast();
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const code = searchParams.get('code');
    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                if (!code) {
                    setStatus('error');
                    throw new Error('No authorization code received');
                }


                const token = await googleAuthApi.activateUser(code);

                if (!token) {
                    throw new Error('No token received from server');
                }

                await login(token);
                setStatus('success');
                toast({
                    title: 'Successfully logged in with Google!',
                    variant: "success",
                });
            } catch (error) {
                console.error('Google login error:', error);
                setStatus('error');
                toast({
                    title: 'Failed to login with Google',
                    description: error instanceof Error ? error.message : 'Failed to login with Google',
                    variant: "error",
                });
                router.push('/login');
            }
        };

        handleGoogleCallback();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            {status === 'loading' && (
                <>
                    <Loader />
                    <p className="mt-4 text-gray-600">Completing your Google login...</p>
                </>
            )}
            {status === 'error' && (
                <p className="text-red-500">Something went wrong. Redirecting... </p>

            )}
            {status === 'success' && (
                <p className="text-green-500">Login successful! Redirecting...</p>
            )}
        </div>
    );
}

export default function GoogleCallback() {
    return (
        <Suspense fallback={<Loader />}>
            <CallbackContent />
        </Suspense>
    );
}
