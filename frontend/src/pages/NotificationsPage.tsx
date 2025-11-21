import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react";
import { Notification } from "../types";
import NotificationItem from "../components/notifications/NotificationItem";
import Button from "../components/ui/Button";

const NotificationsPage: React.FC = () => {
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
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: "2",
      userId: "user123",
      type: "payment",
      title: "Payment Confirmed",
      message: "Your payment of ₹3,500 has been processed successfully",
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      _id: "3",
      userId: "user123",
      type: "course_approval",
      title: "Course Approved",
      message: "Your course 'Machine Learning Basics' has been approved and published",
      read: true,
      link: "/instructor/courses",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: "4",
      userId: "user123",
      type: "course_update",
      title: "New Lesson Added",
      message: "A new lesson has been added to 'Web Development Bootcamp'",
      read: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      _id: "5",
      userId: "user123",
      type: "system",
      title: "Welcome to LearnPulse",
      message: "Start your learning journey today by exploring our featured courses",
      read: true,
      createdAt: new Date(Date.now() - 604800000).toISOString(),
    },
  ]);

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  // TODO: Fetch notifications from backend
  useEffect(() => {
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
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // TODO: Call backend
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: Call backend
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      // TODO: Call backend
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with your learning activity
          </p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  filter === "unread"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all as read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Loading notifications...
              </p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "Notifications will appear here"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onClick={handleNotificationClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
