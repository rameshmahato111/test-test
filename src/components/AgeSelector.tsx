import React, { useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Users, Plus, Minus, X } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface AgeSelectorProps {
    onAgeChange: (ages: number[]) => void;
    selectedAges: number[];
    maxSelections?: number;
}

const AgeSelector: React.FC<AgeSelectorProps> = ({
    onAgeChange,
    selectedAges,
    maxSelections = 10
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentAge, setCurrentAge] = useState<number>(18);
    const [inputValue, setInputValue] = useState('18');

    const handleAddAge = () => {
        if (selectedAges.length >= maxSelections) return;
        const age = parseInt(inputValue);
        if (age < 2 || age > 100) return;
        onAgeChange([...selectedAges, age]);
        setInputValue('');
        setCurrentAge(18);
    };

    const handleRemoveAge = (index: number) => {
        const newAges = [...selectedAges];
        newAges.splice(index, 1);
        onAgeChange(newAges);
    };

    const handleAgeChange = (increment: boolean) => {
        setCurrentAge(prev => {
            const newAge = increment ? prev + 1 : prev - 1;
            const limitedAge = Math.min(Math.max(newAge, 5), 100);
            setInputValue(limitedAge.toString());
            return limitedAge;
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setInputValue('');
            setCurrentAge(0);
            return;
        }
        if (!/^\d+$/.test(value)) return;
        if (value.length > 3) return;
        setInputValue(value);
        setCurrentAge(parseInt(value));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const age = parseInt(inputValue);
            if (age < 2 || age > 100) {
                const validAge = Math.min(Math.max(age, 2), 100);
                setInputValue(validAge.toString());
                setCurrentAge(validAge);
                return;
            }
            handleAddAge();
        }
    };

    const isValidAge = currentAge >= 2 && currentAge <= 100;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start text-left font-medium min-h-[40px] h-auto flex-wrap gap-1 gap-y-3"
                >
                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                    <div className="flex flex-wrap gap-2">
                        {selectedAges.length > 0 ? (
                            selectedAges.map((age, index) => (
                                <div
                                    key={`${age}-${index}`}
                                    className="bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1 text-sm"
                                >
                                    <span>{age} years</span>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveAge(index);
                                        }}
                                        className="hover:bg-gray-200 rounded-full p-0.5 cursor-pointer"
                                    >
                                        <X className="h-3 w-3 text-gray-500" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-500">Select Ages</span>
                        )}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-background" align="start">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">
                            Enter Age
                            {!isValidAge && inputValue && (
                                <p className="text-xs py-1 text-red-500">
                                    Age must be between 5-100
                                </p>
                            )}
                        </label>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() => handleAgeChange(false)}
                                disabled={currentAge <= 5}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>

                            <Input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                className={cn(
                                    "h-8 text-center outline-none focus-visible:ring-0",
                                    !isValidAge && inputValue && "border-red-500"
                                )}
                                placeholder="Enter age"
                            />

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() => handleAgeChange(true)}
                                disabled={currentAge >= 100}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-primary-400 text-background"
                        onClick={handleAddAge}
                        disabled={selectedAges.length >= maxSelections || !isValidAge}
                    >
                        {selectedAges.length >= maxSelections
                            ? `Maximum ${maxSelections} selections`
                            : !isValidAge && inputValue
                                ? 'Invalid age'
                                : 'Add Age'
                        }
                    </Button>

                    {/* {selectedAges.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {selectedAges.map((age, index) => (
                                <div
                                    key={`${age}-${index}`}
                                    className="bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1 text-sm"
                                >
                                    <span>{age} years</span>
                                    <div
                                        onClick={() => handleRemoveAge(index)}
                                        className="hover:bg-gray-200 rounded-full p-0.5 cursor-pointer"
                                    >
                                        <X className="h-3 w-3 text-gray-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )} */}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default AgeSelector; 