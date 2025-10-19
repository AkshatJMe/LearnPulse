import React from 'react';
import { Card, Button } from '../ui';
import { Trash2 } from 'lucide-react';
import { Course } from '../../types';

interface CartItemCardProps {
  course: Course;
  onRemove: (courseId: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  course,
  onRemove,
}) => {
  const instructor = typeof course.instructor === 'string'
    ? { firstName: '', lastName: '' }
    : course.instructor;
  const subtotal = course.price || 0;

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <Card className="flex gap-4 p-4 hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="w-24 h-24 rounded-lg object-cover"
        />
      )}

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{course.courseName}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          By {instructor.firstName} {instructor.lastName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {course.status || 'Published'}
        </p>
      </div>

      {/* Price & Actions */}
      <div className="text-right flex flex-col justify-between">
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">₹{formatCurrency(subtotal)}</p>
        </div>

        <button
          onClick={() => onRemove(course._id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors p-2 rounded self-end"
          title="Remove from cart"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );
};

export default CartItemCard;
