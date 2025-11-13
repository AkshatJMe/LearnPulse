import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { apiConnector } from "../../services/apiConnector";
import { courseEndpoints } from "../../services/apis";

const {
  CREATE_NEW_CATEGORY,
  EDIT_CATEGORY_API,
  DELETE_CATEGORY,
  COURSE_CATEGORIES_API,
} = courseEndpoints;

interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

const CategoryManagement: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiConnector({
        method: "GET",
        url: COURSE_CATEGORIES_API,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.success) {
        setCategories(response?.data?.data || []);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setProcessingId("form");
      if (editingId) {
        // Update category
        const response = await apiConnector({
          method: "PUT",
          url: `${EDIT_CATEGORY_API}/${editingId}`,
          bodyData: {
            name: formData.name,
            description: formData.description,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data?.success) {
          toast.success("Category updated successfully!");
          fetchCategories();
          resetForm();
        } else {
          toast.error(response?.data?.message || "Failed to update category");
        }
      } else {
        // Create category
        const response = await apiConnector({
          method: "POST",
          url: CREATE_NEW_CATEGORY,
          bodyData: {
            name: formData.name,
            description: formData.description,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data?.success) {
          toast.success("Category created successfully!");
          fetchCategories();
          resetForm();
        } else {
          toast.error(response?.data?.message || "Failed to create category");
        }
      }
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error?.message || "Failed to save category");
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setProcessingId(categoryId);
      const response = await apiConnector({
        method: "DELETE",
        url: `${DELETE_CATEGORY}/${categoryId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.success) {
        toast.success("Category deleted successfully!");
        fetchCategories();
      } else {
        toast.error(response?.data?.message || "Failed to delete category");
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error?.message || "Failed to delete category");
    } finally {
      setProcessingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Category Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage course categories</p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition text-white"
        >
          {showForm ? "Close Form" : "+ New Category"}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? "Edit Category" : "Create New Category"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description"
                rows={4}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Form Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={processingId === "form"}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded font-semibold transition text-white"
              >
                {processingId === "form"
                  ? "Saving..."
                  : editingId
                  ? "Update Category"
                  : "Create Category"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded font-semibold transition text-gray-900 dark:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg border border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No categories created yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:border-gray-400 dark:hover:border-gray-600 transition"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{category.name}</h3>

              {category.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {category.description}
                </p>
              )}

              {/* <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </div> */}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition text-sm text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  disabled={processingId === category._id}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 rounded font-semibold transition text-sm text-white"
                >
                  {processingId === category._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-gray-700 dark:text-gray-400">
        <p>
          Total Categories: <span className="font-semibold">{categories.length}</span>
        </p>
      </div>
    </div>
  );
};

export default CategoryManagement;
