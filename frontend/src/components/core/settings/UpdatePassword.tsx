import { Button, Card, CardHeader } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../services/operations/settingsAPI";

const UpdatePassword = () => {
  //@ts-ignore
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    //@ts-ignore
    formState: { errors },
  } = useForm();

  const submitPasswordForm = async (data: any) => {
    try {
      //@ts-ignore
      dispatch(changePassword(token, data));
    } catch (error) {
      console.log("ERROR IN UPDATING PASSWORD");
    }
  };

  return (
    <div className="mb-4">
      <Card className="w-full mb-7">
        <CardHeader className="flex items-center justify-between rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-8 px-3 sm:px-12">
          <div className="flex gap-10">
            <div className="flex flex-col justify-center">
              <p className="text-lg font-semibold text-richblack-5 capitalize">
                Password
              </p>
            </div>
          </div>
        </CardHeader>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit(submitPasswordForm)}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="oldPassword"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password" //@ts-ignore
                  name="oldPassword"
                  id="oldPassword"
                  placeholder="Enter Current Password"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  {...register("oldPassword", { required: true })}
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  New Password
                </label>
                <input
                  type="password" //@ts-ignore
                  name="newPassword"
                  id="newPassword"
                  placeholder="Enter New Password"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  {...register("newPassword", { required: true })}
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="confirmNewPassword"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Last Name
                </label>
                <input
                  type={"password"} //@ts-ignore
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  placeholder="Enter Confirm New Password"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  {...register("confirmNewPassword", { required: true })}
                />
              </div>
            </div>
            <div className="space-x-2 pt-4 flex justify-end">
              <Button
                color="default"
                onClick={() => {
                  navigate("/dashboard/my-profile");
                }}
              >
                Cancel
              </Button>
              <Button color="warning" type="submit">
                Update
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default UpdatePassword;
