import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function StarRating({ rating, count, showCount = false, size = 'sm', className = '' }: StarRatingProps) {
  const starClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';

  const renderStar = (i: number) => {
    const full = rating >= i + 1;
    const half = !full && rating >= i + 0.5;
    if (full) return <FaStar key={i} className={`${starClass} text-star`} />;
    if (half) return <FaStarHalfAlt key={i} className={`${starClass} text-star`} />;
    return <FaRegStar key={i} className={`${starClass} text-lineBorder`} />;
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">{Array.from({ length: 5 }, (_, i) => renderStar(i))}</div>
      <span className="text-xs font-medium text-muted">
        {rating.toFixed(1)}
        {showCount && count != null && <span className="text-muted"> ({count})</span>}
      </span>
    </div>
  );
}