import { Button, Card, CardHeader } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateProfile } from "../../../services/operations/settingsAPI";

const genders: string[] = [
  "Male",
  "Female",
  "Non-Binary",
  "Prefer not to say",
  "Other",
];

const EditProfile = () => {
  //@ts-ignore
  const { user } = useSelector((state) => state.profile); //@ts-ignore
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submitProfileForm = async (data: any) => {
    try {
      //@ts-ignore
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("Some error occured in uploading");
    }
  };

  return (
    <div>
      <Card className="w-full mb-7">
        <CardHeader className="flex items-center justify-between rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12">
          <div className="flex gap-10">
            <div className="flex flex-col justify-center">
              <p className="text-lg font-semibold text-richblack-5 capitalize">
                Profile Information
              </p>
            </div>
          </div>
        </CardHeader>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit(submitProfileForm)}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  First Name
                </label>
                <input
                  type="text" //@ts-ignore
                  name="firstName"
                  id="firstName"
                  placeholder="Enter first name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  {...register("firstName", { required: true })}
                  defaultValue={user?.firstName}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text" //@ts-ignore
                  name="lastName"
                  id="lastName"
                  placeholder="Enter first name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  {...register("lastName", { required: true })}
                  defaultValue={user?.lastName}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="dateOfBirth"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Date of Birth
                </label>

                <input
                  type="date" //@ts-ignore
                  name="dateOfBirth"
                  id="dateOfBirth"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  {...register("dateOfBirth", {
                    required: {
                      value: true,
                      message: "Please enter your Date of Birth.",
                    },
                    max: {
                      value: new Date().toISOString().split("T")[0],
                      message: "Date of Birth cannot be in the future.",
                    },
                  })}
                  defaultValue={user?.additionalDetails?.dateOfBirth}
                />
              </div>

              <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="gender" className="lable-style">
                  Gender
                </label>
                <select //@ts-ignore
                  type="text" //@ts-ignore
                  name="gender"
                  id="gender"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block p-2.5"
                  {...register("gender", { required: true })}
                  defaultValue={user?.additionalDetails?.gender}
                >
                  {genders.map((ele, i) => {
                    return (
                      <option key={i} value={ele}>
                        {ele}
                      </option>
                    );
                  })}
                </select>
                {errors.gender && (
                  <span className="-mt-1 text-[12px] text-yellow-100">
                    Please enter your Date of Birth.
                  </span>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="contactNumber"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Contact Number
                </label>
                <input
                  type="tel" //@ts-ignore
                  name="contactNumber"
                  id="contactNumber"
                  placeholder="Enter Contact Number"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  {...register("contactNumber", {
                    required: {
                      value: true,
                      message: "Please enter your Contact Number.",
                    },
                    maxLength: { value: 12, message: "Invalid Contact Number" },
                    minLength: { value: 10, message: "Invalid Contact Number" },
                  })}
                  defaultValue={user?.additionalDetails?.contactNumber}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="about"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  About
                </label>
                <input
                  type="text" //@ts-ignore
                  name="about"
                  id="about"
                  placeholder="Enter Bio Details"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  {...register("about", { required: true })}
                  defaultValue={user?.additionalDetails?.about}
                />
              </div>
            </div>
            <div className="space-x-2 pt-4 flex justify-end">
              <Button
                color="default"
                onClick={() => {
                  navigate("/dashboard/profile");
                }}
              >
                Cancel
              </Button>
              <Button color="warning" type="submit">
                Save
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default EditProfile;
