import React from "react";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const FeaturesSections: React.FC<{ features: Feature[] }> = ({ features }) => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Why Choose <span className="text-blue-600">LearnPulse</span>?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-xl fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h4 className="text-xl font-semibold mb-2 text-gray-800">
              {feature.title}
            </h4>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      title: "Expert-Led Courses",
      description:
        "Learn from industry experts with years of practical experience",
      icon: "🎓",
    },
    {
      title: "Interactive Learning",
      description: "Engage with hands-on projects and real-world applications",
      icon: "💡",
    },
    {
      title: "Flexible Schedule",
      description: "Learn at your own pace, anytime and anywhere",
      icon: "⏰",
    },
    {
      title: "Community Support",
      description: "Connect with fellow learners and get help when needed",
      icon: "🤝",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <FeaturesSections features={features} />
    </div>
  );
};

export default FeaturesSection;
