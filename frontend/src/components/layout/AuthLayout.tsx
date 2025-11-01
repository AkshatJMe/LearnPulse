import React from 'react';
import Navbar from './Navbar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
