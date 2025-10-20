import { Hotel, Compass } from 'lucide-react';
import ShimmerText from '@/components/shimmers/ShimmerText';
import ShimmerContainer from '@/components/shimmers/ShimmerContainer';

const Loading = () => {
    return (
        <div className="space-y-6">
            {/* Title */}
            <h1 className="text-2xl text-foreground font-semibold">My Bookings</h1>

            {/* Tabs */}
            <div className="w-full">
                <div className="relative">
                    <div className="w-full flex h-auto p-0 bg-transparent">
                        <div className="relative flex items-center gap-2 px-4 pb-4 pt-2 text-base font-medium text-gray-400">
                            <Hotel className="w-5 h-5" />
                            Hotels (0)
                        </div>
                        <div className="relative flex items-center gap-2 px-4 pb-4 pt-2 text-base font-medium text-gray-400">
                            <Compass className="w-5 h-5" />
                            Activities (0)
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
                </div>

                {/* Shimmer Cards */}
                <div className="space-y-6 mt-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 rounded-lg border border-gray-200 bg-background">
                            <div className="flex gap-6">
                                {/* Left Image/Icon Placeholder */}
                                <ShimmerContainer width="160px" height="160px" className="rounded-lg flex-shrink-0" />

                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="space-y-2">
                                            <ShimmerText width="w-64" height="h-6" />
                                            <div className="flex items-center gap-2">
                                                <ShimmerContainer width="16px" height="16px" className="rounded-full" />
                                                <ShimmerText width="w-48" height="h-4" />
                                            </div>
                                        </div>
                                        <ShimmerContainer width="80px" height="24px" className="rounded-full" />
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">
                                        <div className="flex items-start gap-3">
                                            <ShimmerContainer width="20px" height="20px" className="rounded mt-1" />
                                            <div className="space-y-2">
                                                <ShimmerText width="w-24" height="h-4" />
                                                <ShimmerText width="w-32" height="h-4" />
                                                <ShimmerText width="w-16" height="h-3" />
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <ShimmerContainer width="20px" height="20px" className="rounded mt-1" />
                                            <div className="space-y-2">
                                                <ShimmerText width="w-24" height="h-4" />
                                                <ShimmerText width="w-32" height="h-4" />
                                                <ShimmerText width="w-16" height="h-3" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-6">
                                            <div className="space-y-1">
                                                <ShimmerText width="w-24" height="h-3" />
                                                <ShimmerText width="w-32" height="h-4" />
                                            </div>
                                            <div className="space-y-1">
                                                <ShimmerText width="w-16" height="h-3" />
                                                <ShimmerText width="w-24" height="h-4" />
                                            </div>
                                            <ShimmerContainer width="80px" height="24px" className="rounded" />
                                        </div>
                                        <div className="text-right space-y-1">
                                            <ShimmerText width="w-20" height="h-3" />
                                            <ShimmerText width="w-28" height="h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Loading;
