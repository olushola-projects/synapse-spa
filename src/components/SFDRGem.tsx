import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bot,
  Send,
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  Target,
  BarChart3,
  FileCheck,
  Globe,
  Sparkles
} from 'lucide-react';

// Types and Interfaces
interface SFDRClassificationRequest {
  fundName: string;
  description: string;
  investmentStrategy: string;
  esgIntegration: string;
  sustainabilityObjectives: string;
  principalAdverseImpacts: string;
  taxonomyAlignment: string;
}

interface SFDRClassificationResponse {
  classification: 'Article 6' | 'Article 8' | 'Article 9';
  confidence: number;
  reasoning: string;
  recommendations: string[];
  issues: string[];
  complianceScore: number;
  // Enhanced fields from new backend
  sustainability_score?: number;
  key_indicators?: string[];
  risk_factors?: string[];
  regulatory_basis?: string[];
  benchmark_comparison?: {
    industry_baseline: number;
    current_confidence: number;
    performance_vs_baseline: number;
    percentile_rank: number;
  };
  audit_trail?: {
    classification_id: string;
    timestamp: string;
    engine_version: string;
    processing_time: number;
  };
  explainability_score?: number;
  processing_time?: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    classification?: string;
    confidence?: number;
    sources?: string[];
  };
}

interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  status: 'processing' | 'completed' | 'error';
  sfdrRelevance: number;
  summary: string;
  extractedEntities: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  complianceIssues: string[];
}

interface ContextualMemory {
  userPreferences: Record<string, any>;
  recentClassifications: SFDRClassificationResponse[];
  documentHistory: DocumentAnalysis[];
  conversationContext: string[];
}

const SFDRGem: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState<'chat' | 'classify' | 'documents' | 'export'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Welcome to SFDR Gem! I'm your AI-powered SFDR compliance assistant. I can help you classify funds, analyze documents, and ensure regulatory compliance. How can I assist you today?",
      timestamp: new Date(),
      metadata: {
        sources: ['SFDR Regulation (EU) 2019/2088', 'ESMA Guidelines']
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classificationResult, setClassificationResult] =
    useState<SFDRClassificationResponse | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentAnalysis[]>([]);
  const [contextualMemory, setContextualMemory] = useState<ContextualMemory>({
    userPreferences: {},
    recentClassifications: [],
    documentHistory: [],
    conversationContext: []
  });

  // Form state for classification
  const [classificationForm, setClassificationForm] = useState<SFDRClassificationRequest>({
    fundName: '',
    description: '',
    investmentStrategy: '',
    esgIntegration: '',
    sustainabilityObjectives: '',
    principalAdverseImpacts: '',
    taxonomyAlignment: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response with SFDR knowledge
    setTimeout(() => {
      const responses = [
        {
          content:
            'Based on SFDR Article 8 requirements, your fund would need to promote environmental or social characteristics. I can help you assess the specific disclosure requirements.',
          metadata: {
            classification: 'Article 8',
            confidence: 85,
            sources: ['SFDR Article 8', 'RTS on SFDR disclosures']
          }
        },
        {
          content:
            'For Article 9 classification, your fund must have sustainable investment as its objective. Let me analyze your investment strategy against the technical criteria.',
          metadata: {
            classification: 'Article 9',
            confidence: 92,
            sources: ['SFDR Article 9', 'Taxonomy Regulation']
          }
        },
        {
          content:
            "I've identified potential PAI (Principal Adverse Impact) considerations for your fund. Would you like me to generate a detailed compliance checklist?",
          metadata: {
            sources: ['PAI Technical Standards', 'ESMA Q&A']
          }
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      if (randomResponse) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: randomResponse.content,
          timestamp: new Date(),
          metadata: randomResponse.metadata
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
      setIsLoading(false);

      // Update contextual memory
      setContextualMemory(prev => ({
        ...prev,
        conversationContext: [...prev.conversationContext.slice(-4), userMessage.content]
      }));
    }, 1500);
  }, [inputValue, isLoading]);

  const handleDocumentUpload = useCallback(async (files: FileList) => {
    const newDocuments: DocumentAnalysis[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const document: DocumentAnalysis = {
          id: Date.now().toString() + i,
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date(),
          status: 'processing',
          sfdrRelevance: 0,
          summary: '',
          extractedEntities: [],
          sentiment: 'neutral',
          topics: [],
          complianceIssues: []
        };

        newDocuments.push(document);
      }
    }

    setUploadedDocuments(prev => [...prev, ...newDocuments]);

    // Simulate document processing
    setTimeout(() => {
      setUploadedDocuments(prev =>
        prev.map(doc => {
          if (newDocuments.find(newDoc => newDoc.id === doc.id)) {
            return {
              ...doc,
              status: 'completed',
              sfdrRelevance: Math.floor(Math.random() * 40) + 60, // 60-100%
              summary:
                'Document contains relevant SFDR disclosure information including ESG integration methodology and PAI considerations.',
              extractedEntities: [
                'ESG Integration',
                'Sustainable Investment',
                'PAI Indicators',
                'Taxonomy Alignment'
              ],
              sentiment: 'positive',
              topics: ['Environmental Factors', 'Social Characteristics', 'Governance Practices'],
              complianceIssues: Math.random() > 0.7 ? ['Missing PAI disclosure details'] : []
            };
          }
          return doc;
        })
      );
    }, 3000);
  }, []);

  const handleClassification = useCallback(async () => {
    if (!classificationForm.fundName || !classificationForm.description) {
      alert('Please fill in at least the fund name and description.');
      return;
    }

    setIsLoading(true);

    // Simulate API call for classification
    setTimeout(() => {
      const classifications: SFDRClassificationResponse[] = [
        {
          classification: 'Article 8',
          confidence: 87,
          reasoning:
            'Fund promotes environmental characteristics through ESG integration but does not have sustainable investment as primary objective.',
          recommendations: [
            'Enhance disclosure on environmental characteristics promoted',
            'Provide clear methodology for ESG integration',
            'Consider adding specific sustainability indicators'
          ],
          issues: ['PAI disclosure could be more detailed'],
          complianceScore: 85
        },
        {
          classification: 'Article 9',
          confidence: 93,
          reasoning:
            'Fund has sustainable investment as its objective with clear taxonomy alignment and measurable sustainability outcomes.',
          recommendations: [
            'Maintain robust sustainability measurement framework',
            'Regular review of taxonomy alignment',
            'Enhanced reporting on sustainability outcomes'
          ],
          issues: [],
          complianceScore: 94
        },
        {
          classification: 'Article 6',
          confidence: 78,
          reasoning:
            'Fund does not promote environmental or social characteristics as primary focus, standard financial disclosures apply.',
          recommendations: [
            'Consider if any ESG factors are integrated',
            'Review investment process for sustainability considerations',
            'Evaluate potential for Article 8 classification'
          ],
          issues: ['Limited sustainability integration documented'],
          complianceScore: 72
        }
      ];

      const result = classifications[Math.floor(Math.random() * classifications.length)];
      if (result) {
        setClassificationResult(result);
        setIsLoading(false);

        // Update contextual memory
        setContextualMemory(prev => ({
          ...prev,
          recentClassifications: [...prev.recentClassifications.slice(-2), result]
        }));
      }
    }, 2000);
  }, [classificationForm]);

  const handleExport = useCallback(
    (format: 'pdf' | 'excel' | 'json') => {
      const exportData = {
        classification: classificationResult,
        documents: uploadedDocuments,
        chatHistory: messages,
        timestamp: new Date().toISOString(),
        summary: {
          totalDocuments: uploadedDocuments.length,
          averageRelevance:
            uploadedDocuments.reduce((acc, doc) => acc + doc.sfdrRelevance, 0) /
              uploadedDocuments.length || 0,
          complianceIssues: uploadedDocuments.reduce(
            (acc, doc) => acc + doc.complianceIssues.length,
            0
          )
        }
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sfdr-analysis-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Placeholder for PDF/Excel export
        alert(
          `${format.toUpperCase()} export functionality will be implemented with backend integration.`
        );
      }
    },
    [classificationResult, uploadedDocuments, messages]
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-8'
        >
          <div className='flex items-center justify-center gap-3 mb-4'>
            <div className='relative'>
              <Sparkles className='w-10 h-10 text-purple-600' />
              <motion.div
                className='absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full'
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              SFDR Gem
            </h1>
            <Badge variant='secondary' className='bg-green-100 text-green-800'>
              MVP
            </Badge>
          </div>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            AI-powered SFDR compliance navigator with document intelligence and real-time
            classification
          </p>
        </motion.div>

        {/* Main Interface */}
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as any)}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-4 mb-6'>
            <TabsTrigger 
              value='chat' 
              className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              <Bot className='w-4 h-4' />
              AI Chat
            </TabsTrigger>
            <TabsTrigger 
              value='classify' 
              className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              <Target className='w-4 h-4' />
              Classify
            </TabsTrigger>
            <TabsTrigger 
              value='documents' 
              className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              <FileText className='w-4 h-4' />
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value='export' 
              className='flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              <Download className='w-4 h-4' />
              Export
            </TabsTrigger>
          </TabsList>

          {/* AI Chat Tab */}
          <TabsContent value='chat'>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
              <div className='lg:col-span-3'>
                <Card className='h-[600px] flex flex-col'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Brain className='w-5 h-5 text-blue-600' />
                      SFDR AI Navigator
                    </CardTitle>
                    <CardDescription>
                      Ask questions about SFDR compliance, fund classification, and regulatory
                      requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex-1 flex flex-col'>
                    <ScrollArea className='flex-1 pr-4 mb-4'>
                      <div className='space-y-4'>
                        {messages.map(message => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className='text-sm'>{message.content}</p>
                              {message.metadata && (
                                <div className='mt-2 pt-2 border-t border-gray-200 text-xs'>
                                  {message.metadata.classification && (
                                    <Badge variant='outline' className='mr-2'>
                                      {message.metadata.classification}
                                    </Badge>
                                  )}
                                  {message.metadata.confidence && (
                                    <span className='text-gray-500'>
                                      Confidence: {message.metadata.confidence}%
                                    </span>
                                  )}
                                  {message.metadata.sources && (
                                    <div className='mt-1'>
                                      <span className='text-gray-500'>Sources: </span>
                                      {message.metadata.sources.join(', ')}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='flex justify-start'
                          >
                            <div className='bg-gray-100 p-3 rounded-lg'>
                              <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce' />
                                <div
                                  className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                                  style={{ animationDelay: '0.1s' }}
                                />
                                <div
                                  className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                                  style={{ animationDelay: '0.2s' }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                    <div className='flex gap-2'>
                      <Input
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder='Ask about SFDR compliance, fund classification, or regulatory requirements...'
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputValue.trim()}
                      >
                        <Send className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contextual Memory Sidebar */}
              <div className='space-y-4'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <Zap className='w-5 h-5 text-yellow-600' />
                      Contextual Memory
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div>
                        <h4 className='font-medium text-sm mb-2'>Recent Context</h4>
                        <div className='space-y-1'>
                          {contextualMemory.conversationContext.slice(-3).map((context, index) => (
                            <p key={index} className='text-xs text-gray-600 truncate'>
                              {context}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className='font-medium text-sm mb-2'>Classifications</h4>
                        <p className='text-xs text-gray-600'>
                          {contextualMemory.recentClassifications.length} recent
                        </p>
                      </div>
                      <div>
                        <h4 className='font-medium text-sm mb-2'>Documents</h4>
                        <p className='text-xs text-gray-600'>{uploadedDocuments.length} analyzed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <BarChart3 className='w-5 h-5 text-green-600' />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm'>Messages</span>
                        <Badge variant='outline'>{messages.length}</Badge>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm'>Documents</span>
                        <Badge variant='outline'>{uploadedDocuments.length}</Badge>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm'>Classifications</span>
                        <Badge variant='outline'>
                          {contextualMemory.recentClassifications.length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Classification Tab */}
          <TabsContent value='classify'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Target className='w-5 h-5 text-purple-600' />
                    Fund Classification
                  </CardTitle>
                  <CardDescription>
                    Provide fund details for SFDR article classification
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>Fund Name *</label>
                    <Input
                      value={classificationForm.fundName}
                      onChange={e =>
                        setClassificationForm(prev => ({ ...prev, fundName: e.target.value }))
                      }
                      placeholder='Enter fund name'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>Description *</label>
                    <Textarea
                      value={classificationForm.description}
                      onChange={e =>
                        setClassificationForm(prev => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Describe the fund's investment approach and objectives"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>Investment Strategy</label>
                    <Textarea
                      value={classificationForm.investmentStrategy}
                      onChange={e =>
                        setClassificationForm(prev => ({
                          ...prev,
                          investmentStrategy: e.target.value
                        }))
                      }
                      placeholder='Detail the investment strategy and methodology'
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>ESG Integration</label>
                    <Textarea
                      value={classificationForm.esgIntegration}
                      onChange={e =>
                        setClassificationForm(prev => ({ ...prev, esgIntegration: e.target.value }))
                      }
                      placeholder='Describe how ESG factors are integrated'
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Sustainability Objectives
                    </label>
                    <Textarea
                      value={classificationForm.sustainabilityObjectives}
                      onChange={e =>
                        setClassificationForm(prev => ({
                          ...prev,
                          sustainabilityObjectives: e.target.value
                        }))
                      }
                      placeholder='List specific sustainability objectives'
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Principal Adverse Impacts
                    </label>
                    <Textarea
                      value={classificationForm.principalAdverseImpacts}
                      onChange={e =>
                        setClassificationForm(prev => ({
                          ...prev,
                          principalAdverseImpacts: e.target.value
                        }))
                      }
                      placeholder='Describe consideration of principal adverse impacts'
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>Taxonomy Alignment</label>
                    <Textarea
                      value={classificationForm.taxonomyAlignment}
                      onChange={e =>
                        setClassificationForm(prev => ({
                          ...prev,
                          taxonomyAlignment: e.target.value
                        }))
                      }
                      placeholder='Detail EU Taxonomy alignment approach'
                      rows={2}
                    />
                  </div>
                  <Button
                    onClick={handleClassification}
                    disabled={
                      isLoading || !classificationForm.fundName || !classificationForm.description
                    }
                    className='w-full'
                  >
                    {isLoading ? 'Classifying...' : 'Classify Fund'}
                  </Button>
                </CardContent>
              </Card>

              {/* Classification Results */}
              <div className='space-y-6'>
                {classificationResult && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <CheckCircle className='w-5 h-5 text-green-600' />
                          Classification Result
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-6'>
                        {/* Core Classification */}
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <span className='font-medium text-sm text-gray-600'>SFDR Classification</span>
                          <Badge
                            variant={
                              classificationResult.classification === 'Article 9'
                                ? 'default'
                                : 'secondary'
                            }
                              className={`text-sm ${
                              classificationResult.classification === 'Article 9'
                                  ? 'bg-green-600 text-white'
                                : classificationResult.classification === 'Article 8'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-white'
                              }`}
                          >
                            {classificationResult.classification}
                          </Badge>
                        </div>
                          
                          <div className='space-y-2'>
                            <span className='font-medium text-sm text-gray-600'>Confidence Score</span>
                            <div className='flex items-center gap-2'>
                              <Progress value={classificationResult.confidence} className='flex-1 h-2' />
                              <span className='text-sm font-medium'>{classificationResult.confidence}%</span>
                        </div>
                          </div>
                        </div>

                        {/* Enhanced Scores */}
                        {(classificationResult.sustainability_score || classificationResult.explainability_score) && (
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg'>
                            {classificationResult.sustainability_score && (
                              <div className='space-y-2'>
                                <span className='font-medium text-sm text-blue-700'>Sustainability Score</span>
                                <div className='flex items-center gap-2'>
                                  <Progress value={classificationResult.sustainability_score * 100} className='flex-1 h-2' />
                                  <span className='text-sm font-medium text-blue-700'>
                                    {(classificationResult.sustainability_score * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {classificationResult.explainability_score && (
                              <div className='space-y-2'>
                                <span className='font-medium text-sm text-green-700'>Explainability Score</span>
                                <div className='flex items-center gap-2'>
                                  <Progress value={classificationResult.explainability_score * 100} className='flex-1 h-2' />
                                  <span className='text-sm font-medium text-green-700'>
                                    {(classificationResult.explainability_score * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Regulatory Citations - Critical for compliance */}
                        {classificationResult.regulatory_basis && classificationResult.regulatory_basis.length > 0 && (
                          <div className='p-4 bg-amber-50 border border-amber-200 rounded-lg'>
                            <div className='flex items-center gap-2 mb-3'>
                              <FileCheck className='w-4 h-4 text-amber-600' />
                              <span className='font-medium text-amber-800'>Regulatory Basis</span>
                              <Badge variant='outline' className='text-xs text-amber-700 border-amber-300'>
                                SFDR Compliance
                              </Badge>
                            </div>
                            <ul className='space-y-2'>
                              {classificationResult.regulatory_basis.map((citation, index) => (
                                <li key={index} className='text-sm text-amber-800 flex items-start gap-2'>
                                  <CheckCircle className='w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0' />
                                  {citation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Benchmark Comparison */}
                        {classificationResult.benchmark_comparison && (
                          <div className='p-4 bg-purple-50 border border-purple-200 rounded-lg'>
                            <div className='flex items-center gap-2 mb-3'>
                              <BarChart3 className='w-4 h-4 text-purple-600' />
                              <span className='font-medium text-purple-800'>Industry Benchmark</span>
                            </div>
                            <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                                <span className='text-gray-600'>Industry Baseline:</span>
                                <div className='font-medium text-purple-700'>
                                  {(classificationResult.benchmark_comparison.industry_baseline * 100).toFixed(1)}%
                                </div>
                              </div>
                              <div>
                                <span className='text-gray-600'>Performance vs Baseline:</span>
                                <div className={`font-medium ${
                                  classificationResult.benchmark_comparison.performance_vs_baseline > 0 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                                }`}>
                                  {classificationResult.benchmark_comparison.performance_vs_baseline > 0 ? '+' : ''}
                                  {(classificationResult.benchmark_comparison.performance_vs_baseline * 100).toFixed(1)}%
                                </div>
                              </div>
                              <div>
                                <span className='text-gray-600'>Percentile Rank:</span>
                                <div className='font-medium text-purple-700'>
                                  {classificationResult.benchmark_comparison.percentile_rank}th percentile
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Key Indicators */}
                        {classificationResult.key_indicators && classificationResult.key_indicators.length > 0 && (
                          <div>
                            <span className='font-medium block mb-2'>Key ESG Indicators</span>
                            <div className='flex flex-wrap gap-2'>
                              {classificationResult.key_indicators.map((indicator, index) => (
                                <Badge key={index} variant='secondary' className='text-xs'>
                                  {indicator}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Risk Assessment */}
                        {classificationResult.risk_factors && classificationResult.risk_factors.length > 0 && (
                          <div>
                            <span className='font-medium block mb-2'>Risk Assessment</span>
                            <ul className='space-y-1'>
                              {classificationResult.risk_factors.map((risk, index) => (
                                <li key={index} className='text-sm text-gray-700 flex items-start gap-2'>
                                  <AlertTriangle className='w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0' />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Reasoning */}
                        <div>
                          <span className='font-medium block mb-2'>Classification Reasoning</span>
                          <p className='text-sm text-gray-700 bg-gray-50 p-3 rounded-lg'>{classificationResult.reasoning}</p>
                        </div>

                        {/* Legacy Compliance Score */}
                        <div>
                          <span className='font-medium block mb-2'>Compliance Score</span>
                          <Progress value={classificationResult.complianceScore} className='h-2' />
                          <span className='text-sm text-gray-600 mt-1 block'>
                            {classificationResult.complianceScore}%
                          </span>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <span className='font-medium block mb-2'>Recommendations</span>
                          <ul className='space-y-1'>
                            {classificationResult.recommendations.map((rec, index) => (
                              <li
                                key={index}
                                className='text-sm text-gray-700 flex items-start gap-2'
                              >
                                <CheckCircle className='w-3 h-3 text-green-600 mt-0.5 flex-shrink-0' />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Issues */}
                        {classificationResult.issues.length > 0 && (
                          <div>
                            <span className='font-medium block mb-2'>Issues to Address</span>
                            <ul className='space-y-1'>
                              {classificationResult.issues.map((issue, index) => (
                                <li
                                  key={index}
                                  className='text-sm text-red-700 flex items-start gap-2'
                                >
                                  <AlertTriangle className='w-3 h-3 text-red-600 mt-0.5 flex-shrink-0' />
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Audit Trail */}
                        {classificationResult.audit_trail && (
                          <div className='pt-4 border-t border-gray-200'>
                            <span className='font-medium block mb-2 text-xs text-gray-500'>Audit Information</span>
                            <div className='grid grid-cols-2 gap-2 text-xs text-gray-500'>
                              <div>ID: {classificationResult.audit_trail.classification_id?.slice(-8)}</div>
                              <div>Engine: v{classificationResult.audit_trail.engine_version}</div>
                              {classificationResult.processing_time && (
                                <div>Processing: {classificationResult.processing_time.toFixed(3)}s</div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {!classificationResult && (
                  <Card>
                    <CardContent className='pt-6'>
                      <div className='text-center text-gray-500'>
                        <Target className='w-12 h-12 mx-auto mb-4 text-gray-300' />
                        <p>
                          Fill out the form and click "Classify Fund" to get your SFDR
                          classification
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value='documents'>
            <div className='space-y-6'>
              {/* Upload Area */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Upload className='w-5 h-5 text-blue-600' />
                    Document Upload & Analysis
                  </CardTitle>
                  <CardDescription>
                    Upload documents for SFDR compliance analysis and entity extraction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer'
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={e => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        handleDocumentUpload(files);
                      }
                    }}
                    onDragOver={e => e.preventDefault()}
                  >
                    <Upload className='w-12 h-12 mx-auto mb-4 text-gray-400' />
                    <p className='text-lg font-medium mb-2'>Drop files here or click to upload</p>
                    <p className='text-sm text-gray-600'>Supports PDF, DOC, DOCX, TXT files</p>
                    <input
                      ref={fileInputRef}
                      type='file'
                      multiple
                      accept='.pdf,.doc,.docx,.txt'
                      className='hidden'
                      onChange={e => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleDocumentUpload(e.target.files);
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Document List */}
              {uploadedDocuments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <FileText className='w-5 h-5 text-green-600' />
                      Analyzed Documents ({uploadedDocuments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {uploadedDocuments.map(doc => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='border rounded-lg p-4'
                        >
                          <div className='flex items-start justify-between mb-3'>
                            <div>
                              <h4 className='font-medium'>{doc.fileName}</h4>
                              <p className='text-sm text-gray-600'>
                                {(doc.fileSize / 1024).toFixed(1)} KB •{' '}
                                {doc.uploadDate.toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                doc.status === 'completed'
                                  ? 'default'
                                  : doc.status === 'processing'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {doc.status}
                            </Badge>
                          </div>

                          {doc.status === 'completed' && (
                            <div className='space-y-3'>
                              <div>
                                <span className='text-sm font-medium'>SFDR Relevance:</span>
                                <div className='flex items-center gap-2 mt-1'>
                                  <Progress value={doc.sfdrRelevance} className='flex-1 h-2' />
                                  <span className='text-sm'>{doc.sfdrRelevance}%</span>
                                </div>
                              </div>
                              <div>
                                <span className='text-sm font-medium block mb-1'>Summary:</span>
                                <p className='text-sm text-gray-700'>{doc.summary}</p>
                              </div>
                              <div>
                                <span className='text-sm font-medium block mb-1'>
                                  Extracted Entities:
                                </span>
                                <div className='flex flex-wrap gap-1'>
                                  {doc.extractedEntities.map((entity, index) => (
                                    <Badge key={index} variant='outline' className='text-xs'>
                                      {entity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className='grid grid-cols-2 gap-4'>
                                <div>
                                  <span className='text-sm font-medium block mb-1'>Sentiment:</span>
                                  <Badge
                                    variant={
                                      doc.sentiment === 'positive'
                                        ? 'default'
                                        : doc.sentiment === 'negative'
                                          ? 'destructive'
                                          : 'secondary'
                                    }
                                    className='text-xs'
                                  >
                                    {doc.sentiment}
                                  </Badge>
                                </div>
                                <div>
                                  <span className='text-sm font-medium block mb-1'>Topics:</span>
                                  <div className='flex flex-wrap gap-1'>
                                    {doc.topics.slice(0, 2).map((topic, index) => (
                                      <Badge key={index} variant='outline' className='text-xs'>
                                        {topic}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {doc.complianceIssues.length > 0 && (
                                <Alert>
                                  <AlertTriangle className='h-4 w-4' />
                                  <AlertDescription>
                                    <strong>Compliance Issues:</strong>{' '}
                                    {doc.complianceIssues.join(', ')}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          )}

                          {doc.status === 'processing' && (
                            <div className='flex items-center gap-2'>
                              <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                              <span className='text-sm text-gray-600'>Analyzing document...</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {uploadedDocuments.length === 0 && (
                <Card>
                  <CardContent className='pt-6'>
                    <div className='text-center text-gray-500'>
                      <FileText className='w-12 h-12 mx-auto mb-4 text-gray-300' />
                      <p>No documents uploaded yet</p>
                      <p className='text-sm'>Upload documents to start analysis</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value='export'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <Card
                className='cursor-pointer hover:shadow-lg transition-shadow'
                onClick={() => handleExport('pdf')}
              >
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <FileText className='w-5 h-5 text-red-600' />
                    PDF Report
                  </CardTitle>
                  <CardDescription>
                    Comprehensive SFDR compliance report with analysis and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant='outline' className='w-full'>
                    <Download className='w-4 h-4 mr-2' />
                    Export PDF
                  </Button>
                </CardContent>
              </Card>

              <Card
                className='cursor-pointer hover:shadow-lg transition-shadow'
                onClick={() => handleExport('excel')}
              >
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='w-5 h-5 text-green-600' />
                    Excel Workbook
                  </CardTitle>
                  <CardDescription>
                    Detailed data analysis with charts, metrics, and compliance tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant='outline' className='w-full'>
                    <Download className='w-4 h-4 mr-2' />
                    Export Excel
                  </Button>
                </CardContent>
              </Card>

              <Card
                className='cursor-pointer hover:shadow-lg transition-shadow'
                onClick={() => handleExport('json')}
              >
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Globe className='w-5 h-5 text-blue-600' />
                    JSON Data
                  </CardTitle>
                  <CardDescription>
                    Raw data export for integration with other systems and APIs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant='outline' className='w-full'>
                    <Download className='w-4 h-4 mr-2' />
                    Export JSON
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className='mt-6'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FileCheck className='w-5 h-5 text-purple-600' />
                  Export Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertDescription>
                    <strong>Ready for Export:</strong>
                    <ul className='mt-2 space-y-1'>
                      <li>• {classificationResult ? '1' : '0'} fund classification</li>
                      <li>• {uploadedDocuments.length} analyzed documents</li>
                      <li>• {messages.length} chat messages</li>
                      <li>
                        • {contextualMemory.recentClassifications.length} historical classifications
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SFDRGem;
