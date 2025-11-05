import React from "react";

interface ProgressBarProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  strokeWidth?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  size = "md",
  showLabel = true,
  strokeWidth,
  className = "",
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  // Size configurations
  const sizeConfigs = {
    sm: { diameter: 60, defaultStroke: 4, fontSize: "text-xs" },
    md: { diameter: 100, defaultStroke: 6, fontSize: "text-sm" },
    lg: { diameter: 140, defaultStroke: 8, fontSize: "text-lg" },
  };

  const config = sizeConfigs[size];
  const radius = (config.diameter - (strokeWidth || config.defaultStroke)) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercentage / 100) * circumference;

  // Color based on progress
  const getColor = () => {
    if (clampedPercentage === 100) return "text-green-500";
    if (clampedPercentage >= 75) return "text-blue-500";
    if (clampedPercentage >= 50) return "text-yellow-500";
    if (clampedPercentage >= 25) return "text-orange-500";
    return "text-red-500";
  };

  const getStrokeColor = () => {
    if (clampedPercentage === 100) return "stroke-green-500";
    if (clampedPercentage >= 75) return "stroke-blue-500";
    if (clampedPercentage >= 50) return "stroke-yellow-500";
    if (clampedPercentage >= 25) return "stroke-orange-500";
    return "stroke-red-500";
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={config.diameter}
        height={config.diameter}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth || config.defaultStroke}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth || config.defaultStroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${getStrokeColor()} transition-all duration-500 ease-out`}
        />
      </svg>
      {/* Percentage label */}
      {showLabel && (
        <div
          className={`absolute flex flex-col items-center justify-center ${config.fontSize} font-semibold ${getColor()}`}
        >
          <span>{Math.round(clampedPercentage)}%</span>
          {clampedPercentage === 100 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">Complete</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
