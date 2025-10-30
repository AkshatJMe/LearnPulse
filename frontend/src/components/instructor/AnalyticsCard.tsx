import React from "react";
import { BarChart3, TrendingUp, Users, Award } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = "",
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 rounded-lg text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>

      {trend && (
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            trend.isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          <TrendingUp className={`w-4 h-4 ${!trend.isPositive && "rotate-180"}`} />
          {trend.isPositive ? "+" : "-"}
          {Math.abs(trend.value)}% from last month
        </div>
      )}
    </div>
  );
};

export default AnalyticsCard;
