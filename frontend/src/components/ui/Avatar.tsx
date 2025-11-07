import React from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: AvatarSize;
  initials?: string;
  online?: boolean;
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ size = 'md', initials, online, src, alt = 'Avatar', className, ...props }, ref) => {
    const sizes = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    const onlineIndicatorSizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    };

    if (src) {
      return (
        <div className="relative inline-block">
          <img
            ref={ref}
            src={src}
            alt={alt}
            className={`
              ${sizes[size]}
              rounded-full object-cover bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800
              ${className}
            `}
            {...props}
          />
          {online && (
            <div className={`absolute bottom-0 right-0 ${onlineIndicatorSizes[size]} bg-green-500 rounded-full border-2 border-white dark:border-gray-800`} />
          )}
        </div>
      );
    }

    return (
      <div className="relative inline-block">
        <div
          className={`
            ${sizes[size]}
            rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold
            ${className}
          `}
        >
          {initials}
        </div>
        {online && (
          <div className={`absolute bottom-0 right-0 ${onlineIndicatorSizes[size]} bg-green-500 rounded-full border-2 border-white dark:border-gray-800`} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
