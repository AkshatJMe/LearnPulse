import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', children, className, ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs font-medium',
      md: 'px-3 py-1 text-sm font-medium',
      lg: 'px-4 py-1.5 text-base font-medium',
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center rounded-full
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
