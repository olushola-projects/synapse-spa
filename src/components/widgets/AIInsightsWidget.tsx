import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  Target,
  Shield,
  BarChart3
} from 'lucide-react';
import { dataPipelineService } from '@/services/DataPipelineService';
import { EnhancedLLMService } from '@/services/EnhancedLLMService';
import type { DataEvent } from '@/services/DataPipelineService';

interface AIInsight {
  id: string;
  type: 'regulatory_trend' | 'compliance_risk' | 'market_impact' | 'esg_opportunity' | 'predictive_alert';
  title: string;
  description: string;
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations: string[];
  dataSource: string;
  timestamp: Date;
  metadata?: {
    affectedEntities?: string[];
    timeframe?: string;
    riskLevel?: number;
    impactScore?: number;
  };
}

interface PredictiveMetrics {
  complianceScore: number;
  riskTrend: 'increasing' | 'decreasing' | 'stable';
  nextReviewDate: Date;
  criticalAlerts: number;
  automationOpportunities: number;
}

const AIInsightsWidget: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictiveMetrics, setPredictiveMetrics] = useState<PredictiveMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [llmService] = useState(() => new EnhancedLLMService());

  useEffect(() => {
    initializeAIInsights();
    
    // Set up real-time event listener
    dataPipelineService.addEventListener('regulatory_update', handleRegulatoryUpdate);
    dataPipelineService.addEventListener('compliance_alert', handleComplianceAlert);
    
    // Refresh insights every 5 minutes
    const interval = setInterval(refreshInsights, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const initializeAIInsights = async () => {
    setIsLoading(true);
    try {
      // Get recent events from data pipeline
      const recentEvents = dataPipelineService.getRecentEvents(20);
      const pipelineMetrics = dataPipelineService.getPipelineMetrics();
      
      // Generate AI insights from recent data
      const generatedInsights = await generateInsightsFromEvents(recentEvents);
      const metrics = await generatePredictiveMetrics(recentEvents, pipelineMetrics);
      
      setInsights(generatedInsights);
      setPredictiveMetrics(metrics);
    } catch (error) {
      console.error('Failed to initialize AI insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsightsFromEvents = async (events: DataEvent[]): Promise<AIInsight[]> => {
    const insights: AIInsight[] = [];
    
    // Group events by type for analysis
    const eventGroups = events.reduce((acc, event) => {
      if (!acc[event.type]) acc[event.type] = [];
      acc[event.type].push(event);
      return acc;
    }, {} as Record<string, DataEvent[]>);

    // Analyze regulatory updates
    if (eventGroups.regulatory_update?.length > 0) {
      const regulatoryInsight = await analyzeRegulatoryTrends(eventGroups.regulatory_update);
      if (regulatoryInsight) insights.push(regulatoryInsight);
    }

    // Analyze compliance alerts
    if (eventGroups.compliance_alert?.length > 0) {
      const complianceInsight = await analyzeComplianceRisks(eventGroups.compliance_alert);
      if (complianceInsight) insights.push(complianceInsight);
    }

    // Analyze ESG data
    if (eventGroups.esg_data?.length > 0) {
      const esgInsight = await analyzeESGOpportunities(eventGroups.esg_data);
      if (esgInsight) insights.push(esgInsight);
    }

    // Generate predictive alerts
    const predictiveInsight = await generatePredictiveAlert(events);
    if (predictiveInsight) insights.push(predictiveInsight);

    return insights.slice(0, 6); // Limit to 6 insights
  };

  const analyzeRegulatoryTrends = async (events: DataEvent[]): Promise<AIInsight | null> => {
    const prompt = `
      Analyze the following regulatory updates and identify key trends:
      ${JSON.stringify(events.map(e => e.data), null, 2)}
      
      Provide insights on:
      1. Emerging regulatory themes
      2. Impact on compliance requirements
      3. Recommended actions
      
      Return a JSON object with: title, description, confidence (0-100), priority, recommendations array
    `;

    try {
      const response = await llmService.generateResponse({
        prompt,
        model: 'gemini-2.5-pro',
        purpose: 'regulatory_analysis'
      });

      const analysis = JSON.parse(response.content || '{}');
      
      return {
        id: `regulatory_trend_${Date.now()}`,
        type: 'regulatory_trend',
        title: analysis.title || 'Regulatory Trend Analysis',
        description: analysis.description || 'Analysis of recent regulatory developments',
        confidence: analysis.confidence || 75,
        priority: analysis.priority || 'medium',
        actionable: true,
        recommendations: analysis.recommendations || [],
        dataSource: 'regulatory_updates',
        timestamp: new Date(),
        metadata: {
          affectedEntities: events.map(e => e.data.entity || e.data.organization).filter(Boolean),
          timeframe: '30 days'
        }
      };
    } catch (error) {
      console.error('Failed to analyze regulatory trends:', error);
      return null;
    }
  };

  const analyzeComplianceRisks = async (events: DataEvent[]): Promise<AIInsight | null> => {
    const criticalEvents = events.filter(e => e.priority === 'critical' || e.priority === 'high');
    
    if (criticalEvents.length === 0) return null;

    const prompt = `
      Analyze these compliance alerts and assess risk levels:
      ${JSON.stringify(criticalEvents.map(e => e.data), null, 2)}
      
      Determine:
      1. Overall risk level (0-100)
      2. Most critical compliance gaps
      3. Immediate actions required
      4. Potential impact if unaddressed
      
      Return JSON with: title, description, confidence, priority, recommendations, riskLevel
    `;

    try {
      const response = await llmService.generateResponse({
        prompt,
        model: 'gemini-2.5-pro',
        purpose: 'risk_assessment'
      });

      const analysis = JSON.parse(response.content || '{}');
      
      return {
        id: `compliance_risk_${Date.now()}`,
        type: 'compliance_risk',
        title: analysis.title || 'Compliance Risk Assessment',
        description: analysis.description || 'Critical compliance risks identified',
        confidence: analysis.confidence || 85,
        priority: criticalEvents.length > 3 ? 'critical' : 'high',
        actionable: true,
        recommendations: analysis.recommendations || [],
        dataSource: 'compliance_alerts',
        timestamp: new Date(),
        metadata: {
          riskLevel: analysis.riskLevel || 70,
          affectedEntities: criticalEvents.map(e => e.data.entity).filter(Boolean)
        }
      };
    } catch (error) {
      console.error('Failed to analyze compliance risks:', error);
      return null;
    }
  };

  const analyzeESGOpportunities = async (events: DataEvent[]): Promise<AIInsight | null> => {
    const prompt = `
      Analyze ESG data for improvement opportunities:
      ${JSON.stringify(events.map(e => e.data), null, 2)}
      
      Identify:
      1. Areas for ESG performance improvement
      2. Emerging ESG trends
      3. Competitive advantages
      4. Regulatory alignment opportunities
      
      Return JSON with: title, description, confidence, priority, recommendations
    `;

    try {
      const response = await llmService.generateResponse({
        prompt,
        model: 'gemini-2.5-pro',
        purpose: 'esg_analysis'
      });

      const analysis = JSON.parse(response.content || '{}');
      
      return {
        id: `esg_opportunity_${Date.now()}`,
        type: 'esg_opportunity',
        title: analysis.title || 'ESG Improvement Opportunities',
        description: analysis.description || 'Identified ESG enhancement opportunities',
        confidence: analysis.confidence || 70,
        priority: analysis.priority || 'medium',
        actionable: true,
        recommendations: analysis.recommendations || [],
        dataSource: 'esg_data',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to analyze ESG opportunities:', error);
      return null;
    }
  };

  const generatePredictiveAlert = async (events: DataEvent[]): Promise<AIInsight | null> => {
    const recentPatterns = events.slice(-10);
    
    const prompt = `
      Based on these recent regulatory and compliance events, predict potential future issues:
      ${JSON.stringify(recentPatterns.map(e => ({ type: e.type, priority: e.priority, timestamp: e.timestamp })), null, 2)}
      
      Predict:
      1. Likely upcoming compliance challenges
      2. Regulatory changes that may affect operations
      3. Proactive measures to take
      
      Return JSON with: title, description, confidence, priority, recommendations, timeframe
    `;

    try {
      const response = await llmService.generateResponse({
        prompt,
        model: 'gemini-2.5-pro',
        purpose: 'predictive_analysis'
      });

      const analysis = JSON.parse(response.content || '{}');
      
      return {
        id: `predictive_alert_${Date.now()}`,
        type: 'predictive_alert',
        title: analysis.title || 'Predictive Compliance Alert',
        description: analysis.description || 'Potential future compliance considerations',
        confidence: analysis.confidence || 60,
        priority: analysis.priority || 'medium',
        actionable: true,
        recommendations: analysis.recommendations || [],
        dataSource: 'predictive_model',
        timestamp: new Date(),
        metadata: {
          timeframe: analysis.timeframe || '30-60 days'
        }
      };
    } catch (error) {
      console.error('Failed to generate predictive alert:', error);
      return null;
    }
  };

  const generatePredictiveMetrics = async (events: DataEvent[], pipelineMetrics: any): Promise<PredictiveMetrics> => {
    const criticalEvents = events.filter(e => e.priority === 'critical').length;
    const complianceEvents = events.filter(e => e.type === 'compliance_alert').length;
    
    // Calculate compliance score based on recent events and data quality
    const baseScore = 85;
    const eventPenalty = Math.min(criticalEvents * 5 + complianceEvents * 3, 30);
    const qualityBonus = Math.max(0, (pipelineMetrics.averageQualityScore - 80) / 4);
    
    const complianceScore = Math.max(0, Math.min(100, baseScore - eventPenalty + qualityBonus));
    
    // Determine risk trend
    const recentCritical = events.slice(-5).filter(e => e.priority === 'critical').length;
    const olderCritical = events.slice(-10, -5).filter(e => e.priority === 'critical').length;
    
    let riskTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recentCritical > olderCritical) riskTrend = 'increasing';
    else if (recentCritical < olderCritical) riskTrend = 'decreasing';
    
    return {
      complianceScore,
      riskTrend,
      nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      criticalAlerts: criticalEvents,
      automationOpportunities: Math.floor(Math.random() * 5) + 2 // Mock for now
    };
  };

  const handleRegulatoryUpdate = (event: DataEvent) => {
    // Real-time insight generation for new regulatory updates
    if (event.priority === 'critical' || event.priority === 'high') {
      refreshInsights();
    }
  };

  const handleComplianceAlert = (event: DataEvent) => {
    // Real-time insight generation for compliance alerts
    refreshInsights();
  };

  const refreshInsights = async () => {
    const recentEvents = dataPipelineService.getRecentEvents(20);
    const newInsights = await generateInsightsFromEvents(recentEvents);
    setInsights(newInsights);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'regulatory_trend': return <TrendingUp className="h-4 w-4" />;
      case 'compliance_risk': return <Shield className="h-4 w-4" />;
      case 'esg_opportunity': return <Target className="h-4 w-4" />;
      case 'predictive_alert': return <Zap className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Regulatory Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Regulatory Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Predictive Metrics */}
        {predictiveMetrics && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {predictiveMetrics.complianceScore}%
              </div>
              <div className="text-sm text-gray-600">Compliance Score</div>
              <Progress value={predictiveMetrics.complianceScore} className="mt-1" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className={`h-4 w-4 ${
                  predictiveMetrics.riskTrend === 'increasing' ? 'text-red-500' :
                  predictiveMetrics.riskTrend === 'decreasing' ? 'text-green-500' :
                  'text-gray-500'
                }`} />
                <span className="text-sm font-medium capitalize">
                  {predictiveMetrics.riskTrend}
                </span>
              </div>
              <div className="text-sm text-gray-600">Risk Trend</div>
            </div>
          </div>
        )}

        {/* Insights List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <div className="mt-1">
                    {getTypeIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getPriorityColor(insight.priority)} text-white`}
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {insight.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Confidence: {insight.confidence}%</span>
                      <span>{insight.dataSource}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-2">
                  {getPriorityIcon(insight.priority)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {insights.length === 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No AI insights available. Ensure data pipeline is active and processing regulatory data.
            </AlertDescription>
          </Alert>
        )}

        {/* Insight Detail Modal */}
        {selectedInsight && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {getTypeIcon(selectedInsight.type)}
                  {selectedInsight.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInsight(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge className={`${getPriorityColor(selectedInsight.priority)} text-white`}>
                    {selectedInsight.priority} Priority
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Confidence: {selectedInsight.confidence}%
                  </span>
                  <span className="text-sm text-gray-600">
                    Source: {selectedInsight.dataSource}
                  </span>
                </div>
                
                <p className="text-gray-700">{selectedInsight.description}</p>
                
                {selectedInsight.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {selectedInsight.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedInsight.metadata && (
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium mb-2">Additional Details:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {selectedInsight.metadata.timeframe && (
                        <div>Timeframe: {selectedInsight.metadata.timeframe}</div>
                      )}
                      {selectedInsight.metadata.riskLevel && (
                        <div>Risk Level: {selectedInsight.metadata.riskLevel}/100</div>
                      )}
                      {selectedInsight.metadata.affectedEntities && (
                        <div>Affected Entities: {selectedInsight.metadata.affectedEntities.join(', ')}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsWidget;