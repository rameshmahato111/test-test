'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
    value: string
    label: string
}

interface PopoverSelectorProps {
    options: Option[]
    placeholder: string
    onSelect: (value: string) => void
    className?: string
    initialValue?: string
    showPrefix?: boolean
    contentClassName?: string
}

const PopoverSelector: React.FC<PopoverSelectorProps> = ({
    options,
    placeholder,
    onSelect,
    className = '',
    initialValue = '',
    contentClassName = '',
    showPrefix = false
}) => {

    const [selectedValue, setSelectedValue] = useState<string>(initialValue);
    const [open, setOpen] = useState<boolean>(false);

    const handleSelect = (value: string) => {
        setSelectedValue(value)
        onSelect(value)
        setOpen(false)
    }

    const selectedOption = options.find(option => option.value === selectedValue)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className={`bg-background w-full border rounded-lg py-2 px-4 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background text-sm font-inter font-medium justify-between ${className}`}>
                    <span className="truncate w-[calc(100%-24px)] text-left">
                        {showPrefix && <span className="text-gray-500 mr-2">{placeholder}</span>}
                        {selectedOption ? selectedOption.value : <span className='text-gray-500'>{placeholder}</span>}
                    </span>
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className={cn('w-[300px] mt-2 bg-background p-0 rounded-lg shadow-lg', contentClassName)}>
                <div className="max-h-[300px] overflow-y-auto py-2">
                    {options.map((option) => (
                        <Button
                            key={option.value}
                            variant="ghost"
                            className={`w-full justify-start font-normal px-4 py-2 ${selectedValue === option.value ? 'bg-primary-100 text-gray-900' : 'text-gray-700 hover:bg-primary-0'}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            <span className="truncate">
                                {option.label}
                            </span>
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default PopoverSelector
