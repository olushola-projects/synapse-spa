import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { AuthProvider } from './contexts/AuthContext';
import UseCases from './pages/UseCases';
import NexusAgent from './pages/NexusAgent';
import AgentsPage from './pages/AgentsPage';
import CDDAgentPage from './pages/CDDAgentPage';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import SFDRGem from './pages/SFDRGem';

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

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/partners' element={<Partners />} />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/ask-dara'
              element={
                <ProtectedRoute>
                  <AskDara />
                </ProtectedRoute>
              }
            />
            <Route
              path='/login'
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute requireAuth={false}>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path='/use-cases' element={<UseCases />} />
            <Route path='/agents' element={<AgentsPage />} />
            <Route path='/agents/cdd-agent' element={<CDDAgentPage />} />
            <Route
              path='/nexus-agent'
              element={
                <ProtectedRoute>
                  <NexusAgent />
                </ProtectedRoute>
              }
            />
            <Route
              path='/sfdr-navigator'
              element={
                <ProtectedRoute>
                  <NexusAgent />
                </ProtectedRoute>
              }
            />
            <Route
              path='/sfdr-gem'
              element={
                <ProtectedRoute>
                  <SFDRGem />
                </ProtectedRoute>
              }
            />

            {/* Legal Routes */}
            <Route path='/legal/privacy' element={<PrivacyPolicy />} />
            <Route path='/legal/terms' element={<TermsOfService />} />
            <Route path='/legal/security' element={<SecurityPolicy />} />
            <Route path='/legal/cookies' element={<CookiePolicy />} />

            {/* Resources Routes */}
            <Route path='/resources/blog' element={<Blog />} />
            <Route path='/resources/blog/:id' element={<BlogArticleDetails />} />
            <Route path='/resources/documentation' element={<Documentation />} />
            <Route path='/resources/faq' element={<FAQ />} />

            {/* Company Routes */}
            <Route path='/company/about' element={<About />} />
            <Route path='/company/contact' element={<Contact />} />

            {/* Platform Routes */}
            <Route path='/platform/features' element={<Features />} />
            <Route path='/platform/solutions' element={<Solutions />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path='*' element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
