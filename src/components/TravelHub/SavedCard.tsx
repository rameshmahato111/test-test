import React from 'react'
import Link from 'next/link'
import { CardProps } from '@/types'
import FavouriteToggler from '../Cards/FavouriteToggler'
import IconWithText from '../Cards/IconWithText'
import PopoverMenu from './PopMenu'
import { WishlistItem } from '@/schemas/wishlist'

export default function SavedCard({
    card,
    className,
    isFromCreateBucket = false,
    isSelected = false,
    showPopover = true,
    onSelect
}: {
    card: WishlistItem,
    className?: string,
    isFromCreateBucket?: boolean,
    isSelected?: boolean,
    showPopover?: boolean,
    onSelect?: (card: WishlistItem) => void
}) {
    const { item_details: { image, name }, content_type } = card

    const handleClick = () => {
        if (isFromCreateBucket && onSelect) {
            onSelect(card)
        }
    }

    const CardWrapper: React.ElementType = isFromCreateBucket ? 'div' : Link
    const wrapperProps = isFromCreateBucket ? {
        onClick: handleClick,
        className: `block bg-background hover:-translate-y-2 my-2 h-full transition-all duration-300 rounded-lg cursor-pointer shadow-cardShadow overflow-hidden relative w-[295px] ${className} 
        ${isSelected ? 'ring-2 ring-primary-400' : ''}`
    } : {
        href: `/detail/${card.object_id}/?type=${content_type.toLowerCase()}`,
        className: `block bg-background hover:-translate-y-2 my-2 h-full transition-all duration-300 rounded-lg cursor-pointer shadow-cardShadow overflow-hidden relative w-[295px] ${className}`
    }

    return (
        <CardWrapper {...wrapperProps}>
            <div className='relative h-[188px]'>
                <div className='absolute flex items-center gap-2 top-2 right-2 z-10'>
                    <FavouriteToggler cardId={card.object_id} contentType={content_type.toLowerCase()} />
                </div>
                <img src={image} alt="card" className='w-full h-full object-cover' />
            </div>

            <div className='py-6 px-3'>
                <h2 className='text-xl line-clamp-2 font-semibold text-gray-800'>{name}</h2>
            </div>
        </CardWrapper>
    )
}