import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getPlatformAnalytics } from "../../services/operations/adminAPI";

interface Analytics {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalPublishedCourses: number;
  totalPendingCourses: number;
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  topCourses: any[];
  activeInstructors: number;
}

const AdminDashboard: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to safely convert values to numbers
  const toNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (Array.isArray(value)) return 0;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getPlatformAnalytics(token);
        console.log("Analytics Data:", data);
        if (data) {
          // Normalize revenue data that might come as arrays or undefined
          const normalizedData: Analytics = {
            totalUsers: data.totalUsers || 0,
            totalStudents: data.totalStudents || 0,
            totalInstructors: data.totalInstructors || 0,
            totalCourses: data.totalCourses || 0,
            totalPublishedCourses: data.totalPublishedCourses || 0,
            totalPendingCourses: data.totalPendingCourses || 0,
            totalRevenue: toNumber(data.totalRevenue),
            monthlyRevenue: toNumber(data.monthlyRevenue),
            dailyRevenue: toNumber(data.dailyRevenue),
            topCourses: data.topCourses || [],
            activeInstructors: data.activeInstructors || 0,
          };
          setAnalytics(normalizedData);
        } else {
          toast.error("No analytics data received");
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Platform Analytics</h1>

      {analytics ? (
        <>
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg">
              <p className="text-lg opacity-90 mb-2">Total Users</p>
              <p className="text-4xl font-bold">{analytics.totalUsers}</p>
              <p className="text-sm opacity-75 mt-2">Registered users</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg">
              <p className="text-lg opacity-90 mb-2">Total Students</p>
              <p className="text-4xl font-bold">{analytics.totalStudents}</p>
              <p className="text-sm opacity-75 mt-2">Active learners</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg">
              <p className="text-lg opacity-90 mb-2">Total Instructors</p>
              <p className="text-4xl font-bold">{analytics.totalInstructors}</p>
              <p className="text-sm opacity-75 mt-2">Course creators</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-lg">
              <p className="text-lg opacity-90 mb-2">Active Instructors</p>
              <p className="text-4xl font-bold">{analytics.activeInstructors}</p>
              <p className="text-sm opacity-75 mt-2">With published courses</p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">Total Courses</p>
              <p className="text-3xl font-bold">{analytics.totalCourses}</p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">Published Courses</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {analytics.totalPublishedCourses}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">Pending Approval</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {analytics.totalPendingCourses}
              </p>
            </div>
          </div>

          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-lg">
              <p className="text-lg opacity-90 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold">₹{toNumber(analytics.totalRevenue).toFixed(2)}</p>
              <p className="text-sm opacity-75 mt-2">All time</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-lg">
              <p className="text-lg opacity-90 mb-2">Monthly Revenue</p>
              <p className="text-3xl font-bold">₹{toNumber(analytics.monthlyRevenue).toFixed(2)}</p>
              <p className="text-sm opacity-75 mt-2">This month</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-lg">
              <p className="text-lg opacity-90 mb-2">Daily Revenue</p>
              <p className="text-3xl font-bold">₹{toNumber(analytics.dailyRevenue).toFixed(2)}</p>
              <p className="text-sm opacity-75 mt-2">Today</p>
            </div>
          </div>

          {/* Top Courses */}
          {analytics.topCourses && analytics.topCourses.length > 0 && (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Top Performing Courses</h2>
              <div className="space-y-3">
                {analytics.topCourses.slice(0, 5).map((course: any, idx: number) => (
                  <div
                    key={course._id}
                    className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    <div>
                      <p className="font-semibold">{idx + 1}. {course.courseName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {Array.isArray(course.studentsEnrolled) 
                          ? course.studentsEnrolled.length 
                          : course.studentsEnrolled || 0} students
                      </p>
                    </div>
                    <p className="text-green-600 dark:text-green-400 font-bold">
                      ₹{typeof course.totalRevenue === 'number' ? course.totalRevenue?.toFixed(2) : '0.00'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Failed to load analytics data</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
