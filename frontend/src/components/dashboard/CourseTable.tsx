import React from 'react';
import { Card, Button } from '../ui';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';

interface CourseTableProps {
  courses: Array<{
    _id: string;
    courseName: string;
    category: string;
    students?: number;
    revenue?: number;
    status?: 'active' | 'draft' | 'archived';
  }>;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  onView?: (courseId: string) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  onEdit,
  onDelete,
  onView,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'draft':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'archived':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Course Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Category
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Students
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Revenue
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr
              key={course._id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                {course.courseName}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{course.category}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {course.students?.toLocaleString() || '0'}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {course.revenue ? `₹${course.revenue.toLocaleString()}` : '₹0'}
              </td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {course.status || 'Unknown'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {onView && (
                    <button
                      onClick={() => onView(course._id)}
                      className="text-blue-600 hover:text-blue-700 transition-colors p-1"
                      title="View"
                    >
                      <ExternalLink size={16} />
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(course._id)}
                      className="text-gray-600 hover:text-gray-700 transition-colors p-1"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(course._id)}
                      className="text-red-600 hover:text-red-700 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {courses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No courses found</p>
        </div>
      )}
    </div>
  );
};

export default CourseTable;
