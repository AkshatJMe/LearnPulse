import React from "react";

const values = [
  {
    icon: "🎯",
    title: "Quality First",
    description:
      "We maintain the highest standards in course content and user experience.",
  },
  {
    icon: "🤝",
    title: "Community Driven",
    description:
      "We foster a supportive learning community where everyone can thrive.",
  },
  {
    icon: "🚀",
    title: "Innovation",
    description:
      "We continuously evolve our platform with cutting-edge learning technologies.",
  },
  {
    icon: "🌟",
    title: "Accessibility",
    description:
      "We believe quality education should be accessible to everyone, everywhere.",
  },
];

const ValuesSection: React.FC = () => {
  return (
    <section className="mb-16 px-6">
      <div className="bg-white rounded-3xl shadow-md p-8 md:p-12 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Our Values
          </h2>
          <p className="text-lg text-slate-500 mt-2">
            The principles that guide everything we do
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div key={index} className="flex items-start gap-5">
              <div className="text-4xl">{value.icon}</div>
              <div>
                <h4 className="text-xl font-semibold text-slate-700 mb-2">
                  {value.title}
                </h4>
                <p className="text-slate-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
