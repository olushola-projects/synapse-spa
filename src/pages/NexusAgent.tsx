import { useState, useCallback, useRef, useEffect, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import posthog from 'posthog-js';
import { logger } from '@/utils/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

import { TabContentSkeleton, EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { cn } from '@/lib/utils';
import { Activity, Shield, TrendingUp, Users, BarChart3, FileText, Clock, CheckCircle, AlertTriangle, Brain, Target, Search, Loader2, Wifi, WifiOff } from 'lucide-react';
import { NexusAgentChat } from '@/components/NexusAgentChat';
import { NexusTestExecutor } from '@/components/testing/NexusTestExecutor';
import type { QuickActionType } from '@/types/nexus';

/**
 * SFDR Navigator - Regulatory Agent for ESG Compliance
 *
 * This component serves as the main interface for the SFDR (Sustainable Finance Disclosure Regulation)
 * Navigator, providing AI-powered regulatory guidance and compliance tools for GRC professionals.
 */
// Use the shared Supabase client
import { supabase } from '@/integrations/supabase/client';
const NexusAgent = () => {
  // Enhanced state management with loading states
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoadingTab, setIsLoadingTab] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [initError, setInitError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [complianceData, setComplianceData] = useState<{
    status: 'pre-validated' | 'needs-review';
    esmaReference: string;
  }>({
    status: 'pre-validated',
    esmaReference: '2024/1357'
  });
  
   // Enhanced initialization with progressive loading and error handling
   useEffect(() => {
     let authListener: any = null;
     let mounted = true;
     
     const initializeApp = async () => {
       setInitError(null);
       setSystemStatus('checking');
       setLoadingProgress(0);
       
       try {
         // Stage 1: System health check
         if (mounted) setLoadingProgress(20);
         await new Promise(resolve => setTimeout(resolve, 300));
         
         // Stage 2: Authentication setup
         if (mounted) {
           setLoadingProgress(40);
           const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
             logger.info('Auth state changed:', session?.user?.id);
           });
           authListener = data;
         }

         // Stage 3: Analytics initialization (non-blocking)
         if (mounted) {
           setLoadingProgress(60);
           setTimeout(() => {
             try {
               const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
               const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
               if (posthogKey && posthogHost) {
                 posthog.init(posthogKey, {
                   api_host: posthogHost
                 });
               } else {
                 logger.warn('PostHog key or host not provided. Analytics will be disabled.');
               }
             } catch (error) {
               logger.error('Failed to initialize PostHog:', error);
             }
           }, 100);
         }

         // Stage 4: API connectivity check
         if (mounted) {
           setLoadingProgress(80);
           try {
             // Simulated API health check - replace with actual endpoint
             await new Promise(resolve => setTimeout(resolve, 500));
             setSystemStatus('online');
           } catch (apiError) {
             logger.warn('API check failed, using offline mode');
             setSystemStatus('offline');
           }
         }

         // Stage 5: Finalization
         if (mounted) {
           setLoadingProgress(100);
           await new Promise(resolve => setTimeout(resolve, 200));
         }
         
       } catch (error) {
         logger.error('Failed to initialize app:', error);
         if (mounted) {
           setInitError(error instanceof Error ? error.message : 'Initialization failed');
           setSystemStatus('offline');
         }
       } finally {
         if (mounted) {
           setIsInitializing(false);
         }
       }
     };

     initializeApp();
     
     return () => {
       mounted = false;
       authListener?.subscription?.unsubscribe();
     };
   }, [retryCount]);
  
  const [activeTab, setActiveTab] = useState<'chat' | 'overview' | 'testing'>('chat');
  const chatRef = useRef<any>(null);

  // Global industry metrics
  const industryMetrics = [{
    label: 'Compliance Score',
    value: '94%',
    icon: <Shield className='w-5 h-5 text-green-600' />
  }, {
    label: 'Risk Reduction',
    value: '67%',
    icon: <TrendingUp className='w-5 h-5 text-blue-600' />
  }, {
    label: 'Processing Speed',
    value: '3.2s',
    icon: <Activity className='w-5 h-5 text-orange-600' />
  }, {
    label: 'Active Users',
    value: '500+',
    icon: <Users className='w-5 h-5 text-purple-600' />
  }];

  // Enhanced quick actions with Nexus capabilities
  const quickActions = useMemo(() => [{
    type: 'upload-document' as QuickActionType,
    label: 'Upload Document',
    description: 'Upload and analyze compliance documents',
    icon: <FileText className='w-4 h-4' />,
    message: 'I need help uploading and analyzing a compliance document for SFDR validation.'
  }, {
    type: 'check-compliance' as QuickActionType,
    label: 'Check Compliance',
    description: 'Validate SFDR classification',
    icon: <Shield className='w-4 h-4' />,
    message: 'Please check the compliance status of my fund classification against SFDR requirements.'
  }, {
    type: 'article-classification' as QuickActionType,
    label: 'Article Classification',
    description: 'Determine Article 6/8/9 classification',
    icon: <Target className='w-4 h-4' />,
    message: 'Help me determine the correct SFDR article classification for my fund (Article 6, 8, or 9).'
  }, {
    type: 'pai-analysis' as QuickActionType,
    label: 'PAI Analysis',
    description: 'Principal Adverse Impact validation',
    icon: <Brain className='w-4 h-4' />,
    message: 'I need help with Principal Adverse Impact (PAI) indicators analysis and validation.'
  }, {
    type: 'taxonomy-check' as QuickActionType,
    label: 'Taxonomy Check',
    description: 'EU Taxonomy alignment verification',
    icon: <Search className='w-4 h-4' />,
    message: 'Please help me verify EU Taxonomy alignment for my sustainable investment fund.'
  }, {
    type: 'generate-report' as QuickActionType,
    label: 'Generate Report',
    description: 'Create compliance reports',
    icon: <BarChart3 className='w-4 h-4' />,
    message: 'I need to generate a comprehensive SFDR compliance report.'
  }, {
    type: 'risk-assessment' as QuickActionType,
    label: 'Risk Assessment',
    description: 'Identify compliance risks',
    icon: <AlertTriangle className='w-4 h-4' />,
    message: 'Can you help me with a regulatory risk assessment for SFDR compliance?'
  }], []);
  const handleQuickAction = useCallback((actionType: QuickActionType) => {
    // Switch to chat mode if not already active
    if (activeTab !== 'chat') {
      setIsLoadingTab(true);
      setActiveTab('chat');
    }

    // Find the action details
    const action = quickActions.find(a => a.type === actionType);

    // Add a small delay to ensure tab switch completes
    setTimeout(() => {
      if (chatRef.current && typeof chatRef.current.sendMessage === 'function') {
        chatRef.current.sendMessage(action?.message || 'How can you help me today?');
      }

      // Update compliance data based on action
      setComplianceData(prev => ({
        ...prev,
        status: actionType === 'check-compliance' ? 'pre-validated' : 'needs-review'
      }));
      
      setIsLoadingTab(false);
    }, 150);
  }, [quickActions, activeTab]);

  const handleTabChange = useCallback((value: string) => {
    if (isLoadingTab) return; // Prevent rapid tab switching
    
    setIsLoadingTab(true);
    setActiveTab(value as 'chat' | 'overview' | 'testing');
    
    // Progressive tab loading with appropriate delays based on tab complexity
    const delays = {
      chat: 400,      // Chat requires chat history and context loading
      overview: 300,  // Overview requires analytics data
      testing: 350    // Testing requires test suite initialization
    };
    
    const delay = delays[value as keyof typeof delays] || 300;
    
    setTimeout(() => {
      setIsLoadingTab(false);
    }, delay);
  }, [isLoadingTab]);
  // Enhanced loading screen with progressive indicators and error handling
  if (isInitializing) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          {initError ? (
            // Error state with retry option
            <div className='text-center space-y-6 p-8 bg-background border border-destructive/20 rounded-xl shadow-lg'>
              <div className='space-y-3'>
                <WifiOff className='w-12 h-12 mx-auto text-destructive' />
                <h3 className='text-lg font-semibold text-foreground'>
                  Initialization Failed
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {initError}
                </p>
              </div>
              <div className='space-y-3'>
                <Button 
                  onClick={() => {
                    setRetryCount(prev => prev + 1);
                    setIsInitializing(true);
                  }}
                  className='w-full'
                >
                  Retry Initialization
                </Button>
                <Button 
                  variant='outline' 
                  onClick={() => setIsInitializing(false)}
                  className='w-full'
                >
                  Continue Anyway
                </Button>
              </div>
            </div>
          ) : (
            // Normal loading state with progress
            <div className='text-center space-y-6 p-8 bg-background/80 backdrop-blur-sm border border-border/40 rounded-xl shadow-lg'>
              <div className='space-y-3'>
                <div className='relative'>
                  <div className='w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center'>
                    <Brain className='w-8 h-8 text-primary animate-pulse' />
                  </div>
                  <div className={cn(
                    'absolute top-0 right-0 w-4 h-4 rounded-full transition-colors',
                    systemStatus === 'online' && 'bg-emerald-500',
                    systemStatus === 'offline' && 'bg-amber-500',
                    systemStatus === 'checking' && 'bg-muted animate-pulse'
                  )} />
                </div>
                <h3 className='text-lg font-semibold text-foreground'>
                  SFDR Navigator
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Initializing AI-powered compliance engine...
                </p>
              </div>
              
              <div className='space-y-3'>
                <div className='flex justify-between text-xs text-muted-foreground'>
                  <span>Loading progress</span>
                  <span>{loadingProgress}%</span>
                </div>
                <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
                  <div 
                    className='h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out'
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>

              <div className='flex items-center justify-center space-x-4 text-xs text-muted-foreground'>
                <div className='flex items-center space-x-1'>
                  {systemStatus === 'online' ? <Wifi className='w-3 h-3' /> : <WifiOff className='w-3 h-3' />}
                  <span className='capitalize'>{systemStatus}</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <Shield className='w-3 h-3' />
                  <span>Secure</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Enhanced Header with Navigation */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Navigation Bar */}
          <div className='flex justify-between items-center py-3 border-b border-gray-100'>
            <div className='flex items-center space-x-6'>
              <Link to="/" className='text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300'>
                Synapse
              </Link>
              <nav className='hidden md:flex items-center space-x-6'>
                <Link to="/agents" className='text-sm text-gray-600 hover:text-primary transition-colors'>Agents</Link>
                <Link to="/use-cases" className='text-sm text-gray-600 hover:text-primary transition-colors'>Use Cases</Link>
                <Link to="/partners" className='text-sm text-gray-600 hover:text-primary transition-colors'>Partners</Link>
              </nav>
            </div>
            <div className='flex items-center space-x-3'>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/">Home</Link>
              </Button>
            </div>
          </div>
          
          {/* Agent Header */}
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-3'>
              <img src="/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png" alt="Sophia - SFDR Navigator Agent" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <h1 className="text-2xl text-gray-900 font-medium">SFDR Navigator - Sophia</h1>
                <p className="text-sm text-gray-500">Elegant female guide to sustainable finance disclosures</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Badge variant='outline' className='text-green-600 border-green-200'>
                <CheckCircle className='w-3 h-3 mr-1' />
                {complianceData.status === 'pre-validated' ? 'Pre-Validated' : 'Needs Review'}
              </Badge>
              <span className='text-sm text-gray-500'>ESMA {complianceData.esmaReference}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className='grid w-full grid-cols-3 mb-6'>
            <TabsTrigger value='chat' className='flex items-center space-x-2' disabled={isLoadingTab}>
              {isLoadingTab && activeTab === 'chat' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <img src="/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png" alt="Sophia" className="w-4 h-4 rounded-full object-cover" />
              )}
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value='overview' className='flex items-center space-x-2' disabled={isLoadingTab}>
              {isLoadingTab && activeTab === 'overview' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <BarChart3 className='w-4 h-4' />
              )}
              <span>Compliance Overview</span>
            </TabsTrigger>
            <TabsTrigger value='testing' className='flex items-center space-x-2' disabled={isLoadingTab}>
              {isLoadingTab && activeTab === 'testing' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Target className='w-4 h-4' />
              )}
              <span>UAT Testing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='chat'>
            {isLoadingTab ? (
              <TabContentSkeleton type="chat" />
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                {/* Chat Interface */}
                <div className='lg:col-span-3 nexus-agent-container' data-testid="nexus-chat">
                  <Suspense fallback={<EnhancedSkeleton className="h-96 w-full" />}>
                    <NexusAgentChat className='shadow-lg' ref={chatRef} />
                  </Suspense>
                </div>

                {/* Quick Actions Sidebar */}
                <div className='space-y-4'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg flex items-center'>
                        <FileText className='w-5 h-5 mr-2' />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      {quickActions.slice(0, 6).map((action) => (
                        <Button 
                          key={action.type}
                          variant='outline' 
                          className='w-full justify-start hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 hover:scale-[1.02]' 
                          onClick={() => handleQuickAction(action.type)} 
                          data-testid={`quick-action-${action.type}`}
                          disabled={isLoadingTab}
                        >
                          {action.icon}
                          <span className='ml-2'>{action.label}</span>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Industry Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg'>Industry Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {industryMetrics.map((metric, index) => (
                        <div key={index} className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            {metric.icon}
                            <span className='text-sm font-medium'>{metric.label}</span>
                          </div>
                          <span className='text-sm font-bold'>{metric.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value='overview'>
            {isLoadingTab ? (
              <TabContentSkeleton type="overview" />
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {/* Compliance Status */}
                <Card className='hover:shadow-lg transition-shadow duration-200'>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <Shield className='w-5 h-5 mr-2 text-green-600' />
                      Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm'>Overall Score</span>
                        <span className='font-bold text-green-600'>94%</span>
                      </div>
                      <Progress value={94} className='h-2' />
                      <div className='text-xs text-gray-500'>
                        Last updated: {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className='hover:shadow-lg transition-shadow duration-200'>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <Clock className='w-5 h-5 mr-2 text-blue-600' />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div className='flex items-center space-x-2'>
                        <CheckCircle className='w-4 h-4 text-green-600' />
                        <span className='text-sm'>Document processed</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <AlertTriangle className='w-4 h-4 text-yellow-600' />
                        <span className='text-sm'>Review pending</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <CheckCircle className='w-4 h-4 text-green-600' />
                        <span className='text-sm'>Report generated</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card className='hover:shadow-lg transition-shadow duration-200'>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <Activity className='w-5 h-5 mr-2 text-orange-600' />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm'>API Response</span>
                        <span className='font-bold text-green-600'>3.2s</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm'>Uptime</span>
                        <span className='font-bold text-green-600'>99.9%</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm'>Active Users</span>
                        <span className='font-bold text-purple-600'>500+</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value='testing'>
            {isLoadingTab ? (
              <TabContentSkeleton type="testing" />
            ) : (
              <div className='space-y-6'>
                <div className='bg-background border border-border rounded-lg shadow-sm p-6'>
                  <h3 className='text-lg font-semibold text-foreground mb-4'>
                    User Acceptance Testing Suite
                  </h3>
                  <p className='text-muted-foreground mb-6'>
                    Execute comprehensive testing scenarios to validate SFDR Navigator functionality
                    across different regulatory use cases and compliance requirements.
                  </p>
                  
                  <Suspense fallback={<EnhancedSkeleton className="h-32 w-full" />}>
                    <NexusTestExecutor />
                  </Suspense>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default NexusAgent;