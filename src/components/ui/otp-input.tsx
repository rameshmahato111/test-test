'use client';
import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from './input';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
}

const OTPInput = ({ length = 6, value, onChange, error }: OTPInputProps) => {
    const [otp, setOtp] = useState<string[]>(value.split('').concat(Array(length - value.length).fill('')));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const focusInput = (index: number) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index]?.focus();
        }
    };

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(''));

        if (value !== '' && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                focusInput(index - 1);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            focusInput(index - 1);
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();

        if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

        const pastedArray = pastedData.slice(0, length).split('');
        const newOtp = [...pastedArray, ...Array(length - pastedArray.length).fill('')];

        setOtp(newOtp);
        onChange(newOtp.join(''));

        // Focus the next empty input or the last input
        const nextEmptyIndex = newOtp.findIndex(val => val === '');
        focusInput(nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1);
    };

    // Correct ref callback type
    const setRef = (index: number) => (el: HTMLInputElement | null) => {
        inputRefs.current[index] = el;
    };

    return (
        <div className="flex gap-2 items-center justify-between max-w-xs mx-auto">
            {Array.from({ length }, (_, index) => (
                <Input
                    key={index}
                    ref={setRef(index)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index]}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-0 text-center text-lg font-semibold ${error ? 'border-red-500' : ''
                        }`}
                />
            ))}
        </div>
    );
};

export default OTPInput; 