import React, { useState } from 'react';

interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onTabChange?: (value: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value);

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  const activeTabData = tabs.find((tab) => tab.value === activeTab) || tabs[0];

  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={`
              px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap
              border-b-2 -mb-[2px]
              ${
                activeTab === tab.value
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }
            `}
          >
            {tab.icon && <span className="inline-block mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-4">{activeTabData?.content}</div>
    </div>
  );
};

export default Tabs;
