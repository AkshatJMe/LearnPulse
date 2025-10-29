import React, { useEffect, useState } from 'react';
import { Card } from '../ui';
import CourseCard from '../course/CourseCard';
import { Course } from '../../types';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedCoursesProps {
  courses?: Course[];
  isLoading?: boolean;
  onAddToCart?: (courseId: string) => void;
  onWishlistToggle?: (courseId: string) => void;
  wishlistedCourses?: string[];
}

const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({
  courses = [],
  isLoading = false,
  onAddToCart,
  onWishlistToggle,
  wishlistedCourses = [],
}) => {
  return (
    <div className="w-full py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <BookOpen size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Popular Courses
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our most popular courses and start learning today
          </p>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-full animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 8).map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isWishlisted={wishlistedCourses.includes(course._id)}
                onAddToCart={onAddToCart}
                onWishlistToggle={onWishlistToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No courses available yet</p>
          </div>
        )}

        {/* View All Button */}
        {courses.length > 0 && (
          <div className="flex justify-center pt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              View All Courses
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCourses;
