import React, { useCallback } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { StarRating } from './StarRating';

interface FilterSectionProps {
    title: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
    value?: string;
    showMore?: boolean;
}

const FilterSection = React.memo(({ title, options, onChange, value, showMore }: FilterSectionProps) => {
    // Memoize the change handler
    const handleChange = useCallback((newValue: string) => {
        onChange(newValue);
    }, [onChange]);

    return (
        <div className="py-4">
            <h3 className="font-medium mb-4">{title}</h3>
            <RadioGroup value={value} onValueChange={handleChange}>
                {options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={option.value} id={`${title}-${option.value}`} />
                        {/* <Label htmlFor={`${title}-${option.value}`}>{option.label}</Label> */}
                        <StarRating rating={Number(option.value)} />
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
});

FilterSection.displayName = 'FilterSection';

export default FilterSection; 