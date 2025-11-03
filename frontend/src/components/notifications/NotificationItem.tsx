import React from "react";
import {
  BookOpen,
  CreditCard,
  CheckCircle,
  XCircle,
  Bell,
  MessageSquare,
  Clock,
} from "lucide-react";
import { Notification } from "../../types";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onClick,
}) => {
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "enrollment":
        return <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "payment":
        return <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "course_approval":
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "course_rejection":
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "course_update":
        return <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={() => onClick?.(notification)}
      className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition ${
        !notification.read ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {notification.title}
            </p>
            {!notification.read && (
              <span className="flex-shrink-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-1"></span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              {getTimeAgo(notification.createdAt)}
            </span>
            {!notification.read && onMarkAsRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification._id);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
