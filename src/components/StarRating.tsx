import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
    rating: number
    size?: number
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, size = 16 }) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                />
            ))}
        </div>
    )
}
