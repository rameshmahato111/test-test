'use client'
import React, { useState } from 'react'
import HorizontalCardScroll from '@/components/HorizontalCardScroll'
import ImageWithTitle from '@/components/ImageWithTitle'
import BucketCard from '@/components/TravelHub/BucketCard'
import SavedCard from '@/components/TravelHub/SavedCard'
import { Button } from '@/components/ui/button'
import TravelHubEmptyState from './TravelHubEmptyState'
import { WishlistAPI } from '@/services/api/wishlist'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import DataStateHandler from '../StateHandlers/DataStateHandler'
import ShimmerCardGrid from '../shimmers/ShimmerCardGrid'
import CreateBucketlistModal from './CreateBucketlistModal'
import ErrorState from '../StateHandlers/ErrorState'
import ShimmerHorizontalCards from '../shimmers/ShimmerHorizontalCards'

const ITEMS_PER_PAGE = 12;

const TravelHub: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const { token } = useAuth();

    const {
        data: savedItems,
        isLoading: isLoadingSavedItems,
        error: errorSavedItems,
        isFetching: isFetchingSavedItems,
    } = useQuery({
        queryKey: ['savedItems', currentPage],
        queryFn: () => WishlistAPI.getWishlist(token!, currentPage, ITEMS_PER_PAGE),
        enabled: !!token,
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: 1,
    })
    const totalPages = Math.ceil((savedItems?.count || 0) / ITEMS_PER_PAGE)

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
        }
    }
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
        }
    }

    const {
        data: bucketlists,
        isLoading: isLoadingBucketlists,
        error: errorBucketlists,
        isFetching: isFetchingBucketlists
    } = useQuery({
        queryKey: ['bucketlists'],
        queryFn: () => WishlistAPI.getBucketlists(token!),
        enabled: !!token,
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    return (
        <>
            <ImageWithTitle title="Travel Hub" image={`/images/travel_hub.jpg`} />
            <div className='py-10 px-4 md:px-8 lg:px-10'>
                <h2 className='text-3xl font-semibold text-foreground'>Bucket Lists:</h2>
                <DataStateHandler
                    isLoading={isLoadingBucketlists || bucketlists === undefined}
                    isEmpty={!bucketlists?.length}
                    errorComponent={<ErrorState message={errorBucketlists?.message} />}
                    emptyComponent={
                        <TravelHubEmptyState
                            emptyState={{
                                title: "Your bucketlist is empty!",
                                description: "Add some items before you can add items in your bucketlist",
                                image: "/icons/empty-bucket.png",
                                buttonText: "Create New Wishlist",
                                showButton: false
                            }}
                        />
                    }
                    loadingComponent={<ShimmerHorizontalCards />}
                >
                    <div className={isFetchingBucketlists ? 'opacity-50 pointer-events-none' : ''}>
                        <HorizontalCardScroll>
                            {bucketlists?.map((bucket) => (
                                <BucketCard key={bucket.id} card={bucket} />
                            ))}
                        </HorizontalCardScroll>
                    </div>
                </DataStateHandler>

                <div className='flex justify-center mt-6'>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className='mx-auto w-full md:w-auto bg-primary-400 text-background hover:bg-primary-500 font-semibold text-base duration-300 px-4'
                    >
                        Create New Bucketlist
                    </Button>
                </div>

                <div className='mt-16'>
                    <h2 className='text-3xl font-semibold text-foreground'>Saved Items:</h2>
                    <DataStateHandler
                        error={errorSavedItems}
                        isLoading={isLoadingSavedItems}
                        isEmpty={!savedItems?.results?.length}
                        errorComponent={<ErrorState message={errorSavedItems?.message} />}
                        emptyComponent={
                            <TravelHubEmptyState
                                emptyState={{
                                    title: "Your saved items are empty!",
                                    description: "Start exploring and add saved items here",
                                    image: "/icons/empty-items.png",
                                    buttonText: "Explore New",
                                    showButton: true
                                }}
                            />
                        }
                        loadingComponent={<ShimmerCardGrid count={8} />}
                    >
                        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pt-8 ${isFetchingSavedItems ? 'opacity-50 pointer-events-none' : ''}`}>
                            {savedItems?.results.map((card) => (
                                <SavedCard key={card.id} className='w-full' card={card} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {savedItems && savedItems.results.length > 0 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <Button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1 || isFetchingSavedItems}
                                    variant="outline"
                                >
                                    Previous
                                </Button>
                                <span className="text-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages || isFetchingSavedItems}
                                    variant="outline"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </DataStateHandler>
                </div>

                <CreateBucketlistModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </>
    )
}

export default TravelHub
