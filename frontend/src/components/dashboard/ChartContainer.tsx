import React from 'react';
import { Card } from '../ui';

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  footer,
}) => {
  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>

      <div className="overflow-x-auto">
        {children}
      </div>

      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-600 dark:text-gray-400">
          {footer}
        </div>
      )}
    </Card>
  );
};

export default ChartContainer;
