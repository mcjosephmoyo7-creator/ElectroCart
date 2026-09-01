'use client';

import { HiOutlineStar } from 'react-icons/hi';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export default function StarRating({ rating, size = 'sm', showValue = true }: StarRatingProps) {
  const sizeClass = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  const textClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <HiOutlineStar
          key={star}
          className={`${sizeClass} ${
            star <= Math.round(rating) ? 'text-star fill-star' : 'text-gray-300'
          }`}
          style={star <= Math.round(rating) ? { fill: '#F59E0B' } : undefined}
        />
      ))}
      {showValue && (
        <span className={`${textClass} font-semibold text-slateText ml-0.5`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
