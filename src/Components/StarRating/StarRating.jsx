import React from "react";

const StarRating = ({ averageRating }) => {
  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );
      } else if (hasHalfStar && i === fullStars + 1) {
        // Half star
        stars.push(
          <svg
            key={i}
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 22 20"
          >
            <defs>
              <linearGradient
                id={`half-star-gradient-${i}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="50%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#6B7280" />
              </linearGradient>
            </defs>
            <path
              d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
              fill={`url(#half-star-gradient-${i})`}
            />
          </svg>
        );
      } else {
        // Empty star
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-300 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );
      }
    }

    return stars;
  };
  return (
    <span
      className="flex gap-1 -mt-0.5"
      role="img"
      aria-label={`Rating: ${averageRating} out of 5 stars`}
    >
      {generateStars(averageRating)}
    </span>
  );
};

export default StarRating;
