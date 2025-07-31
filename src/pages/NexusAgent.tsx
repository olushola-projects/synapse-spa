import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import posthog from 'posthog-js';
import { logger } from '@/utils/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Activity, Shield, TrendingUp, Users, BarChart3, FileText, Clock, CheckCircle, AlertTriangle, Brain, Target, Search } from 'lucide-react';
import { NexusAgentChat } from '@/components/NexusAgentChat';
import { NexusTestExecutor } from '@/components/testing/NexusTestExecutor';
import type { QuickActionType } from '@/types/nexus';

/**
 * SFDR Navigator - Regulatory Agent for ESG Compliance
 *
 * This component serves as the main interface for the SFDR (Sustainable Finance Disclosure Regulation)
 * Navigator, providing AI-powered regulatory guidance and compliance tools for GRC professionals.
 */
// Initialize Supabase client
let supabase;
try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    logger.warn('Supabase URL or key not provided. Supabase functionality will be limited.');
    // Create a mock or disabled client
    supabase = {
      from: () => ({
        select: () => Promise.resolve({
          data: [],
          error: null
        }),
        insert: () => Promise.resolve({
          data: null,
          error: null
        }),
        update: () => Promise.resolve({
          data: null,
          error: null
        }),
        delete: () => Promise.resolve({
          data: null,
          error: null
        })
      }),
      auth: {
        onAuthStateChange: () => ({
          data: null,
          error: null
        }),
        signOut: () => Promise.resolve({
          error: null
        })
      }
    };
  }
} catch (error) {
  logger.error('Failed to initialize Supabase client:', error);
  // Provide fallback client
  supabase = {
    from: () => ({
      select: () => Promise.resolve({
        data: [],
        error: null
      }),
      insert: () => Promise.resolve({
        data: null,
        error: null
      }),
      update: () => Promise.resolve({
        data: null,
        error: null
      }),
      delete: () => Promise.resolve({
        data: null,
        error: null
      })
    }),
    auth: {
      onAuthStateChange: () => ({
        data: null,
        error: null
      }),
      signOut: () => Promise.resolve({
        error: null
      })
    }
  };
}
const NexusAgent = () => {
  // State declarations
  const [complianceData, setComplianceData] = useState<{
    status: 'pre-validated' | 'needs-review';
    esmaReference: string;
  }>({
    status: 'pre-validated',
    esmaReference: '2024/1357'
  });
  useEffect(() => {
    // Authentication check
    const {
      data: authListener
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      logger.info('Auth state changed:', session?.user?.id);
    });

    // Initialize analytics
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
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
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
    setActiveTab('chat');

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
    }, 100);
  }, [quickActions]);
  return <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-3'>
              <img src="/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png" alt="SFDR Navigator Agent" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <h1 className="text-2xl text-gray-900 font-medium">SFDR Navigator</h1>
                
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
        <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'chat' | 'overview' | 'testing')}>
          <TabsList className='grid w-full grid-cols-3 mb-6'>
            <TabsTrigger value='chat' className='flex items-center space-x-2'>
              <img src="/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png" alt="Sophia" className="w-4 h-4 rounded-full object-cover" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value='overview' className='flex items-center space-x-2'>
              <BarChart3 className='w-4 h-4' />
              <span>Compliance Overview</span>
            </TabsTrigger>
            <TabsTrigger value='testing' className='flex items-center space-x-2'>
              <Target className='w-4 h-4' />
              <span>UAT Testing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='chat'>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
              {/* Chat Interface */}
              <div className='lg:col-span-3 nexus-agent-container' data-testid="nexus-chat">
                <NexusAgentChat className='shadow-lg' ref={chatRef} />
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
                    <Button variant='outline' className='w-full justify-start' onClick={() => handleQuickAction('upload-document')} data-testid="quick-action-button">
                      Upload Document
                    </Button>
                    <Button variant='outline' className='w-full justify-start' onClick={() => handleQuickAction('check-compliance')} data-testid="quick-action-button">
                      Check Compliance
                    </Button>
                    <Button variant='outline' className='w-full justify-start' onClick={() => handleQuickAction('generate-report')} data-testid="quick-action-button">
                      Generate Report
                    </Button>
                    <Button variant='outline' className='w-full justify-start' onClick={() => handleQuickAction('risk-assessment')} data-testid="quick-action-button">
                      Risk Assessment
                    </Button>
                  </CardContent>
                </Card>

                {/* Industry Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Industry Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {industryMetrics.map((metric, index) => <div key={index} className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          {metric.icon}
                          <span className='text-sm font-medium'>{metric.label}</span>
                        </div>
                        <span className='text-sm font-bold'>{metric.value}</span>
                      </div>)}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='overview'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* Compliance Status */}
              <Card>
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
              <Card>
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
              <Card>
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
          </TabsContent>

          <TabsContent value='testing'>
            <NexusTestExecutor />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default NexusAgent;