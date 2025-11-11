import React from 'react';
import { Card, Button } from '../ui';
import { Heart, ShoppingCart, Users, Star } from 'lucide-react';

interface WishlistItemProps {
  courseId: {
    _id: string;
    courseName: string;
    price: number;
    thumbnail?: string;
    rating?: number;
    studentsEnrolled?: number;
    instructor: {
      firstName: string;
      lastName: string;
    };
  };
  onRemove: (courseId: string) => void;
  onAddToCart?: (courseId: string) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  courseId,
  onRemove,
  onAddToCart,
}) => {
  const { _id, courseName, price, thumbnail, rating, studentsEnrolled, instructor } = courseId;

  return (
    <Card className="flex gap-4 p-4 hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt={courseName}
          className="w-32 h-32 rounded-lg object-cover"
        />
      )}

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{courseName}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          By {instructor.firstName} {instructor.lastName}
        </p>

        {/* Rating & Students */}
        <div className="flex items-center gap-4 text-sm mb-3">
          {rating && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">({rating})</span>
            </div>
          )}

          {studentsEnrolled && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Users size={14} />
              <span>{studentsEnrolled.toLocaleString()} students</span>
            </div>
          )}
        </div>

        {/* Price */}
        <p className="text-lg font-bold text-gray-900 dark:text-white">₹{price.toLocaleString()}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 justify-start">
        {onAddToCart && (
          <Button
            variant="primary"
            size="sm"
            icon={<ShoppingCart size={16} />}
            onClick={() => onAddToCart(_id)}
          >
            Add to Cart
          </Button>
        )}

        <button
          onClick={() => onRemove(_id)}
          className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          title="Remove from wishlist"
        >
          <Heart size={20} fill="currentColor" />
        </button>
      </div>
    </Card>
  );
};

export default WishlistItem;
