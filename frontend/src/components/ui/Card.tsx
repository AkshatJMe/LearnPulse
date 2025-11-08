import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, shadow = 'md', className, children, ...props }, ref) => {
    const shadows = {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      none: 'shadow-none',
    };

    return (
      <div
        ref={ref}
        className={`
          rounded-lg bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700
          ${shadows[shadow]}
          ${hoverable ? 'transition-all duration-200 hover:shadow-lg cursor-pointer hover:-translate-y-1' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
