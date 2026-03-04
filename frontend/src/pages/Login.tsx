import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../services/operations/authAPI";

const demoAccounts = [
  {
    role: "Admin",
    email: "admin@learnpulse.com",
    password: "Admin@123456",
  },
  {
    role: "Instructor",
    email: "rahul@instructor.com",
    password: "Instructor@123",
  },
  {
    role: "Student",
    email: "sarah@student.com",
    password: "Student@123",
  },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault(); //@ts-ignore
    dispatch(login(formData.email, formData.password, navigate));
  };

  const handleDemoFill = (account: { email: string; password: string }) => {
    setFormData({
      email: account.email,
      password: account.password,
    });
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-center text-gray-900 dark:text-white md:text-4xl">
          LearnPulse
        </h2>
        <h2 className="mt-6 sm:mt-10 text-center text-xl sm:text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Login to your account
        </h2>
      </div>

      <div className="mt-6 sm:mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4 sm:space-y-6" onSubmit={handleOnSubmit} method="POST">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleOnChange}
                autoComplete="email"
                required
                className="block w-full px-3 py-2.5 rounded-md border-0 text-base text-gray-900 dark:text-white dark:bg-gray-800 dark:ring-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-semibold text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleOnChange}
                autoComplete="current-password"
                required
                className="block w-full px-3 py-2.5 rounded-md border-0 text-base text-gray-900 dark:text-white dark:bg-gray-800 dark:ring-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-4 py-3 text-base font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6 sm:mt-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Demo Quick Login
          </p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => handleDemoFill(account)}
                className="w-full text-left rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              >
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  {account.role}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {account.email}
                </p>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 sm:mt-10 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Not a member?
          <a
            href="/signup"
            className="font-semibold leading-6 text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {"  "}Don't have an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
