import React from 'react';
import { Heart, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../ui';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  isWishlisted?: boolean;
  onWishlistToggle?: (courseId: string) => void;
  onAddToCart?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isWishlisted = false,
  onWishlistToggle,
  onAddToCart,
}) => {
  const instructor =
    course.instructor && typeof course.instructor === 'object'
      ? course.instructor
      : { firstName: '', lastName: '' };
  const instructorName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || 'Instructor';
  const studentCount = Array.isArray(course.studentsEnrolled) 
    ? course.studentsEnrolled.length 
    : 0;

  return (
    <Card className="overflow-hidden flex flex-col h-full p-0 hover:shadow-xl transition-all">
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden bg-gray-200 dark:bg-gray-700">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">No thumbnail</span>
          </div>
        )}
        <button
          onClick={() => onWishlistToggle?.(course._id)}
          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={20}
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Title */}
        <Link to={`/course/${course._id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
            {course.courseName}
          </h3>
        </Link>

        {/* Instructor */}
        <p className="text-sm text-gray-600 dark:text-gray-400">{instructorName}</p>

        {/* Rating */}
        {course.averageRating !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(course.averageRating!) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300 dark:text-gray-600'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({course.averageRating.toFixed(1)})
            </span>
          </div>
        )}

        {/* Students */}
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <Users size={16} />
          <span>{studentCount.toLocaleString()} students</span>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{(course.price || 0).toLocaleString()}
          </span>
          {onAddToCart && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddToCart(course._id)}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
