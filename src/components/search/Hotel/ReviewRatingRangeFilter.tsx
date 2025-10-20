import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface ReviewRatingRangeFilterProps {
    ratingRange: number[];
    onRatingRangeChange: (value: number[] | undefined) => void;
}

const ReviewRatingRangeFilter = ({ ratingRange, onRatingRangeChange }: ReviewRatingRangeFilterProps) => {
    const MIN_RATING = 0;
    const MAX_RATING = 5;
    const STEP = 1;

    const displayRange = ratingRange || [MIN_RATING, MAX_RATING];
    const [localRange, setLocalRange] = useState<number[]>(displayRange);
    const [activeHandle, setActiveHandle] = useState<'min' | 'max' | null>(null);

    useEffect(() => {
        setLocalRange(ratingRange || [MIN_RATING, MAX_RATING]);
    }, [ratingRange]);

    const handleValueChange = (newValue: number[]) => {
        const [newMin, newMax] = newValue;
        const [currentMin, currentMax] = localRange;

        // If no active handle, determine which one is moving
        if (activeHandle === null) {
            // Special case when min is at 0 and max changes
            if (currentMin === MIN_RATING && newMax !== currentMax) {
                setActiveHandle('max');
            } else {
                const minDiff = Math.abs(newMin - currentMin);
                const maxDiff = Math.abs(newMax - currentMax);
                setActiveHandle(minDiff > maxDiff ? 'min' : 'max');
            }
        }

        let updatedRange: number[];
        if (activeHandle === 'min') {
            updatedRange = [newMin, Math.max(newMin, currentMax)];
        } else {
            // When max handle is active
            updatedRange = [currentMin, Math.max(currentMin, newMax)];
        }

        setLocalRange(updatedRange);
    };

    const handleValueCommit = (value: number[]) => {
        setActiveHandle(null);
        if (value[0] !== MIN_RATING || value[1] !== MAX_RATING) {
            onRatingRangeChange(value);
        } else {
            onRatingRangeChange(undefined);
        }
    };

    return (
        <div className='pb-6 pt-4'>
            <h3 className="font-semibold text-foreground mb-4">Review Rating</h3>
            <Slider
                defaultValue={[MIN_RATING, MAX_RATING]}
                max={MAX_RATING}
                min={MIN_RATING}
                step={STEP}
                value={localRange}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
                className="mb-6"
            />
            <div className="flex justify-between items-center gap-4">
                <div className="border border-gray-200 shadow-cardShadow bg-background items-center px-2 py-1 flex gap-2 relative">
                    <p className='text-sm text-gray-500'>{localRange[0]} ★</p>
                </div>
                <div className="border border-gray-200 shadow-cardShadow bg-background items-center px-2 py-1 flex gap-2 relative">
                    <p className='text-sm text-gray-500'>{localRange[1]} ★</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewRatingRangeFilter;