import BannerImage1 from "/about/aboutus1.webp";
import BannerImage2 from "/about/aboutus2.webp";
import BannerImage3 from "/about/aboutus3.webp";
import Footer from "../components/common/Footer";
import AboutForm from "../components/common/AboutForm";
import ValuesSection from "../components/core/ValuesSection";

export const About = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Banner */}
      <div className="relative mx-7 mt-8 mb-8">
        <section className="bg-white rounded-3xl shadow-md">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center text-center py-12 px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
              LearnPulse: Elevating Online Learning
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mb-14">
              LearnPulse is redefining how people learn in the digital age. We
              build engaging, practical, and impactful learning experiences that
              empower individuals to thrive in their careers and passions.
            </p>

            {/* Banner Images */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
              <img
                src={BannerImage1}
                alt="Team collaboration"
                className="rounded-xl shadow"
              />
              <img
                src={BannerImage2}
                alt="Online education"
                className="rounded-xl shadow"
              />
              <img
                src={BannerImage3}
                alt="Learning experience"
                className="rounded-xl shadow"
              />
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mt-12 bg-white rounded-3xl shadow-sm">
          <div className="mx-auto w-11/12 max-w-maxContent py-14 px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We believe that education should be more than just information —
              it should be transformation. Our mission is to bridge the gap
              between knowledge and real-world application, empowering learners
              to grow confidently with skills that matter.
            </p>
          </div>
        </section>
      </div>

      {/* Values Section */}
      <ValuesSection />

      {/* About Form */}
      <AboutForm />

      {/* Footer */}
      <Footer />
    </div>
  );
};
