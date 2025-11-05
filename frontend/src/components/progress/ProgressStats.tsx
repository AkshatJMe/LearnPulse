import React from "react";
import { BookOpen, Award, Clock, TrendingUp } from "lucide-react";

interface ProgressStatsProps {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalCertificates: number;
  totalLearningHours?: number;
  averageProgress?: number;
  className?: string;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  totalCourses,
  completedCourses,
  inProgressCourses,
  totalCertificates,
  totalLearningHours = 0,
  averageProgress = 0,
  className = "",
}) => {
  const stats = [
    {
      icon: BookOpen,
      label: "Total Courses",
      value: totalCourses,
      subtext: `${inProgressCourses} in progress`,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Award,
      label: "Completed",
      value: completedCourses,
      subtext: `${totalCertificates} certificates`,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Clock,
      label: "Learning Hours",
      value: totalLearningHours,
      subtext: "Total time spent",
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      suffix: "h",
    },
    {
      icon: TrendingUp,
      label: "Avg. Progress",
      value: Math.round(averageProgress),
      subtext: "Across all courses",
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      suffix: "%",
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
                {stat.suffix && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">
                    {stat.suffix}
                  </span>
                )}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStats;
