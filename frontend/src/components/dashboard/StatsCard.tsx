import React from 'react';
import { Card } from '../ui';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  onClick,
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <Card
      className={`p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>

          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.direction === 'up' ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>{trend.percentage}% from last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
