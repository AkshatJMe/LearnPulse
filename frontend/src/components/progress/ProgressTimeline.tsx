import React from "react";
import { CheckCircle, Circle, Lock, PlayCircle } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  type: "video" | "quiz" | "section";
  status: "completed" | "in-progress" | "locked";
  completedAt?: string;
  duration?: string;
}

interface ProgressTimelineProps {
  items: TimelineItem[];
  onItemClick?: (item: TimelineItem) => void;
  className?: string;
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  items,
  onItemClick,
  className = "",
}) => {
  const getIcon = (item: TimelineItem) => {
    if (item.status === "completed") {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (item.status === "in-progress") {
      return <PlayCircle className="w-5 h-5 text-blue-500" />;
    } else {
      return <Lock className="w-5 h-5 text-gray-400 dark:text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "locked":
        return "bg-gray-300 dark:bg-gray-600";
      default:
        return "bg-gray-300 dark:bg-gray-600";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isClickable = item.status !== "locked" && onItemClick;

        return (
          <div key={item.id} className="relative flex gap-4">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[18px] top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            )}

            {/* Icon */}
            <div className="relative flex-shrink-0 mt-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  item.status === "completed"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : item.status === "in-progress"
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {getIcon(item)}
              </div>
            </div>

            {/* Content */}
            <div
              className={`flex-1 pb-6 ${
                isClickable ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 -ml-2 -mr-2 pl-2 pr-2 -mt-1 pt-1 rounded-lg transition-colors" : ""
              }`}
              onClick={() => isClickable && onItemClick(item)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4
                    className={`font-medium text-sm ${
                      item.status === "locked"
                        ? "text-gray-400 dark:text-gray-600"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    {/* Type badge */}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.type === "video"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : item.type === "quiz"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                    {/* Duration */}
                    {item.duration && (
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {item.duration}
                      </span>
                    )}
                    {/* Completion time */}
                    {item.completedAt && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        ✓ {formatDate(item.completedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status indicator dot */}
                <div className={`w-2 h-2 rounded-full mt-1.5 ${getStatusColor(item.status)}`}></div>
              </div>
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-500">
          <Circle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No timeline items available</p>
        </div>
      )}
    </div>
  );
};

export default ProgressTimeline;
