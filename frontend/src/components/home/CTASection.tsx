import React from 'react';
import { Button } from '../ui';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
          Ready to Start Learning?
        </h2>
        
        {/* Description */}
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Join millions of learners worldwide and transform your future with world-class education.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
          <div className="flex items-center justify-center gap-2 text-white">
            <CheckCircle size={20} />
            <span>Expert Instructors</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-white">
            <CheckCircle size={20} />
            <span>Lifetime Access</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-white">
            <CheckCircle size={20} />
            <span>Money Back Guarantee</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 hover:bg-gray-100 group"
          >
            Get Started Free
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/contact')}
            className="border-white text-white hover:bg-white/10"
          >
            Contact Us
          </Button>
        </div>

        {/* Sub Text */}
        <p className="text-sm text-blue-100">
          No credit card required. Start learning immediately.
        </p>
      </div>
    </div>
  );
};

export default CTASection;
