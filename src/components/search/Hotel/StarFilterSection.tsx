import React from 'react';
import { cn } from '@/lib/utils';

interface StarFilterSectionProps {
    title: string;
    value?: number;
    onChange: (value: number) => void;
}

const StarFilterItem = ({ stars, isSelected, onClick }: {
    stars: number;
    isSelected: boolean;
    onClick: () => void
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                'px-3 py-2 rounded-lg text-sm border transition-all',
                'hover:border-primary-400 hover:text-primary-400',
                isSelected
                    ? 'border-primary-400 text-primary-400 bg-primary-50'
                    : 'border-gray-200 text-gray-600'
            )}
        >
            {`${Math.floor(stars)}${stars % 1 === 0.5 ? ' and half' : ''} star${stars === 1 ? '' : 's'}`}
        </button>
    );
};

const StarFilterSection = ({ title, value, onChange }: StarFilterSectionProps) => {
    const stars = [5, 4, 3, 2, 1];

    return (
        <div className='py-6 '>
            <h3 className='text-base font-medium pb-4'>{title}</h3>
            <div className='flex gap-2 flex-wrap'>
                {stars.map((starCount) => (
                    <StarFilterItem
                        key={starCount}
                        stars={starCount}
                        isSelected={value === starCount}
                        onClick={() => onChange(starCount)}
                    />
                ))}
            </div>
        </div>
    );
};

export default StarFilterSection; 