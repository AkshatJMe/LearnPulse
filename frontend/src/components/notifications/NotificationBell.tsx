import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Mock count

  // TODO: Fetch unread count from backend
  useEffect(() => {
    // const fetchUnreadCount = async () => {
    //   try {
    //     const response = await apiConnector('GET', '/notifications/unread-count', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     });
    //     setUnreadCount(response.data.count);
    //   } catch (error) {
    //     console.error("Error fetching unread count:", error);
    //   }
    // };
    // fetchUnreadCount();

    // Optional: Set up polling or websocket for real-time updates
    // const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition relative"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default NotificationBell;
