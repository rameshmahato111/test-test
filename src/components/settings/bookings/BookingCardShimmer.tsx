import ShimmerContainer from '../../shimmers/ShimmerContainer';
import ShimmerText from '../../shimmers/ShimmerText';

const BookingCardShimmer = () => {
    return (
        <div className="p-6 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                    <ShimmerText width="w-48" height="h-6" />
                    <ShimmerText width="w-32" height="h-4" />
                </div>
                <ShimmerContainer width="80px" height="24px" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                    <ShimmerText width="w-20" height="h-4" />
                    <ShimmerText width="w-24" height="h-5" />
                </div>
                <div className="space-y-2">
                    <ShimmerText width="w-20" height="h-4" />
                    <ShimmerText width="w-24" height="h-5" />
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <ShimmerText width="w-32" height="h-4" />
                    <ShimmerText width="w-24" height="h-5" />
                </div>
                <div className="space-y-2">
                    <ShimmerText width="w-24" height="h-4" />
                    <ShimmerText width="w-20" height="h-6" />
                </div>
            </div>

            <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                    <ShimmerContainer width="100px" height="24px" />
                    <ShimmerText width="w-32" height="h-4" />
                </div>
            </div>
        </div>
    );
};

export default BookingCardShimmer; 