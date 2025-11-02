import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, UserCircle, Settings, LogOut, BarChart3, Users, ShoppingCart } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarProps {
  role: 'student' | 'instructor' | 'admin';
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  const location = useLocation();

  const navItems: Record<string, NavItem[]> = {
    student: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'My Courses', href: '/dashboard/courses', icon: <BookOpen size={20} /> },
      { label: 'Wishlist', href: '/dashboard/wishlist', icon: <BookOpen size={20} /> },
      { label: 'Purchase History', href: '/dashboard/purchases', icon: <ShoppingCart size={20} /> },
      { label: 'Profile', href: '/dashboard/profile', icon: <UserCircle size={20} /> },
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
    ],
    instructor: [
      { label: 'Dashboard', href: '/dashboard/instructor', icon: <LayoutDashboard size={20} /> },
      { label: 'My Courses', href: '/dashboard/instructor/courses', icon: <BookOpen size={20} /> },
      { label: 'Analytics', href: '/dashboard/instructor/analytics', icon: <BarChart3 size={20} /> },
      { label: 'Students', href: '/dashboard/instructor/students', icon: <Users size={20} /> },
      { label: 'Profile', href: '/dashboard/profile', icon: <UserCircle size={20} /> },
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
    ],
    admin: [
      { label: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard size={20} /> },
      { label: 'Users', href: '/dashboard/admin/users', icon: <Users size={20} /> },
      { label: 'Courses', href: '/dashboard/admin/courses', icon: <BookOpen size={20} /> },
      { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChart3 size={20} /> },
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
    ],
  };

  const items = navItems[role] || [];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${location.pathname === item.href
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
