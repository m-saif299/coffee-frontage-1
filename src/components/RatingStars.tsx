import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  size = 16, 
  interactive = false,
  onRate 
}) => {
  // Safety check: ensure rating is a number, default to 0 if undefined/null
  const safeRating = typeof rating === 'number' ? rating : 0;

  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate && onRate(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        >
          {safeRating >= star ? (
            <Star size={size} fill="currentColor" />
          ) : safeRating >= star - 0.5 ? (
            <StarHalf size={size} fill="currentColor" />
          ) : (
            <Star size={size} />
          )}
        </button>
      ))}
      {!interactive && <span className="text-coffee-700 text-sm font-medium mr-1">{safeRating.toFixed(1)}</span>}
    </div>
  );
};