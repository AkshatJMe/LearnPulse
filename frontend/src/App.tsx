import "./index.css";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
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
import Cart from "./pages/Cart";
import CreateCategory from "./pages/dashboard/CreateCategory";
import AllStudents from "./pages/dashboard/AllStudents";
import AllInstructors from "./pages/dashboard/AllInstructors";
import AddCourse from "./pages/instructor/AddCourse";
import MyCourses from "./pages/instructor/MyCourses";
import Instructor from "./pages/instructor/Instructor";
import EnrolledCourses from "./pages/student/EnrolledCourses";
import OpenRoute from "./components/core/auth/OpenRoute";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import CategoryType from "./pages/CategoryType";
import CoursePreview from "./pages/CoursePreview";

function App() {
  // @ts-ignore
  const { user } = useSelector((state) => state.profile);
  return (
    <div className="w-screen min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="catalog/:id" element={<CategoryType />} />

        <Route
          path="signup"
          element={
            <OpenRoute>
              <SignUp />
            </OpenRoute>
          }
        />

        <Route
          path="login"
          element={
            <OpenRoute>
              <LoginPage />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        {user && (
          <>
            <Route path="/dashboard/my-profile" element={<MyProfile />} />
            <Route path="/dashboard/Settings" element={<Settings />} />
            <Route path="/course/:courseId" element={<CoursePreview />} />
          </>
        )}

        {user?.accountType === "admin" && (
          <>
            <Route
              path="dashboard/create-category"
              element={<CreateCategory />}
            />
            <Route path="dashboard/all-students" element={<AllStudents />} />
            <Route
              path="dashboard/all-instructors"
              element={<AllInstructors />}
            />

            <Route path="dashboard/admin" element={<AdminDashboard />} />
          </>
        )}

        {user?.accountType === "student" && (
          <>
            <Route path="dashboard/cart" element={<Cart />} />
            <Route
              path="dashboard/enrolled-courses"
              element={<EnrolledCourses />}
            />
          </>
        )}

        {user?.accountType === "instructor" && (
          <>
            <Route path="dashboard/instructor" element={<Instructor />} />
            <Route path="dashboard/add-course" element={<AddCourse />} />
            <Route path="dashboard/my-course" element={<MyCourses />} />
          </>
        )}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
