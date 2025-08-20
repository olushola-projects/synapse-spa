import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import HeaderBar from './HeaderBar';
import { DashboardContent } from './DashboardContent';
const DashboardLayout = ({ children }) => {
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
    return _jsx('div', {
      className: 'flex items-center justify-center h-screen',
      children: 'Loading...'
    });
  }
  return _jsxs('div', {
    className: 'flex h-screen bg-gray-50',
    children: [
      _jsx(Sidebar, { user: user }),
      _jsx(MobileNav, { user: user, onLogout: handleLogout }),
      _jsxs('div', {
        className: 'md:ml-64 flex flex-col flex-1',
        children: [
          _jsx(HeaderBar, { user: user, onLogout: handleLogout }),
          _jsx(DashboardContent, { children: children })
        ]
      })
    ]
  });
};
export default DashboardLayout;
