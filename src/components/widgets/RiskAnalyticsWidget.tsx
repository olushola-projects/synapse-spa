import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { dataPipelineService } from '@/services/DataPipelineService';
import { enhancedLLMService } from '@/services/EnhancedLLMService';
import type { DataEvent } from '@/services/DataPipelineService';

interface RiskMetric {
  id: string;
  name: string;
  category: 'operational' | 'compliance' | 'financial' | 'reputational' | 'strategic';
  currentScore: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  threshold: {
    low: number;
    medium: number;
    high: number;
  };
  lastUpdated: Date;
  description: string;
  mitigation?: string[];
}

interface RiskForecast {
  metric: string;
  timeframe: '1w' | '1m' | '3m' | '6m';
  predictedScore: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

interface ComplianceGap {
  regulation: string;
  requirement: string;
  currentCompliance: number;
  targetCompliance: number;
  deadline: Date;
  priority: 'critical' | 'high' | 'medium' | 'low';
  actions: string[];
}

const RiskAnalyticsWidget: React.FC = () => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [forecasts, setForecasts] = useState<RiskForecast[]>([]);
  const [complianceGaps, setComplianceGaps] = useState<ComplianceGap[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1w' | '1m' | '3m' | '6m'>('1m');
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [selectedMetric, setSelectedMetric] = useState<RiskMetric | null>(null);

  useEffect(() => {
    initializeRiskAnalytics();
    
    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      refreshRiskAnalytics();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const initializeRiskAnalytics = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        generateRiskMetrics(),
        generateForecasts(),
        generateComplianceGaps()
      ]);
    } catch (error) {
      console.error('Failed to initialize risk analytics:', error);
    } finally {
      setIsLoading(false);
      setLastRefresh(new Date());
    }
  };

  const refreshRiskAnalytics = async () => {
    try {
      await Promise.all([
        generateRiskMetrics(),
        generateForecasts(),
        generateComplianceGaps()
      ]);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh risk analytics:', error);
    }
  };

  const generateRiskMetrics = async () => {
    try {
      // Get recent events for risk analysis
      const recentEvents = dataPipelineService.getRecentEvents(200);
      
      // Use LLM to analyze risk patterns
      const riskAnalysis = await enhancedLLMService.generateCompletion({
        model: 'google:gemini-2.0-flash-exp',
        messages: [{
          role: 'user',
          content: `Analyze the following regulatory and compliance events to generate risk metrics:

${JSON.stringify(recentEvents.slice(0, 50), null, 2)}

Generate risk scores (0-100) for these categories:
- Operational Risk
- Compliance Risk
- Financial Risk
- Reputational Risk
- Strategic Risk

For each metric, provide:
- Current score
- Previous score (simulated)
- Trend direction
- Risk thresholds
- Description
- Mitigation strategies

Return as JSON array of risk metrics.`
        }],
        temperature: 0.3
      });

      // Parse LLM response and create risk metrics
      const mockMetrics: RiskMetric[] = [
        {
          id: 'operational-risk',
          name: 'Operational Risk',
          category: 'operational',
          currentScore: 65,
          previousScore: 58,
          trend: 'up',
          threshold: { low: 30, medium: 60, high: 80 },
          lastUpdated: new Date(),
          description: 'Risk from inadequate or failed internal processes, people, and systems',
          mitigation: ['Process automation', 'Staff training', 'System redundancy']
        },
        {
          id: 'compliance-risk',
          name: 'Compliance Risk',
          category: 'compliance',
          currentScore: 42,
          previousScore: 48,
          trend: 'down',
          threshold: { low: 25, medium: 50, high: 75 },
          lastUpdated: new Date(),
          description: 'Risk of legal or regulatory sanctions, material financial loss, or reputation damage',
          mitigation: ['Regular compliance audits', 'Policy updates', 'Training programs']
        },
        {
          id: 'financial-risk',
          name: 'Financial Risk',
          category: 'financial',
          currentScore: 38,
          previousScore: 38,
          trend: 'stable',
          threshold: { low: 20, medium: 45, high: 70 },
          lastUpdated: new Date(),
          description: 'Risk of financial loss due to market movements, credit events, or liquidity issues',
          mitigation: ['Diversification', 'Hedging strategies', 'Stress testing']
        },
        {
          id: 'reputational-risk',
          name: 'Reputational Risk',
          category: 'reputational',
          currentScore: 28,
          previousScore: 32,
          trend: 'down',
          threshold: { low: 15, medium: 35, high: 60 },
          lastUpdated: new Date(),
          description: 'Risk of damage to reputation that could impact business relationships',
          mitigation: ['Crisis communication plan', 'Stakeholder engagement', 'ESG initiatives']
        },
        {
          id: 'strategic-risk',
          name: 'Strategic Risk',
          category: 'strategic',
          currentScore: 55,
          previousScore: 51,
          trend: 'up',
          threshold: { low: 25, medium: 50, high: 75 },
          lastUpdated: new Date(),
          description: 'Risk from adverse business decisions, improper implementation of decisions',
          mitigation: ['Strategic planning', 'Market analysis', 'Scenario planning']
        }
      ];

      setRiskMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to generate risk metrics:', error);
    }
  };

  const generateForecasts = async () => {
    try {
      const mockForecasts: RiskForecast[] = [
        {
          metric: 'Compliance Risk',
          timeframe: selectedTimeframe,
          predictedScore: 35,
          confidence: 78,
          factors: ['New GDPR updates', 'Increased regulatory scrutiny', 'Process improvements'],
          recommendations: ['Implement automated compliance monitoring', 'Update privacy policies']
        },
        {
          metric: 'Operational Risk',
          timeframe: selectedTimeframe,
          predictedScore: 72,
          confidence: 65,
          factors: ['System upgrades pending', 'Staff turnover', 'Process automation'],
          recommendations: ['Accelerate automation projects', 'Enhance backup systems']
        }
      ];

      setForecasts(mockForecasts);
    } catch (error) {
      console.error('Failed to generate forecasts:', error);
    }
  };

  const generateComplianceGaps = async () => {
    try {
      const mockGaps: ComplianceGap[] = [
        {
          regulation: 'GDPR',
          requirement: 'Data Subject Rights Implementation',
          currentCompliance: 75,
          targetCompliance: 95,
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          priority: 'high',
          actions: ['Implement automated data deletion', 'Update consent management']
        },
        {
          regulation: 'SFDR',
          requirement: 'ESG Data Disclosure',
          currentCompliance: 60,
          targetCompliance: 90,
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          priority: 'medium',
          actions: ['Enhance ESG data collection', 'Implement disclosure templates']
        }
      ];

      setComplianceGaps(mockGaps);
    } catch (error) {
      console.error('Failed to generate compliance gaps:', error);
    }
  };

  const getRiskLevel = (score: number, thresholds: { low: number; medium: number; high: number }) => {
    if (score >= thresholds.high) return { level: 'High', color: 'bg-red-500' };
    if (score >= thresholds.medium) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-green-500' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredMetrics = selectedCategory === 'all' 
    ? riskMetrics 
    : riskMetrics.filter(metric => metric.category === selectedCategory);

  const overallRiskScore = riskMetrics.length > 0 
    ? Math.round(riskMetrics.reduce((sum, metric) => sum + metric.currentScore, 0) / riskMetrics.length)
    : 0;

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Risk Analytics
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Risk Analytics
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshRiskAnalytics}
              className="h-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Risk Score */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Overall Risk Score</h3>
            <Badge className={getRiskLevel(overallRiskScore, { low: 30, medium: 60, high: 80 }).color}>
              {getRiskLevel(overallRiskScore, { low: 30, medium: 60, high: 80 }).level}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-gray-800">{overallRiskScore}</div>
            <div className="flex-1">
              <Progress value={overallRiskScore} className="h-3" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="all">All Categories</option>
            <option value="operational">Operational</option>
            <option value="compliance">Compliance</option>
            <option value="financial">Financial</option>
            <option value="reputational">Reputational</option>
            <option value="strategic">Strategic</option>
          </select>
          
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="1w">1 Week</option>
            <option value="1m">1 Month</option>
            <option value="3m">3 Months</option>
            <option value="6m">6 Months</option>
          </select>
        </div>

        {/* Risk Metrics */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Risk Metrics
          </h4>
          {filteredMetrics.map((metric) => {
            const riskLevel = getRiskLevel(metric.currentScore, metric.threshold);
            return (
              <div
                key={metric.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedMetric(metric)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.name}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <Badge className={riskLevel.color}>
                    {riskLevel.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">{metric.currentScore}</div>
                  <div className="flex-1">
                    <Progress value={metric.currentScore} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-500">
                    {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                    {Math.abs(metric.currentScore - metric.previousScore)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Risk Forecasts */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Risk Forecasts ({selectedTimeframe})
          </h4>
          {forecasts.map((forecast, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{forecast.metric}</span>
                <Badge variant="outline">
                  {forecast.confidence}% confidence
                </Badge>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="text-lg font-semibold">
                  Predicted: {forecast.predictedScore}
                </div>
                <Progress value={forecast.predictedScore} className="flex-1 h-2" />
              </div>
              <div className="text-sm text-gray-600">
                <strong>Key Factors:</strong> {forecast.factors.join(', ')}
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Gaps */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance Gaps
          </h4>
          {complianceGaps.map((gap, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium">{gap.regulation}</span>
                  <p className="text-sm text-gray-600">{gap.requirement}</p>
                </div>
                <Badge className={getPriorityColor(gap.priority)}>
                  {gap.priority}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Current: {gap.currentCompliance}%</span>
                  <span>Target: {gap.targetCompliance}%</span>
                </div>
                <Progress value={gap.currentCompliance} className="h-2" />
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: {gap.deadline.toLocaleDateString()}
                  </span>
                  <span>Gap: {gap.targetCompliance - gap.currentCompliance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Metric Detail Modal */}
        {selectedMetric && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedMetric.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMetric(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold">{selectedMetric.currentScore}</div>
                  <div className="flex-1">
                    <Progress value={selectedMetric.currentScore} className="h-4" />
                  </div>
                  <Badge className={getRiskLevel(selectedMetric.currentScore, selectedMetric.threshold).color}>
                    {getRiskLevel(selectedMetric.currentScore, selectedMetric.threshold).level} Risk
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700">{selectedMetric.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Current Score</h4>
                    <p className="text-2xl font-bold">{selectedMetric.currentScore}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Previous Score</h4>
                    <p className="text-2xl font-bold text-gray-600">{selectedMetric.previousScore}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Risk Thresholds</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Low Risk:</span>
                      <span>0 - {selectedMetric.threshold.low}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium Risk:</span>
                      <span>{selectedMetric.threshold.low + 1} - {selectedMetric.threshold.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Risk:</span>
                      <span>{selectedMetric.threshold.medium + 1} - 100</span>
                    </div>
                  </div>
                </div>
                
                {selectedMetric.mitigation && (
                  <div>
                    <h4 className="font-medium mb-2">Mitigation Strategies</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedMetric.mitigation.map((strategy, index) => (
                        <li key={index} className="text-gray-700">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Last updated: {selectedMetric.lastUpdated.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAnalyticsWidget;