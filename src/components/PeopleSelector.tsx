import React, { useState, Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Users, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
export type PersonType = {
    label: string;
    value: number;
    min?: number;
    max?: number;
}

// Update the interface definition to exclude childrenAges from Record<string, number>
interface PeopleSelectorProps<T> {
    onSelectionChange: Dispatch<SetStateAction<T>>;
    initialSelection: T;
    options: PersonType[];
    triggerText?: (total: number) => string;
    icon?: React.ReactNode;
    className?: string;
}

const PeopleSelector = <T extends Record<string, number> & { childrenAges?: number[] }>({
    onSelectionChange,
    initialSelection,
    options,
    triggerText,
    icon = <Users className="mr-2 h-4 w-4 text-gray-500" />,
    className
}: PeopleSelectorProps<T>) => {

    const [selection, setSelection] = useState<T>(initialSelection);
    const [isOpen, setIsOpen] = useState(false);


    const handleIncrement = (key: string, max?: number) => {
        const newValue = selection[key] + 1;
        if (max !== undefined && newValue > max) return;

        // Create new selection object
        const newSelection = {
            ...selection,
            [key]: newValue,
        } as T;

        // Handle children ages when adding a child
        if (key === 'Children') {
            const currentAges = selection.childrenAges || [];
            newSelection.childrenAges = [...currentAges, 0];
        }

        setSelection(newSelection);
        onSelectionChange(newSelection);
    };

    const handleDecrement = (key: string, min: number = 0) => {
        const newValue = Math.max(min, selection[key] - 1);

        const newSelection = {
            ...selection,
            [key]: newValue,
        } as T;

        // Handle children ages when removing a child
        if (key === 'Children' && selection.childrenAges) {
            newSelection.childrenAges = selection.childrenAges.slice(0, newValue);
        }

        setSelection(newSelection);
        onSelectionChange(newSelection);
    };

    const handleAgeChange = (index: number, value: string) => {
        if (!selection.childrenAges) return;

        const newAges = [...selection.childrenAges];
        const parsedAge = parseInt(value);

        // Validate age input
        if (!isNaN(parsedAge) && parsedAge >= 0 && parsedAge <= 17) {
            newAges[index] = parsedAge;

            const newSelection = {
                ...selection,
                childrenAges: newAges,
            } as T;

            setSelection(newSelection);
            onSelectionChange(newSelection);
        }
    };

    // Fix the total people calculation
    const totalPeople = Object.entries(selection).reduce((sum, [key, value]) => {
        if (key === 'childrenAges') return sum;
        return sum + (value as number);
    }, 0);

    const defaultTriggerText = (total: number) =>
        `${total} ${total === 1 ? 'guest' : 'guests'}`;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-medium", className)}>
                    {icon}
                    {(triggerText || defaultTriggerText)(totalPeople)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-80 w-64 mt-2 p-0 bg-background" align="end">
                <div className="p-4 w-full">
                    {options.map(({ label, value, min = 0, max }) => (
                        <div key={label} className="flex w-full justify-between items-center mb-4">
                            <span className="text-sm text-gray-800 font-semibold">{label}</span>
                            <div className="flex border border-gray-200">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className='p-0 border-l-0 border-y-0 bg-gray-50 rounded-none border-gray-200 border-r'
                                    onClick={() => handleDecrement(label, min)}
                                    disabled={selection[label] <= min}
                                >
                                    <Minus className="h-2 w-2" />
                                </Button>
                                <span className="flex justify-center items-center w-12 text-center">
                                    {selection[label]}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className='p-0 border-r-0 border-y-0 bg-gray-50 rounded-none border-gray-200 border-l'
                                    onClick={() => handleIncrement(label, max)}
                                    disabled={max !== undefined && selection[label] >= max}
                                >
                                    <Plus className="h-2 w-2" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Children Ages Section */}
                    {selection['Children'] > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Children's Ages</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {selection.childrenAges?.map((age, index) => (
                                    <div key={index} className="flex flex-col items-start">
                                        <label className="text-sm font-medium text-gray-700">
                                            Child {index + 1}
                                        </label>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            min={0}
                                            max={17}
                                            value={age || ''}
                                            onChange={(e) => handleAgeChange(index, e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                            className="mt-1 w-full border border-gray-300 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-1 text-sm"
                                            placeholder="Age"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default PeopleSelector;
