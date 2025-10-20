import React from "react";

const Stars = ({
  rating,
  starSize = "24",
}: {
  rating: number;
  starSize?: string;
}) => {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        return (
          <svg
            key={star}
            width={starSize}
            height={starSize}
            viewBox="0 0 24 24"
            className={`${star <= rating ? "fill-yellow-400" : "fill-gray-200"
              }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.45 13.97L5.82 21L12 17.27Z" />
          </svg>
        );
      })}
    </div>
  );
};

export default Stars;
