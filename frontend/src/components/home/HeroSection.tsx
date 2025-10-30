import React from 'react';
import { Button } from '../ui';
import { ArrowRight, Zap, Users, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 dark:from-gray-900 via-blue-50 dark:via-gray-800 to-indigo-50 dark:to-gray-900 overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 dark:opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Zap size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Most Popular EdTech Platform
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">anything</span>, anytime, anywhere
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Unlock your potential with expert-led courses. Join millions of learners mastering new skills and advancing their careers.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/catalog')}
              className="group"
            >
              Explore Courses
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Learners</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5M+</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">10K+</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Instructors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">50K+</p>
            </div>
          </div>
        </div>

        {/* Right Content - Illustration */}
        <div className="flex-1 relative w-full">
          <div className="relative w-full h-72 sm:h-96 bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-900 dark:to-indigo-900 rounded-3xl overflow-hidden shadow-2xl">
            {/* Placeholder for illustration */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="space-y-4 text-center px-6">
                <div className="flex justify-center gap-2">
                  <div className="w-20 h-20 bg-white/20 rounded-lg animate-pulse"></div>
                  <div className="w-20 h-20 bg-white/30 rounded-lg animate-pulse animation-delay-200"></div>
                </div>
                <div className="flex justify-center gap-2">
                  <div className="w-20 h-20 bg-white/30 rounded-lg animate-pulse animation-delay-400"></div>
                  <div className="w-20 h-20 bg-white/20 rounded-lg animate-pulse animation-delay-600"></div>
                </div>
                <p className="text-white/90 mt-4 text-sm sm:text-base font-medium">Course learning interface</p>
              </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0"></div>
          </div>

          {/* Floating Cards */}
          <div className="hidden sm:block absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 max-w-xs animate-bounce animation-delay-200 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Award size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Certificates</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Get recognized</p>
              </div>
            </div>
          </div>

          <div className="hidden sm:block absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 max-w-xs animate-bounce z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Progress Tracking</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Stay motivated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
