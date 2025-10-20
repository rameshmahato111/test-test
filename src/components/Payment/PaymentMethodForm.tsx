import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaymentMethodFormProps {
    errors: Record<string, string>;
    bookingType: 'hotel' | 'activity';
}

const PaymentMethodForm = ({ errors, bookingType }: PaymentMethodFormProps) => {
    // Format card number with spaces
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    // Format expiry date with slash for display
    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
        }
        return v;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        switch (name) {
            case 'cardNumber':
                formattedValue = formatCardNumber(value);
                e.target.value = formattedValue;
                break;
            case 'expiryDate':
                // Store raw MMYY in hidden input
                const rawValue = value.replace(/\D/g, '').slice(0, 4);
                const hiddenInput = document.getElementById('rawExpiryDate') as HTMLInputElement;
                if (hiddenInput) {
                    hiddenInput.value = rawValue;
                }
                // Display MM/YY format in visible input
                formattedValue = formatExpiryDate(value);
                e.target.value = formattedValue;
                break;
            case 'cvv':
                formattedValue = value.replace(/\D/g, '').slice(0, 4);
                e.target.value = formattedValue;
                break;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        // Prevent default form submission
        e.preventDefault();

        // Get the form element
        const form = e.target as HTMLFormElement;

        // Create FormData and submit through form action
        const formData = new FormData(form);
        form.requestSubmit();
    };

    // Only render card form for hotel bookings
    if (bookingType === 'activity') {
        return null;
    }

    return (
        <div className='py-8 px-6 mt-8 rounded-[20px] bg-background shadow-cardShadow'>
            <h4 className='text-foreground text-xl font-semibold pb-2'>Payment Method</h4>
            <p className='text-sm font-normal pb-6 text-gray-800'>Please select your preferred payment method.</p>


            <div className="flex items-center space-x-2">

                <Label htmlFor="card" className="text-base text-gray-800 font-medium">
                    Credit/Debit Card
                </Label>
            </div>

            <div className="mt-6 space-y-4">
                <div>
                    <Label htmlFor="cardHolderName" className='text-sm font-medium text-gray-800'>Cardholder Name</Label>
                    <Input
                        id="cardHolderName"
                        name="cardHolderName"
                        required
                        placeholder="Name on card"
                        className={`mt-2 focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-0
                                ${errors.cardHolderName ? 'border-red-500' : ''}`}
                    />
                    {errors.cardHolderName && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="cardNumber" className='text-sm font-medium text-gray-800'>Card Number</Label>
                    <Input
                        id="cardNumber"
                        name="cardNumber"
                        required
                        placeholder="1234 5678 9012 3456"
                        onChange={handleInputChange}
                        className={`mt-2 focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-0
                                ${errors.cardNumber ? 'border-red-500' : ''}`}
                        maxLength={19}
                        inputMode="numeric"
                    />
                    {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="expiryDate" className='text-sm font-medium text-gray-800'>Expiry Date</Label>
                        <Input
                            id="expiryDate"
                            name="expiryDate"
                            required
                            placeholder="MM/YY"
                            onChange={handleInputChange}
                            className={`mt-2 focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-0
                                    ${errors.expiryDate ? 'border-red-500' : ''}`}
                            maxLength={5}
                            inputMode="numeric"
                        />
                        {/* Hidden input to store MMYY format */}
                        <input
                            type="hidden"
                            id="rawExpiryDate"
                            name="rawExpiryDate"
                        />
                        {errors.expiryDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="cvv" className='text-sm font-medium text-gray-800'>CVV</Label>
                        <Input
                            id="cvv"
                            name="cvv"
                            required
                            placeholder="123"
                            onChange={handleInputChange}
                            className={`mt-2 focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-0
                                    ${errors.cvv ? 'border-red-500' : ''}`}
                            maxLength={4}
                            type="text"
                            inputMode="numeric"
                        />
                        {errors.cvv && (
                            <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PaymentMethodForm; 