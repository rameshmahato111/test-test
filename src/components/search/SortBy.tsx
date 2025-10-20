'use client'
import React from 'react'
import PopoverSelector from '../PopoverSelector'
import { cn } from '@/lib/utils'

interface SortByProps {
    className?: string
    value: string
    onChange: (value: string) => void
}

const SortBy: React.FC<SortByProps> = ({ className, value, onChange }) => {
    const sortOptions = [
        { value: "recommendation", label: "Recommendation" },
        { value: "price-low-high", label: "Price: Low to High" },
        { value: "price-high-low", label: "Price: High to Low" },
        { value: "relevance", label: "Relevance" },
        { value: "rating", label: "Rating" },
        { value: "popularity", label: "Popularity" }
    ]

    return (
        <div className={cn("", className)}>
            <PopoverSelector
                options={sortOptions}
                placeholder="Sort by"
                onSelect={onChange}
                className="w-[240px] shadow-sm"
                initialValue={value}
                showPrefix={true}
            />
        </div>
    )
}

export default SortBy
