import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  type?: 'text' | 'circle' | 'rectangle' | 'card';
  height?: string;
  width?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  type = 'text',
  height = 'h-4',
  width = 'w-full',
  className,
  ...props
}) => {
  const baseClass = 'bg-gray-200 dark:bg-gray-700 animate-pulse rounded';

  const typeStyles = {
    text: `${height} ${width} rounded-md`,
    circle: 'w-10 h-10 rounded-full',
    rectangle: 'w-full h-32 rounded-lg',
    card: 'w-full h-64 rounded-lg',
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} ${typeStyles[type]} ${className}`}
          {...props}
        />
      ))}
    </div>
  );
};

export default Skeleton;
