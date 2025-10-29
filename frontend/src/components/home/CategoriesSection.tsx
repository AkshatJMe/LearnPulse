import React from 'react';
import { Card, Button } from '../ui';
import { Category } from '../../types';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CategoriesSectionProps {
  categories?: Category[];
  isLoading?: boolean;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories = [],
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // Default categories if none provided
  const displayCategories = categories.length > 0 ? categories : [
    { _id: '1', name: 'Web Development', description: 'Learn web technologies' },
    { _id: '2', name: 'Mobile Development', description: 'Build mobile apps' },
    { _id: '3', name: 'Data Science', description: 'Analyze and visualize data' },
    { _id: '4', name: 'UI/UX Design', description: 'Design beautiful interfaces' },
    { _id: '5', name: 'Cloud Computing', description: 'Master cloud platforms' },
    { _id: '6', name: 'DevOps', description: 'Deploy and manage systems' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/catalog/${categoryId}`);
  };

  return (
    <div className="w-full py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              Browse By Category
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Explore Top Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from dozens of courses in your favorite subjects
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-40 animate-pulse bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((category) => (
              <Card
                key={category._id}
                className="group overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                onClick={() => handleCategoryClick(category._id)}
              >
                {/* Category Header with Icon */}
                <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center relative overflow-hidden">
                  {/* Animated Background */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent transform group-hover:scale-110 transition-transform"></div>
                  </div>

                  {/* Icon */}
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300 z-10">
                    {getIconForCategory(category.name)}
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6 space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium pt-2 group-hover:gap-3 transition-all">
                    Explore
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get emoji icons for categories
function getIconForCategory(categoryName: string): string {
  const icons: { [key: string]: string } = {
    'Web Development': '🌐',
    'Mobile Development': '📱',
    'Data Science': '📊',
    'UI/UX Design': '🎨',
    'Cloud Computing': '☁️',
    'DevOps': '⚙️',
    'Python': '🐍',
    'JavaScript': '📜',
    'React': '⚛️',
    'Machine Learning': '🤖',
  };
  return icons[categoryName] || '📚';
}

export default CategoriesSection;
