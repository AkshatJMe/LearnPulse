//@ts-nocheck
import { useDispatch, useSelector } from "react-redux";
import { useTable, useSortBy } from "react-table";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../services/formateDate";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../utils/constant";
import ConfirmationModal from "../../../common/ConfirmationModal";
import Img from "./../../../common/Img";
import toast from "react-hot-toast";

// Define TypeScript interfaces for props and data
interface Course {
  _id: string;
  thumbnail: string;
  courseName: string;
  courseDescription: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  status: COURSE_STATUS;
}

interface CoursesTableProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const CoursesTable: React.FC<CoursesTableProps> = ({
  courses,
  setCourses,
  loading,
  setLoading,
}) => {
  const navigate = useNavigate();
  const { token } = useSelector((state: any) => state.auth);

  const [confirmationModal, setConfirmationModal] = useState<{
    text1: string;
    text2: string;
    btn1Text: string;
    btn2Text: string;
    btn1Handler: () => void;
    btn2Handler: () => void;
  } | null>(null);

  const TRUNCATE_LENGTH = 25;

  // Handle course deletion
  const handleCourseDelete = async (courseId: string) => {
    setLoading(true);
    const toastId = toast.loading("Deleting...");
    await deleteCourse({ courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
    toast.dismiss(toastId);
  };

  // Define columns for react-table
  const columns = React.useMemo(
    () => [
      {
        Header: "Courses",
        accessor: "courseName",
        Cell: ({ row }: any) => (
          <div className="flex gap-x-4">
            <Img
              src={row.original.thumbnail}
              alt={row.original.courseName}
              className="h-[148px] min-w-[270px] max-w-[270px] rounded-lg object-cover"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-richblack-5 capitalize">
                {row.original.courseName}
              </p>
              <p className="text-xs text-richblack-300">
                {row.original.courseDescription.split(" ").length >
                TRUNCATE_LENGTH
                  ? row.original.courseDescription
                      .split(" ")
                      .slice(0, TRUNCATE_LENGTH)
                      .join(" ") + "..."
                  : row.original.courseDescription}
              </p>
              <p className="text-[12px] text-richblack-100 mt-4">
                Created: {formatDate(row.original.createdAt)}
              </p>
              <p className="text-[12px] text-richblack-100">
                Updated: {formatDate(row.original.updatedAt)}
              </p>
              {row.original.status === COURSE_STATUS.DRAFT ? (
                <p className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                  <HiClock size={14} />
                  Drafted
                </p>
              ) : (
                <div className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                  <p className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                    <FaCheck size={8} />
                  </p>
                  Published
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        Header: "Duration",
        accessor: "duration",
        Cell: () => "2hr 30min",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }: any) => `₹${value}`,
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }: any) => (
          <div className="flex gap-x-2">
            <button
              disabled={loading}
              onClick={() =>
                navigate(`/dashboard/edit-course/${row.original._id}`)
              }
              title="Edit"
              className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
            >
              <FiEdit2 size={20} />
            </button>
            <button
              disabled={loading}
              onClick={() => {
                setConfirmationModal({
                  text1: "Do you want to delete this course?",
                  text2: "All the data related to this course will be deleted",
                  btn1Text: !loading ? "Delete" : "Loading...",
                  btn2Text: "Cancel",
                  btn1Handler: !loading
                    ? () => handleCourseDelete(row.original._id)
                    : () => {},
                  btn2Handler: !loading
                    ? () => setConfirmationModal(null)
                    : () => {},
                });
              }}
              title="Delete"
              className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
            >
              <RiDeleteBin6Line size={20} />
            </button>
          </div>
        ),
      },
    ],
    [navigate, loading, handleCourseDelete]
  );

  // Initialize table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: courses }, useSortBy);

  // Skeleton loader
  const skItem = () => (
    <div className="flex border-b border-richblack-800 px-6 py-8 w-full">
      <div className="flex flex-1 gap-x-4">
        <div className="h-[148px] min-w-[300px] rounded-xl skeleton"></div>
        <div className="flex flex-col w-[40%]">
          <p className="h-5 w-[50%] rounded-xl skeleton"></p>
          <p className="h-20 w-[60%] rounded-xl mt-3 skeleton"></p>
          <p className="h-2 w-[20%] rounded-xl skeleton mt-3"></p>
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <table
        {...getTableProps()}
        className="rounded-2xl border border-richblack-800"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="flex gap-x-10 rounded-t-3xl border-b border-b-richblack-800 px-6 py-2"
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="text-left text-sm font-medium uppercase text-richblack-100"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {loading ? (
            <>
              {skItem()}
              {skItem()}
              {skItem()}
            </>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="py-10 text-center text-2xl font-medium text-richblack-100"
              >
                No courses found
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="text-sm font-medium text-richblack-100"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default CoursesTable;
