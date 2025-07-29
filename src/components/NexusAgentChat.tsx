import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedMessage } from '@/components/ui/enhanced-message';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { ProcessingStages } from '@/components/ui/processing-stages';
import { Bot, Loader2, AlertCircle, Shield, Settings, Zap } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { nexusAgent } from '@/services/nexusAgent';
import { TIME_CONSTANTS } from '@/utils/constants';
import {
  type SFDRClassificationRequest,
  type NexusValidationResponse,
  type NexusMessage
} from '@/types/nexus';

// Extended NexusMessage interface to include additional chat features
interface ChatMessage extends NexusMessage {
  intent?: string;
  confidence?: number;
  isStreaming?: boolean;
  messageType?: 'text' | 'compliance-report' | 'risk-analysis' | 'code' | 'table';
  attachments?: File[];
  reactions?: {
    likes: number;
    dislikes: number;
    userReaction?: 'like' | 'dislike';
  };
}

interface NexusAgentChatProps {
  apiEndpoint?: string;
  className?: string;
}

/**
 * NexusAgentChat component - Interactive chat interface for SFDR compliance validation
 * Integrates with the SFDR Navigator API for real-time regulatory compliance checking
 */
export const NexusAgentChat = forwardRef<any, NexusAgentChatProps>(
  (
    { apiEndpoint: _apiEndpoint = 'https://api.nexus-agent.com/v1/sfdr/validate', className = '' },
    ref
  ) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
      {
        id: '1',
        type: 'system',
        content:
          'Welcome to SFDR Navigator! I can help you validate SFDR compliance for your fund classifications. You can ask questions or submit fund data for validation.',
        timestamp: new Date()
      }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [processingType, setProcessingType] = useState<
      'thinking' | 'searching' | 'analyzing' | 'calculating' | 'generating'
    >('thinking');
    const [processingStages, setProcessingStages] = useState<
      Array<{
        name: string;
        status: 'pending' | 'active' | 'completed';
        description?: string;
      }>
    >([]);
    const [agentPersonality, _setAgentPersonality] = useState({
      name: 'SFDR Navigator',
      role: 'ESG Compliance Expert',
      expertise: ['SFDR Regulations', 'ESG Reporting', 'Risk Assessment']
    });
    const [showFormMode, setShowFormMode] = useState(false);
    const [formData, setFormData] = useState<Partial<SFDRClassificationRequest>>({
      metadata: {
        entityId: '',
        reportingPeriod: new Date().getFullYear().toString(),
        regulatoryVersion: 'SFDR_v1.0',
        submissionType: 'INITIAL'
      },
      fundProfile: {
        fundType: 'UCITS',
        fundName: '',
        targetArticleClassification: 'Article8'
      }
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      sendMessage: (message: string) => {
        handleSendMessage(message);
      }
    }));

    /**
     * Scroll to bottom of messages when new message is added
     */
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    // Listen for quick action events from parent
    useEffect(() => {
      const handleQuickAction = (event: CustomEvent) => {
        const { message } = event.detail;
        handleSendMessage(message);
      };

      window.addEventListener('nexus-quick-action', handleQuickAction as EventListener);
      return () => {
        window.removeEventListener('nexus-quick-action', handleQuickAction as EventListener);
      };
    }, []);

    /**
     * Add a new message to the chat
     */
    const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      const newMessage: ChatMessage = {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      return newMessage.id;
    };

    /**
     * Update an existing message (useful for loading states)
     */
    const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
      setMessages(prev => prev.map(msg => (msg.id === id ? { ...msg, ...updates } : msg)));
    };

    /**
     * Call the Nexus Agent for SFDR validation
     */
    const callNexusAPI = async (
      request: SFDRClassificationRequest
    ): Promise<NexusValidationResponse> => {
      return await nexusAgent.validateClassification(request);
    };

    /**
     * Handle message reactions
     */
    const handleMessageReaction = (messageId: string, reaction: 'like' | 'dislike') => {
      setMessages(prev =>
        prev.map(msg => {
          if (msg.id === messageId) {
            const currentReaction = msg.reactions?.userReaction;
            const newReactions = {
              likes: msg.reactions?.likes || 0,
              dislikes: msg.reactions?.dislikes || 0,
              userReaction: msg.reactions?.userReaction
            };

            // Remove previous reaction if exists
            if (currentReaction === 'like') {
              newReactions.likes = Math.max(0, newReactions.likes - 1);
            }
            if (currentReaction === 'dislike') {
              newReactions.dislikes = Math.max(0, newReactions.dislikes - 1);
            }

            // Add new reaction if different from current
            if (currentReaction !== reaction) {
              if (reaction === 'like') {
                newReactions.likes = newReactions.likes + 1;
              }
              if (reaction === 'dislike') {
                newReactions.dislikes = newReactions.dislikes + 1;
              }
              newReactions.userReaction = reaction;
            } else {
              delete newReactions.userReaction;
            }

            return { ...msg, reactions: newReactions };
          }
          return msg;
        })
      );
    };

    /**
     * Handle copying message content
     */
    const handleCopyMessage = (content: string) => {
      // Additional logging or analytics can be added here
      console.log('Message copied:', `${content.substring(0, 50)}...`);
    };

    /**
     * Handle exporting message
     */
    const handleExportMessage = (messageId: string) => {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        const exportData = {
          content: message.content,
          timestamp: message.timestamp,
          metadata: message.metadata
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sfdr-message-${messageId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    };

    /**
     * Handle voice input
     */
    const handleVoiceInput = (transcript: string) => {
      console.log('Voice input received:', transcript);
      // Additional voice input processing can be added here
    };

    /**
     * Simulate processing stages for complex queries
     */
    const simulateProcessingStages = async () => {
      const stages = [
        {
          name: 'Understanding request',
          status: 'active' as const,
          description: 'Analyzing your query...'
        },
        { name: 'Searching regulations', status: 'pending' as const },
        { name: 'Analyzing compliance', status: 'pending' as const },
        { name: 'Generating response', status: 'pending' as const }
      ];
      setProcessingStages(stages);

      // Simulate stage progression
      for (let i = 0; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, TIME_CONSTANTS.PROCESSING_STAGE_DELAY_MS));
        setProcessingStages(prev =>
          prev.map((stage, index) => ({
            ...stage,
            status: index < i ? 'completed' : index === i ? 'active' : 'pending'
          }))
        );

        // Update processing type based on stage
        if (i === 1) {
          setProcessingType('searching');
        } else if (i === 2) {
          setProcessingType('analyzing');
        } else if (i === 3) {
          setProcessingType('generating');
        }
      }
    };

    /**
     * Route user message to appropriate handler based on content
     */
    const routeMessageToHandler = async (userMessage: string): Promise<string> => {
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('upload') || lowerMessage.includes('document')) {
        return await handleDocumentUpload(userMessage);
      } else if (lowerMessage.includes('check compliance') || lowerMessage.includes('validate')) {
        return await handleComplianceCheck(userMessage);
      } else if (lowerMessage.includes('generate report') || lowerMessage.includes('report')) {
        return await handleReportGeneration(userMessage);
      } else if (lowerMessage.includes('risk assessment') || lowerMessage.includes('risk')) {
        return await handleRiskAssessment(userMessage);
      } else if (
        lowerMessage.includes('pai') ||
        lowerMessage.includes('principal adverse impact')
      ) {
        return await providePAIGuidance(userMessage);
      } else if (lowerMessage.includes('article 8')) {
        return await provideArticle8Guidance(userMessage);
      } else if (lowerMessage.includes('article 9')) {
        return await provideArticle9Guidance(userMessage);
      } else if (lowerMessage.includes('taxonomy') || lowerMessage.includes('eu taxonomy')) {
        return await provideTaxonomyGuidance(userMessage);
      } else {
        return await provideGeneralGuidance(userMessage);
      }
    };

    /**
     * Handle sending a text message with real SFDR validation
     */
    const handleSendMessage = async (messageText?: string) => {
      const userMessage = messageText || inputMessage;
      if (!userMessage.trim() || isLoading) {
        return;
      }

      setInputMessage('');

      // Add user message
      addMessage({
        type: 'user',
        content: userMessage
      });

      // Add loading message
      const loadingId = addMessage({
        type: 'agent',
        content: 'Processing your request...',
        isLoading: true
      });

      setIsLoading(true);
      setIsTyping(true);

      const isComplexQuery = userMessage.length > 100;

      try {
        if (isComplexQuery) {
          await simulateProcessingStages();
        } else {
          setProcessingType('thinking');
          await new Promise(resolve =>
            setTimeout(resolve, TIME_CONSTANTS.SIMPLE_PROCESSING_DELAY_MS)
          );
        }

        const response = await routeMessageToHandler(userMessage);

        updateMessage(loadingId, {
          content: response,
          isLoading: false
        });
      } catch (error) {
        console.error('Error processing message:', error);
        updateMessage(loadingId, {
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          isLoading: false
        });
      } finally {
        setIsLoading(false);
        setIsTyping(false);
        setProcessingStages([]);
      }
    };

    /**
     * Handle document upload guidance
     */
    const handleDocumentUpload = async (_message: string): Promise<string> => {
      return `Absolutely, uploading your SFDR-related documents is a great starting point. In my Big 4 advisory role, I've seen how proper documentation streamlines compliance. Let's get your pre-contractual disclosures or periodic reports uploaded – what specific document are you thinking of, and how can I assist in reviewing it against SFDR requirements?`;
    };

    /**
     * Handle compliance check with real SFDR logic
     */
    const handleComplianceCheck = async (_message: string): Promise<string> => {
      return `Certainly! Performing a compliance check is crucial, much like our regulatory health checks at the Big 4. We'll verify your fund against SFDR criteria, including disclosures and PAI. Could you provide more details on your fund type or specific areas of concern?`;
    };

    /**
     * Handle report generation
     */
    const handleReportGeneration = async (_message: string): Promise<string> => {
      return `Generating reports is a key part of advisory services. Based on compliance forums and publications, effective SFDR reports include PAI statements and Taxonomy alignments. What type of report do you need – periodic, pre-contractual, or something custom? Let's tailor it to your needs.`;
    };

    /**
     * Handle risk assessment
     */
    const handleRiskAssessment = async (_message: string): Promise<string> => {
      return `Risk assessment is fundamental in GRC. Drawing from supervisor guidelines and LinkedIn discussions, we'll evaluate sustainability risks in your portfolio. Are there particular risks like climate or social factors you're worried about? Let's dive in.`;
    };

    /**
     * Provide PAI guidance with current regulations
     */
    const providePAIGuidance = async (_message: string): Promise<string> => {
      return `Ah, PAI indicators – a crucial part of SFDR compliance. From my work on numerous client engagements, much like Big 4 advisory projects, there are 18 mandatory indicators covering GHG emissions, biodiversity impacts, and social factors like gender pay gaps. For robust compliance, aim for at least 50% data coverage and document your sources carefully. Article 8 funds must consider these in their processes, while Article 9 requires deeper due diligence. What's your specific challenge with PAI – data collection or integration into reporting?`;
    };

    /**
     * Provide Article 8 specific guidance
     */
    const provideArticle8Guidance = async (_message: string): Promise<string> => {
      return `Good day! Drawing from my background in Big 4 regulatory advisory, where I've assisted numerous funds with SFDR implementations, Article 8 products promote environmental or social characteristics without making them the core objective. It's essential to have measurable characteristics, proper PAI consideration, and consistent disclosures. Common pitfalls include vague definitions or insufficient evidence of promotion. How can I help refine your Article 8 approach – perhaps reviewing your fund's characteristics or disclosure strategy?`;
    };

    /**
     * Provide Article 9 specific guidance
     */
    const provideArticle9Guidance = async (_message: string): Promise<string> => {
      return `Hello there. In my experience leading Article 9 validations for major clients, much like Big 4 engagements, these products must have sustainable investment as their primary objective, backed by impact measurements and DNSH analysis. It's a higher bar than Article 8, requiring robust due diligence. Let's discuss your fund's objectives – are you facing challenges with impact metrics or Taxonomy alignment?`;
    };

    /**
     * Provide EU Taxonomy guidance
     */
    const provideTaxonomyGuidance = async (_message: string): Promise<string> => {
      return `Greetings! As someone who's contributed to supervisory publications on EU Taxonomy, I can tell you it's about aligning activities with six environmental objectives while ensuring DNSH and minimum safeguards compliance. From forum discussions I've engaged in, many struggle with data for substantial contribution. Shall we walk through your activity assessment or tackle a specific objective?`;
    };

    /**
     * Provide general SFDR guidance
     */
    const provideGeneralGuidance = async (_message: string): Promise<string> => {
      return `Hello! As a senior regulatory consultant with extensive experience in sustainable finance, similar to those at the Big 4 firms, I'm here to guide you through the SFDR framework. The Sustainable Finance Disclosure Regulation aims to boost transparency on sustainability risks and prevent greenwashing, aligning with the EU Green Deal. Products fall into Article 6 (no sustainability focus), Article 8 (promoting E/S characteristics), or Article 9 (with sustainable objectives). We've seen ongoing updates, like Level 2 requirements since 2023. How specifically can I assist with your SFDR needs today? Perhaps checking compliance or analyzing PAI indicators?`;
    };

    /**
     * Handle form submission for SFDR validation
     */
    const handleFormSubmit = async () => {
      if (!formData.fundProfile?.fundName || !formData.metadata?.entityId) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in the required fields (Fund Name and Entity ID)',
          variant: 'destructive'
        });
        return;
      }

      const request = formData as SFDRClassificationRequest;

      // Add form submission message
      addMessage({
        type: 'user',
        content: `Validating SFDR classification for: ${request.fundProfile.fundName}`,
        data: request
      });

      // Add loading message
      const loadingId = addMessage({
        type: 'agent',
        content: 'Validating SFDR compliance...',
        isLoading: true
      });

      setIsLoading(true);

      try {
        const response = await callNexusAPI(request);

        let responseContent = `**Validation Complete**\n\n`;
        responseContent += `**Classification:** ${response.classification?.recommendedArticle || 'N/A'}\n`;
        responseContent += `**Confidence:** ${((response.classification?.confidence || 0) * 100).toFixed(1)}%\n\n`;
        responseContent += `**Compliance Score:** ${response.complianceScore}%\n\n`;

        if (response.issues && response.issues.length > 0) {
          responseContent += `**Issues Found:**\n`;
          response.issues.forEach(issue => {
            responseContent += `• ${issue.message} (${issue.severity})\n`;
          });
          responseContent += '\n';
        }

        if (response.recommendations && response.recommendations.length > 0) {
          responseContent += `**Recommendations:**\n`;
          response.recommendations.forEach(rec => {
            responseContent += `• ${rec}\n`;
          });
        }

        updateMessage(loadingId, {
          content: responseContent,
          data: response,
          isLoading: false
        });

        toast({
          title: 'Validation Complete',
          description: `Classification: ${response.classification?.recommendedArticle || 'N/A'} (${((response.classification?.confidence || 0) * 100).toFixed(1)}% confidence)`
        });
      } catch (error) {
        updateMessage(loadingId, {
          content: 'Error validating SFDR compliance. Please check your data and try again.',
          isLoading: false
        });

        toast({
          title: 'Validation Error',
          description: 'Failed to validate SFDR compliance',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
        setShowFormMode(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-4xl mx-auto ${className}`}
      >
        <Card className='h-[700px] flex flex-col shadow-lg'>
          <CardHeader className='flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <motion.div
                  className='relative'
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className='h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center'>
                    <Bot className='h-5 w-5 text-white' />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white'
                  />
                </motion.div>
                <div>
                  <CardTitle className='text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                    {agentPersonality.name}
                  </CardTitle>
                  <CardDescription className='text-sm text-muted-foreground'>
                    {agentPersonality.role} • {agentPersonality.expertise.join(' • ')}
                  </CardDescription>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <Badge
                  variant='outline'
                  className='text-xs bg-green-50 text-green-700 border-green-200'
                >
                  <Shield className='h-3 w-3 mr-1' />
                  Secure
                </Badge>
                <Badge
                  variant='outline'
                  className='text-xs bg-blue-50 text-blue-700 border-blue-200'
                >
                  <Zap className='h-3 w-3 mr-1' />
                  AI-Powered
                </Badge>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowFormMode(!showFormMode)}
                  className='text-xs hover:bg-blue-50'
                >
                  {showFormMode ? 'Chat Mode' : 'Form Mode'}
                </Button>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <Settings className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className='flex-1 flex flex-col p-0'>
            {!showFormMode ? (
              // Chat Mode
              <>
                <ScrollArea className='flex-1 px-4'>
                  <div className='space-y-4 py-4'>
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={`${message.id}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <EnhancedMessage
                            id={message.id}
                            type={message.type as 'system' | 'user' | 'agent'}
                            content={message.content}
                            timestamp={message.timestamp}
                            isLoading={message.isLoading}
                            isStreaming={message.isStreaming}
                            confidence={message.confidence}
                            messageType={message.messageType}
                            onReaction={handleMessageReaction}
                            onCopy={handleCopyMessage}
                            onExport={handleExportMessage}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='flex items-start space-x-3'
                      >
                        <Avatar className='h-8 w-8'>
                          <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white'>
                            <Bot className='h-4 w-4' />
                          </AvatarFallback>
                        </Avatar>
                        <div className='bg-white border rounded-lg p-3 shadow-sm'>
                          {processingStages.length > 0 ? (
                            <ProcessingStages
                              stages={processingStages.map((stage, index) => ({
                                id: `stage-${index}`,
                                label: stage.name,
                                ...stage
                              }))}
                            />
                          ) : (
                            <TypingIndicator
                              agentName={agentPersonality.name}
                              processingType={processingType}
                            />
                          )}
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className='border-t bg-gray-50/50 p-4'>
                  <EnhancedInput
                    value={inputMessage}
                    onChange={setInputMessage}
                    onSubmit={handleSendMessage}
                    onVoiceInput={handleVoiceInput}
                    placeholder='Ask about SFDR compliance, fund classification, or submit data for validation...'
                    disabled={isLoading}
                    isLoading={isLoading}
                    maxLength={2000}
                    suggestions={[
                      'What are the key SFDR disclosure requirements?',
                      'How do I classify my fund under SFDR Article 6, 8, or 9?',
                      'What ESG data do I need to collect for SFDR reporting?',
                      'Explain the difference between Article 8 and Article 9 funds'
                    ]}
                  />
                </div>
              </>
            ) : (
              // Form Mode
              <div className='p-4 space-y-4 overflow-y-auto'>
                <Alert>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>
                    Fill out the form below to validate SFDR compliance for your fund.
                  </AlertDescription>
                </Alert>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='entityId'>Entity ID *</Label>
                    <Input
                      id='entityId'
                      value={formData.metadata?.entityId || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata!, entityId: e.target.value }
                        }))
                      }
                      placeholder='123e4567-e89b-12d3-a456-426614174000'
                    />
                  </div>

                  <div>
                    <Label htmlFor='reportingPeriod'>Reporting Period</Label>
                    <Input
                      id='reportingPeriod'
                      value={formData.metadata?.reportingPeriod || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata!, reportingPeriod: e.target.value }
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='fundName'>Fund Name *</Label>
                  <Input
                    id='fundName'
                    value={formData.fundProfile?.fundName || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        fundProfile: { ...prev.fundProfile!, fundName: e.target.value }
                      }))
                    }
                    placeholder='ESG European Equity Fund'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='fundType'>Fund Type</Label>
                    <select
                      id='fundType'
                      className='w-full p-2 border border-gray-300 rounded-md'
                      value={formData.fundProfile?.fundType || 'UCITS'}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          fundProfile: {
                            ...prev.fundProfile!,
                            fundType: e.target.value as
                              | 'UCITS'
                              | 'AIF'
                              | 'MMF'
                              | 'PEPP'
                              | 'IORP'
                              | 'OTHER'
                          }
                        }))
                      }
                    >
                      <option value='UCITS'>UCITS</option>
                      <option value='AIF'>AIF</option>
                      <option value='ELTIF'>ELTIF</option>
                      <option value='MMF'>MMF</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor='targetArticle'>Target Article Classification</Label>
                    <select
                      id='targetArticle'
                      className='w-full p-2 border border-gray-300 rounded-md'
                      value={formData.fundProfile?.targetArticleClassification || 'Article8'}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          fundProfile: {
                            ...prev.fundProfile!,
                            targetArticleClassification: e.target.value as
                              | 'Article6'
                              | 'Article8'
                              | 'Article9'
                          }
                        }))
                      }
                    >
                      <option value='Article6'>Article 6 (Basic)</option>
                      <option value='Article8'>Article 8 (ESG Characteristics)</option>
                      <option value='Article9'>Article 9 (Sustainable Investment)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor='investmentObjective'>Investment Objective</Label>
                  <Textarea
                    id='investmentObjective'
                    value={formData.fundProfile?.investmentObjective || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        fundProfile: { ...prev.fundProfile!, investmentObjective: e.target.value }
                      }))
                    }
                    placeholder="Describe the fund's investment objective and ESG approach..."
                    rows={3}
                  />
                </div>

                <div className='flex justify-end gap-2'>
                  <Button variant='outline' onClick={() => setShowFormMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFormSubmit} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Shield className='w-4 h-4 mr-2' />
                        Validate SFDR Compliance
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

NexusAgentChat.displayName = 'NexusAgentChat';

export default NexusAgentChat;
