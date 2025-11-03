import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Notification } from "../../types";
import NotificationItem from "./NotificationItem";
import Button from "../ui/Button";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      _id: "1",
      userId: "user123",
      type: "enrollment",
      title: "Successfully Enrolled",
      message: "You have been enrolled in Advanced React Patterns course",
      read: false,
      link: "/course/react-advanced",
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      _id: "2",
      userId: "user123",
      type: "payment",
      title: "Payment Confirmed",
      message: "Your payment of ₹3,500 has been processed successfully",
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    },
    {
      _id: "3",
      userId: "user123",
      type: "course_approval",
      title: "Course Approved",
      message: "Your course 'Machine Learning Basics' has been approved and published",
      read: true,
      link: "/instructor/courses",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // TODO: Fetch notifications from backend
  useEffect(() => {
    if (isOpen) {
      // const fetchNotifications = async () => {
      //   try {
      //     setIsLoading(true);
      //     const response = await apiConnector('GET', '/notifications', {
      //       headers: { Authorization: `Bearer ${token}` }
      //     });
      //     setNotifications(response.data.notifications);
      //   } catch (error) {
      //     console.error("Error fetching notifications:", error);
      //   } finally {
      //     setIsLoading(false);
      //   }
      // };
      // fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // TODO: Call backend to mark as read
      // await apiConnector('PUT', `/notifications/${notificationId}/read`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: Call backend to mark all as read
      // await apiConnector('PUT', '/notifications/read-all', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      // TODO: Call backend to clear all
      // await apiConnector('DELETE', '/notifications/clear-all', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              <CheckCheck className="w-3 h-3" />
              Mark all as read
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline"
            >
              <Trash2 className="w-3 h-3" />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[32rem] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              No notifications
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You're all caught up!
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onClick={handleNotificationClick}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={() => {
              navigate("/notifications");
              onClose();
            }}
            className="w-full text-center text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
