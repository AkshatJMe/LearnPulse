import React, { useState } from "react";
import { Search, Trash2, Shield } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: "student" | "instructor" | "admin";
  createdAt: string;
}

interface UserManagementTableProps {
  users?: User[];
  onSuspend?: (userId: string) => void;
  onPromoteToAdmin?: (userId: string) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users = [
    {
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      accountType: "instructor",
      createdAt: "2025-01-15",
    },
    {
      _id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      accountType: "student",
      createdAt: "2025-02-20",
    },
    {
      _id: "3",
      firstName: "Bob",
      lastName: "Wilson",
      email: "bob@example.com",
      accountType: "student",
      createdAt: "2025-02-25",
    },
  ],
  onSuspend = () => {},
  onPromoteToAdmin = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "role">("date");

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      case "role":
        return a.accountType.localeCompare(b.accountType);
      case "date":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "instructor":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "date" | "role")}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="role">Sort by Role</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                  Name
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                  Email
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                  Role
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                  Joined
                </th>
                <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadgeColor(
                          user.accountType
                        )}`}
                      >
                        {user.accountType}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {user.accountType !== "admin" && (
                          <button
                            onClick={() => onPromoteToAdmin(user._id)}
                            className="p-1 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition"
                            title="Promote to Admin"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onSuspend(user._id)}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                          title="Suspend User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {sortedUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default UserManagementTable;
