import React, { useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Bed, Plus, Minus } from 'lucide-react';

interface RoomPeopleSelectorProps {
    onSelectionChange: (selection: RoomPeopleSelection) => void;
    initialSelection: RoomPeopleSelection;
}
interface RoomPeopleSelection {
    rooms: number;
    children: number;
    agesOfChildren: number[];
    adults: number;
}

type CountKeys = 'rooms' | 'children' | 'adults';

const RoomPeopleSelector: React.FC<RoomPeopleSelectorProps> = ({ initialSelection, onSelectionChange }) => {
    const [selection, setSelection] = useState<RoomPeopleSelection>(initialSelection);
    const [isOpen, setIsOpen] = useState(false);

    const handleIncrement = (key: CountKeys) => {
        const newSelection = {
            ...selection,
            [key]: (selection[key] || 0) + 1,
        };

        if (key === 'children') {
            newSelection.agesOfChildren = [...(selection.agesOfChildren || []), 0];
        }

        setSelection(newSelection);
        onSelectionChange(newSelection);
    };

    const handleDecrement = (key: CountKeys) => {
        const minValue = key === 'rooms' || key === 'adults' ? 1 : 0;
        const currentValue = selection[key] || 0;
        const newValue = Math.max(minValue, currentValue - 1);

        const newSelection = {
            ...selection,
            [key]: newValue,
        };

        if (key === 'children' && newValue < selection.children) {
            newSelection.agesOfChildren = (selection.agesOfChildren || []).slice(0, newValue);
        }

        setSelection(newSelection);
        onSelectionChange(newSelection);
    };

    const handleAgeChange = (index: number, value: string) => {
        const newAges = [...(selection.agesOfChildren || [])];
        const age = value === "" ? null : Math.min(Math.max(parseInt(value, 10) || 0, 0), 12); // Limit range to 0-12
        newAges[index] = age!;

        setSelection({
            ...selection,
            agesOfChildren: newAges,
        });

    };

    const handleAgeBlur = (index: number) => {
        const newAges = [...(selection.agesOfChildren || [])];
        if (newAges[index] === null) {
            newAges[index] = 0; // Default to 0 if left empty
        }
        setSelection({
            ...selection,
            agesOfChildren: newAges,
        });
        onSelectionChange(selection);
    };

    const totalPeople = (selection.children || 0) + (selection.adults || 0);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-medium">
                    <Bed className="mr-2 h-4 w-4 text-gray-500" />
                    {`${selection.rooms || 0} Room, ${totalPeople} ${totalPeople === 1 ? 'Guest' : 'Guests'}`}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-80 w-64 mt-2 p-0 bg-background" align="end">
                <div className="p-4 w-full">
                    {(['rooms', 'adults', 'children'] as CountKeys[]).map((key) => (
                        <div key={key} className="flex w-full justify-between items-center mb-4">
                            <span className="capitalize text-sm text-gray-800 font-semibold">{key}</span>
                            <div className="flex border border-gray-200">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="p-0 border-l-0 border-y-0 bg-gray-50 rounded-none border-gray-200 border-r"
                                    onClick={() => handleDecrement(key)}
                                >
                                    <Minus className="h-2 w-2" />
                                </Button>
                                <span className="flex justify-center items-center w-12 text-center">{selection[key]}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="p-0 border-r-0 border-y-0 bg-gray-50 rounded-none border-gray-200 border-l"
                                    onClick={() => handleIncrement(key)}
                                >
                                    <Plus className="h-2 w-2" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {selection.children > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Children's Ages</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {selection.agesOfChildren?.map((age, index) => (
                                    <div key={index} className="flex flex-col items-start">
                                        <label className="text-sm font-medium text-gray-700">
                                            Child {index + 1}
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={17}
                                            value={age === null ? "" : age}
                                            onChange={(e) => handleAgeChange(index, e.target.value)}
                                            onBlur={() => handleAgeBlur(index)}
                                            className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                                            placeholder="Age"
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

export default RoomPeopleSelector;
