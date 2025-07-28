import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import HeaderBar from './HeaderBar';
import { DashboardContent } from './DashboardContent';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user exists, if not redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    // Return null or a loading state when there's no user
    return <div className='flex items-center justify-center h-screen'>Loading...</div>;
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar for desktop */}
      <Sidebar user={user} />

      {/* Mobile navigation */}
      <MobileNav user={user} onLogout={handleLogout} />

      {/* Main content area */}
      <div className='md:ml-64 flex flex-col flex-1'>
        {/* Desktop header */}
        <HeaderBar user={user} onLogout={handleLogout} />

        {/* Page content */}
        <DashboardContent>{children}</DashboardContent>
      </div>
    </div>
  );
};

export default DashboardLayout;
