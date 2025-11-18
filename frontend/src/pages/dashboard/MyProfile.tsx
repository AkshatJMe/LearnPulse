import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, Image } from "@nextui-org/react";
import { EditBtn } from "../../components/core/EditBtn";
import { formattedDate } from "../../utils/dareFormatter";

const MyProfile = () => {
  //@ts-ignore
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  return (
    <div className="p-10">
      <h1 className="mb-14 text-4xl font-medium text-gray-900 dark:text-gray-100 font-boogaloo text-center sm:text-left">
        {" "}
        My Profile
      </h1>

      <Card className="w-full mb-7">
        <CardHeader className="flex items-center justify-between rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12">
          <div className="flex gap-10">
            <Image
              alt={`profile-${user?.firstName}`}
              height={80}
              radius="sm"
              src={user?.image}
              width={80}
              className=""
            />
            <div className="flex flex-col justify-center">
              <p className="text-lg font-semibold text-richblack-5 capitalize">
                {" "}
                {user?.firstName + " " + user?.lastName}
              </p>
              <p className="text-small text-richblack-300">{user?.email}</p>
            </div>
          </div>
          <EditBtn text="Edit" onClick={() => navigate("/dashboard/settings")} />
        </CardHeader>
      </Card>

      <Card className="w-full mb-7">
        <CardHeader className="flex items-center justify-between rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12">
          <div className="flex gap-10 flex-col">
            <div className="flex flex-col justify-center">
              <p className="text-lg font-semibold text-richblack-5 capitalize">
                About
              </p>
            </div>

            <p
              className={`${
                user?.additionalDetails?.about
                  ? "text-richblack-5"
                  : "text-richblack-400"
              } text-sm font-medium`}
            >
              {user?.additionalDetails?.about ??
                "Write Something About Yourself "}
            </p>
          </div>
          <EditBtn text="Edit" onClick={() => navigate("/dashboard/settings")} />
        </CardHeader>
      </Card>

      <Card className="w-full mb-7">
        <CardHeader className="flex flex-col items-center justify-between rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12">
          <div className="flex w-full items-center justify-between">
            <p className="text-lg font-semibold text-richblack-5">
              Personal Details
            </p>
            <EditBtn text="Edit" onClick={() => navigate("/dashboard/settings")} />
          </div>

          {/* niche wala container */}
          <div className="w-full ">
            <div className="flex gap-10 max-w-[500px] justify-between">
              <div className="flex flex-col gap-y-5">
                <div>
                  <p className="mb-2 text-sm text-richblack-300">First Name</p>
                  <p className="text-sm font-semibold text-richblack-5 capitalize">
                    {user?.firstName}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-300">
                    Account Type
                  </p>
                  <p className="text-sm font-semibold text-richblack-5 capitalize">
                    {user?.accountType}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-300">Email</p>
                  <p className="text-sm font-semibold text-richblack-5">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-300">Gender</p>
                  <p className="text-sm font-semibold text-richblack-5">
                    {user?.additionalDetails?.gender ?? "Add Gender"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-y-5">
                <div>
                  <p className="mb-2 text-sm text-richblack-300">Last Name</p>
                  <p className="text-sm font-semibold text-richblack-5 capitalize">
                    {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-300">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-richblack-5">
                    {user?.additionalDetails?.contactNumber ??
                      "Add Contact Number"}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-richblack-300">
                    Date Of Birth
                  </p>
                  <p className="text-sm font-semibold text-richblack-5">
                    {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                      "Add Date Of Birth"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MyProfile;
