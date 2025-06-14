import React, { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  Metric,
  Flex,
  Badge,
  ProgressBar,
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
  Grid,
  Col,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Callout,
  Button,
  Select,
  SelectItem,
  DateRangePicker,
  DateRangePickerValue
} from '@tremor/react';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { agentOrchestrator } from '../../../services/agents/AgentOrchestrator';
import { llmService } from '../../../services/nlp/LLMService';
import { ragService } from '../../../services/rag/RAGService';

// Types for dashboard data
interface ComplianceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastUpdated: Date;
}

interface RiskAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  createdAt: Date;
  status: 'open' | 'investigating' | 'resolved';
}

interface ComplianceScore {
  overall: number;
  categories: {
    name: string;
    score: number;
    weight: number;
  }[];
}

const ComplianceMetricsDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<DateRangePickerValue>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all');
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetric[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [complianceScore, setComplianceScore] = useState<ComplianceScore | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange, selectedJurisdiction]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate loading compliance data
      await Promise.all([
        loadComplianceMetrics(),
        loadRiskAlerts(),
        loadComplianceScore(),
        loadTrendData()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComplianceMetrics = async () => {
    // In production, this would fetch from your API
    const metrics: ComplianceMetric[] = [
      {
        id: 'sfdr-compliance',
        name: 'SFDR Compliance',
        value: 87,
        target: 95,
        trend: 'up',
        status: 'good',
        lastUpdated: new Date()
      },
      {
        id: 'aml-coverage',
        name: 'AML Coverage',
        value: 94,
        target: 98,
        trend: 'stable',
        status: 'good',
        lastUpdated: new Date()
      },
      {
        id: 'mifid-compliance',
        name: 'MiFID II Compliance',
        value: 78,
        target: 90,
        trend: 'down',
        status: 'warning',
        lastUpdated: new Date()
      },
      {
        id: 'gdpr-compliance',
        name: 'GDPR Compliance',
        value: 96,
        target: 95,
        status: 'excellent',
        trend: 'up',
        lastUpdated: new Date()
      }
    ];
    setComplianceMetrics(metrics);
  };

  const loadRiskAlerts = async () => {
    const alerts: RiskAlert[] = [
      {
        id: '1',
        title: 'High-Risk Transaction Detected',
        description: 'Transaction exceeding $50,000 from high-risk jurisdiction',
        severity: 'high',
        category: 'AML',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'investigating'
      },
      {
        id: '2',
        title: 'SFDR Disclosure Gap',
        description: 'Missing sustainability indicators for Q3 reporting',
        severity: 'medium',
        category: 'SFDR',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'open'
      },
      {
        id: '3',
        title: 'Data Retention Policy Violation',
        description: 'Customer data retained beyond GDPR requirements',
        severity: 'critical',
        category: 'GDPR',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: 'open'
      }
    ];
    setRiskAlerts(alerts);
  };

  const loadComplianceScore = async () => {
    const score: ComplianceScore = {
      overall: 89,
      categories: [
        { name: 'SFDR', score: 87, weight: 0.25 },
        { name: 'AML/CTF', score: 94, weight: 0.30 },
        { name: 'MiFID II', score: 78, weight: 0.20 },
        { name: 'GDPR', score: 96, weight: 0.15 },
        { name: 'Other', score: 85, weight: 0.10 }
      ]
    };
    setComplianceScore(score);
  };

  const loadTrendData = async () => {
    // Generate sample trend data
    const data = [];
    const startDate = new Date(selectedTimeRange.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        'Overall Compliance': 85 + Math.random() * 10,
        'Risk Score': 20 + Math.random() * 15,
        'SFDR': 80 + Math.random() * 15,
        'AML': 90 + Math.random() * 8,
        'MiFID II': 75 + Math.random() * 20
      });
    }
    
    setTrendData(data);
  };

  const getStatusColor = (status: ComplianceMetric['status']) => {
    switch (status) {
      case 'excellent': return 'emerald';
      case 'good': return 'blue';
      case 'warning': return 'yellow';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const getSeverityColor = (severity: RiskAlert['severity']) => {
    switch (severity) {
      case 'low': return 'blue';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const getTrendIcon = (trend: ComplianceMetric['trend']) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-500" />;
      case 'down': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Title>Compliance Metrics Dashboard</Title>
          <Text>Real-time compliance monitoring and risk assessment</Text>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
            <SelectItem value="all">All Jurisdictions</SelectItem>
            <SelectItem value="eu">European Union</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="us">United States</SelectItem>
          </Select>
          
          <DateRangePicker
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4">
        {complianceMetrics.map((metric) => (
          <Card key={metric.id} className="p-4">
            <Flex alignItems="start">
              <div className="flex-1">
                <Text className="text-sm font-medium text-gray-600">
                  {metric.name}
                </Text>
                <Metric className="mt-1">{metric.value}%</Metric>
                <Flex className="mt-2" alignItems="center" justifyContent="start">
                  {getTrendIcon(metric.trend)}
                  <Text className="ml-1 text-sm">vs {metric.target}% target</Text>
                </Flex>
              </div>
              <Badge color={getStatusColor(metric.status)} size="sm">
                {metric.status}
              </Badge>
            </Flex>
            <ProgressBar 
              value={metric.value} 
              color={getStatusColor(metric.status)}
              className="mt-3"
            />
          </Card>
        ))}
      </Grid>

      {/* Main Content Tabs */}
      <TabGroup>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Risk Alerts</Tab>
          <Tab>Trends</Tab>
          <Tab>Compliance Score</Tab>
        </TabList>
        
        <TabPanels>
          {/* Overview Tab */}
          <TabPanel>
            <Grid numItems={1} numItemsLg={2} className="gap-6 mt-6">
              <Card>
                <Title>Compliance Score Breakdown</Title>
                {complianceScore && (
                  <DonutChart
                    className="mt-4"
                    data={complianceScore.categories.map(cat => ({
                      name: cat.name,
                      value: cat.score
                    }))}
                    category="value"
                    index="name"
                    colors={['blue', 'emerald', 'yellow', 'orange', 'red']}
                    showLabel={true}
                  />
                )}
              </Card>
              
              <Card>
                <Title>Recent Activity</Title>
                <div className="mt-4 space-y-3">
                  {riskAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {alert.severity === 'critical' ? (
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                        ) : (
                          <ClockIcon className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Text className="font-medium">{alert.title}</Text>
                        <Text className="text-sm text-gray-600 mt-1">
                          {alert.description}
                        </Text>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge color={getSeverityColor(alert.severity)} size="xs">
                            {alert.severity}
                          </Badge>
                          <Text className="text-xs text-gray-500">
                            {alert.createdAt.toLocaleTimeString()}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Grid>
          </TabPanel>

          {/* Risk Alerts Tab */}
          <TabPanel>
            <div className="mt-6 space-y-4">
              {riskAlerts.map((alert) => (
                <Callout
                  key={alert.id}
                  title={alert.title}
                  icon={alert.severity === 'critical' ? ExclamationTriangleIcon : ClockIcon}
                  color={getSeverityColor(alert.severity)}
                >
                  <div className="mt-2">
                    <Text>{alert.description}</Text>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <Badge color={getSeverityColor(alert.severity)} size="sm">
                          {alert.severity}
                        </Badge>
                        <Text className="text-sm text-gray-600">
                          Category: {alert.category}
                        </Text>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="xs" variant="secondary">
                          Investigate
                        </Button>
                        <Button size="xs">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                </Callout>
              ))}
            </div>
          </TabPanel>

          {/* Trends Tab */}
          <TabPanel>
            <div className="mt-6 space-y-6">
              <Card>
                <Title>Compliance Trends</Title>
                <LineChart
                  className="mt-4 h-72"
                  data={trendData}
                  index="date"
                  categories={['Overall Compliance', 'SFDR', 'AML', 'MiFID II']}
                  colors={['blue', 'emerald', 'yellow', 'orange']}
                  yAxisWidth={48}
                  showLegend={true}
                />
              </Card>
              
              <Card>
                <Title>Risk Score Trends</Title>
                <AreaChart
                  className="mt-4 h-72"
                  data={trendData}
                  index="date"
                  categories={['Risk Score']}
                  colors={['red']}
                  yAxisWidth={48}
                  showLegend={false}
                />
              </Card>
            </div>
          </TabPanel>

          {/* Compliance Score Tab */}
          <TabPanel>
            <div className="mt-6">
              {complianceScore && (
                <Grid numItems={1} numItemsLg={2} className="gap-6">
                  <Card>
                    <Title>Overall Compliance Score</Title>
                    <Metric className="mt-4">{complianceScore.overall}%</Metric>
                    <ProgressBar 
                      value={complianceScore.overall} 
                      color="blue"
                      className="mt-4"
                    />
                    <Text className="mt-2 text-sm text-gray-600">
                      Weighted average across all compliance categories
                    </Text>
                  </Card>
                  
                  <Card>
                    <Title>Category Breakdown</Title>
                    <BarChart
                      className="mt-4 h-64"
                      data={complianceScore.categories.map(cat => ({
                        name: cat.name,
                        Score: cat.score,
                        Weight: cat.weight * 100
                      }))}
                      index="name"
                      categories={['Score']}
                      colors={['blue']}
                      yAxisWidth={48}
                    />
                  </Card>
                </Grid>
              )}
              
              <Card className="mt-6">
                <Title>Detailed Category Analysis</Title>
                <div className="mt-4 space-y-4">
                  {complianceScore?.categories.map((category) => (
                    <div key={category.name} className="p-4 border rounded-lg">
                      <Flex>
                        <div className="flex-1">
                          <Text className="font-medium">{category.name}</Text>
                          <Text className="text-sm text-gray-600 mt-1">
                            Weight: {(category.weight * 100).toFixed(0)}%
                          </Text>
                        </div>
                        <div className="text-right">
                          <Metric>{category.score}%</Metric>
                        </div>
                      </Flex>
                      <ProgressBar 
                        value={category.score} 
                        color={category.score >= 90 ? 'emerald' : category.score >= 80 ? 'blue' : category.score >= 70 ? 'yellow' : 'red'}
                        className="mt-3"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default ComplianceMetricsDashboard;