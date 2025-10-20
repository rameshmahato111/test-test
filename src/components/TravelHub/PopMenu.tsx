'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { EllipsisVertical } from 'lucide-react'

export default function PopoverMenu() {
    const [isOpen, setIsOpen] = useState(false)

    const handleAddToBucketList = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Add your logic here to add the item to the bucket list
        // console.log('Added to bucket list')
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    className='bg-background w-7 h-7 rounded-full p-1 flex items-center justify-center'
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsOpen(!isOpen)
                    }}
                >
                    <EllipsisVertical className='w-4 h-4 text-gray-600' />
                </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className="w-full p-0 mt-2">
                <Button
                    className='bg-background p-4 w-full justify-start'
                    onClick={handleAddToBucketList}
                >
                    <p className='text-base font-medium text-gray-800'>Add Item to BucketList</p>
                </Button>
            </PopoverContent>
        </Popover>
    )
}