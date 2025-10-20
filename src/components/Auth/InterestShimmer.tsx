import React from 'react'
import ShimmerButton from '../shimmers/ShimmerButton'
import ShimmerText from '../shimmers/ShimmerText'
import ShimmerContainer from '../shimmers/ShimmerContainer'

const InterestShimmer = () => {
    return (
        <div>


            {/* Interest Cards Container */}
            <div className='flex flex-wrap gap-4 pt-4'>
                {/* Generate multiple shimmer cards to represent loading interest cards */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                        {/* Card container with image and label */}
                        <ShimmerContainer
                            width="120px"
                            height="120px"
                            className="rounded-xl cursor-pointer"
                        />

                    </div>
                ))}
            </div>


        </div>
    )
}

export default InterestShimmer
