import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import type { ContactDetails } from './FlightSearch';
import { Mail, Phone, Plane, DollarSign } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import icons from "currency-icons";
import { useAuth } from '@/contexts/AuthContext';
interface ContactDetailsFormProps {
    contactDetails: ContactDetails;
    onUpdate: (details: ContactDetails) => void;
    onSubmit: () => void;
    onBack: () => void;
    isLoading: boolean;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
    contactDetails,
    onUpdate,
    onSubmit,
    onBack,
    isLoading
}) => {
    const { currency } = useCurrency();

    const handleInputChange = (field: keyof ContactDetails, value: string | string[] | { min: number; max: number }) => {
        onUpdate({
            ...contactDetails,
            [field]: value
        });
    };

    const handleAirlineInput = (value: string) => {
        const airlines = value.split(',').map(airline => airline.trim());
        handleInputChange('preferredAirlines', airlines);
    };

    const handlePriceRangeInput = (field: 'min' | 'max', value: string) => {
        const numValue = parseInt(value) || '';
        handleInputChange('priceRange', {
            ...contactDetails.priceRange!,
            [field]: numValue
        });
    };

    return (
        <div className="mx-auto">
            <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <h2 className="text-base font-medium text-gray-900">Contact Details & Preferences</h2>
            </div>

            <div className="bg-white rounded-lg border border-gray-100">
                <div className="px-3 py-2 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                <Label htmlFor="email" className="text-xs text-gray-600">Email</Label>
                            </div>
                            <Input
                                id="email"
                                type="email"
                                value={contactDetails.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter email address"
                                className="focus-visible:ring-0 outline-none border focus-visible:border-primary-400"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                <Label htmlFor="phone" className="text-xs text-gray-600">Phone Number</Label>
                            </div>
                            <Input
                                id="phone"
                                type="tel"
                                value={contactDetails.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Enter phone number"
                                className="focus-visible:ring-0 outline-none border focus-visible:border-primary-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="px-3 py-2">
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <Plane className="w-3.5 h-3.5 text-gray-400" />
                                <Label htmlFor="airlines" className="text-xs text-gray-600">Preferred Airlines</Label>
                            </div>
                            <Input
                                id="airlines"
                                value={contactDetails.preferredAirlines?.join(', ')}
                                onChange={(e) => handleAirlineInput(e.target.value)}
                                placeholder="e.g. Emirates, Qatar Airways, Etihad"
                                className="focus-visible:ring-0 outline-none border focus-visible:border-primary-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <Label htmlFor="minPrice" className="text-xs text-gray-600">{icons[currency]?.symbol} Min Price ({currency})</Label>

                                </div>
                                <Input
                                    id="minPrice"
                                    type="number"
                                    value={contactDetails.priceRange?.min}
                                    onChange={(e) => handlePriceRangeInput('min', e.target.value)}
                                    min={0}
                                    className="focus-visible:ring-0 outline-none border focus-visible:border-primary-400"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <Label htmlFor="maxPrice" className="text-xs text-gray-600">{icons[currency]?.symbol} Max Price ({currency})</Label>

                                </div>
                                <Input
                                    id="maxPrice"
                                    type="number"
                                    value={contactDetails.priceRange?.max}
                                    onChange={(e) => handlePriceRangeInput('max', e.target.value)}
                                    min={0}
                                    className="focus-visible:ring-0 outline-none border focus-visible:border-primary-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-3">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="px-4 py-1.5 h-8"
                >
                    Back
                </Button>
                <Button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="px-4 py-1.5 h-8 bg-pink-500 hover:bg-pink-600 text-white"
                >
                    {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </div>
    );
};

export default ContactDetailsForm; 