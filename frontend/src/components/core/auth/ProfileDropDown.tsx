import { useRef, useState } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import {
  VscArrowRight,
  VscDashboard,
  VscNewFile,
  VscSignOut,
  VscSymbolConstant,
} from "react-icons/vsc";
import { TbLayoutDashboard } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../../../services/operations/authAPI";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { CiCirclePlus } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

export default function ProfileDropdown() {
  //@ts-ignore
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  if (!user) return null;

  return (
    // only for large devices

    <button className="relative hidden sm:flex" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className={"aspect-square w-[30px] rounded-full object-cover"}
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </div>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bg-slate-50 top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
          ref={ref}
        >
          <Link to="/dashboard/profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <CgProfile className="text-lg" />
              Profile
            </div>
          </Link>

          {user && user?.accountType === "student" && (
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <Link
                to="/dashboard/enrolled-courses"
                onClick={() => setOpen(false)}
              >
                <div className="flex gap-1">
                  <VscDashboard className="text-lg" />
                  EnrolledCourses
                </div>
              </Link>
            </div>
          )}

          {user && user?.accountType === "instructor" && (
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <Link to="/dashboard/instructor" onClick={() => setOpen(false)}>
                <div className="flex gap-1">
                  <VscDashboard className="text-lg" />
                  Dashboard
                </div>
              </Link>
            </div>
          )}

          {user && user?.accountType === "instructor" && (
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <Link to="/dashboard/my-courses" onClick={() => setOpen(false)}>
                <div className="flex gap-1">
                  <VscSymbolConstant className="text-lg" />
                  MyCourse
                </div>
              </Link>
            </div>
          )}

          {user && user?.accountType === "instructor" && (
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <Link to="/dashboard/add-course" onClick={() => setOpen(false)}>
                <div className="flex gap-1">
                  <CiCirclePlus className="text-lg" />
                  AddCourse
                </div>
              </Link>
            </div>
          )}

          {user && user?.accountType === "admin" && (
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <Link to="/dashboard/admin" onClick={() => setOpen(false)}>
                <div className="flex gap-1">
                  <TbLayoutDashboard className="text-lg" />
                  Dashboard
                </div>
              </Link>
            </div>
          )}

          {user && user?.accountType === "admin" && (
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <Link
                to="/dashboard/create-category"
                onClick={() => setOpen(false)}
              >
                <div className="flex gap-1">
                  <VscNewFile className="text-lg" />
                  Category
                </div>
              </Link>
            </div>
          )}

          {user && user?.accountType === "admin" && (
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <Link to="/dashboard/all-students" onClick={() => setOpen(false)}>
                <div className="flex gap-1">
                  <VscArrowRight className="text-lg" />
                  Students
                </div>
              </Link>
            </div>
          )}
          {user && user?.accountType === "admin" && (
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <Link
                to="/dashboard/all-instructors"
                onClick={() => setOpen(false)}
              >
                <div className="flex gap-1">
                  <VscArrowRight className="text-lg" />
                  Instructors
                </div>
              </Link>
            </div>
          )}

          <div
            onClick={() => {
              //@ts-ignore
              dispatch(logout(navigate));
              setOpen(false);
            }}
            className="flex w-full items-center gap-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  );
}
