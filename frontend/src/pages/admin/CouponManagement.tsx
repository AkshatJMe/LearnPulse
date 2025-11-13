import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
} from "../../services/operations/couponAPI";
import { apiConnector } from "../../services/apiConnector";
import { courseEndpoints } from "../../services/apis";

interface Coupon {
  _id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  discountType: "percent" | "fixed";
  expiryDate?: string;
  maxUsage?: number;
  usedCount: number;
  courseId?: string;
  isActive: boolean;
  minPurchaseAmount?: number;
  course?: {
    courseName: string;
  };
}

const CouponManagement: React.FC = () => {
  const { token } = useSelector((state: any) => state.auth);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent",
    discountPercent: "",
    discountAmount: "",
    expiryDate: "",
    maxUsage: "",
    courseId: "",
    minPurchaseAmount: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
    fetchCourses();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons(token);
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await apiConnector({
        method: "GET",
        url: courseEndpoints.GET_ALL_COURSE_API,
      });

      if (response?.data?.success) {
        setCourses(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }

    if (!formData.discountPercent && !formData.discountAmount) {
      toast.error("Please enter either discount percent or amount");
      return;
    }

    const data: any = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      isActive: formData.isActive,
    };

    if (formData.discountPercent) {
      data.discountPercent = Number(formData.discountPercent);
    }
    if (formData.discountAmount) {
      data.discountAmount = Number(formData.discountAmount);
    }
    if (formData.expiryDate) {
      data.expiryDate = new Date(formData.expiryDate);
    }
    if (formData.maxUsage) {
      data.maxUsage = Number(formData.maxUsage);
    }
    if (formData.courseId) {
      data.courseId = formData.courseId;
    }
    if (formData.minPurchaseAmount) {
      data.minPurchaseAmount = Number(formData.minPurchaseAmount);
    }

    try {
      setProcessingId("form");
      if (editingId) {
        await updateCoupon(editingId, data, token);
        toast.success("Coupon updated successfully!");
      } else {
        await createCoupon(data, token);
        toast.success("Coupon created successfully!");
      }
      fetchCoupons();
      resetForm();
    } catch (error: any) {
      console.error("Error saving coupon:", error);
      toast.error(error.message || "Failed to save coupon");
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = async (couponId: string) => {
    try {
      const coupon = await getCoupon(couponId, token);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountPercent: coupon.discountPercent?.toString() || "",
        discountAmount: coupon.discountAmount?.toString() || "",
        expiryDate: coupon.expiryDate
          ? new Date(coupon.expiryDate).toISOString().split("T")[0]
          : "",
        maxUsage: coupon.maxUsage?.toString() || "",
        courseId: coupon.courseId || "",
        minPurchaseAmount: coupon.minPurchaseAmount?.toString() || "",
        isActive: coupon.isActive,
      });
      setEditingId(couponId);
      setShowForm(true);
    } catch (error) {
      toast.error("Failed to load coupon details");
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    try {
      setProcessingId(couponId);
      await deleteCoupon(couponId, token);
      toast.success("Coupon deleted successfully!");
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    } finally {
      setProcessingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percent",
      discountPercent: "",
      discountAmount: "",
      expiryDate: "",
      maxUsage: "",
      courseId: "",
      minPurchaseAmount: "",
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
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
          <h1 className="text-4xl font-bold">Coupon Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
        >
          {showForm ? "Close Form" : "+ New Coupon"}
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? "Edit Coupon" : "Create New Coupon"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter coupon code"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={!!editingId}
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Discount Type *
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              {/* Discount Percent */}
              {formData.discountType === "percent" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Discount Percent (0-100) *
                  </label>
                  <input
                    type="number"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleInputChange}
                    placeholder="e.g., 20"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Discount Amount */}
              {formData.discountType === "fixed" && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Discount Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="discountAmount"
                    value={formData.discountAmount}
                    onChange={handleInputChange}
                    placeholder="e.g., 500"
                    min="0"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Max Usage */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Maximum Usage (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  name="maxUsage"
                  value={formData.maxUsage}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  min="1"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Min Purchase Amount */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Minimum Purchase Amount (₹)
                </label>
                <input
                  type="number"
                  name="minPurchaseAmount"
                  value={formData.minPurchaseAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000"
                  min="0"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Applicable Course */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Applicable Course (leave empty for all courses)
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">Active</span>
                </label>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={processingId === "form"}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded font-semibold transition"
              >
                {processingId === "form" ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg border border-gray-300 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No coupons created yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:border-gray-400 dark:hover:border-gray-600 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                {/* Code */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Code</p>
                  <p className="text-xl font-bold font-mono">{coupon.code}</p>
                </div>

                {/* Discount */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Discount</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {coupon.discountType === "percent"
                      ? `${coupon.discountPercent}%`
                      : `₹${coupon.discountAmount}`}
                  </p>
                </div>

                {/* Usage */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Usage</p>
                  <p className="text-lg font-semibold">
                    {coupon.usedCount}
                    {coupon.maxUsage ? `/${coupon.maxUsage}` : " (unlimited)"}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        coupon.isActive
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                    {isExpired(coupon.expiryDate) && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-900 text-red-200">
                        Expired
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                {coupon.expiryDate && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Expiry</p>
                    <p className="font-semibold">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {coupon.minPurchaseAmount && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Min Purchase</p>
                    <p className="font-semibold">₹{coupon.minPurchaseAmount}</p>
                  </div>
                )}

                {coupon.course && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Course</p>
                    <p className="font-semibold">{coupon.course.courseName}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleEdit(coupon._id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  disabled={processingId === coupon._id}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 rounded font-semibold transition"
                >
                  {processingId === coupon._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-gray-600 dark:text-gray-400">
        <p>Total Coupons: <span className="font-semibold">{coupons.length}</span></p>
      </div>
    </div>
  );
};

export default CouponManagement;
