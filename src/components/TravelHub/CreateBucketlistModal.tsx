'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/dist/client/components/navigation'
import { WishlistAPI } from '@/services/api/wishlist'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

interface CreateBucketlistModalProps {
    isOpen: boolean
    onClose: () => void

}

const CreateBucketlistModal: React.FC<CreateBucketlistModalProps> = ({
    isOpen,
    onClose,

}) => {
    const router = useRouter();
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData(e.target as HTMLFormElement)
        const name = formData.get('bucketlist-name') as string
        try {
            const response = await WishlistAPI.createBucketlist(token as string, { name })
            if (response) {
                const queryParams = new URLSearchParams()
                queryParams.set('bucketName', name)
                queryParams.set('bucketId', response.id.toString())
                router.push(`/create-bucket?${queryParams.toString()}`);
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to create bucketlist',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create bucketlist',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[90%]  sm:w-full rounded-lg sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className='text-xl text-start md:text-2xl lg:text-3xl font-semibold text-foreground pb-4 md:pb-8'>Create New Bucketlist</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Name of Wishlist"
                        id='bucketlist-name'
                        name='bucketlist-name'
                        className='focus-visible:ring-0 mb-6 font-medium focus-visible:ring-offset-0 text-foreground placeholder:text-foreground/50 focus-visible:outline-none border border-gray-600 focus-visible:border focus-visible:border-primary-400'

                    />

                    <Button
                        type="submit"
                        className='bg-primary-400 rounded-xl text-base font-semibold w-full text-background hover:bg-primary-500'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create A Bucketlist'}
                    </Button>

                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBucketlistModal 