import React from 'react';
import ShimmerContainer from './ShimmerContainer';
import ShimmerImage from './ShimmerImage';
import ShimmerText from './ShimmerText';

const ReviewCardShimmer = () => {
    return (
        <div className="border-b border-gray-200 py-8">
            <div className="flex items-start justify-between">
                <div className="flex gap-3">
                    {/* Avatar shimmer */}
                    <ShimmerImage width="w-10" height="h-10" className="rounded-full" />
                    <div>
                        {/* Username shimmer */}
                        <ShimmerText width="w-24" height="h-5" className="mb-2" />
                        <div className="flex items-center gap-2">
                            {/* Rating stars shimmer */}
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <ShimmerContainer
                                        key={i}
                                        width="14px"
                                        height="14px"
                                        className="rounded-full"
                                    />
                                ))}
                            </div>
                            {/* Time ago shimmer */}
                            <ShimmerText width="w-16" height="h-3" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Review text shimmer */}
            <div className="my-6 space-y-2">
                <ShimmerText width="w-full" height="h-4" />
                <ShimmerText width="w-3/4" height="h-4" />
                <ShimmerText width="w-1/2" height="h-4" />
            </div>
            {/* Like/Dislike buttons shimmer */}
            <div className="flex items-center gap-6">
                <ShimmerContainer width="24px" height="24px" className="rounded" />
                <ShimmerContainer width="24px" height="24px" className="rounded" />
            </div>
        </div>
    );
};

export default ReviewCardShimmer; 