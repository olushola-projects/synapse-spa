import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '@/utils/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Loader2, AlertCircle, Shield, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { nexusAgent } from '@/services/nexusAgent';
import { TIME_CONSTANTS } from '@/utils/constants';
import { type SFDRClassificationRequest, type NexusValidationResponse, type NexusMessage } from '@/types/nexus';

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
export const NexusAgentChat = forwardRef<any, NexusAgentChatProps>(({
  apiEndpoint: _apiEndpoint = 'https://api.nexus-agent.com/v1/sfdr/validate',
  className = ''
}, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    type: 'system',
    content: "Hello, I'm Sophia, your SFDR Navigator and agentic guide to sustainable finance disclosures. Whether you're managing Article 6, 8, or 9 funds, I break down regulatory requirements into actionable steps. I help map your fund strategy to the right SFDR classification, flag gaps in your pre-contractual and periodic templates, and guide you through PAI indicator selection. I monitor regulatory updates and ensure you're disclosing what's necessary, when it's needed, and how it's evolving without overwhelming your team. Ready to simplify your next SFDR disclosure cycle?",
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [processingType, setProcessingType] = useState<'thinking' | 'searching' | 'analyzing' | 'calculating' | 'generating'>('thinking');
  const [processingStages, setProcessingStages] = useState<Array<{
    name: string;
    status: 'pending' | 'active' | 'completed';
    description?: string;
  }>>([]);
  const [agentPersonality, _setAgentPersonality] = useState({
    name: 'Sophia',
    role: 'SFDR Navigator & Sustainable Finance Expert',
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
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for quick action events from parent
  useEffect(() => {
    const handleQuickAction = (event: CustomEvent) => {
      const {
        message
      } = event.detail;
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
    setMessages(prev => prev.map(msg => msg.id === id ? {
      ...msg,
      ...updates
    } : msg));
  };

  /**
   * Call the Nexus Agent for SFDR validation
   */
  const callNexusAPI = async (request: SFDRClassificationRequest): Promise<NexusValidationResponse> => {
    return await nexusAgent.validateClassification(request);
  };

  /**
   * Handle message reactions
   */
  const handleMessageReaction = (messageId: string, reaction: 'like' | 'dislike') => {
    setMessages(prev => prev.map(msg => {
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
        return {
          ...msg,
          reactions: newReactions
        };
      }
      return msg;
    }));
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
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
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
    const stages = [{
      name: 'Understanding request',
      status: 'active' as const,
      description: 'Analyzing your query...'
    }, {
      name: 'Searching regulations',
      status: 'pending' as const
    }, {
      name: 'Analyzing compliance',
      status: 'pending' as const
    }, {
      name: 'Generating response',
      status: 'pending' as const
    }];
    setProcessingStages(stages);

    // Simulate stage progression
    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, TIME_CONSTANTS.PROCESSING_STAGE_DELAY_MS));
      setProcessingStages(prev => prev.map((stage, index) => ({
        ...stage,
        status: index < i ? 'completed' : index === i ? 'active' : 'pending'
      })));

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
    } else if (lowerMessage.includes('pai') || lowerMessage.includes('principal adverse impact')) {
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
        await new Promise(resolve => setTimeout(resolve, TIME_CONSTANTS.SIMPLE_PROCESSING_DELAY_MS));
      }
      const response = await routeMessageToHandler(userMessage);
      updateMessage(loadingId, {
        content: response,
        isLoading: false
      });
    } catch (error) {
      logger.error('Error processing message:', error);
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
    return `Excellent choice. Document upload is a fundamental step in our compliance validation process. Based on my extensive experience in regulatory advisory services, proper documentation significantly streamlines the compliance review cycle. I can assist with analyzing your pre-contractual disclosures, periodic reports, or any SFDR-related documentation. Which specific document type are you planning to upload, and what particular aspects would you like me to focus on during the review?`;
  };

  /**
   * Handle compliance check with real SFDR logic
   */
  const handleComplianceCheck = async (_message: string): Promise<string> => {
    return `Absolutely. Conducting a comprehensive compliance assessment is essential for robust regulatory positioning. I will systematically verify your fund against the full spectrum of SFDR criteria, including disclosure requirements, PAI considerations, and classification alignment. To provide the most targeted analysis, could you share details about your fund type, current classification status, or any specific compliance areas where you have concerns?`;
  };

  /**
   * Handle report generation
   */
  const handleReportGeneration = async (_message: string): Promise<string> => {
    return `Report generation is indeed a cornerstone of effective regulatory advisory services. Drawing from regulatory guidance and industry best practices, comprehensive SFDR reports should encompass PAI statements, EU Taxonomy alignment assessments, and detailed disclosure frameworks. What specific type of report are you looking to generate - periodic reporting, pre-contractual disclosures, or perhaps a custom compliance assessment? I can tailor the output to meet your precise requirements.`;
  };

  /**
   * Handle risk assessment
   */
  const handleRiskAssessment = async (_message: string): Promise<string> => {
    return `Risk assessment forms the foundation of effective governance, risk, and compliance frameworks. Based on supervisory guidelines and regulatory developments, I will conduct a comprehensive evaluation of sustainability risks within your portfolio structure. This assessment will examine climate-related financial risks, social impact factors, and governance considerations. Are there specific risk categories such as transition risks, physical climate risks, or social impact metrics that you would like me to prioritize in the analysis?`;
  };

  /**
   * Provide PAI guidance with current regulations
   */
  const providePAIGuidance = async (_message: string): Promise<string> => {
    return `Principal Adverse Impact indicators represent a cornerstone of SFDR compliance architecture. Through extensive regulatory advisory engagements, I have observed that the 18 mandatory indicators encompass greenhouse gas emissions, biodiversity considerations, and critical social factors including gender pay gap metrics. To achieve robust compliance positioning, organizations should target a minimum of 50% data coverage while maintaining comprehensive documentation of all data sources and methodologies. Article 8 funds must integrate these indicators into their investment decision-making processes, whereas Article 9 funds require enhanced due diligence frameworks. What specific aspect of PAI implementation would you like to address - data collection strategies or integration into your reporting infrastructure?`;
  };

  /**
   * Provide Article 8 specific guidance
   */
  const provideArticle8Guidance = async (_message: string): Promise<string> => {
    return `Good day. Drawing from my extensive regulatory advisory background, where I have guided numerous funds through successful SFDR implementations, Article 8 products are designed to promote environmental or social characteristics without establishing them as the primary investment objective. Critical success factors include establishing measurable characteristics, implementing proper PAI consideration frameworks, and maintaining consistent disclosure protocols. Common implementation challenges include insufficient definitional precision and inadequate evidence of characteristic promotion. How may I assist in optimizing your Article 8 approach - would you prefer to review your fund's characteristic definitions or enhance your disclosure strategy?`;
  };

  /**
   * Provide Article 9 specific guidance
   */
  const provideArticle9Guidance = async (_message: string): Promise<string> => {
    return `Greetings. Through my experience directing Article 9 validation processes for institutional clients, these products must establish sustainable investment as their primary objective, supported by comprehensive impact measurement frameworks and Do No Significant Harm analysis. This represents a significantly elevated compliance standard compared to Article 8, requiring sophisticated due diligence methodologies and robust impact assessment capabilities. Let us explore your fund's sustainable investment objectives - are you encountering challenges with impact measurement protocols or EU Taxonomy alignment requirements?`;
  };

  /**
   * Provide EU Taxonomy guidance
   */
  const provideTaxonomyGuidance = async (_message: string): Promise<string> => {
    return `Good day. Having contributed to supervisory publications on EU Taxonomy implementation, I can confirm that the framework centers on aligning economic activities with six defined environmental objectives while ensuring comprehensive Do No Significant Harm compliance and minimum safeguards adherence. Based on regulatory dialogue and industry feedback, many organizations encounter difficulties with substantial contribution data requirements. Would you prefer to systematically review your activity assessment methodology or address specific environmental objective alignment challenges?`;
  };

  /**
   * Provide general SFDR guidance
   */
  const provideGeneralGuidance = async (_message: string): Promise<string> => {
    return `Hello. As a senior regulatory consultant with comprehensive expertise in sustainable finance frameworks, I am here to guide you through the intricacies of the SFDR regulatory landscape. The Sustainable Finance Disclosure Regulation is designed to enhance transparency regarding sustainability risks and prevent greenwashing practices, directly supporting the EU Green Deal objectives. Financial products are categorized under Article 6 (no specific sustainability focus), Article 8 (promoting environmental or social characteristics), or Article 9 (sustainable investment objectives). The regulatory framework continues to evolve, with Level 2 requirements having been implemented since 2023. How may I specifically assist with your SFDR requirements today - would you prefer compliance verification or Principal Adverse Impact indicator analysis?`;
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
    } catch (_error) {
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
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className={`w-full max-w-4xl mx-auto ${className}`}>
        <Card className='h-[700px] flex flex-col shadow-lg'>
          <CardHeader className='flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <motion.div className='relative' whileHover={{
              scale: 1.05
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10
            }}>
                  <img src="/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png" alt="SFDR Navigator Agent" className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" />
                  <motion.div animate={{
                scale: [1, 1.2, 1]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }} className='absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white' />
                </motion.div>
                <div>
                  <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-normal">
                    {agentPersonality.name}
                  </CardTitle>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <Badge variant='outline' className='text-xs bg-green-50 text-green-700 border-green-200'>
                  <Shield className='h-3 w-3 mr-1' />
                  Secure
                </Badge>

                <Button variant='outline' size='sm' onClick={() => setShowFormMode(!showFormMode)} className="text-xs bg-blue-50">
                  {showFormMode ? 'Chat Mode' : 'Form Mode'}
                </Button>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <Settings className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className='flex-1 flex flex-col p-0'>
            {!showFormMode ?
        // Chat Mode
        <>
                <ScrollArea className='flex-1 px-4 max-h-[500px]'>
                  <div className='space-y-4 py-4'>
                    <AnimatePresence>
                      {messages.map((message, index) => <motion.div key={`${message.id}-${index}`} initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -20
                }} transition={{
                  duration: 0.3,
                  delay: index * 0.1
                }}>
                          <EnhancedMessage id={message.id} type={message.type as 'system' | 'user' | 'agent'} content={message.content} timestamp={message.timestamp} isLoading={message.isLoading} isStreaming={message.isStreaming} confidence={message.confidence} messageType={message.messageType} onReaction={handleMessageReaction} onCopy={handleCopyMessage} onExport={handleExportMessage} />
                        </motion.div>)}
                    </AnimatePresence>

                    {isTyping && <motion.div initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} className='flex items-start space-x-3'>
                        <Avatar className='h-8 w-8'>
                          <img src="/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png" alt="SFDR Navigator Agent" className="w-full h-full object-cover rounded-full" />
                          <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white'>
                            SN
                          </AvatarFallback>
                        </Avatar>
                        <div className='bg-white border rounded-lg p-3 shadow-sm'>
                          {processingStages.length > 0 ? <ProcessingStages stages={processingStages.map((stage, index) => ({
                    id: `stage-${index}`,
                    label: stage.name,
                    ...stage
                  }))} /> : <TypingIndicator agentName={agentPersonality.name} processingType={processingType} />}
                        </div>
                      </motion.div>}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className='border-t bg-gray-50/50 p-4'>
                  <EnhancedInput value={inputMessage} onChange={setInputMessage} onSubmit={handleSendMessage} onVoiceInput={handleVoiceInput} placeholder='Ask about SFDR compliance, fund classification, or submit data for validation...' disabled={isLoading} isLoading={isLoading} maxLength={2000} suggestions={['What are the key SFDR disclosure requirements?', 'How do I classify my fund under SFDR Article 6, 8, or 9?', 'What ESG data do I need to collect for SFDR reporting?', 'Explain the difference between Article 8 and Article 9 funds']} />
                </div>
              </> :
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
                    <Input id='entityId' value={formData.metadata?.entityId || ''} onChange={e => setFormData(prev => ({
                ...prev,
                metadata: {
                  ...prev.metadata!,
                  entityId: e.target.value
                }
              }))} placeholder='123e4567-e89b-12d3-a456-426614174000' />
                  </div>

                  <div>
                    <Label htmlFor='reportingPeriod'>Reporting Period</Label>
                    <Input id='reportingPeriod' value={formData.metadata?.reportingPeriod || ''} onChange={e => setFormData(prev => ({
                ...prev,
                metadata: {
                  ...prev.metadata!,
                  reportingPeriod: e.target.value
                }
              }))} />
                  </div>
                </div>

                <div>
                  <Label htmlFor='fundName'>Fund Name *</Label>
                  <Input id='fundName' value={formData.fundProfile?.fundName || ''} onChange={e => setFormData(prev => ({
              ...prev,
              fundProfile: {
                ...prev.fundProfile!,
                fundName: e.target.value
              }
            }))} placeholder='ESG European Equity Fund' />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='fundType'>Fund Type</Label>
                    <select id='fundType' className='w-full p-2 border border-gray-300 rounded-md' value={formData.fundProfile?.fundType || 'UCITS'} onChange={e => setFormData(prev => ({
                ...prev,
                fundProfile: {
                  ...prev.fundProfile!,
                  fundType: e.target.value as 'UCITS' | 'AIF' | 'MMF' | 'PEPP' | 'IORP' | 'OTHER'
                }
              }))}>
                      <option value='UCITS'>UCITS</option>
                      <option value='AIF'>AIF</option>
                      <option value='ELTIF'>ELTIF</option>
                      <option value='MMF'>MMF</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor='targetArticle'>Target Article Classification</Label>
                    <select id='targetArticle' className='w-full p-2 border border-gray-300 rounded-md' value={formData.fundProfile?.targetArticleClassification || 'Article8'} onChange={e => setFormData(prev => ({
                ...prev,
                fundProfile: {
                  ...prev.fundProfile!,
                  targetArticleClassification: e.target.value as 'Article6' | 'Article8' | 'Article9'
                }
              }))}>
                      <option value='Article6'>Article 6 (Basic)</option>
                      <option value='Article8'>Article 8 (ESG Characteristics)</option>
                      <option value='Article9'>Article 9 (Sustainable Investment)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor='investmentObjective'>Investment Objective</Label>
                  <Textarea id='investmentObjective' value={formData.fundProfile?.investmentObjective || ''} onChange={e => setFormData(prev => ({
              ...prev,
              fundProfile: {
                ...prev.fundProfile!,
                investmentObjective: e.target.value
              }
            }))} placeholder="Describe the fund's investment objective and ESG approach..." rows={3} />
                </div>

                <div className='flex justify-end gap-2'>
                  <Button variant='outline' onClick={() => setShowFormMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFormSubmit} disabled={isLoading}>
                    {isLoading ? <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Validating...
                      </> : <>
                        <Shield className='w-4 h-4 mr-2' />
                        Validate SFDR Compliance
                      </>}
                  </Button>
                </div>
              </div>}
          </CardContent>
        </Card>
      </motion.div>;
});
NexusAgentChat.displayName = 'NexusAgentChat';
export default NexusAgentChat;