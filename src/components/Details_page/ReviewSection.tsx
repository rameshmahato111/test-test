import React, { useState, useEffect } from 'react'
import ReviewCard from './ReviewCard'
import { Button } from '../ui/button'
import { useQuery } from '@tanstack/react-query'
import { API_BASE_URL, detailAPI } from '@/services/api'
import DataStateHandler from '../StateHandlers/DataStateHandler'
import ReviewCardShimmer from '../shimmers/ReviewCardShimmer'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
const REVIEWS_PER_PAGE = 5;


const ReviewSection = ({ id, type }: { id: string, type: string }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['reviews', id, type, currentPage],
        queryFn: async () => {
            try {
                return await detailAPI.getReviews({
                    id,
                    type,
                    page: currentPage,
                    limit: REVIEWS_PER_PAGE
                });
            } catch (err) {
                console.error('Error fetching reviews:', err);
                throw err;
            }
        },
        retry: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });

    const totalPages = data ? Math.ceil(data.count / REVIEWS_PER_PAGE) : 0;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        document.getElementById('review-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const LoadingComponent = () => (
        <div className="divide-y divide-gray-200">
            {[...Array(3)].map((_, index) => (
                <ReviewCardShimmer key={index} />
            ))}
        </div>
    );

    const EmptyComponent = () => (
        <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold text-gray-700">No Reviews Yet</h3>
            <p className="text-gray-500 mt-2">Be the first one to review!</p>
        </div>
    );

    const ErrorComponent = () => (
        <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold text-gray-700">Failed to Load Reviews</h3>
            <p className="text-gray-500 mt-2">
                {error instanceof Error ? error.message : 'Please try again later'}
            </p>

        </div>
    );

    const timeAgo = (date: string) => {
        const now = new Date();
        const reviewDate = new Date(date);
        const secondsAgo = Math.floor((now.getTime() - reviewDate.getTime()) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(secondsAgo / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    }

    const PaginationControls = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-start ml-8 gap-2 mt-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 bg-white"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                            return (
                                <Button
                                    key={pageNumber}
                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`w-9 h-9 ${currentPage === pageNumber
                                        ? 'bg-primary-400 text-white hover:bg-primary-500'
                                        : ''
                                        }`}
                                >
                                    {pageNumber}
                                </Button>
                            );
                        } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                        ) {
                            return <span key={pageNumber}>...</span>;
                        }
                        return null;
                    })}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        );
    };



    return (
        <div className='pb-9' id="review-section">
            <div className='flex justify-between items-center mb-6'>
                <p className='text-sm md:text-base font-medium text-foreground'>Reviews:</p>
                <div className='flex items-center gap-2'>
                    {/* <SortBy value='recommendation' onChange={() => { }} /> */}
                </div>
            </div>
            <DataStateHandler
                isLoading={isLoading}
                error={error as Error | null}
                isEmpty={data?.results?.length === 0}
                loadingComponent={<LoadingComponent />}
                emptyComponent={<EmptyComponent />}
                errorComponent={<ErrorComponent />}
            >
                <div className="divide-y divide-gray-200">
                    {data?.results?.map((review, index) => (
                        <ReviewCard
                            key={index}
                            userImage={`${API_BASE_URL}${review.user.profile_picture}`}
                            userName={review.user.username}
                            rating={review.rating}
                            timeAgo={timeAgo(review.created_at)}
                            review={review.comment}
                            like_count={review.like_count!}
                            dislike_count={review.dislike_count!}
                            images={review.images}
                            reviewId={review.id}
                            isOwner={review.user.id === user?.user.id}
                        />
                    ))}
                </div>
                <PaginationControls />
            </DataStateHandler>
        </div>
    )
}

export default ReviewSection
