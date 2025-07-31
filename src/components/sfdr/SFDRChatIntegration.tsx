import { useState, useEffect } from 'react';
import { useSFDRClassification } from '@/hooks/useSFDRClassification';
import { NexusClassificationRequest } from '@/services/nexusAgentClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, CheckCircle, AlertTriangle, History } from 'lucide-react';

interface SFDRChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  classification?: any;
}

const SFDRChatIntegration = () => {
  const [messages, setMessages] = useState<SFDRChatMessage[]>([]);
  const [input, setInput] = useState('');
  const { classify, loading, result, error } = useSFDRClassification();
  const [apiHealth, setApiHealth] = useState<'checking' | 'healthy' | 'error'>('checking');

  useEffect(() => {
    // Check API health on component mount
    checkApiHealth();
    
    // Add initial message when result is available
    if (result) {
      const assistantMessage: SFDRChatMessage = {
        id: Date.now().toString(),
        content: formatChatResponse(result),
        sender: 'assistant',
        timestamp: new Date(),
        classification: result
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
  }, [result]);

  const checkApiHealth = async () => {
    try {
      // For now, assume healthy - in production, implement proper health check
      setApiHealth('healthy');
    } catch (error) {
      setApiHealth('error');
      console.error('SFDR API health check failed:', error);
    }
  };

  const extractProductData = (userMessage: string): NexusClassificationRequest => {
    // Extract product information from user message
    // This is a simplified extraction - you can enhance with NLP
    const productData: NexusClassificationRequest = {
      productName: 'Unknown Product',
      productType: 'investment_fund',
      sustainabilityObjectives: [],
      investmentStrategy: 'ESG_focused',
      riskProfile: 'moderate'
    };

    // Simple keyword extraction
    if (userMessage.toLowerCase().includes('green bond')) {
      productData.productName = 'Green Bond Fund';
      productData.sustainabilityObjectives = ['climate_mitigation'];
    }
    
    if (userMessage.toLowerCase().includes('article 8')) {
      productData.targetArticle = 'Article 8';
    } else if (userMessage.toLowerCase().includes('article 9')) {
      productData.targetArticle = 'Article 9';
    }

    return productData;
  };

  const formatChatResponse = (classification: any): string => {
    return `Based on my SFDR analysis:

📊 **Classification**: ${classification.classification}
📈 **Compliance Score**: ${classification.complianceScore}%
⚠️ **Risk Level**: ${classification.riskLevel}

**Recommendations**:
${classification.recommendations?.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n') || 'No specific recommendations at this time.'}

*Analysis completed at ${classification.timestamp}*`;
  };

  const handleSFDRQuery = async (userMessage: string) => {
    try {
      const productData = extractProductData(userMessage);
      const classification = await classify(productData);
      return formatChatResponse(classification);
    } catch (error) {
      console.error('SFDR classification error:', error);
      return 'I apologize, but I encountered an issue with the SFDR analysis. Please try again or check if the service is available.';
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: SFDRChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      await handleSFDRQuery(input);
      
      // Note: Assistant message will be added via useEffect when result updates
    } catch (error) {
      const errorMessage: SFDRChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an issue with the SFDR analysis. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          SFDR Chat Integration
          <Badge variant={apiHealth === 'healthy' ? 'default' : 'destructive'}>
            {apiHealth === 'checking' && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
            {apiHealth === 'healthy' && <CheckCircle className="h-3 w-3 mr-1" />}
            {apiHealth === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {apiHealth === 'checking' ? 'Checking...' : apiHealth === 'healthy' ? 'Connected' : 'Disconnected'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div className="min-h-[400px] max-h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Start a conversation about SFDR compliance...</p>
              <p className="text-sm">Try asking about "Article 8 fund classification" or "Green bond compliance"</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {message.content}
                </pre>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Analyzing SFDR compliance...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about SFDR compliance, fund classification, or regulations..."
            disabled={loading || apiHealth === 'error'}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || loading || apiHealth === 'error'}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
          </Button>
        </div>

        {apiHealth === 'error' && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            ⚠️ SFDR API is currently unavailable. Please check your configuration or try again later.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SFDRChatIntegration;