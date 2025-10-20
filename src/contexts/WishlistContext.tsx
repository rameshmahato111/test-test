'use client';
import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { WishlistAPI } from '@/services/api/wishlist';

const WISHLIST_STORAGE_KEY = 'user_wishlist';

type WishlistContextType = {
    wishlistItems: Record<string, boolean>;
    syncWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<Record<string, boolean>>({});
    const { isAuthenticated, token, logout } = useAuth();

    const syncWishlist = useCallback(async () => {
        if (!isAuthenticated || !token) {
            setWishlistItems({});
            localStorage.removeItem(WISHLIST_STORAGE_KEY);
            return;
        }

        try {
            const wishlistLookup = await WishlistAPI.wishlistIdsByUser(token);

            setWishlistItems(wishlistLookup as Record<string, boolean>);
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistLookup));
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('Invalid token')) {
                    logout();
                }
            }
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        syncWishlist();
    }, [syncWishlist]);

    return (
        <WishlistContext.Provider value={{ wishlistItems, syncWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}; 