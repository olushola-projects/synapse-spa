import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
// Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Partners from './pages/Partners';
import Dashboard from './pages/Dashboard';
import AskDara from './pages/AskDara';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UseCases from './pages/UseCases';
import SFDRNavigator from './pages/SFDRNavigator';
import AgentsPage from './pages/AgentsPage';
import CDDAgentPage from './pages/CDDAgentPage';
// Legal pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import SecurityPolicy from './pages/legal/SecurityPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
// Resources pages
import Blog from './pages/resources/Blog';
import BlogArticleDetails from './components/blog/BlogArticleDetails';
import Documentation from './pages/resources/Documentation';
import FAQ from './pages/resources/FAQ';
// Company pages
import About from './pages/company/About';
import Contact from './pages/company/Contact';
// Platform pages
import Features from './pages/platform/Features';
import Solutions from './pages/platform/Solutions';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1
    }
  }
});
const App = () =>
  _jsx(ErrorBoundary, {
    children: _jsx(QueryClientProvider, {
      client: queryClient,
      children: _jsx(AuthProvider, {
        children: _jsxs(TooltipProvider, {
          children: [
            _jsx(Toaster, {}),
            _jsx(BrowserRouter, {
              children: _jsxs(Routes, {
                children: [
                  _jsx(Route, { path: '/', element: _jsx(Index, {}) }),
                  _jsx(Route, { path: '/partners', element: _jsx(Partners, {}) }),
                  _jsx(Route, {
                    path: '/dashboard',
                    element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) })
                  }),
                  _jsx(Route, {
                    path: '/ask-dara',
                    element: _jsx(ProtectedRoute, { children: _jsx(AskDara, {}) })
                  }),
                  _jsx(Route, {
                    path: '/login',
                    element: _jsx(ProtectedRoute, { requireAuth: false, children: _jsx(Login, {}) })
                  }),
                  _jsx(Route, {
                    path: '/register',
                    element: _jsx(ProtectedRoute, {
                      requireAuth: false,
                      children: _jsx(Register, {})
                    })
                  }),
                  _jsx(Route, {
                    path: '/forgot-password',
                    element: _jsx(ProtectedRoute, {
                      requireAuth: false,
                      children: _jsx(ForgotPassword, {})
                    })
                  }),
                  _jsx(Route, {
                    path: '/reset-password',
                    element: _jsx(ProtectedRoute, {
                      requireAuth: false,
                      children: _jsx(ResetPassword, {})
                    })
                  }),
                  _jsx(Route, {
                    path: '/profile',
                    element: _jsx(ProtectedRoute, { children: _jsx(Profile, {}) })
                  }),
                  _jsx(Route, { path: '/use-cases', element: _jsx(UseCases, {}) }),
                  _jsx(Route, { path: '/agents', element: _jsx(AgentsPage, {}) }),
                  _jsx(Route, { path: '/agents/cdd-agent', element: _jsx(CDDAgentPage, {}) }),
                  _jsx(Route, { path: '/sfdr-navigator', element: _jsx(SFDRNavigator, {}) }),
                  _jsx(Route, { path: '/nexus-agent', element: _jsx(SFDRNavigator, {}) }),
                  _jsx(Route, { path: '/sfdr-gem', element: _jsx(SFDRNavigator, {}) }),
                  _jsx(Route, { path: '/legal/privacy', element: _jsx(PrivacyPolicy, {}) }),
                  _jsx(Route, { path: '/legal/terms', element: _jsx(TermsOfService, {}) }),
                  _jsx(Route, { path: '/legal/security', element: _jsx(SecurityPolicy, {}) }),
                  _jsx(Route, { path: '/legal/cookies', element: _jsx(CookiePolicy, {}) }),
                  _jsx(Route, { path: '/resources/blog', element: _jsx(Blog, {}) }),
                  _jsx(Route, {
                    path: '/resources/blog/:id',
                    element: _jsx(BlogArticleDetails, {})
                  }),
                  _jsx(Route, {
                    path: '/resources/documentation',
                    element: _jsx(Documentation, {})
                  }),
                  _jsx(Route, { path: '/resources/faq', element: _jsx(FAQ, {}) }),
                  _jsx(Route, { path: '/company/about', element: _jsx(About, {}) }),
                  _jsx(Route, { path: '/company/contact', element: _jsx(Contact, {}) }),
                  _jsx(Route, { path: '/platform/features', element: _jsx(Features, {}) }),
                  _jsx(Route, { path: '/platform/solutions', element: _jsx(Solutions, {}) }),
                  _jsx(Route, { path: '*', element: _jsx(NotFound, {}) })
                ]
              })
            })
          ]
        })
      })
    })
  });
export default App;
