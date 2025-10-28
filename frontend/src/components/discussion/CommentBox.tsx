import React from 'react';
import { Input, Button } from '../ui';
import { Send } from 'lucide-react';

interface CommentBoxProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  isReply?: boolean;
}

const CommentBox: React.FC<CommentBoxProps> = ({
  onSubmit,
  placeholder = 'Write your comment...',
  isLoading = false,
  isReply = false,
}) => {
  const [content, setContent] = React.useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <div className={`space-y-3 ${isReply ? 'ml-6 mt-4 pb-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 resize-none"
      />

      <div className="flex gap-2 justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setContent('')}
          disabled={!content.trim() || isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={!content.trim() || isLoading}
          icon={!isLoading && <Send size={16} />}
        >
          {isReply ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </div>
  );
};

export default CommentBox;
