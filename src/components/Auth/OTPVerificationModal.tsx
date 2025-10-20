'use client';

import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface OTPVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (otp: string) => void;
    email: string;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({ isOpen, onClose, onVerify, email }) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [isOpen]);

    const handleInput = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value.length === 1 && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && index > 0 && !event.currentTarget.value) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const otp = inputRefs.current.map(input => input?.value).join('');
        onVerify(otp);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-inter font-semibold">Check your Email</DialogTitle>
                </DialogHeader>
                <p className="text-gray-600 mb-6">
                    We have sent you verification code at <span className='font-semibold'>{email}</span>. Enter 6 digit code mentioned in the email.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between mb-6">
                        {[...Array(6)].map((_, index) => (
                            <Input
                                key={index}
                                type="text"
                                name={`otp-${index}`}
                                maxLength={1}
                                className="w-12 h-12 text-center text-base font-medium border-2 border-gray-300 rounded-md focus-visible:border-primary-400 focus:ring-0 focus-visible:ring-0"
                                required
                                ref={(el) => { inputRefs.current[index] = el }}
                                onInput={(e) => handleInput(index, e as React.ChangeEvent<HTMLInputElement>)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                            />
                        ))}
                    </div>
                    <Button type="submit" className="w-full text-base font-semibold bg-primary-400 text-background py-3 rounded-md hover:bg-primary-500 transition duration-300">
                        Continue
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default OTPVerificationModal;
