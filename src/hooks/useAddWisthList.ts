import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from './use-toast';
import { WishlistAPI } from '@/services/api/wishlist';
import { useWishlist } from '@/contexts/WishlistContext';

export const useAddWishlist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const { wishlistItems, syncWishlist } = useWishlist();

  const checkItemInWishlist = useCallback((objectId: number, contentType: string) => {
    const key = `${contentType}|${objectId}`;
    return !!wishlistItems[key];
  }, [wishlistItems]);

  const addToWishlist = async (objectId: number, contentType: string) => {
    if (!isAuthenticated || !token) {
      toast({
        title: 'Please login to add to wishlist',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      await WishlistAPI.addToWishlist(token, {
        object_id: objectId,
        content_type: contentType
      });
      await syncWishlist(); // Sync after successful addition
      toast({
        title: 'Added to wishlist',
        variant: 'success',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Failed to add to wishlist',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (objectId: number, contentType: string) => {
    if (!isAuthenticated || !token) {
      toast({
        title: 'Please login to remove from wishlist',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      await WishlistAPI.removeFromWishlist(token, {
        object_id: objectId,
        content_type: contentType
      });
      await syncWishlist(); // Sync after successful removal
      toast({
        title: 'Removed from wishlist',
        variant: 'success',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Failed to remove from wishlist',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addToWishlist,
    removeFromWishlist,
    checkItemInWishlist,
    isLoading,
  };
};
