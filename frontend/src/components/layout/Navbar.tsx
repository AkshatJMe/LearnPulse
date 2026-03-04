import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, ShoppingCart, LogOut, User, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Avatar } from '../ui';
import { NotificationBell } from '../notifications';
import { logout } from '../../services/operations/authAPI';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.auth);
  const { user } = useSelector((state: any) => state.profile || {});
  const { cart } = useSelector((state: any) => state.cart || { cart: [] });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    dispatch(logout(navigate) as any);
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartCount = cart?.length || 0;

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LP</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">
              LearnPulse
            </span>
          </Link>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {isDark ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            {token && <NotificationBell />}

            {/* Cart */}
            {token && (
              <Link
                to="/cart"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition relative"
              >
                <ShoppingCart size={20} className="text-gray-600 dark:text-gray-400" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth buttons / Profile */}
            {!token ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-lg transition"
                >
                  <Avatar
                    initials={user?.firstName?.[0]?.toUpperCase() || 'U'}
                    size="sm"
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50">
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    {String(user?.accountType || '').toLowerCase() === 'student' && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        <div className="px-4 py-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider bg-orange-50 dark:bg-orange-900/30">
                          Student Panel
                        </div>
                        <Link
                          to="/dashboard/enrolled-courses"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 font-medium"
                        >
                          <span>📘</span>
                          Enrolled Courses
                        </Link>
                        <Link
                          to="/dashboard/wishlist"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40"
                        >
                          <span>❤️</span>
                          Wishlist
                        </Link>
                        <Link
                          to="/dashboard/certificates"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40"
                        >
                          <span>🏅</span>
                          Certificates
                        </Link>
                        <Link
                          to="/dashboard/progress"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40"
                        >
                          <span>📈</span>
                          Progress
                        </Link>
                      </>
                    )}
                    {String(user?.accountType || '').toLowerCase() === 'instructor' && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        <div className="px-4 py-2 text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/30">
                          Instructor Panel
                        </div>
                        <Link
                          to="/dashboard/instructor"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 font-medium"
                        >
                          <span>📊</span>
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/my-courses"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40"
                        >
                          <span>📚</span>
                          My Courses
                        </Link>
                        <Link
                          to="/dashboard/add-course"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40"
                        >
                          <span>➕</span>
                          Create Course
                        </Link>
                        <Link
                          to="/dashboard/analytics"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40"
                        >
                          <span>📈</span>
                          Analytics
                        </Link>
                        <Link
                          to="/dashboard/my-courses"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40"
                        >
                          <span>🧠</span>
                          Create Quiz
                        </Link>
                      </>
                    )}
                    {String(user?.accountType || '').toLowerCase() === 'admin' && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        <div className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30">
                          Admin Panel
                        </div>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-medium"
                        >
                          <span>📊</span>
                          Analytics
                        </Link>
                        <Link
                          to="/admin/pending-courses"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                        >
                          <span>⏳</span>
                          Pending Courses
                        </Link>
                        <Link
                          to="/admin/courses"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                        >
                          <span>📚</span>
                          Manage Courses
                        </Link>
                        <Link
                          to="/admin/users"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                        >
                          <span>👥</span>
                          User Management
                        </Link>
                        <Link
                          to="/admin/coupons"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                        >
                          <span>🎟️</span>
                          Manage Coupons
                        </Link>
                        <Link
                          to="/admin/categories"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                        >
                          <span>📂</span>
                          Categories
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              ref={menuRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {isMenuOpen ? (
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu size={20} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Home
              </Link>
              <Link
                to={token ? '/dashboard/enrolled-courses' : '/catalog'}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Courses
              </Link>
              {String(user?.accountType || '').toLowerCase() === 'student' && (
                <>
                  <div className="px-4 py-3 text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider bg-orange-100 dark:bg-orange-900/40 rounded-lg mx-2 mt-2">
                    📋 Student Panel
                  </div>
                  <Link
                    to="/dashboard/enrolled-courses"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg ml-2"
                  >
                    📘 Enrolled Courses
                  </Link>
                  <Link
                    to="/dashboard/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg ml-2"
                  >
                    ❤️ Wishlist
                  </Link>
                  <Link
                    to="/dashboard/certificates"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg ml-2"
                  >
                    🏅 Certificates
                  </Link>
                  <Link
                    to="/dashboard/progress"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg ml-2"
                  >
                    📈 Progress
                  </Link>
                </>
              )}
              {String(user?.accountType || '').toLowerCase() === 'instructor' && (
                <>
                  <div className="px-4 py-3 text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider bg-green-100 dark:bg-green-900/40 rounded-lg mx-2 mt-2">
                    📋 Instructor Panel
                  </div>
                  <Link
                    to="/dashboard/instructor"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg ml-2"
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    to="/dashboard/my-courses"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg ml-2"
                  >
                    📚 My Courses
                  </Link>
                  <Link
                    to="/dashboard/add-course"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg ml-2"
                  >
                    ➕ Create Course
                  </Link>
                  <Link
                    to="/dashboard/analytics"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg ml-2"
                  >
                    📈 Analytics
                  </Link>
                  <Link
                    to="/dashboard/my-courses"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg ml-2"
                  >
                    🧠 Create Quiz
                  </Link>
                </>
              )}
              {String(user?.accountType || '').toLowerCase() === 'admin' && (
                <>
                  <div className="px-4 py-3 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 rounded-lg mx-2 mt-2">
                    📋 Admin Panel
                  </div>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg ml-2"
                  >
                    📊 Analytics
                  </Link>
                  <Link
                    to="/admin/pending-courses"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg ml-2"
                  >
                    ⏳ Pending Courses
                  </Link>
                  <Link
                    to="/admin/courses"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg ml-2"
                  >
                    📚 Manage Courses
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg ml-2"
                  >
                    👥 User Management
                  </Link>
                  <Link
                    to="/admin/coupons"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg ml-2"
                  >
                    🎟️ Manage Coupons
                  </Link>
                  <Link
                    to="/admin/categories"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg ml-2"
                  >
                    📂 Categories
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Warm-up Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center py-1.5 text-yellow-800 dark:text-yellow-200">
            ⚠️ Deployed on free tier - First request may take 30-60s to warm up
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
