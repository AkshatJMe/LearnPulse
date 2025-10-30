import React from 'react';
import { Card, Avatar, Rating } from '../ui';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  content: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  isLoading?: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  isLoading = false,
}) => {
  // Default testimonials
  const defaultTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Anderson',
      role: 'Product Manager at Tech Co',
      avatar: 'SA',
      content: 'LearnPulse transformed my career. The courses are incredibly well-structured and the instructors are truly experts in their field.',
      rating: 5,
    },
    {
      id: '2',
      name: 'James Chen',
      role: 'Full Stack Developer',
      avatar: 'JC',
      content: 'I completed 5 courses on LearnPulse and got promoted within 3 months. Highly recommend!',
      rating: 5,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Data Scientist at StartUp',
      avatar: 'ER',
      content: 'The hands-on projects and real-world applications in these courses helped me land my dream job.',
      rating: 5,
    },
    {
      id: '4',
      name: 'Michael Park',
      role: 'UX Designer',
      avatar: 'MP',
      content: 'Great learning experience with supportive community and excellent instructors. Worth every penny!',
      rating: 4,
    },
  ];

  const displayTestimonials = testimonials || defaultTestimonials;

  return (
    <div className="w-full py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Star size={16} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Student Success Stories
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Loved by Thousands of Learners
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See what our students have to say about their learning journey
          </p>
        </div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayTestimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col relative"
              >
                {/* Quote Icon */}
                <Quote
                  size={32}
                  className="text-blue-200 dark:text-blue-900/30 mb-2 absolute top-4 right-4"
                />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 flex-1 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Avatar
                    src={testimonial.avatar}
                    initials={testimonial.avatar?.substring(0, 1) || ''}
                    size="sm"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
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

export default TestimonialsSection;
