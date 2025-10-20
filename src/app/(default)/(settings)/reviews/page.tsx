'use client'
import ReviewCard from '@/components/Details_page/ReviewCard'
import ErrorState from '@/components/StateHandlers/ErrorState';
import { useAuth } from '@/hooks/useAuth';
import { ProfileApi } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import DataStateHandler from '@/components/StateHandlers/DataStateHandler';
import ReviewCardShimmer from '@/components/shimmers/ReviewCardShimmer';
import { Button } from '@/components/ui/button';

const Page = () => {
    const { token, user } = useAuth();
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['reviews', token, page],
        queryFn: () => ProfileApi.getReviews(token!, page),
        retry: false,
        enabled: !!token,
        refetchOnWindowFocus: false,
    });

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

    return (
        <div className="p-4">
            <h1 className='text-2xl font-semibold text-foreground pb-9'>My Reviews</h1>
            <DataStateHandler
                isLoading={isLoading || !data}
                error={isError ? new Error('Error fetching reviews') : null}
                isEmpty={data?.results.length === 0}
                loadingComponent={<ReviewCardShimmer />}
                emptyComponent={<EmptyComponent />}
                errorComponent={<ErrorState message='Error fetching reviews. Please try again later.' />}
            >
                <div className="space-y-4">
                    {data?.results.map((review, index) => (
                        <ReviewCard key={index}
                            userImage={user?.profile_picture || '/images/default-image.png'}
                            userName={user?.user.username!}
                            rating={review.rating}
                            timeAgo={timeAgo(review.created_at)}
                            review={review.comment}
                            initialLikes={review.like_count}
                            reviewId={review.id}
                            isFromProfile={true}
                            images={review.images || []}
                        />
                    ))}
                </div>

                {/* Pagination Controls */}
                {data && data.results.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {page} of {Math.ceil(data.count / 10)}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= Math.ceil(data.count / 10)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </DataStateHandler>
        </div>
    );
}

export default Page;

const EmptyComponent = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h2 className="text-xl font-semibold text-gray-700">No Reviews Found</h2>
            <p className="text-gray-500 mt-2">You haven't written any reviews yet.</p>
        </div>
    )
}

