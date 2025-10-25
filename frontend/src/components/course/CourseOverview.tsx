import React, { useState } from "react";
import { ChevronDown, CheckCircle } from "lucide-react";

interface CourseOverviewProps {
  courseDescription: string;
  whatYouWillLearn: string[];
  prerequisites?: string[];
  instructions?: string[];
}

const CourseOverview: React.FC<CourseOverviewProps> = ({
  courseDescription,
  whatYouWillLearn,
  prerequisites = [],
  instructions = [],
}) => {
  const [expandedSection, setExpandedSection] = useState<
    "learn" | "prereq" | "instructions" | null
  >("learn");

  const toggleSection = (section: "learn" | "prereq" | "instructions") => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      {/* Course Description */}
      <section>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          About This Course
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {courseDescription}
        </p>
      </section>

      {/* What You'll Learn */}
      <section>
        <button
          onClick={() => toggleSection("learn")}
          className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            What You'll Learn
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
              expandedSection === "learn" ? "rotate-180" : ""
            }`}
          />
        </button>

        {expandedSection === "learn" && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {whatYouWillLearn.map((point: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {point.trim()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Prerequisites */}
      {prerequisites.length > 0 && (
        <section>
          <button
            onClick={() => toggleSection("prereq")}
            className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Prerequisites
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                expandedSection === "prereq" ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSection === "prereq" && (
            <div className="mt-3 space-y-2">
              {prerequisites.map((prereq, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 rounded-lg">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-sm mt-0.5">
                    ℹ️
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {prereq}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Instructions */}
      {instructions.length > 0 && (
        <section>
          <button
            onClick={() => toggleSection("instructions")}
            className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Course Instructions
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                expandedSection === "instructions" ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedSection === "instructions" && (
            <div className="mt-3 space-y-2">
              {instructions.map((instruction: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg"
                >
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0 mt-0.5">
                    {idx + 1}.
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {instruction.trim()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default CourseOverview;
