import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'instructor' | 'admin';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Dispatch logout action
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} onLogout={handleLogout} />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
