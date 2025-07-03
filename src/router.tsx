
import { createBrowserRouter } from 'react-router-dom';

// Import all components used in routes
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Partners from './pages/Partners';
import Dashboard from './pages/Dashboard';
import AskDara from './pages/AskDara';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import SecurityPolicy from './pages/legal/SecurityPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import Blog from './pages/resources/Blog';
import BlogArticleDetails from './components/blog/BlogArticleDetails';
import Documentation from './pages/resources/Documentation';
import FAQ from './pages/resources/FAQ';
import About from './pages/company/About';
import Contact from './pages/company/Contact';
import Careers from './pages/company/Careers';
import Features from './pages/platform/Features';
import Solutions from './pages/platform/Solutions';
import NavbarMenuTest from './pages/NavbarMenuTest';

// Create and export the router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: '/partners',
    element: <Partners />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/ask-dara',
    element: <AskDara />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  // Legal routes
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/terms-of-service',
    element: <TermsOfService />,
  },
  {
    path: '/security-policy',
    element: <SecurityPolicy />,
  },
  {
    path: '/cookie-policy',
    element: <CookiePolicy />,
  },
  // Resources routes
  {
    path: '/blog',
    element: <Blog />,
  },
  {
    path: '/blog/:articleId',
    element: <BlogArticleDetails />,
  },
  {
    path: '/documentation',
    element: <Documentation />,
  },
  {
    path: '/faq',
    element: <FAQ />,
  },
  // Company routes
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/careers',
    element: <Careers />,
  },
  // Platform routes
  {
    path: '/features',
    element: <Features />,
  },
  {
    path: '/solutions',
    element: <Solutions />,
  },
  // Test routes
  {
    path: '/navbar-test',
    element: <NavbarMenuTest />,
  }
]);
