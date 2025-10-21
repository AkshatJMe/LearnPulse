import { Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../slices/themeSlice";
import { RootState } from "../../reducer";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex items-center justify-center p-2 rounded-lg 
                 bg-gray-200 dark:bg-gray-800 
                 hover:bg-gray-300 dark:hover:bg-gray-700 
                 transition-all duration-300 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun
          className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 ${
            theme === "light"
              ? "opacity-100 rotate-0"
              : "opacity-0 rotate-180"
          }`}
        />
        <Moon
          className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
            theme === "dark"
              ? "opacity-100 rotate-0"
              : "opacity-0 -rotate-180"
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
