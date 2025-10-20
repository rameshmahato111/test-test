import React from 'react'
import Stars from './Stars';
import { useQuery } from '@tanstack/react-query';
import { detailAPI } from '@/services/api';
import { Loader2 } from 'lucide-react';


const RatingDetails = ({ id, type }: { id: string, type: string }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['review-stats', id, type],
        queryFn: async () => {
            try {
                return await detailAPI.getReviewStats(id, type);
            } catch (err) {
                console.error('Error fetching review stats:', err);
                throw err;
            }
        },
        retry: 2,
        retryDelay: 2000,
    });

    // Calculate percentage for each star rating
    const getPercentage = (count: number) => {
        if (!data?.total_reviews || data.total_reviews === 0) return 0;
        return (count / data.total_reviews) * 100;
    };

    // Convert rating distribution object to array for rendering
    const getRatingBars = (distribution: Record<string, number>) => {
        return Object.entries(distribution)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([rating, count]) => ({
                stars: Number(rating),
                count: count
            }));
    };

    return (
        <div>
            <h4 className='text-xl md:text-2xl lg:text-3xl pb-4 md:pb-8 text-foreground font-semibold'>
                Ratings
            </h4>
            <div className='flex gap-4 md:gap-12 bg-primary-0 p-6 rounded-xl'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='text-5xl font-medium text-foreground flex items-center'>
                        {isLoading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
                        ) : (
                            data?.average_rating?.toFixed(1) || '0.0'
                        )}
                    </div>
                    <Stars starSize='14' rating={data?.average_rating || 0} />
                    <p className='text-sm text-gray-700 mt-1'>
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-primary-400" />
                        ) : (
                            `${data?.total_reviews || 0} Reviews`
                        )}
                    </p>
                </div>
                <div className='flex-1 space-y-2'>
                    {getRatingBars(data?.rating_distribution || {}).map(({ stars, count }) => (
                        <div key={stars} className='flex items-center gap-4'>
                            <p className='text-sm text-gray-700'>{stars}</p>
                            <div className='flex-1 h-1 bg-gray-200 rounded-full overflow-hidden'>
                                <div
                                    className='h-full bg-primary-400 rounded-full transition-all duration-500'
                                    style={{
                                        width: `${isLoading ? 0 : getPercentage(count)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RatingDetails;
