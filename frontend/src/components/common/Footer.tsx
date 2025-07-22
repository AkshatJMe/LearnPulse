import React from "react";
import FooterLinkGroup from "../core/FooterLinkGroup";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gray-300 mx-7 mt-4 rounded-3xl mb-4">
      <div className="w-full px-8 mx-auto max-w-7xl">
        {/* Footer links section */}
        <div className="grid w-full grid-cols-1 gap-8 py-12 mx-auto md:grid-cols-2 lg:grid-cols-4">
          {/* Replace with your data or use props */}
          <FooterLinkGroup
            title="Company"
            links={["About Us", "Careers", "Our Team", "Projects"]}
          />
          <FooterLinkGroup
            title="Help Center"
            links={["Discord", "Twitter", "GitHub", "Contact Us"]}
          />
          <FooterLinkGroup
            title="Subjects"
            links={[
              "DevOps",
              "Cloud Computing",
              "Code Foundation",
              "Affiliate Program",
              "Machine Learning",
              "Data Science",
            ]}
          />
          <FooterLinkGroup
            title="Career building"
            links={[
              "Career paths",
              "Career services",
              "Interview prep",
              "Professional Certification",
              "-",
              "Full Catalog",
              "Beta Content",
            ]}
          />
        </div>

        {/* Bottom section with legal info and credits */}
        <div className="flex flex-col items-center justify-center w-full py-4 border-t border-gray-200 md:flex-row md:justify-between">
          <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm">
            <div className="flex">
              {/* Legal links */}
              <div className="border-r border-richblack-700 px-3 cursor-pointer hover:text-richblack-50 transition-all duration-200">
                Privacy Policy
              </div>
              <div className="border-r border-richblack-700 px-3 cursor-pointer hover:text-richblack-50 transition-all duration-200">
                Cookie Policy
              </div>
              <div className="border-r border-richblack-700 px-3 cursor-pointer hover:text-richblack-50 transition-all duration-200">
                Terms
              </div>
            </div>

            <div className="text-center flex flex-col sm:flex-row">
              {/* Credits */}
              <div className="flex">
                <span className="pr-2"> Made with ❤️</span>
                Akshat Jain
              </div>
              <span> © 2023 LearnPulse</span>
            </div>
          </div>
          <div className="flex gap-4 text-gray-900 sm:justify-center"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
