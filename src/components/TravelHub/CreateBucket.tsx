'use client'
import React, { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import SavedCard from './SavedCard'
import { WishlistItem } from '@/schemas/wishlist'
import { useQuery } from '@tanstack/react-query'
import { WishlistAPI } from '@/services/api/wishlist'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import DataStateHandler from '../StateHandlers/DataStateHandler'
import ShimmerCardGrid from '../shimmers/ShimmerCardGrid'
import EmptyState from '../StateHandlers/EmptyState'
import ErrorState from '../StateHandlers/ErrorState'
import { useQueryClient } from '@tanstack/react-query'
import Loader from '../Loader'
const ITEMS_PER_PAGE = 10

const CreateBucket = ({ bucketId, bucketName }: { bucketId: string, bucketName: string }) => {
    const queryClient = useQueryClient()
    const [selectedCards, setSelectedCards] = useState<WishlistItem[]>([])
    const [existingItems, setExistingItems] = useState<Set<number>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { token } = useAuth()

    // Query for existing bucket items
    const { data: bucketData } = useQuery({
        queryKey: ['bucketlist', bucketId],
        queryFn: () => WishlistAPI.getBucketlistById(token!, { id: parseInt(bucketId) }),
        enabled: !!token && !!bucketId
    })

    // Update existing items when bucket data changes
    useEffect(() => {
        if (bucketData?.bucket_list.wishlist_items) {
            const itemIds = new Set(
                bucketData.bucket_list.wishlist_items.map(item => item.id)
            )
            setExistingItems(itemIds)
        }
    }, [bucketData])

    // Query for initial wishlist items
    const {
        data: initialItems,
        isLoading: isLoadingInitial,
        error: initialError
    } = useQuery({
        queryKey: ['savedItems'],
        queryFn: () => WishlistAPI.getWishlist(token!, 1, ITEMS_PER_PAGE),
        enabled: !!token && !searchQuery,
    })

    // Query for search results
    const {
        data: searchResults,
        isLoading: isLoadingSearch,
        error: searchError
    } = useQuery({
        queryKey: ['searchWishlist', searchQuery],
        queryFn: () => WishlistAPI.searchWishlist(token!, { query: searchQuery }),
        enabled: !!token && !!searchQuery,
    })

    const handleCardSelect = (card: WishlistItem) => {
        setSelectedCards(prev => {
            const isAlreadySelected = prev.some(item => item.id === card.id)
            if (isAlreadySelected) {
                return prev.filter(item => item.id !== card.id)
            }
            return [...prev, card]
        })
    }

    const handleCreateBucket = async () => {
        setIsLoading(true)
        try {
            // Filter out existing items from the selected cards
            const newItems = selectedCards.filter(card => !existingItems.has(card.id))

            const allPromise = newItems.map((card) =>
                WishlistAPI.addItemToBucketlist(token!, {
                    bucketlist_id: parseInt(bucketId),
                    wishlist_item_id: card.id
                })
            )
            await Promise.all(allPromise)
            queryClient.invalidateQueries({ queryKey: ['bucketlist', bucketId] })
            router.push('/travel-hub')
        } catch (error) {
            console.error('Error creating bucket:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Determine which data to show based on search state
    const isFetchLoading = isLoadingInitial || isLoadingSearch
    const error = searchQuery ? searchError : initialError
    const items = searchQuery ? searchResults : initialItems?.results

    return (
        <div>
            <div className="my-6">

                <Input
                    placeholder='Search for items from wishlist'
                    className='w-full focus-visible:ring-0 mb-6 font-medium focus-visible:ring-offset-0 text-foreground placeholder:text-foreground/50 focus-visible:outline-none border border-gray-600 focus-visible:border focus-visible:border-primary-400'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <DataStateHandler
                    isLoading={isFetchLoading}
                    loadingComponent={<ShimmerCardGrid count={6} />}
                    emptyComponent={
                        <EmptyState
                            message={searchQuery ? 'No items found for your search' : 'No saved items found'}
                        />
                    }
                    isEmpty={!items?.length}
                    errorComponent={<ErrorState message={error?.message} />}
                >
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {items?.map((card) => (
                            <SavedCard
                                key={card.id}
                                className='w-full'
                                isFromCreateBucket={true}
                                card={card}
                                isSelected={selectedCards.some(item => item.id === card.id) || existingItems.has(card.id)}
                                onSelect={handleCardSelect}
                            />
                        ))}
                    </div>
                </DataStateHandler>
            </div>

            <div className='mt-6 flex justify-end'>
                <Button
                    onClick={handleCreateBucket}
                    disabled={selectedCards.filter(card => !existingItems.has(card.id)).length === 0}
                    className='bg-primary-400 text-background hover:bg-primary-500'
                >
                    Add to Bucket ({selectedCards.filter(card => !existingItems.has(card.id)).length} new items)
                </Button>
            </div>
            {isLoading && <Loader />}
        </div>
    )
}

export default CreateBucket
