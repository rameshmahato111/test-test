import React, { useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


interface BookingConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bookingDetails: {
        itemName: string;
        checkIn: string;
        checkOut: string;
        adults: number;
        children: number;
        total: number;
    };
}


const BookingConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    bookingDetails
}: BookingConfirmationModalProps) => {
    const formatDate = useCallback((date: string): string => {
        const dateObj = new Date(date);
        return [
            dateObj.getFullYear(),
            String(dateObj.getMonth() + 1).padStart(2, '0'),
            String(dateObj.getDate()).padStart(2, '0')
        ].join('-');
    }, []);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-2xl font-semibold'>Confirm Your Booking</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold">{bookingDetails.itemName}</h3>
                        <div className="text-sm space-y-1">
                            <p className='text-gray-800'>Dates: {formatDate(bookingDetails.checkIn)} - {formatDate(bookingDetails.checkOut)}</p>
                            <p className='text-gray-800'>Guests: {bookingDetails.adults} Adults, {bookingDetails.children} Children</p>
                            <p className="font-semibold mt-2">Total Amount: ${bookingDetails.total}</p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button className='bg-primary-400 hover:bg-primary-500 duration-300 text-white' onClick={onConfirm}>Confirm Booking</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BookingConfirmationModal; 