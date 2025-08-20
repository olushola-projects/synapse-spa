import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { useSFDRClassify, useHealthCheck } from '@/hooks/useSupabaseApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, CheckCircle, AlertTriangle, History } from 'lucide-react';
const SFDRChatIntegration = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { classify, loading, data: result } = useSFDRClassify();
  const { checkHealth } = useHealthCheck();
  const [apiHealth, setApiHealth] = useState('checking');
  useEffect(() => {
    // Check API health on component mount
    checkApiHealth();
    // Add initial message when result is available
    if (result) {
      const assistantMessage = {
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
      const healthStatus = await checkHealth();
      setApiHealth(healthStatus ? 'healthy' : 'error');
    } catch (error) {
      setApiHealth('error');
      console.error('SFDR API health check failed:', error);
    }
  };
  const extractProductData = userMessage => {
    // Extract product information from user message
    // This is a simplified extraction - you can enhance with NLP
    const productData = {
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
  const formatChatResponse = classification => {
    const sustainabilityScore = classification.sustainability_score
      ? `🌱 **Sustainability Score**: ${(classification.sustainability_score * 100).toFixed(1)}%\n`
      : '';
    const explainabilityScore = classification.explainability_score
      ? `🔍 **Explainability Score**: ${(classification.explainability_score * 100).toFixed(1)}%\n`
      : '';
    const regulatoryBasis =
      classification.regulatory_basis && classification.regulatory_basis.length > 0
        ? `\n⚖️ **Regulatory Basis**:\n${classification.regulatory_basis.map(citation => `• ${citation}`).join('\n')}\n`
        : '';
    const benchmarkInfo = classification.benchmark_comparison
      ? `\n📊 **Industry Benchmark**:\n• Baseline: ${(classification.benchmark_comparison.industry_baseline * 100).toFixed(1)}%\n• Performance vs Baseline: ${classification.benchmark_comparison.performance_vs_baseline > 0 ? '+' : ''}${(classification.benchmark_comparison.performance_vs_baseline * 100).toFixed(1)}%\n• Percentile Rank: ${classification.benchmark_comparison.percentile_rank}th\n`
      : '';
    const keyIndicators =
      classification.key_indicators && classification.key_indicators.length > 0
        ? `\n🎯 **Key ESG Indicators**: ${classification.key_indicators.join(', ')}\n`
        : '';
    const riskFactors =
      classification.risk_factors && classification.risk_factors.length > 0
        ? `\n⚠️ **Risk Factors**:\n${classification.risk_factors.map(risk => `• ${risk}`).join('\n')}\n`
        : '';
    const auditInfo = classification.audit_trail
      ? `\n🔒 **Audit Trail**: ID ${classification.audit_trail.classification_id?.slice(-8)} | Engine v${classification.audit_trail.engine_version}`
      : '';
    const processingTime = classification.processing_time
      ? ` | Processing: ${classification.processing_time.toFixed(3)}s`
      : '';
    return `Based on my enhanced SFDR analysis:

📊 **Classification**: ${classification.classification}
📈 **Confidence**: ${classification.confidence}%
${sustainabilityScore}${explainabilityScore}${regulatoryBasis}${benchmarkInfo}${keyIndicators}${riskFactors}
**Reasoning**: ${classification.reasoning}

**Recommendations**:
${classification.recommendations?.map((rec, index) => `${index + 1}. ${rec}`).join('\n') || 'No specific recommendations at this time.'}

${auditInfo}${processingTime}`;
  };
  const handleSFDRQuery = async userMessage => {
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
    if (!input.trim()) {
      return;
    }
    const userMessage = {
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
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content:
          'I apologize, but I encountered an issue with the SFDR analysis. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  return _jsxs(Card, {
    className: 'w-full max-w-4xl mx-auto',
    children: [
      _jsx(CardHeader, {
        children: _jsxs(CardTitle, {
          className: 'flex items-center gap-2',
          children: [
            _jsx(History, { className: 'h-5 w-5' }),
            'SFDR Chat Integration',
            _jsxs(Badge, {
              variant: apiHealth === 'healthy' ? 'default' : 'destructive',
              children: [
                apiHealth === 'checking' &&
                  _jsx(Loader2, { className: 'h-3 w-3 animate-spin mr-1' }),
                apiHealth === 'healthy' && _jsx(CheckCircle, { className: 'h-3 w-3 mr-1' }),
                apiHealth === 'error' && _jsx(AlertTriangle, { className: 'h-3 w-3 mr-1' }),
                apiHealth === 'checking'
                  ? 'Checking...'
                  : apiHealth === 'healthy'
                    ? 'Connected'
                    : 'Disconnected'
              ]
            })
          ]
        })
      }),
      _jsxs(CardContent, {
        className: 'space-y-4',
        children: [
          _jsxs('div', {
            className:
              'min-h-[400px] max-h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4',
            children: [
              messages.length === 0 &&
                _jsxs('div', {
                  className: 'text-center text-muted-foreground',
                  children: [
                    _jsx(MessageSquare, { className: 'h-12 w-12 mx-auto mb-2 opacity-50' }),
                    _jsx('p', { children: 'Start a conversation about SFDR compliance...' }),
                    _jsx('p', {
                      className: 'text-sm',
                      children:
                        'Try asking about "Article 8 fund classification" or "Green bond compliance"'
                    })
                  ]
                }),
              messages.map(message =>
                _jsx(
                  'div',
                  {
                    className: `flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`,
                    children: _jsxs('div', {
                      className: `max-w-[80%] rounded-lg p-3 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`,
                      children: [
                        _jsx('pre', {
                          className: 'whitespace-pre-wrap font-sans text-sm',
                          children: message.content
                        }),
                        _jsx('div', {
                          className: 'text-xs opacity-70 mt-1',
                          children: message.timestamp.toLocaleTimeString()
                        })
                      ]
                    })
                  },
                  message.id
                )
              ),
              loading &&
                _jsx('div', {
                  className: 'flex justify-start',
                  children: _jsxs('div', {
                    className: 'bg-muted rounded-lg p-3 flex items-center gap-2',
                    children: [
                      _jsx(Loader2, { className: 'h-4 w-4 animate-spin' }),
                      _jsx('span', {
                        className: 'text-sm',
                        children: 'Analyzing SFDR compliance...'
                      })
                    ]
                  })
                })
            ]
          }),
          _jsxs('div', {
            className: 'flex gap-2',
            children: [
              _jsx(Input, {
                value: input,
                onChange: e => setInput(e.target.value),
                onKeyPress: handleKeyPress,
                placeholder: 'Ask about SFDR compliance, fund classification, or regulations...',
                disabled: loading || apiHealth === 'error'
              }),
              _jsx(Button, {
                onClick: sendMessage,
                disabled: !input.trim() || loading || apiHealth === 'error',
                children: loading ? _jsx(Loader2, { className: 'h-4 w-4 animate-spin' }) : 'Send'
              })
            ]
          }),
          apiHealth === 'error' &&
            _jsx('div', {
              className: 'text-sm text-destructive bg-destructive/10 p-2 rounded',
              children:
                '\u26A0\uFE0F SFDR API is currently unavailable. Please check your configuration or try again later.'
            })
        ]
      })
    ]
  });
};
export default SFDRChatIntegration;
