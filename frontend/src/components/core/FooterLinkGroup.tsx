import React from "react";

// Define the props interface for FooterLinkGroup component
interface FooterLinkGroupProps {
  title: string; // Title of the link group
  links: string[]; // Array of links to display
}

// Functional component that renders a group of links with a title
const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links }) => {
  return (
    <div className="w-full">
      {/* Title of the link group */}
      <p className="block mb-4 text-sm antialiased font-extrabold leading-normal uppercase opacity-50 text-blue-gray-900 dark:text-gray-300">
        {title}
      </p>
      {/* List of links */}
      <ul className="space-y-1">
        {links.map((link, index) => (
          <li
            key={index}
            className="block text-base antialiased font-normal leading-relaxed text-blue-gray-900 dark:text-gray-300"
          >
            {/* Each link */}
            <a
              href="#"
              className="inline-block py-1 pr-2 transition-transform hover:scale-105"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinkGroup;
