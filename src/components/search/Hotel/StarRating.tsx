import Image from 'next/image'

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
}

export const StarRating = ({ rating, maxRating = 5, size = 20 }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
      {[...Array(maxRating)].map((_, index) => (
        <div key={index} className="relative">
          {/* Background star (empty) */}
          <Image
            src="/icons/star-empty.svg"
            alt=""
            width={size}
            height={size}
            className="text-gray-300"
          />
          
          {/* Foreground star (filled) with clip based on rating */}
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{
              width: `${index + 1 <= rating 
                ? '100%' 
                : index < rating 
                  ? `${(rating % 1) * 100}%` 
                  : '0%'}`
            }}
          >
            <Image
              src="/icons/star.svg"
              alt=""
              width={size}
              height={size}
              className="text-yellow-400"
            />
          </div>
        </div>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {`${Math.floor(rating)}${rating % 1 === 0.5 ? ' and half' : ''} star${rating === 1 ? '' : 's'}`}
      </span>
    </div>
  );
};
