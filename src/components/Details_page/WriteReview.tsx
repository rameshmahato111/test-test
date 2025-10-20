import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Star, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { detailAPI } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface WriteReviewProps {
    isOpen: boolean;
    onClose: () => void;
    objectId: number;
    contentType: string;
}

interface UploadedImage {
    file: File;
    preview: string;
}

const WriteReview: React.FC<WriteReviewProps> = ({ isOpen, onClose, objectId, contentType }) => {
    const { token } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>('');
    const [hoveredStar, setHoveredStar] = useState<number>(0);
    const [images, setImages] = useState<UploadedImage[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const postReviewMutation = useMutation({
        mutationFn: (reviewData: { rating: number; comment: string; images: File[] }) =>
            detailAPI.postReview({
                object_id: objectId.toString(),
                content_type: contentType,
                rating: reviewData.rating,
                comment: reviewData.comment,
                images: reviewData.images,
            }, token!),
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Your review has been submitted successfully.",
                variant: "success"
            });

            queryClient.invalidateQueries({
                queryKey: ['reviews', objectId, contentType]
            });
            queryClient.invalidateQueries({
                queryKey: ['review-stats', objectId, contentType]
            });
            queryClient.invalidateQueries({
                queryKey: ['existingReviewsInfo']
            });
            setImages([]);
            setRating(0);
            setReview('');
            onClose();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to submit review",
                variant: "error"
            });
        }
    });

    const handleSubmit = () => {
        if (!rating || !review.trim()) {
            toast({
                title: "Error",
                description: "Please provide both a rating and a review.",
                variant: "error"
            });
            return;
        }

        // Get all image files from the uploaded images
        const imageFiles = images.map(img => img.file);

        postReviewMutation.mutate({
            rating,
            comment: review,
            images: imageFiles
        });
    };

    const handleImageUpload = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && images.length < 5) { // Limit to 5 images
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, {
                    file,
                    preview: reader.result as string
                }]);
            };
            reader.readAsDataURL(file);
        }
        // Reset input value to allow uploading the same image again
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };
    const closeDialog = () => {
        setImages([]);
        setRating(0);
        setReview('');
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle className='text-3xl font-semibold text-foreground'>Write A Review</DialogTitle>
                </DialogHeader>

                <p className="text-base font-medium text-gray-800">Rate your Experience <span className='text-primary-500'>*</span></p>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`cursor-pointer ${star <= (hoveredStar || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                                }`}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>

                <div className="py-3">
                    <p className="text-base font-medium text-gray-800 mb-2">Write your Experience <span className='text-primary-500'>*</span></p>
                    <textarea
                        className="w-full focus-visible:border-primary-400 focus:outline-none min-h-[140px] p-3 border rounded-md"
                        placeholder="Write your Experience"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                </div>

                <div className="py-3">
                    <p className="text-base font-medium text-gray-800 mb-2">
                        Upload Photo or Video (Optional) - {images.length}/5
                    </p>

                    {/* Image Preview Section */}
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {images.map((img, index) => (
                                <div key={index} className="relative w-24 aspect-square rounded-lg overflow-hidden">
                                    <Image
                                        src={img.preview}
                                        alt={`Preview ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        aria-label="Remove image"
                                        aria-describedby="remove-image-description"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    {images.length < 5 && (
                        <div
                            className="relative border bg-background border-gray-200 shadow-searchShadow rounded-md md:min-h-[170px] p-6 text-center cursor-pointer"
                            onClick={handleImageUpload}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                className='hidden'
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <div className="flex bg-primary-50 p-2 w-fit mx-auto rounded-lg justify-center mb-2">
                                <Upload className='w-6 h-6 text-primary-400' />
                            </div>
                            <p className="text-sm font-medium text-gray-800">Tap Here to Upload</p>
                            {/* <p className="text-xs text-gray-700">(Max. File size: 2 MB)</p> */}
                        </div>
                    )}
                </div>

                <Button
                    className="w-full bg-primary-400 hover:bg-primary-500 text-base font-semibold transition-all duration-300 text-white"
                    onClick={handleSubmit}
                    disabled={!rating || !review.trim() || postReviewMutation.isPending}
                >
                    {postReviewMutation.isPending ? 'Submitting...' : 'Write the Review'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default WriteReview;
