import React from "react";
import { Button } from "@nextui-org/react";
import FAQPage from "../components/common/FAQ";
import Footer from "../components/common/Footer";
import SignupSection from "../components/core/SignupSection";
import FeaturesSection from "../components/core/FeaturesSection";

const Home = () => {
  return (
    <React.Fragment>
      {/* Hero section with background image */}
      <div
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(/search.jpg) center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className="py-44 px-1 md:px-8 text-center relative text-white font-bold text-2xl md:text-3xl overflow-auto"
      >
        <h1 className="pb-4">Search for Courses</h1>
        <div className="w-11/12 md:w-3/4 lg:max-w-3xl m-auto">
          <div className="relative text-base text-black">
            <input
              type="text"
              placeholder="Courses"
              className="mt-2 shadow-md focus:outline-none rounded-2xl py-3 px-6 w-full"
            />
            <div className="text-left absolute top-10 rounded-t-none rounded-b-2xl shadow bg-white divide-y w-full max-h-40 overflow-auto">
              {/* Your autocomplete or suggestion results can go here */}
            </div>
          </div>
        </div>
      </div>

      {/* Main content section with title, description, and buttons */}
      <div className="px-7 lg:px-10 max-w-6xl mx-auto flex flex-col gap-y-10 lg:flex-row items-center gap-x-10 justify-center py-10 lg:py-14 dark:bg-gray-800">
        <div className="lg:w-[650px] lg:px-5 flex flex-col gap-y-5">
          <h1 className="text-4xl md:text-5xl xl:text-[50px] leading-[1.2] md:max-w-xl md:mx-auto md:text-center lg:text-left lg:mx-0 lg:max-w-full font-semibold dark:text-white">
            Empower Your Future with Coding Skills
          </h1>
          <p className="text-sm md:max-w-xl md:mx-auto lg:mx-0 lg:max-w-full md:text-center lg:text-left dark:text-gray-300">
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors.
          </p>
          <div className="flex gap-x-5 flex-col gap-y-2.5 lg:flex-row">
            <Button color="primary">Learn More</Button>
            <Button color="primary" variant="faded">
              Book a Demo
            </Button>
          </div>
        </div>
        <div className="hero-image md:px-5 lg:px-0 w-full lg:w-1/2 rounded-3xl md:pt-2 lg:pt-0 relative isolate z-10">
          <img
            className="rounded-3xl w-full"
            src="/join.jpg"
            alt="hero-image"
          />
        </div>
      </div>

      {/* Signup section */}
      <div className="bg-gray-200 mx-7 mt-4 rounded-3xl mb-4 relative">
        <SignupSection />
      </div>

      <FeaturesSection />

      {/* FAQ section */}
      <div className="bg-gray-200 mx-7 mt-4 rounded-3xl mb-4 relative">
        <FAQPage />
      </div>

      {/* Footer */}
      <Footer />

      {/* Placeholder for future content */}
      {/* <div className="bg-slate-800 p-8"></div> */}
    </React.Fragment>
  );
};

export default Home;
