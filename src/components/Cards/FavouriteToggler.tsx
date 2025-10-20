'use client'
import { Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useAddWishlist } from '@/hooks/useAddWisthList';

const FavouriteToggler = ({
  cardId,
  contentType = 'activity'
}: {
  cardId: number,
  contentType?: string
}) => {

  const [isFavourite, setIsFavourite] = useState(false);
  const { addToWishlist, removeFromWishlist, checkItemInWishlist, isLoading } = useAddWishlist();

  useEffect(() => {
    setIsFavourite(checkItemInWishlist(cardId, contentType));
  }, [cardId, contentType, checkItemInWishlist]);

  const handleFavouriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopPropagation();

    if (isLoading) return;

    // Optimistically update UI
    setIsFavourite(!isFavourite);

    try {
      const success = isFavourite
        ? await removeFromWishlist(cardId, contentType)
        : await addToWishlist(cardId, contentType);

      // Revert if operation failed
      if (!success) {
        setIsFavourite(isFavourite);
      }
    } catch (error) {
      // Revert on error
      setIsFavourite(isFavourite);
      console.error('Failed to toggle wishlist:', error);
    }
  }

  return (
    <div onClick={handleFavouriteToggle} className='w-[26px] h-[26px] bg-background rounded-full p-[6px] flex items-center justify-center'>
      <Heart
        className={`${isLoading ? 'opacity-50' : ''} ${isFavourite ? "fill-primary-400 text-primary-400" : "fill-none text-gray-600"
          }`}
      />
    </div>
  )
}

export default FavouriteToggler
