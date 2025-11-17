import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Users, BookOpen, TrendingUp, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import { Course } from "../../types";

interface AdminStats {
  totalUsers: number;
  totalInstructors: number;
  totalCourses: number;
  totalRevenue: number;
  pendingCourses: number;
}

interface PendingCourse extends Course {
  submittedAt: string;
  instructorName: string;
}

const AdminDashboard: React.FC = () => {
  //@ts-ignore
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 5320,
    totalInstructors: 128,
    totalCourses: 450,
    totalRevenue: 2540000,
    pendingCourses: 12,
  });

  const [pendingCourses, setPendingCourses] = useState<PendingCourse[]>([
    {
      _id: "1",
      courseName: "Advanced React Patterns",
      price: 3500,
      instructor: { firstName: "John", lastName: "Doe", email: "john@example.com" },
      courseContent: [],
      ratingAndReviews: [],
      tag: [],
      studentsEnrolled: [],
      status: "Draft",
      submittedAt: "2 hours ago",
      instructorName: "John Doe",
    } as unknown as PendingCourse,
  ]);

  const [selectedTab, setSelectedTab] = useState<"overview" | "courses" | "users">(
    "overview"
  );

  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.accountType !== "admin") {
      navigate("/login");
      return;
    }

    // TODO: Fetch admin dashboard data from backend
    // const fetchAdminData = async () => {
    //   try {
    //     const response = await apiConnector('GET', '/admin/dashboard', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     });
    //     setStats(response.data.stats);
    //     setPendingCourses(response.data.pendingCourses);
    //   } catch (error) {
    //     console.error("Error fetching admin data:", error);
    //   }
    // };
    // fetchAdminData();
  }, [user, navigate]);

  const handleApproveCourse = async (courseId: string) => {
    try {
      // TODO: Call backend to approve course
      // await apiConnector('POST', `/admin/approve-course/${courseId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setPendingCourses((prev) => prev.filter((c) => c._id !== courseId));
      setStats((prev) => ({
        ...prev,
        pendingCourses: prev.pendingCourses - 1,
      }));
    } catch (error) {
      console.error("Error approving course:", error);
    }
  };

  const handleRejectCourse = async (courseId: string) => {
    try {
      // TODO: Call backend to reject course
      // await apiConnector('POST', `/admin/reject-course/${courseId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setPendingCourses((prev) => prev.filter((c) => c._id !== courseId));
      setStats((prev) => ({
        ...prev,
        pendingCourses: prev.pendingCourses - 1,
      }));
    } catch (error) {
      console.error("Error rejecting course:", error);
    }
  };

  if (!user || user.accountType !== "admin") {
    return (
      <DashboardLayout role="admin">
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            This page is only accessible to administrators
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Platform Overview & Management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Instructors
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalInstructors}
                </p>
              </div>
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Courses
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCourses}
                </p>
              </div>
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{(stats.totalRevenue / 100000).toFixed(1)}L
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-yellow-200 dark:border-yellow-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Pending Courses
                </p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.pendingCourses}
                </p>
              </div>
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              selectedTab === "overview"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab("courses")}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              selectedTab === "courses"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400"
            }`}
          >
            Course Approvals ({stats.pendingCourses})
          </button>
          <button
            onClick={() => setSelectedTab("users")}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              selectedTab === "users"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400"
            }`}
          >
            User Management
          </button>
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Signups */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Signups
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Sarah Johnson", role: "Student", time: "2 hours ago" },
                  { name: "Mike Chen", role: "Instructor", time: "5 hours ago" },
                  { name: "Emily Davis", role: "Student", time: "1 day ago" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.role}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {user.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Health */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Platform Health
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Server Health
                    </p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      99.9%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "99.9%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Database Capacity
                    </p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      65%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      User Engagement
                    </p>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      78%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Approvals Tab */}
        {selectedTab === "courses" && (
          <div>
            {pendingCourses.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  All Caught Up!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No pending courses for review
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {course.courseName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          By {course.instructorName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Submitted {course.submittedAt}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold">
                        Pending Review
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleApproveCourse(course._id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
                        onClick={() => handleRejectCourse(course._id)}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Management Tab */}
        {selectedTab === "users" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              User Management
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Joined
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "John Doe",
                      email: "john@example.com",
                      role: "Instructor",
                      joined: "2025-01-15",
                    },
                    {
                      name: "Jane Smith",
                      email: "jane@example.com",
                      role: "Student",
                      joined: "2025-02-20",
                    },
                    {
                      name: "Bob Wilson",
                      email: "bob@example.com",
                      role: "Student",
                      joined: "2025-02-25",
                    },
                  ].map((user, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {user.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === "Instructor"
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {user.joined}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-red-600 dark:text-red-400 hover:underline font-medium text-xs">
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
