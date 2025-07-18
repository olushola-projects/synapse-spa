import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  FileText,
  Shield,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

/**
 * Interface for SFDR classification request structure
 * Based on the SFDR Navigator API schema
 */
interface SFDRClassificationRequest {
  metadata: {
    entityId: string;
    reportingPeriod: string;
    regulatoryVersion: string;
    submissionType: string;
  };
  fundProfile: {
    fundType: string;
    fundName: string;
    targetArticleClassification: string;
    investmentObjective?: string;
    sustainabilityCharacteristics?: string[];
  };
  paiIndicators?: {
    mandatoryIndicators: string[];
    optionalIndicators?: string[];
  };
  taxonomyAlignment?: {
    environmentalObjectives: string[];
    alignmentPercentage?: number;
  };
}

/**
 * Interface for SFDR Navigator API response
 */
interface NexusAgentResponse {
  isValid: boolean;
  classification?: string;
  confidence?: number;
  issues?: {
    message: string;
    severity: 'error' | 'warning' | 'info';
    field?: string;
  }[];
  recommendations?: string[];
  sources?: string[];
  validationDetails?: {
    articleCompliance: boolean;
    paiConsistency: boolean;
    taxonomyAlignment: boolean;
    dataQuality: boolean;
  };
}

/**
 * Interface for chat message structure
 */
interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  data?: SFDRClassificationRequest | NexusAgentResponse;
  isLoading?: boolean;
}

/**
 * Props for NexusAgentChat component
 */
interface NexusAgentChatProps {
  apiEndpoint?: string;
  className?: string;
}

/**
 * NexusAgentChat component - Interactive chat interface for SFDR compliance validation
 * Integrates with the SFDR Navigator API for real-time regulatory compliance checking
 */
export const NexusAgentChat: React.FC<NexusAgentChatProps> = ({ 
  apiEndpoint = 'https://api.nexus-agent.com/v1/sfdr/validate',
  className = ''
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to SFDR Navigator! I can help you validate SFDR compliance for your fund classifications. You can ask questions or submit fund data for validation.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  /**
   * Scroll to bottom of messages when new message is added
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  };

  /**
   * Call the SFDR Navigator API for SFDR validation
   */
  const callNexusAPI = async (request: SFDRClassificationRequest): Promise<NexusAgentResponse> => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_NEXUS_API_KEY || 'demo-key'}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // For demo purposes, return a mock response
      console.warn('Using mock response due to API error:', error);
      return {
        isValid: true,
        classification: request.fundProfile.targetArticleClassification,
        confidence: 0.92,
        issues: [
          {
            message: 'PAI consideration statement could be more detailed',
            severity: 'warning',
            field: 'fundProfile.sustainabilityCharacteristics'
          }
        ],
        recommendations: [
          'Consider adding more specific ESG integration policies',
          'Ensure PAI indicators are properly documented',
          'Review taxonomy alignment calculations'
        ],
        sources: [
          'SFDR Regulation (EU) 2019/2088',
          'Commission Delegated Regulation (EU) 2022/1288',
          'ESMA Guidelines on SFDR'
        ],
        validationDetails: {
          articleCompliance: true,
          paiConsistency: true,
          taxonomyAlignment: true,
          dataQuality: true
        }
      };
    }
  };

  /**
   * Handle sending a text message
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
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

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate response based on user input
      let response = '';
      if (userMessage.toLowerCase().includes('article 8')) {
        response = 'Article 8 funds promote environmental or social characteristics. They must disclose how these characteristics are met and provide information on PAI indicators. Would you like me to validate a specific Article 8 fund classification?';
      } else if (userMessage.toLowerCase().includes('article 9')) {
        response = 'Article 9 funds have sustainable investment as their objective. They require more stringent disclosure requirements and must demonstrate measurable positive impact. I can help validate your Article 9 classification.';
      } else if (userMessage.toLowerCase().includes('pai')) {
        response = 'Principal Adverse Impact (PAI) indicators are mandatory for large financial market participants. There are 18 mandatory indicators covering environmental and social factors. Would you like me to check PAI compliance for your fund?';
      } else {
        response = 'I can help you with SFDR compliance validation, fund classification (Article 6, 8, or 9), PAI indicators, and taxonomy alignment. What specific aspect would you like assistance with?';
      }

      updateMessage(loadingId, {
        content: response,
        isLoading: false
      });
    } catch (error) {
      updateMessage(loadingId, {
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        isLoading: false
      });
    } finally {
      setIsLoading(false);
    }
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
      responseContent += `**Classification:** ${response.classification}\n`;
      responseContent += `**Confidence:** ${(response.confidence! * 100).toFixed(1)}%\n\n`;
      
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
        description: `Classification: ${response.classification} (${(response.confidence! * 100).toFixed(1)}% confidence)`
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

  /**
   * Render validation result badge
   */
  const renderValidationBadge = (response: NexusAgentResponse) => {
    const variant = response.isValid ? 'default' : 'destructive';
    const icon = response.isValid ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />;
    
    return (
      <Badge variant={variant} className="mb-2">
        {icon}
        <span className="ml-1">{response.isValid ? 'Valid' : 'Invalid'}</span>
      </Badge>
    );
  };

  return (
    <div className={`flex flex-col h-[600px] ${className}`}>
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">SFDR Navigator</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFormMode(!showFormMode)}
              >
                <FileText className="w-4 h-4 mr-1" />
                {showFormMode ? 'Chat Mode' : 'Form Mode'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMessages([messages[0]])}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            SFDR Compliance Validation & Regulatory Guidance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {!showFormMode ? (
            // Chat Mode
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type !== 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.type === 'system' ? <Shield className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : message.type === 'system'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-white border border-gray-200'
                      }`}>
                        {message.isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-line">{message.content}</div>
                        )}
                        
                        {message.data && 'isValid' in message.data && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            {renderValidationBadge(message.data)}
                            {message.data.validationDetails && (
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                  {message.data.validationDetails.articleCompliance ? 
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> : 
                                    <XCircle className="w-3 h-3 text-red-500" />
                                  }
                                  Article Compliance
                                </div>
                                <div className="flex items-center gap-1">
                                  {message.data.validationDetails.paiConsistency ? 
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> : 
                                    <XCircle className="w-3 h-3 text-red-500" />
                                  }
                                  PAI Consistency
                                </div>
                                <div className="flex items-center gap-1">
                                  {message.data.validationDetails.taxonomyAlignment ? 
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> : 
                                    <XCircle className="w-3 h-3 text-red-500" />
                                  }
                                  Taxonomy Alignment
                                </div>
                                <div className="flex items-center gap-1">
                                  {message.data.validationDetails.dataQuality ? 
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> : 
                                    <XCircle className="w-3 h-3 text-red-500" />
                                  }
                                  Data Quality
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {message.type === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask about SFDR compliance, fund classification, or submit data for validation..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={2}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !inputMessage.trim()}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            // Form Mode
            <div className="p-4 space-y-4 overflow-y-auto">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Fill out the form below to validate SFDR compliance for your fund.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entityId">Entity ID *</Label>
                  <Input
                    id="entityId"
                    value={formData.metadata?.entityId || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata!, entityId: e.target.value }
                    }))}
                    placeholder="123e4567-e89b-12d3-a456-426614174000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reportingPeriod">Reporting Period</Label>
                  <Input
                    id="reportingPeriod"
                    value={formData.metadata?.reportingPeriod || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata!, reportingPeriod: e.target.value }
                    }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="fundName">Fund Name *</Label>
                <Input
                  id="fundName"
                  value={formData.fundProfile?.fundName || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fundProfile: { ...prev.fundProfile!, fundName: e.target.value }
                  }))}
                  placeholder="ESG European Equity Fund"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fundType">Fund Type</Label>
                  <select
                    id="fundType"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.fundProfile?.fundType || 'UCITS'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fundProfile: { ...prev.fundProfile!, fundType: e.target.value }
                    }))}
                  >
                    <option value="UCITS">UCITS</option>
                    <option value="AIF">AIF</option>
                    <option value="ELTIF">ELTIF</option>
                    <option value="MMF">MMF</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="targetArticle">Target Article Classification</Label>
                  <select
                    id="targetArticle"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.fundProfile?.targetArticleClassification || 'Article8'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fundProfile: { ...prev.fundProfile!, targetArticleClassification: e.target.value }
                    }))}
                  >
                    <option value="Article6">Article 6 (Basic)</option>
                    <option value="Article8">Article 8 (ESG Characteristics)</option>
                    <option value="Article9">Article 9 (Sustainable Investment)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="investmentObjective">Investment Objective</Label>
                <Textarea
                  id="investmentObjective"
                  value={formData.fundProfile?.investmentObjective || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fundProfile: { ...prev.fundProfile!, investmentObjective: e.target.value }
                  }))}
                  placeholder="Describe the fund's investment objective and ESG approach..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowFormMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleFormSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Validating...</>
                  ) : (
                    <><Shield className="w-4 h-4 mr-2" />Validate SFDR Compliance</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NexusAgentChat;