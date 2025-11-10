import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  className?: string;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
}

const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  readOnly = true,
  size = 'md',
  showCount = false,
  count = 0,
  className,
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const stars = Array.from({ length: 5 }).map((_, i) => i + 1);

  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <div className="flex items-center gap-1">
        {stars.map((star) => (
          <button
            key={star}
            onClick={() => !readOnly && onChange?.(star)}
            disabled={readOnly}
            className={`transition-all duration-200 ${!readOnly && 'cursor-pointer hover:scale-110'}`}
          >
            {star <= Math.round(value) ? (
              <Star className={`${sizes[size]} fill-yellow-400 text-yellow-400`} />
            ) : (
              <Star className={`${sizes[size]} text-gray-300 dark:text-gray-600`} />
            )}
          </button>
        ))}
      </div>
      {showCount && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default Rating;
