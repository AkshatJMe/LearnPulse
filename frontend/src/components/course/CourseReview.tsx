import React from 'react';
import { Card, Avatar, Rating } from '../ui';

interface CourseReviewProps {
  id: string;
  author: {
    firstName: string;
    lastName: string;
    image?: string;
  };
  rating: number;
  title: string;
  content: string;
  createdAt: string;
}

const CourseReview: React.FC<CourseReviewProps> = ({
  author,
  rating,
  title,
  content,
  createdAt,
}) => {
  const authorName = `${author.firstName} ${author.lastName}`;
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card shadow="sm">
      <div className="flex gap-4">
        <Avatar src={author.image} initials={author.firstName[0]} size="md" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{authorName}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
            </div>
            <Rating value={rating} readOnly size="sm" />
          </div>
          <h5 className="font-medium text-gray-900 dark:text-white mb-1">{title}</h5>
          <p className="text-sm text-gray-700 dark:text-gray-300">{content}</p>
        </div>
      </div>
    </Card>
  );
};

export default CourseReview;
