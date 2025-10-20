
import React from 'react';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import Stars from './Stars';
import { ReviewCardProps } from '@/types/details';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useLikeDislike } from '@/hooks/useLikeDislike';



const ReviewCard = ({
    userImage,
    userName,
    rating,
    timeAgo,
    review,
    like_count = 0,
    dislike_count = 0,
    images = [],
    reviewId,
    isOwner = false,
    isFromProfile = false,

}: ReviewCardProps) => {

    const {
        likes,
        dislikes,
        isLiked,
        isDisliked,
        isLoading,
        handleLike,
        handleDislike
    } = useLikeDislike({
        initialLikes: like_count,
        initialDislikes: dislike_count,
        reviewId: reviewId.toString(),

    });



    return (
        <div className="border-b border-gray-200 py-8">
            <div className="flex items-start justify-between">
                <div className="flex gap-3">
                    <Avatar className='w-10 h-10'>
                        <AvatarImage src={userImage} alt={userName} />
                        <AvatarFallback className='bg-primary-400 text-white'>{'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm md:text-base text-foreground">{userName}</h3>
                        <div className="flex items-center gap-2">
                            <Stars rating={rating} starSize="14" />
                            <span className="text-[10px] md:text-xs text-gray-700 font-normal">{timeAgo}</span>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 my-6">{review}</p>
            {!isOwner && <div className="flex items-center gap-6">
                <button
                    aria-label="Like review"
                    aria-describedby="like-review-description"
                    onClick={handleLike}
                    disabled={isLoading || isFromProfile}
                    className={`flex items-center gap-1 text-sm hover:text-primary-400 transition-colors ${isLiked ? 'text-primary-400' : 'text-gray-500'
                        }`}
                >
                    <ThumbsUp
                        className="w-4 h-4"
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                    />
                    <span>{likes}</span>
                </button>
                <button
                    aria-label="Dislike review"
                    aria-describedby="dislike-review-description"
                    onClick={handleDislike}
                    disabled={isLoading || isFromProfile}
                    className={`flex items-center gap-1 text-sm hover:text-primary-400 transition-colors ${isDisliked ? 'text-primary-400' : 'text-gray-500'
                        }`}
                >
                    <ThumbsDown
                        className="w-4 h-4"
                        fill={isDisliked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                    />
                    <span>{dislikes}</span>
                </button>
            </div>}

            {images.length > 0 && <div className='flex gap-2 mt-4'>
                {images.map((image) => (
                    <Image key={image.id} className='object-cover border border-gray-200 rounded-lg' src={image.image} alt={image.caption || 'Review Image'} width={100} height={100} />
                ))}
            </div>}
        </div>
    );
};

export default ReviewCard;
