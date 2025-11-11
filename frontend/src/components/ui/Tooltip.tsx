import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block group">
      {children}
      <div
        className={`
          absolute hidden group-hover:block ${positionClasses[position]}
          bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap
          z-50 pointer-events-none
        `}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
