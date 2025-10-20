'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ChevronDownIcon, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PopoverWithSearchProps {
    options: string[]
    placeholder: string
    initialSelected?: string,
    className?: string
    value?: string
    contentClassName?: string
    onChange?: (value: string) => void
    onOpen?: () => void
    onSearch?: (term: string) => void
}


const PopoverWithSearch: React.FC<PopoverWithSearchProps> = ({
    options,
    placeholder,

    initialSelected = '',
    className,
    value,
    onChange,
    contentClassName,
    onOpen,
    onSearch,
}) => {
    const [selected, setSelected] = useState(initialSelected)
    const [searchTerm, setSearchTerm] = useState(value || '')
    const [open, setOpen] = useState(false)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value
        setSearchTerm(term)
        onSearch?.(term)
    }

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelect = (option: string) => {
        setSelected(option)
        onChange?.(option)
        setOpen(false)
    }

    const handleOpenChange = (newOpen: boolean) => {

        setOpen(newOpen)
        if (newOpen) {
            onOpen?.()
            setSearchTerm('')
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn(" flex items-center border-primary-400  justify-between outline-ring-0", className)}>
                    <p className='text-ellipsis overflow-hidden'>

                        {selected || <span className='text-gray-500'>{placeholder}</span>}
                    </p>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("bg-background w-[370px] p-0", contentClassName)} align="start">
                <div className="py-6">
                    <div className="flex mx-4 items-center border rounded-lg px-2 border-gray-200 mb-4">
                        <Search className="w-6 h-6 text-gray-500" />
                        <Input
                            type="text"

                            placeholder={`Search for a ${placeholder.toLowerCase()}`}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <ul className="space-y-1 px-4 max-h-[200px] overflow-y-auto">
                        {filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                className={`p-2 border border-transparent text-base font-medium text-gray-800 rounded-md cursor-pointer ${option === selected
                                    ? 'bg-primary-0 text-foreground !border-primary-400'
                                    : 'hover:bg-primary-0'
                                    }`}
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default PopoverWithSearch
