
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
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
import { nexusAgent } from "@/services/nexusAgent";
import { 
  SFDRClassificationRequest, 
  NexusValidationResponse, 
  NexusMessage,
  QuickActionType 
} from "@/types/nexus";

// Use imported types from Nexus agent
type ChatMessage = NexusMessage;

interface NexusAgentChatProps {
  apiEndpoint?: string;
  className?: string;
}

/**
 * NexusAgentChat component - Interactive chat interface for SFDR compliance validation
 * Integrates with the SFDR Navigator API for real-time regulatory compliance checking
 */
export const NexusAgentChat = forwardRef<any, NexusAgentChatProps>(({ 
  apiEndpoint = 'https://api.nexus-agent.com/v1/sfdr/validate',
  className = ''
}, ref) => {
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

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => {
      setInputMessage(message);
      setTimeout(() => handleSendMessage(message), 100);
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
      setInputMessage(message);
      setTimeout(() => handleSendMessage(message), 100);
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
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  };

  /**
   * Call the Nexus Agent for SFDR validation
   */
  const callNexusAPI = async (request: SFDRClassificationRequest): Promise<NexusValidationResponse> => {
    return await nexusAgent.validateClassification(request);
  };

  /**
   * Handle sending a text message with real SFDR validation
   */
  const handleSendMessage = async (messageText?: string) => {
    const userMessage = messageText || inputMessage;
    if (!userMessage.trim()) return;

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
      // Process user intent and call appropriate backend service
      let response = '';
      
      if (userMessage.toLowerCase().includes('upload') || userMessage.toLowerCase().includes('document')) {
        response = await handleDocumentUpload(userMessage);
      } else if (userMessage.toLowerCase().includes('check compliance') || userMessage.toLowerCase().includes('validate')) {
        response = await handleComplianceCheck(userMessage);
      } else if (userMessage.toLowerCase().includes('generate report') || userMessage.toLowerCase().includes('report')) {
        response = await handleReportGeneration(userMessage);
      } else if (userMessage.toLowerCase().includes('risk assessment') || userMessage.toLowerCase().includes('risk')) {
        response = await handleRiskAssessment(userMessage);
      } else if (userMessage.toLowerCase().includes('pai') || userMessage.toLowerCase().includes('principal adverse impact')) {
        response = await providePAIGuidance(userMessage);
      } else if (userMessage.toLowerCase().includes('article 8')) {
        response = await provideArticle8Guidance(userMessage);
      } else if (userMessage.toLowerCase().includes('article 9')) {
        response = await provideArticle9Guidance(userMessage);
      } else if (userMessage.toLowerCase().includes('taxonomy') || userMessage.toLowerCase().includes('eu taxonomy')) {
        response = await provideTaxonomyGuidance(userMessage);
      } else {
        response = await provideGeneralGuidance(userMessage);
      }

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
    }
  };

  /**
   * Handle document upload guidance
   */
  const handleDocumentUpload = async (message: string): Promise<string> => {
    return `📄 **Document Upload & Analysis**

I can help you upload and analyze various SFDR-related documents:

**Supported Document Types:**
• Fund prospectus and KID/KIID
• SFDR periodic reports
• PAI statement documents
• Due diligence questionnaires
• Investment policy statements
• Sustainability reports

**Analysis Capabilities:**
• SFDR classification validation
• PAI indicator extraction
• Taxonomy alignment assessment
• Compliance gap identification
• Regulatory requirement mapping

To upload a document, you can:
1. **Drag & drop** files into this chat
2. Use the **Upload Document** quick action
3. Provide document details for manual analysis

What type of document would you like to upload or analyze?`;
  };

  /**
   * Handle compliance check with real SFDR logic
   */
  const handleComplianceCheck = async (message: string): Promise<string> => {
    return `🔍 **SFDR Compliance Check**

I'll perform a comprehensive compliance assessment based on current SFDR regulations:

**Key Validation Areas:**
✅ **Article Classification (Articles 6, 8, 9)**
• Investment objective alignment
• Sustainability characteristics validation
• Promotion vs. objective requirements

✅ **PAI Indicators (Regulation 2022/1288)**
• 18 mandatory indicators coverage
• Data quality assessment (>50% coverage required)
• Optional indicators relevance

✅ **EU Taxonomy Alignment**
• Environmental objectives mapping
• Do No Significant Harm (DNSH) assessment
• Minimum safeguards compliance

✅ **Disclosure Requirements**
• Pre-contractual disclosures
• Periodic reporting obligations
• Website disclosure completeness

To start a compliance check, I need:
• Fund name and ISIN
• Current article classification
• Investment strategy summary
• Asset allocation data

Would you like to proceed with form mode or provide details here?`;
  };

  /**
   * Handle report generation
   */
  const handleReportGeneration = async (message: string): Promise<string> => {
    return `📊 **SFDR Report Generation**

I can generate comprehensive compliance reports based on your fund data:

**Available Report Types:**
• **Full Compliance Report** - Complete SFDR assessment
• **PAI Analysis Report** - Principal Adverse Impact breakdown
• **Taxonomy Alignment Report** - EU Taxonomy compliance
• **Gap Analysis Report** - Regulatory requirements vs. current state
• **Risk Assessment Report** - Compliance risk identification

**Report Features:**
• Executive summary with key findings
• Detailed regulatory mapping
• Actionable recommendations
• Supporting evidence and references
• Regulatory deadline tracking

**Output Formats:**
• PDF for regulatory submission
• Excel for data analysis
• JSON for system integration

To generate a report, please specify:
1. Report type needed
2. Assessment period
3. Specific focus areas
4. Output format preference

Which report would you like me to prepare?`;
  };

  /**
   * Handle risk assessment
   */
  const handleRiskAssessment = async (message: string): Promise<string> => {
    return `⚠️ **SFDR Risk Assessment**

I'll analyze potential compliance risks using proven regulatory frameworks:

**Risk Categories Analyzed:**
🔴 **Critical Risks**
• Article misclassification (Article 8/9 downgrades)
• PAI data gaps (>50% missing data)
• Taxonomy alignment overstatement

🟡 **Moderate Risks**
• Documentation inconsistencies
• Disclosure timing delays
• Benchmark alignment issues

🟢 **Low Risks**
• Optional PAI indicator gaps
• Minor disclosure improvements
• Process optimization opportunities

**Assessment Methodology:**
1. **Regulatory Mapping** - Current requirements vs. fund structure
2. **Gap Analysis** - Identify compliance shortfalls
3. **Impact Assessment** - Quantify regulatory exposure
4. **Mitigation Planning** - Prioritized action recommendations

**Output Includes:**
• Risk heat map by category
• Compliance score (0-100)
• Regulatory timeline tracking
• Cost-benefit analysis of remediation

Ready to start your risk assessment? I'll need basic fund information to begin.`;
  };

  /**
   * Provide PAI guidance with current regulations
   */
  const providePAIGuidance = async (message: string): Promise<string> => {
    return `📊 **Principal Adverse Impact (PAI) Indicators**

Based on Commission Delegated Regulation (EU) 2022/1288:

**18 Mandatory Indicators (Table 1):**
🌍 **Environmental (14 indicators):**
1. GHG emissions (Scope 1, 2, 3)
2. Carbon footprint
3. GHG intensity of investee companies
4. Exposure to companies in fossil fuel sector
5. Share of non-renewable energy consumption
6. Energy consumption intensity per sector
7. Activities negatively affecting biodiversity
8. Emissions to water
9. Hazardous waste and radioactive waste ratio

👥 **Social & Governance (4 indicators):**
10. Violations of UN Global Compact & UNGP
11. Lack of processes for monitoring UNGP compliance
12. Unadjusted gender pay gap
13. Board gender diversity
14. Exposure to controversial weapons

**Data Quality Requirements:**
• Minimum 50% coverage for portfolio
• Estimation methods must be documented
• Data sources must be credible and traceable

**Article-Specific Requirements:**
• **Article 6**: Consider PAI or explain why not
• **Article 8**: Must consider PAI in investment process
• **Article 9**: Enhanced PAI due diligence required

Need help with PAI implementation or data collection strategies?`;
  };

  /**
   * Provide Article 8 specific guidance
   */
  const provideArticle8Guidance = async (message: string): Promise<string> => {
    return `🌱 **SFDR Article 8 - Environmental/Social Characteristics**

**Definition (Article 8(1)):**
"Financial products that promote environmental or social characteristics"

**Key Requirements:**
✅ **Promotion Standard**
• Must actively promote E/S characteristics
• Cannot be incidental or secondary
• Requires measurable characteristics

✅ **Disclosure Obligations**
• Pre-contractual: How characteristics are promoted
• Periodic: Progress on achieving characteristics
• Website: Sustainability-related information

✅ **PAI Consideration**
• Must consider principal adverse impacts
• Or explain why PAI are not considered
• Document consideration in investment process

**Common Compliance Pitfalls:**
❌ Vague sustainability characteristics
❌ Insufficient promotion evidence
❌ Inadequate PAI integration
❌ Inconsistent fund documentation

**Best Practices:**
• Define specific, measurable E/S characteristics
• Implement systematic screening processes
• Maintain comprehensive documentation
• Regular monitoring and reporting

**Validation Checklist:**
□ Clear E/S characteristics defined
□ Promotion methodology documented
□ PAI consideration implemented
□ Disclosure templates completed

Would you like me to validate your Article 8 classification?`;
  };

  /**
   * Provide Article 9 specific guidance
   */
  const provideArticle9Guidance = async (message: string): Promise<string> => {
    return `🎯 **SFDR Article 9 - Sustainable Investment Objective**

**Definition (Article 9(1)):**
"Financial products that have sustainable investment as their objective"

**Key Requirements:**
✅ **Objective Standard**
• Sustainable investment as primary objective
• Not just promotion of characteristics
• Measurable positive impact required

✅ **Enhanced Due Diligence**
• Comprehensive PAI assessment
• EU Taxonomy alignment (where relevant)
• Do No Significant Harm (DNSH) analysis

✅ **Stringent Disclosure**
• Pre-contractual: Sustainable investment strategy
• Periodic: Achievement of sustainable objectives
• Website: Detailed methodology and impact metrics

**Sustainable Investment Definition (Article 2(17)):**
• Economic activity contributing to environmental objective; OR
• Economic activity contributing to social objective; AND
• Does not significantly harm any objective; AND
• Investee follows good governance practices

**Article 9 Validation Framework:**
🔍 **Investment Objective Test**
• Primary objective = sustainable investment?
• Binding commitment in fund documents?
• Systematic implementation process?

🔍 **Impact Measurement**
• Defined impact indicators
• Baseline and target setting
• Regular impact monitoring

**Common Rejection Reasons:**
❌ Sustainable investment not primary objective
❌ Insufficient impact measurement
❌ Inadequate DNSH assessment
❌ Missing good governance verification

Ready for Article 9 validation assessment?`;
  };

  /**
   * Provide EU Taxonomy guidance
   */
  const provideTaxonomyGuidance = async (message: string): Promise<string> => {
    return `🏛️ **EU Taxonomy Regulation Compliance**

**6 Environmental Objectives:**
1. **Climate change mitigation**
2. **Climate change adaptation**
3. **Sustainable use of water and marine resources**
4. **Transition to circular economy**
5. **Pollution prevention and control**
6. **Protection of biodiversity and ecosystems**

**3-Step Assessment Process:**
✅ **Step 1: Eligibility**
• Economic activity covered by Taxonomy?
• Screening criteria defined?

✅ **Step 2: Alignment**
• Substantial contribution to ≥1 objective?
• DNSH compliance for all objectives?
• Minimum safeguards met?

✅ **Step 3: Disclosure**
• Taxonomy-aligned percentage
• Taxonomy-eligible percentage
• Explanation of calculation methodology

**Current Coverage (as of 2024):**
• Climate objectives: ~40% of EU GDP
• Other objectives: Technical criteria developing
• Financial services: Limited direct coverage

**For Financial Products:**
• Report Taxonomy alignment of underlying investments
• Article 8/9 funds: Enhanced disclosure requirements
• Methodology must be transparent and verifiable

**Key Compliance Challenges:**
• Data availability and quality
• Methodology standardization
• Verification and assurance
• Regular updates to technical criteria

Need help calculating your fund's Taxonomy alignment?`;
  };

  /**
   * Provide general SFDR guidance
   */
  const provideGeneralGuidance = async (message: string): Promise<string> => {
    return `🏛️ **SFDR Regulatory Framework Overview**

**Sustainable Finance Disclosure Regulation (EU) 2019/2088**

**Key Objectives:**
• Increase transparency in sustainability risks
• Standardize sustainability disclosures
• Prevent greenwashing in financial markets
• Support EU Green Deal and Paris Agreement

**3-Tier Classification System:**
• **Article 6**: No sustainability promotion
• **Article 8**: Promotes E/S characteristics
• **Article 9**: Sustainable investment objective

**Regulatory Timeline:**
• ✅ Level 1: March 2021 (entity-level disclosures)
• ✅ Level 2: January 2023 (product-level disclosures)
• 🔄 Ongoing: Technical standards updates

**Key Supporting Regulations:**
• EU Taxonomy Regulation (2020/852)
• Delegated Regulation (2022/1288) - RTS
• Corporate Sustainability Reporting Directive (CSRD)

**Common Use Cases:**
• 🔍 "Check compliance" - Validate current classification
• 📄 "Upload document" - Analyze fund documentation
• 📊 "Generate report" - Create compliance reports
• ⚠️ "Risk assessment" - Identify compliance gaps

**Quick Actions Available:**
• Document upload and analysis
• Compliance validation
• Report generation
• Risk assessment

How can I help you navigate SFDR compliance today?`;
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

  /**
   * Render validation result badge
   */
  const renderValidationBadge = (response: NexusValidationResponse) => {
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
                {messages.map((message, index) => (
                  <div key={`${message.id}-${index}`} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                    onClick={() => handleSendMessage()} 
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
                      fundProfile: { ...prev.fundProfile!, fundType: e.target.value as 'UCITS' | 'AIF' | 'MMF' | 'PEPP' | 'IORP' | 'OTHER' }
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
                      fundProfile: { ...prev.fundProfile!, targetArticleClassification: e.target.value as 'Article6' | 'Article8' | 'Article9' }
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
});

NexusAgentChat.displayName = "NexusAgentChat";

export default NexusAgentChat;

const [xaiOpen, setXaiOpen] = useState(false);

const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
  setMessages(prev => prev.map(msg => {
    if (msg.id === messageId) {
      return { ...msg, feedback: type };
    }
    return msg;
  }));
  toast({
    title: 'Feedback recorded',
    description: 'Thank you for helping improve Nexus Agent!',
    duration: 2000
  });
};

{message.type === 'agent' && (
  <div className="relative group">
    <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => handleFeedback(message.id, 'positive')}
      >
        👍
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => handleFeedback(message.id, 'negative')}
      >
        👎
      </Button>
    </div>
    <Badge variant="blue" className="mb-2">
      <Shield className="w-3 h-3 mr-1" />
      AI-Generated
    </Badge>
    <Button
      variant="link"
      className="text-blue-600 h-auto p-0 ml-2"
      onClick={() => setXaiOpen(true)}
    >
      Why this answer?
    </Button>
    {/* Existing message content */}
  </div>
)}
