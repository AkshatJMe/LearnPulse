import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  getAllUsers,
  deleteUser,
} from "../../services/operations/adminAPI";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  active: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(token);
      console.log(data)
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to ban "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setProcessingId(userId);
      await deleteUser(userId, token);
      toast.success("User banned successfully!");
      fetchAllUsers();
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Failed to ban user");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filterType === "all") return true;
    if (filterType === "active") return user.active;
    if (filterType === "inactive") return !user.active;
    if (filterType === "student") return user.accountType?.toLowerCase() === "student";
    if (filterType === "instructor") return user.accountType?.toLowerCase() === "instructor";
    return true;
  });

  const getAccountTypeColor = (type: string) => {
    const lowerType = type?.toLowerCase();
    if (lowerType === "student") return "bg-blue-900 text-blue-200";
    if (lowerType === "instructor") return "bg-purple-900 text-purple-200";
    if (lowerType === "admin") return "bg-red-900 text-red-200";
    return "bg-gray-700 text-gray-200";
  };

  const getStatusColor = (active: boolean) => {
    return active ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-2">User Management</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage platform users and their access</p>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: "All Users", value: "all" },
          { label: "Active", value: "active" },
          { label: "Students", value: "student" },
          { label: "Instructors", value: "instructor" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterType(filter.value)}
            className={`px-4 py-2 rounded font-semibold transition ${
              filterType === filter.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg border border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Joined</th>
                <th className="px-6 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-4 font-semibold">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getAccountTypeColor(
                        user.accountType
                      )}`}
                    >
                      {user.accountType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        user.active
                      )}`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {user.active && (
                        <button
                          onClick={() => handleBanUser(user._id, `${user.firstName} ${user.lastName}`)}
                          disabled={processingId === user._id}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 rounded font-semibold transition text-white text-sm"
                        >
                          {processingId === user._id ? "Banning..." : "Ban"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-gray-600 dark:text-gray-400">
        <p>Total Users: <span className="font-semibold">{filteredUsers.length}</span> / <span className="text-gray-500 dark:text-gray-500">{users.length}</span></p>
      </div>
    </div>
  );
};

export default UserManagement;
