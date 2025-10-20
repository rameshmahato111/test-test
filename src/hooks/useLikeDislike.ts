import { useEffect, useState } from 'react';
import { detailAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from './use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface UseLikeDislikeProps {
    initialLikes: number;
    initialDislikes: number;
    reviewId: string;
   
}

export const useLikeDislike = ({ 
    initialLikes, 
    initialDislikes, 
    reviewId,
  
}: UseLikeDislikeProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { token } = useAuth();

    useEffect(() => {
        if(token){
            detailAPI.isLikedOrDisliked(reviewId, token).then(res => {
                setIsLiked(res.is_liked);
                setIsDisliked(res.is_disliked);
            });
        }
    }, []);


    const handleLike = async () => {
        try {
            setIsLoading(true);
            
            if (!token) {
                toast({
                    title: 'Please login to like reviews',
                    variant: 'destructive',
                });
                return;
            }

            if (isLiked) {
                await detailAPI.unLikeReview(reviewId, token);
                setLikes(prev => prev - 1);
                setIsLiked(false);
            } else {
                await detailAPI.likeReview(reviewId, token);
                setLikes(prev => prev + 1);
                setIsLiked(true);
                
                if (isDisliked) {
                    setDislikes(prev => prev - 1);
                    setIsDisliked(false);
                }
            }
           

        } catch (error) {
            toast({
                title: error instanceof Error ? error.message : 'Failed to update like',
                variant: 'destructive',
            });
            console.error('Error in like/unlike:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDislike = async () => {
        try {
            setIsLoading(true);
            if (!token) {
                toast({
                    title: 'Please login to dislike reviews',
                    variant: 'destructive',
                });
                return;
            }

            if (isDisliked) {
                setDislikes(prev => prev - 1);
                await detailAPI.unLikeReview(reviewId, token);
                setIsDisliked(false);
            } else {
                setDislikes(prev => prev + 1);
                await detailAPI.dislikeReview(reviewId, token);
                setIsDisliked(true);
                
                if (isLiked) {
                    setLikes(prev => prev - 1);
                    setIsLiked(false);
                }
            }

          

        } catch (error) {
            toast({
                title: 'Failed to update dislike',
                variant: 'destructive',
            });
            console.error('Error in dislike/undislike:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        likes,
        dislikes,
        isLiked,
        isDisliked,
        isLoading,
        handleLike,
        handleDislike
    };
}; 