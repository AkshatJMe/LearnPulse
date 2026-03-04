import "./index.css";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

// Pages
import Home from "./pages/Home";
import { About } from "./pages/About";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import MyProfile from "./pages/dashboard/MyProfile";
import PageNotFound from "./pages/NotFoundPage";
import Settings from "./pages/dashboard/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Contact from "./pages/Contact";
import EnhancedCart from "./pages/EnhancedCart";
import Catalog from "./pages/Catalog";
import CreateCategory from "./pages/dashboard/CreateCategory";
import AllStudents from "./pages/dashboard/AllStudents";
import AllInstructors from "./pages/dashboard/AllInstructors";
import AddCourse from "./pages/instructor/AddCourse";
import MyCourses from "./pages/instructor/MyCourses";
import Instructor from "./pages/instructor/Instructor";
import EnrolledCourses from "./pages/student/EnrolledCourses";
import OpenRoute from "./components/core/auth/OpenRoute";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminAnalyticsDashboard from "./pages/admin/AdminDashboard";
import AdminPendingCourses from "./pages/admin/PendingCourses";
import AdminUserManagement from "./pages/admin/UserManagement";
import AdminCourseManagement from "./pages/admin/CourseManagement";
import AdminCouponManagement from "./pages/admin/CouponManagement";
import AdminCategoryManagement from "./pages/admin/CategoryManagement";
import CategoryType from "./pages/CategoryType";
import CoursePreview from "./pages/CoursePreview";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Wishlist from "./pages/Wishlist";
import NotificationsPage from "./pages/NotificationsPage";
import Certificates from "./pages/student/Certificates";
import CertificatesPage from "./pages/CertificatesPage";
import CertificateDetailPage from "./pages/CertificateDetailPage";
import StudentProgressPage from "./pages/StudentProgressPage";
import CourseProgressDetailPage from "./pages/CourseProgressDetailPage";
import CreateQuiz from "./pages/instructor/CreateQuiz";
import TakeQuiz from "./pages/student/TakeQuiz";
import QuizResult from "./pages/student/QuizResult";
import CourseDiscussion from "./pages/CourseDiscussion";
import InstructorAnalytics from "./pages/instructor/InstructorAnalytics";
import AdminPlatformAnalytics from "./pages/dashboard/AdminPlatformAnalytics";
import ContentModeration from "./pages/dashboard/ContentModeration";

// Layout
import MainLayout from "./components/layout/MainLayout";

function App() {
  const { user } = useSelector((state: any) => state.profile || {});

  return (
    <ThemeProvider>
      <ToastProvider>
        <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/courses" element={<Catalog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/catalog/:id" element={<CategoryType />} />

          {/* Auth Routes */}
          <Route
            path="/signup"
            element={
              <OpenRoute>
                <SignUp />
              </OpenRoute>
            }
          />
          <Route
            path="/login"
            element={
              <OpenRoute>
                <LoginPage />
              </OpenRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />
          <Route
            path="/update-password/:token"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />

          {/* Course Routes */}
          <Route path="/course/:courseId" element={<CoursePreview />} />

          {/* General Dashboard Routes */}
          {user && (
            <>
              <Route path="/dashboard/profile" element={<MyProfile />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/certificate/:certificateId" element={<CertificateDetailPage />} />
              <Route path="/dashboard/progress" element={<StudentProgressPage />} />
              <Route path="/dashboard/progress/:courseId" element={<CourseProgressDetailPage />} />
              <Route path="/cart" element={<EnhancedCart />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
              <Route path="/courses/:courseId/discussion" element={<CourseDiscussion />} />
            </>
          )}

          {/* Student Routes */}
          {String(user?.accountType || "").toLowerCase() === "student" && (
            <>
              <Route path="/dashboard" element={<MyProfile />} />
              <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
              <Route path="/dashboard/wishlist" element={<Wishlist />} />
              <Route path="/dashboard/certificates" element={<Certificates />} />
              <Route path="/quiz/:quizId/take" element={<TakeQuiz />} />
              <Route path="/quiz-result/:attemptId" element={<QuizResult />} />
            </>
          )}

          {/* Instructor Routes */}
          {String(user?.accountType || "").toLowerCase() === "instructor" && (
            <>
              <Route path="/dashboard/instructor" element={<Instructor />} />
              <Route path="/dashboard/add-course" element={<AddCourse />} />
              <Route path="/dashboard/my-courses" element={<MyCourses />} />
              <Route path="/dashboard/analytics" element={<InstructorAnalytics />} />
              <Route path="/course/:courseId/quiz/create" element={<CreateQuiz />} />
            </>
          )}

          {/* Admin Routes */}
          {String(user?.accountType || "").toLowerCase() === "admin" && (
            <>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminAnalyticsDashboard />} />
              <Route path="/admin/pending-courses" element={<AdminPendingCourses />} />
              <Route path="/admin/users" element={<AdminUserManagement />} />
              <Route path="/admin/courses" element={<AdminCourseManagement />} />
              <Route path="/admin/coupons" element={<AdminCouponManagement />} />
              <Route path="/admin/categories" element={<AdminCategoryManagement />} />
              <Route path="/dashboard/create-category" element={<CreateCategory />} />
              <Route path="/dashboard/all-students" element={<AllStudents />} />
              <Route path="/dashboard/all-instructors" element={<AllInstructors />} />
              <Route path="/dashboard/analytics" element={<AdminPlatformAnalytics />} />
              <Route path="/dashboard/moderation" element={<ContentModeration />} />
            </>
          )}

          {/* Catch all */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </MainLayout>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
