import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  Upload, 
  MessageSquare, 
  Brain, 
  Target, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface for SFDR classification request
 */
interface SFDRClassificationRequest {
  fundName: string;
  description: string;
  investmentStrategy: string;
  esgIntegration: string;
  sustainabilityObjectives?: string;
  principalAdverseImpacts?: string;
  taxonomyAlignment?: string;
}

/**
 * Interface for SFDR classification response
 */
interface SFDRClassificationResponse {
  classification: 'Article 6' | 'Article 8' | 'Article 9';
  confidence: number;
  reasoning: string;
  recommendations: string[];
  issues: string[];
  complianceScore: number;
}

/**
 * Interface for chat message
 */
interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

/**
 * Interface for document analysis result
 */
interface DocumentAnalysis {
  fileName: string;
  extractedText: string;
  entities: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  summary: string;
  sfdrRelevance: number;
}

/**
 * SFDR Gem - Advanced AI-powered SFDR compliance assistant
 * Provides intelligent document analysis, classification, and compliance guidance
 */
export const SFDRGem: React.FC = () => {
  // Core state management
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classificationResult, setClassificationResult] = useState<SFDRClassificationResponse | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentAnalysis[]>([]);
  const [contextualMemory, setContextualMemory] = useState<string[]>([]);
  
  // Form state for classification
  const [formData, setFormData] = useState<SFDRClassificationRequest>({
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

  /**
   * Scroll to bottom of messages when new message is added
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Add a new message to the chat
   */
  const addMessage = (type: 'user' | 'agent' | 'system', content: string, metadata?: any) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata
    };
    setMessages(prev => [...prev, newMessage]);
  };

  /**
   * Handle sending a chat message
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      // Simulate AI response with contextual awareness
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let response = '';
      
      if (userMessage.toLowerCase().includes('article 8')) {
        response = 'Article 8 funds promote environmental or social characteristics. They must disclose how these characteristics are met and provide information on sustainability indicators. Key requirements include pre-contractual disclosures, website disclosures, and periodic reporting.';
      } else if (userMessage.toLowerCase().includes('article 9')) {
        response = 'Article 9 funds have sustainable investment as their objective. They must demonstrate measurable positive impact and "do no significant harm" to other sustainability objectives. These funds have the highest disclosure requirements under SFDR.';
      } else if (userMessage.toLowerCase().includes('pai') || userMessage.toLowerCase().includes('principal adverse')) {
        response = 'Principal Adverse Impacts (PAI) are negative effects on sustainability factors. Large financial market participants must consider and disclose how they address PAI in their investment decisions. This includes metrics on GHG emissions, biodiversity, water, waste, and social issues.';
      } else if (userMessage.toLowerCase().includes('taxonomy')) {
        response = 'The EU Taxonomy Regulation establishes criteria for environmentally sustainable economic activities. SFDR Article 8 and 9 funds must disclose the proportion of investments that are taxonomy-aligned, helping investors understand the environmental impact of their investments.';
      } else {
        response = `I understand you're asking about: "${userMessage}". Based on our conversation context and uploaded documents, I can provide specific SFDR guidance. Could you clarify which aspect of SFDR compliance you'd like me to focus on?`;
      }
      
      // Update contextual memory
      setContextualMemory(prev => [...prev.slice(-4), userMessage]);
      
      addMessage('agent', response);
    } catch (error) {
      addMessage('system', 'Sorry, I encountered an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle document upload and analysis
   */
  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Simulate document analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockAnalysis: DocumentAnalysis = {
          fileName: file.name,
          extractedText: `Extracted content from ${file.name}...`,
          entities: ['ESG Integration', 'Sustainable Investment', 'Climate Risk'],
          sentiment: 'positive',
          topics: ['Environmental Impact', 'Social Responsibility', 'Governance'],
          summary: `This document discusses sustainable investment strategies and ESG integration approaches relevant to SFDR compliance.`,
          sfdrRelevance: Math.random() * 40 + 60 // 60-100% relevance
        };
        
        setUploadedDocuments(prev => [...prev, mockAnalysis]);
        addMessage('system', `Document "${file.name}" analyzed successfully. SFDR relevance: ${mockAnalysis.sfdrRelevance.toFixed(1)}%`);
      }
    } catch (error) {
      addMessage('system', 'Error analyzing documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle SFDR classification form submission
   */
  const handleClassification = async () => {
    if (!formData.fundName || !formData.description) {
      addMessage('system', 'Please provide at least fund name and description for classification.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate classification API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult: SFDRClassificationResponse = {
        classification: formData.sustainabilityObjectives ? 'Article 9' : 
                      formData.esgIntegration ? 'Article 8' : 'Article 6',
        confidence: Math.random() * 20 + 80, // 80-100% confidence
        reasoning: `Based on the provided information, this fund appears to be ${formData.sustainabilityObjectives ? 'an Article 9 fund with sustainable investment objectives' : formData.esgIntegration ? 'an Article 8 fund promoting ESG characteristics' : 'an Article 6 fund with no specific sustainability claims'}.`,
        recommendations: [
          'Enhance ESG integration documentation',
          'Develop comprehensive PAI consideration framework',
          'Implement robust sustainability measurement processes'
        ],
        issues: [
          'Limited disclosure on taxonomy alignment',
          'Insufficient detail on sustainability indicators'
        ],
        complianceScore: Math.random() * 15 + 85 // 85-100% compliance
      };
      
      setClassificationResult(mockResult);
      addMessage('agent', `Classification complete: ${mockResult.classification} with ${mockResult.confidence.toFixed(1)}% confidence.`);
    } catch (error) {
      addMessage('system', 'Classification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Export analysis results
   */
  const handleExport = (format: 'pdf' | 'excel' | 'json') => {
    const exportData = {
      classification: classificationResult,
      documents: uploadedDocuments,
      chatHistory: messages,
      timestamp: new Date().toISOString()
    };
    
    // Simulate export
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sfdr-analysis-${Date.now()}.${format === 'json' ? 'json' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addMessage('system', `Analysis exported as ${format.toUpperCase()} file.`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SFDR Gem
          </h1>
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-4 w-4 mr-1" />
            MVP
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your intelligent SFDR compliance assistant with advanced AI-powered analysis, 
          contextual memory, and seamless export capabilities.
        </p>
      </motion.div>

      {/* Main Interface */}
      <Card className="border-2">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>AI Chat</span>
              </TabsTrigger>
              <TabsTrigger value="classify" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Classify</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <TabsContent value="chat" className="space-y-4">
            {/* Chat Interface */}
            <ScrollArea className="h-96 w-full border rounded-lg p-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : message.type === 'agent'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-yellow-100 text-yellow-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            {/* Chat Input */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about SFDR compliance, regulations, or upload documents..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                Send
              </Button>
            </div>
            
            {/* Contextual Memory Display */}
            {contextualMemory.length > 0 && (
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>Context:</strong> {contextualMemory.slice(-2).join(' → ')}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="classify" className="space-y-4">
            {/* Classification Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Input
                  placeholder="Fund Name"
                  value={formData.fundName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fundName: e.target.value }))}
                />
                <Input
                  placeholder="Fund Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <Input
                  placeholder="Investment Strategy"
                  value={formData.investmentStrategy}
                  onChange={(e) => setFormData(prev => ({ ...prev, investmentStrategy: e.target.value }))}
                />
                <Input
                  placeholder="ESG Integration Approach"
                  value={formData.esgIntegration}
                  onChange={(e) => setFormData(prev => ({ ...prev, esgIntegration: e.target.value }))}
                />
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Sustainability Objectives (optional)"
                  value={formData.sustainabilityObjectives}
                  onChange={(e) => setFormData(prev => ({ ...prev, sustainabilityObjectives: e.target.value }))}
                />
                <Input
                  placeholder="Principal Adverse Impacts Consideration"
                  value={formData.principalAdverseImpacts}
                  onChange={(e) => setFormData(prev => ({ ...prev, principalAdverseImpacts: e.target.value }))}
                />
                <Input
                  placeholder="Taxonomy Alignment"
                  value={formData.taxonomyAlignment}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxonomyAlignment: e.target.value }))}
                />
                <Button onClick={handleClassification} disabled={isLoading} className="w-full">
                  {isLoading ? 'Classifying...' : 'Classify Fund'}
                </Button>
              </div>
            </div>
            
            {/* Classification Results */}
            {classificationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 mt-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Classification Result</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Classification:</span>
                      <Badge variant={classificationResult.classification === 'Article 9' ? 'default' : 'secondary'}>
                        {classificationResult.classification}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Confidence:</span>
                        <span>{classificationResult.confidence.toFixed(1)}%</span>
                      </div>
                      <Progress value={classificationResult.confidence} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Compliance Score:</span>
                        <span>{classificationResult.complianceScore.toFixed(1)}%</span>
                      </div>
                      <Progress value={classificationResult.complianceScore} className="w-full" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Reasoning:</h4>
                      <p className="text-sm text-muted-foreground">{classificationResult.reasoning}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Recommendations:
                      </h4>
                      <ul className="text-sm space-y-1">
                        {classificationResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {classificationResult.issues.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                          Issues to Address:
                        </h4>
                        <ul className="text-sm space-y-1">
                          {classificationResult.issues.map((issue, index) => (
                            <li key={index} className="flex items-start">
                              <AlertTriangle className="h-3 w-3 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            {/* Document Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
              <p className="text-muted-foreground mb-4">
                Upload fund documents, prospectuses, or ESG reports for AI analysis
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleDocumentUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Choose Files'}
              </Button>
            </div>
            
            {/* Uploaded Documents */}
            {uploadedDocuments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Analyzed Documents</h3>
                {uploadedDocuments.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">{doc.fileName}</span>
                          </div>
                          <Badge variant="outline">
                            {doc.sfdrRelevance.toFixed(1)}% SFDR Relevant
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{doc.summary}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {doc.entities.map((entity, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {entity}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Sentiment: {doc.sentiment}</span>
                          <span>{doc.topics.length} topics identified</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            {/* Export Options */}
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Export Analysis</h3>
                <p className="text-muted-foreground">
                  Export your SFDR analysis results in various formats
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport('pdf')}>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">PDF Report</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive analysis report with charts and recommendations
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport('excel')}>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Excel Workbook</h4>
                    <p className="text-sm text-muted-foreground">
                      Structured data with analysis metrics and compliance scores
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport('json')}>
                  <CardContent className="p-6 text-center">
                    <Download className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">JSON Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Raw data for integration with other systems and APIs
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {(classificationResult || uploadedDocuments.length > 0) && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Ready to export: {classificationResult ? '1 classification' : '0 classifications'}, 
                    {uploadedDocuments.length} document{uploadedDocuments.length !== 1 ? 's' : ''}, 
                    {messages.length} chat messages
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default SFDRGem;