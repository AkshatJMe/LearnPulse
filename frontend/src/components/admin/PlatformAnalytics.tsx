import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PlatformAnalyticsProps {
  totalRevenue?: number;
  revenueGrowth?: number;
  activeUsers?: number;
  activeUsersGrowth?: number;
  totalEnrollments?: number;
  enrollmentGrowth?: number;
  courseApprovals?: number;
}

const PlatformAnalytics: React.FC<PlatformAnalyticsProps> = ({
  totalRevenue = 2540000,
  revenueGrowth = 12.5,
  activeUsers = 4820,
  activeUsersGrowth = 8.3,
  totalEnrollments = 15420,
  enrollmentGrowth = 15.7,
  courseApprovals = 92,
}) => {
  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const AnalyticsMetric = ({
    label,
    value,
    growth,
    icon: Icon,
  }: {
    label: string;
    value: string | number;
    growth: number;
    icon: React.ReactNode;
  }) => {
    const isPositive = growth >= 0;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
          <div className="text-gray-400 dark:text-gray-500">{Icon}</div>
        </div>

        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
          <span
            className={`text-sm font-semibold ${
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {Math.abs(growth)}% from last month
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnalyticsMetric
        label="Total Revenue"
        value={formatCurrency(totalRevenue)}
        growth={revenueGrowth}
        icon={<span className="text-3xl">💰</span>}
      />
      <AnalyticsMetric
        label="Active Users (30d)"
        value={activeUsers.toLocaleString()}
        growth={activeUsersGrowth}
        icon={<span className="text-3xl">👥</span>}
      />
      <AnalyticsMetric
        label="Total Enrollments"
        value={totalEnrollments.toLocaleString()}
        growth={enrollmentGrowth}
        icon={<span className="text-3xl">📚</span>}
      />
      <AnalyticsMetric
        label="Course Approvals"
        value={`${courseApprovals}%`}
        growth={3.2}
        icon={<span className="text-3xl">✅</span>}
      />
    </div>
  );
};

export default PlatformAnalytics;
