import ChangeProfilePicture from "../../components/core/settings/ChangeProfilePicture";
import DeleteAccount from "../../components/core/settings/DeleteAccount";
import EditProfile from "../../components/core/settings/EditProfile";
import UpdatePassword from "../../components/core/settings/UpdatePassword";
import { useTheme } from "../../context/ThemeContext";
import { Monitor, Moon, Sun } from "lucide-react";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="mb-8 text-3xl font-medium font-boogaloo text-center sm:text-left">
        Edit Profile
      </h1>

      <div className="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5">
        <h2 className="text-lg font-semibold mb-3">Theme</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Choose how LearnPulse looks for you.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 border transition ${
              theme === "light"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            }`}
          >
            <Sun size={16} />
            Light
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 border transition ${
              theme === "dark"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            }`}
          >
            <Moon size={16} />
            Dark
          </button>

          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 border transition ${
              theme === "system"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            }`}
          >
            <Monitor size={16} />
            System
          </button>
        </div>
      </div>

      <ChangeProfilePicture />
      <EditProfile />
      <UpdatePassword />
      <DeleteAccount />
    </div>
  );
};

export default Settings;
