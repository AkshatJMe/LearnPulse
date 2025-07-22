//@ts-nocheck
import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const stats = {
    totalUsers: 15420,
    totalInstructors: 1250,
    totalStudents: 14170,
    totalCourses: 3450,
    totalRevenue: 245670,
    monthlyGrowth: 12.5,
    activeUsers: 8920,
    courseCompletionRate: 73.2,
  };

  const recentUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Student",
      joinDate: "2024-01-20",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Instructor",
      joinDate: "2024-01-19",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@example.com",
      role: "Student",
      joinDate: "2024-01-18",
      status: "Pending",
    },
  ];

  const recentCourses = [
    {
      id: 1,
      title: "Advanced React Patterns",
      instructor: "Sarah Johnson",
      status: "Under Review",
      submittedDate: "2024-01-20",
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      instructor: "Dr. Smith",
      status: "Approved",
      submittedDate: "2024-01-19",
    },
  ];

  const categoryStats = [
    { name: "Web Development", courses: 1250, percentage: 36 },
    { name: "Data Science", courses: 890, percentage: 26 },
    { name: "Mobile Development", courses: 650, percentage: 19 },
    { name: "Design", courses: 450, percentage: 13 },
    { name: "Marketing", courses: 210, percentage: 6 },
  ];

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">Platform overview and management</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-slate-700"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          growth={stats.monthlyGrowth}
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          growth={8.3}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          growth={15.7}
        />
        <StatCard title="Active Users" value={stats.activeUsers} growth={5.2} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <BreakdownCard
          title="Students"
          value={stats.totalStudents}
          total={stats.totalUsers}
        />
        <BreakdownCard
          title="Instructors"
          value={stats.totalInstructors}
          total={stats.totalUsers}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.courseCompletionRate}%`}
          growth={2.1}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <RecentUsersCard users={recentUsers} />
        <CategoryStatsCard stats={categoryStats} />
      </div>

      <RecentCoursesCard courses={recentCourses} />

      <QuickActions />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  growth,
}: {
  title: string;
  value: number | string;
  growth: number;
}) => (
  <div className="bg-white shadow rounded-xl p-6 text-center">
    <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
    <div className="text-slate-500">{title}</div>
    <div className="text-green-500 text-sm mt-1">+{growth}% this month</div>
  </div>
);

const BreakdownCard = ({
  title,
  value,
  total,
}: {
  title: string;
  value: number;
  total: number;
}) => (
  <div className="bg-white shadow rounded-xl p-6 text-center">
    <div className="text-2xl font-bold text-slate-800 mb-1">
      {value.toLocaleString()}
    </div>
    <div className="text-slate-500">{title}</div>
    <div className="text-sm text-slate-400 mt-1">
      {((value / total) * 100).toFixed(1)}% of total users
    </div>
  </div>
);

const RecentUsersCard = ({ users }: { users: typeof recentUsers }) => (
  <div className="bg-white shadow rounded-xl p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold text-slate-800">Recent Users</h3>
      <Link to="/admin/users" className="text-blue-600 text-sm">
        View All
      </Link>
    </div>
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex justify-between items-center border p-3 rounded"
        >
          <div>
            <h5 className="text-slate-800 font-medium">{user.name}</h5>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="text-xs text-slate-400">Joined: {user.joinDate}</p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-2 py-1 text-xs rounded ${
                user.role === "Instructor"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {user.role}
            </span>
            <div className="mt-1">
              <span
                className={`inline-block px-2 py-1 text-xs rounded ${
                  user.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CategoryStatsCard = ({ stats }: { stats: typeof categoryStats }) => (
  <div className="bg-white shadow rounded-xl p-6">
    <h3 className="text-xl font-semibold text-slate-800 mb-4">
      Course Categories
    </h3>
    <div className="space-y-4">
      {stats.map((category, index) => (
        <div key={index}>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-slate-700">{category.name}</span>
            <span className="text-sm text-slate-400">
              {category.courses} courses
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${category.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RecentCoursesCard = ({ courses }: { courses: typeof recentCourses }) => (
  <div className="bg-white shadow rounded-xl p-6 mb-10">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold text-slate-800">
        Recent Course Submissions
      </h3>
      <Link to="/admin/courses" className="text-blue-600 text-sm">
        View All
      </Link>
    </div>
    <div className="space-y-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="flex justify-between items-center border p-3 rounded"
        >
          <div>
            <h5 className="text-slate-800 font-medium">{course.title}</h5>
            <p className="text-sm text-slate-500">By {course.instructor}</p>
            <p className="text-xs text-slate-400">
              Submitted: {course.submittedDate}
            </p>
          </div>
          <div className="flex gap-3">
            <span
              className={`inline-block px-2 py-1 text-xs rounded ${
                course.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : course.status === "Under Review"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {course.status}
            </span>
            <button className="text-sm text-blue-600">Review</button>
            <button className="text-sm text-slate-700">View</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickActions = () => (
  <div className="bg-white shadow rounded-xl p-6">
    <h3 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Link
        to="/admin/users"
        className="flex flex-col items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100"
      >
        <span className="text-2xl mb-2">👥</span>
        <span className="text-sm font-medium text-slate-700">Manage Users</span>
      </Link>
      <Link
        to="/admin/categories"
        className="flex flex-col items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100"
      >
        <span className="text-2xl mb-2">📂</span>
        <span className="text-sm font-medium text-slate-700">Categories</span>
      </Link>
      <button className="flex flex-col items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100">
        <span className="text-2xl mb-2">📊</span>
        <span className="text-sm font-medium text-slate-700">Reports</span>
      </button>
      <button className="flex flex-col items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100">
        <span className="text-2xl mb-2">⚙️</span>
        <span className="text-sm font-medium text-slate-700">Settings</span>
      </button>
    </div>
  </div>
);

export default AdminDashboard;
