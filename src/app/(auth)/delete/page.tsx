'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'

import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { authApi } from '@/services/api'

const DeleteAccountPage = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const { token, logout } = useAuth()

    const handleDeleteAccount = async () => {
        try {
            setIsLoading(true)
            if (!token) {
                toast({
                    variant: 'error',
                    title: 'Error',
                    description: 'Please login to delete your account.',
                })
                return;
            }
            const res = await authApi.deleteAccount(email, token)
            if (res) {
                toast({
                    title: 'Account deleted successfully',
                    variant: 'success',
                    description: 'We&apos;re sorry to see you go. Your account has been permanently deleted.',
                })
                logout();
                router.push('/')

            } else {
                toast({
                    variant: 'error',
                    title: 'Error',
                    description: 'Incorrect password or something went wrong. Please try again.',
                })

            }
        } catch (error) {
            toast({
                variant: 'error',
                title: 'Error',
                description: 'Incorrect password or something went wrong. Please try again.',
            })
        } finally {
            setIsLoading(false)
            setShowConfirmDialog(false)
        }
    }

    return (
        <div className="container min-h-screen max-w-2xl mx-auto py-8 px-4">
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Delete Account</h1>
                    <p className="text-muted-foreground">
                        We're sorry to see you go. This action cannot be undone.
                    </p>
                </div>

                <div className="space-y-4 bg-card p-6 rounded-lg border">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Before you go...</h2>
                        <p className="text-sm text-muted-foreground">
                            Please note that deleting your account will:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Permanently delete all your data</li>
                            <li>Remove access to all services</li>
                            <li>Cancel any active subscriptions</li>
                            <li>This action cannot be reversed</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Enter Your Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full focus-visible:border-primary-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>

                    <Button
                        className="w-full bg-primary-400 text-white font-semibold hover:bg-primary-500"
                        onClick={() => setShowConfirmDialog(true)}
                        disabled={!email || isLoading}
                    >
                        {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Account
                    </Button>
                </div>
            </div>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='pb-4 text-2xl'>Are you absolutely sure?</DialogTitle>
                        <DialogDescription className='pb-4'>
                            This action cannot be undone. This will permanently delete your account and remove all
                            your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                            Cancel
                        </Button>
                        <Button className='bg-primary-400 text-white font-semibold hover:bg-primary-500' onClick={handleDeleteAccount} disabled={isLoading}>
                            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Yes, delete my account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DeleteAccountPage
