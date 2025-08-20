import { jsx as _jsx } from "react/jsx-runtime";
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
import Webinars from './pages/resources/Webinars';
import About from './pages/company/About';
import Contact from './pages/company/Contact';
import Careers from './pages/company/Careers';
import Features from './pages/platform/Features';
import Solutions from './pages/platform/Solutions';
import NavbarMenuTest from './pages/NavbarMenuTest';
import Map from './pages/Map';
import UseCases from './pages/UseCases';
import SFDRNavigator from './pages/SFDRNavigator';
// Create and export the router
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(Index, {}),
        errorElement: _jsx(NotFound, {})
    },
    {
        path: '/partners',
        element: _jsx(Partners, {})
    },
    {
        path: '/dashboard',
        element: _jsx(Dashboard, {})
    },
    {
        path: '/ask-dara',
        element: _jsx(AskDara, {})
    },
    {
        path: '/login',
        element: _jsx(Login, {})
    },
    {
        path: '/register',
        element: _jsx(Register, {})
    },
    {
        path: '/profile',
        element: _jsx(Profile, {})
    },
    // Legal routes
    {
        path: '/privacy-policy',
        element: _jsx(PrivacyPolicy, {})
    },
    {
        path: '/terms-of-service',
        element: _jsx(TermsOfService, {})
    },
    {
        path: '/security-policy',
        element: _jsx(SecurityPolicy, {})
    },
    {
        path: '/cookie-policy',
        element: _jsx(CookiePolicy, {})
    },
    {
        path: '/legal/privacy',
        element: _jsx(PrivacyPolicy, {})
    },
    {
        path: '/legal/terms',
        element: _jsx(TermsOfService, {})
    },
    {
        path: '/legal/security',
        element: _jsx(SecurityPolicy, {})
    },
    {
        path: '/legal/cookies',
        element: _jsx(CookiePolicy, {})
    },
    // Resources routes
    {
        path: '/blog',
        element: _jsx(Blog, {})
    },
    {
        path: '/blog/:articleId',
        element: _jsx(BlogArticleDetails, {})
    },
    {
        path: '/documentation',
        element: _jsx(Documentation, {})
    },
    {
        path: '/faq',
        element: _jsx(FAQ, {})
    },
    {
        path: '/resources/blog',
        element: _jsx(Blog, {})
    },
    {
        path: '/resources/documentation',
        element: _jsx(Documentation, {})
    },
    {
        path: '/resources/faq',
        element: _jsx(FAQ, {})
    },
    {
        path: '/resources/webinars',
        element: _jsx(Webinars, {})
    },
    // Company routes
    {
        path: '/about',
        element: _jsx(About, {})
    },
    {
        path: '/contact',
        element: _jsx(Contact, {})
    },
    {
        path: '/careers',
        element: _jsx(Careers, {})
    },
    {
        path: '/company/about',
        element: _jsx(About, {})
    },
    {
        path: '/company/careers',
        element: _jsx(Careers, {})
    },
    {
        path: '/company/contact',
        element: _jsx(Contact, {})
    },
    // Platform routes
    {
        path: '/features',
        element: _jsx(Features, {})
    },
    {
        path: '/solutions',
        element: _jsx(Solutions, {})
    },
    {
        path: '/platform/features',
        element: _jsx(Features, {})
    },
    {
        path: '/platform/solutions',
        element: _jsx(Solutions, {})
    },
    // Platform routes
    {
        path: '/map',
        element: _jsx(Map, {})
    },
    {
        path: '/use-cases',
        element: _jsx(UseCases, {})
    },
    // Test routes
    {
        path: '/navbar-test',
        element: _jsx(NavbarMenuTest, {})
    },
    // Unified SFDR Navigator - Consolidates all regulatory compliance features
    {
        path: '/sfdr-navigator',
        element: _jsx(SFDRNavigator, {})
    },
    // Legacy route redirects to unified navigator
    {
        path: '/nexus-agent',
        element: _jsx(SFDRNavigator, {})
    },
    {
        path: '/sfdr-gem',
        element: _jsx(SFDRNavigator, {})
    }
]);
