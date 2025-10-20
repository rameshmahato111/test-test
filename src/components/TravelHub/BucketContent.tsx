'use client';
import React, { useState } from 'react'
import ImageWithTitle from '../ImageWithTitle'
import SavedCard from './SavedCard'
import { WishlistAPI } from '@/services/api/wishlist';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import DataStateHandler from '../StateHandlers/DataStateHandler';
import ErrorState from '../StateHandlers/ErrorState';

import { EllipsisVertical } from 'lucide-react';
import ShimmerContainer from '../shimmers/ShimmerContainer';
import ShimmerCardGrid from '../shimmers/ShimmerCardGrid';
import ShimmerText from '../shimmers/ShimmerText';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import EmptyState from '../StateHandlers/EmptyState';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog"
import Link from 'next/link';

const BucketContent = ({ bucketId }: { bucketId: number }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const router = useRouter()
    const { token } = useAuth();

    const { data: bucketlist, isLoading, isFetching, error } = useQuery({
        queryKey: ['bucketlist', bucketId],
        queryFn: () =>
            WishlistAPI.getBucketlistById(token as string, { id: bucketId }),
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 0,
        enabled: !!token
    })
    const handleDeleteBucketList = async () => {
        await WishlistAPI.deleteBucketlist(token as string, { id: bucketId })
        setShowDeleteDialog(false)
        setIsOpen(false)
        router.push('/travel-hub')
    }
    const handleAddToBucketList = () => {
        router.push(`/create-bucket?bucketId=${bucketId}&bucketName=${bucketlist?.bucket_list.name}`)

    }
    return (
        <div>
            <DataStateHandler
                isLoading={isLoading || bucketlist === undefined}
                isEmpty={bucketlist?.bucket_list.wishlist_items.length === undefined || bucketlist?.bucket_list.wishlist_items.length === 0}
                errorComponent={<ErrorState message={error?.message} />}
                emptyComponent={<div className='min-h-[60vh] flex items-center justify-center'>
                    <div>

                        <EmptyState message='No bucketlist found' />

                        <Button onClick={handleAddToBucketList} className='bg-primary-400 text-white'>
                            Add Items to Bucketlist
                        </Button>

                    </div>
                </div>}
                loadingComponent={<div>
                    <ShimmerContainer width='100%' className='mb-6' height='300px' />
                    <ShimmerText className='my-6' width='w-48' />
                    <ShimmerCardGrid count={6} />
                </div>}>

                <ImageWithTitle title={bucketlist?.bucket_list.name || 'Bucket Name'} image={bucketlist?.bucket_list.cover_image || `/images/city_landscape.jpg`} />
                <div className='mt-10 px-4 md:px-6'>
                    <div className='flex items-center justify-between'>

                        <h1 className='text-3xl font-semibold text-foreground pb-4'>Bucket Items({bucketlist?.bucket_list.wishlist_items.length})</h1>
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    className='bg-primary-500 w-10 h-10 rounded-full shadow-cardShadow p-1 flex items-center justify-center'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setIsOpen(!isOpen)
                                    }}
                                >
                                    <EllipsisVertical className='w-4 h-4 text-white' />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align='end' className="w-full mt-2 bg-background p-2">
                                <Button
                                    className=' hover:bg-primary-50 w-full justify-start'
                                    onClick={handleAddToBucketList}
                                >
                                    <p className='text-base font-medium text-gray-800'>Add Item</p>
                                </Button>
                                <Button
                                    className='hover:bg-primary-50 w-full justify-start'
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    <p className='text-base font-medium text-gray-800'>Delete Bucket</p>
                                </Button>
                            </PopoverContent>
                        </Popover>

                    </div>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pt-8 ${isFetching ? 'opacity-50 pointer-events-none' : ''}`}>
                        {
                            bucketlist?.bucket_list.wishlist_items.map((item) => (
                                <SavedCard key={item.id} showPopover={false} className='w-full' card={item} />
                            ))
                        }
                    </div>
                </div>
            </DataStateHandler>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className='bg-background w-[90%] rounded-lg shadow-cardShadow'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-2xl font-semibold'>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your bucket list
                            and remove all items from it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-primary-400 font-semibold text-white' onClick={handleDeleteBucketList}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default BucketContent
