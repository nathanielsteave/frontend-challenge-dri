'use client';

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface RatingProps {
  rate: number;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md';
}

export default function Rating({ rate, count, showCount = true, size = 'sm' }: RatingProps) {
  const stars = [];
  const fullStars = Math.floor(rate);
  const hasHalf = rate - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
  }
  if (hasHalf) {
    stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
  }
  const emptyCount = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < emptyCount; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400/40" />);
  }

  return (
    <div className={`flex items-center gap-1 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center gap-0.5">{stars}</div>
      {showCount && count !== undefined && (
        <span className="text-gray-400 ml-0.5 text-[10px]">({count})</span>
      )}
    </div>
  );
}
