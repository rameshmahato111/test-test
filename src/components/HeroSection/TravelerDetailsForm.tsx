import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import type { TravelerDetails } from './FlightSearch';
import { User } from 'lucide-react';

interface TravelerDetailsFormProps {
    travelers: TravelerDetails[];
    onUpdate: (travelers: TravelerDetails[]) => void;
    onNext: () => void;
    onBack: () => void;
}

const TravelerDetailsForm: React.FC<TravelerDetailsFormProps> = ({
    travelers,
    onUpdate,
    onNext,
    onBack
}) => {
    const handleInputChange = (index: number, value: string) => {
        const updatedTravelers = [...travelers];
        updatedTravelers[index] = {
            ...updatedTravelers[index],
            fullName: value
        };
        onUpdate(updatedTravelers);
    };

    return (
        <div className="mx-auto">
            <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <h2 className="text-base font-medium text-gray-900">Traveler Details</h2>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                {travelers.map((traveler, index) => (
                    <div key={index} className="flex items-center gap-3 px-2 py-2 border-b last:border-b-0">
                        <div className="flex flex-col items-start gap-2 w-[85px]">
                            <span className="text-xs md:text-sm font-medium text-gray-700">
                                Traveler {index + 1}
                            </span>
                            <span className="text-[10px] md:text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 whitespace-nowrap">
                                {traveler.type === 'ADULT' ? '12+ years' : 'Under 12'}
                            </span>
                        </div>
                        <Input
                            id={`fullName-${index}`}
                            value={traveler.fullName}
                            type='text'
                            autoComplete='off'
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder="Enter full name"
                            className=" focus-visible:ring-0 outline-none border focus-visible:border-primary-400"
                        />
                    </div>
                ))}
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
                    onClick={onNext}
                    className="px-4 py-1.5 h-8 bg-pink-500 hover:bg-pink-600 text-white"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default TravelerDetailsForm; 