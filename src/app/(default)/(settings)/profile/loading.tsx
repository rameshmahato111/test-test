import ShimmerButton from '@/components/shimmers/ShimmerButton'
import ShimmerImage from '@/components/shimmers/ShimmerImage'
import ShimmerText from '@/components/shimmers/ShimmerText'
import ShimmerContainer from '@/components/shimmers/ShimmerContainer'
import React from 'react'

const loading = () => {
    return (
        <div className="space-y-8">
            {/* Avatar section */}
            <div className='relative w-fit mb-9'>
                <ShimmerImage width='w-20' height='h-20' className="rounded-full" />
                <div className='absolute bottom-0 right-0 z-10 rounded-full p-1'>
                    <ShimmerContainer width="24px" height="24px" className="rounded-full" />
                </div>
            </div>

            {/* User Info Title */}
            <ShimmerText width="w-40" height="h-8" className="mb-9" />

            {/* Form Fields */}
            <div className='grid lg:grid-cols-1 xl:grid-cols-2 gap-y-8 gap-x-6'>
                {/* Email Field */}
                <div>
                    <ShimmerText width="w-16" height="h-5" className="mb-2" />
                    <ShimmerContainer width="100%" height="40px" />
                </div>

                {/* Phone Field */}
                <div>
                    <ShimmerText width="w-16" height="h-5" className="mb-2" />
                    <ShimmerContainer width="100%" height="40px" />
                </div>

                {/* Username Field */}
                <div>
                    <ShimmerText width="w-24" height="h-5" className="mb-2" />
                    <ShimmerContainer width="100%" height="40px" />
                </div>
            </div>

            {/* City Field */}
            <div className="mt-8">
                <ShimmerText width="w-12" height="h-5" className="mb-2" />
                <ShimmerContainer width="100%" height="40px" className="max-w-[400px]" />
            </div>

            {/* Update Button */}
            <ShimmerButton className="mt-9" />
        </div>
    )
}

export default loading
