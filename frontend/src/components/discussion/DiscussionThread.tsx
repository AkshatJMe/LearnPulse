import React from 'react';
import { Card, Avatar, Button } from '../ui';
import { Heart, MessageCircle, Flag } from 'lucide-react';

interface DiscussionComment {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
  content: string;
  createdAt: string;
  upvotes?: string[];
  isReply?: boolean;
}

interface DiscussionThreadProps {
  comment: DiscussionComment;
  isOriginal?: boolean;
  onReply?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  isLiked?: boolean;
}

const DiscussionThread: React.FC<DiscussionThreadProps> = ({
  comment,
  isOriginal = false,
  onReply,
  onLike,
  isLiked = false,
}) => {
  const authorName = `${comment.userId.firstName} ${comment.userId.lastName}`;
  const date = new Date(comment.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className={`p-0 ${isOriginal ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={comment.userId.image}
            initials={comment.userId.firstName[0]}
            size="sm"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">{authorName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
          </div>
          {isOriginal && (
            <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
              Original
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-gray-700 dark:text-gray-300 mb-4">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => onLike?.(comment._id)}
            className={`flex items-center gap-1 transition-colors ${
              isLiked
                ? 'text-red-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{comment.upvotes?.length || 0}</span>
          </button>

          {onReply && (
            <button
              onClick={() => onReply(comment._id)}
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
            >
              <MessageCircle size={16} />
              <span>Reply</span>
            </button>
          )}

          <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors ml-auto">
            <Flag size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default DiscussionThread;
