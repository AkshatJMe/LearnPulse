import React from 'react';
import { Card } from '../ui';
import { ChevronDown } from 'lucide-react';

interface Lesson {
  _id: string;
  title: string;
  duration?: number;
  completed?: boolean;
}

interface Section {
  _id: string;
  sectionName: string;
  subSection: Lesson[];
}

interface CurriculumProps {
  sections: Section[];
}

const Curriculum: React.FC<CurriculumProps> = ({ sections }) => {
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalLessons = sections.reduce((acc, section) => acc + section.subSection.length, 0);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {sections.length} sections • {totalLessons} lessons
      </div>

      <div className="space-y-2">
        {sections.map((section) => (
          <Card key={section._id} shadow="sm" className="p-0">
            <button
              onClick={() =>
                setExpandedSection(expandedSection === section._id ? null : section._id)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-white text-left">
                {section.sectionName}
              </h3>
              <ChevronDown
                size={20}
                className={`text-gray-600 dark:text-gray-400 transition-transform ${
                  expandedSection === section._id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSection === section._id && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                {section.subSection.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-gray-400 dark:text-gray-500">
                          {/*checkmark or play icon*/}
                          {lesson.completed ? (
                            <span className="text-green-500">✓</span>
                          ) : (
                            <span>▶</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {index + 1}. {lesson.title}
                        </span>
                      </div>
                      {lesson.duration && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDuration(lesson.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Curriculum;
