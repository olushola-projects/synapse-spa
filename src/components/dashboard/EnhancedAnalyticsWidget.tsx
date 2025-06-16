import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Zap,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Users,
  FileText,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced types for analytics data
export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  trend?: "up" | "down" | "stable";
  target?: number;
  unit?: string;
  category: "compliance" | "risk" | "performance" | "efficiency";
  priority: "low" | "medium" | "high" | "critical";
  lastUpdated: string;
}

export interface TimeSeriesData {
  timestamp: string;
  date: string;
  value: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface ComplianceScore {
  framework: string;
  score: number;
  maxScore: number;
  status: "compliant" | "partial" | "non_compliant" | "pending";
  lastAssessment: string;
  requirements: {
    total: number;
    met: number;
    partial: number;
    failed: number;
  };
}

export interface RiskAssessment {
  category: string;
  level: "low" | "medium" | "high" | "critical";
  score: number;
  trend: "improving" | "stable" | "deteriorating";
  mitigationStatus: "none" | "planned" | "in_progress" | "completed";
  lastReview: string;
}

export interface AnalyticsData {
  metrics: AnalyticsMetric[];
  timeSeries: TimeSeriesData[];
  complianceScores: ComplianceScore[];
  riskAssessments: RiskAssessment[];
  summary: {
    totalCompliance: number;
    averageRisk: number;
    trendsImproving: number;
    criticalIssues: number;
  };
}

interface EnhancedAnalyticsWidgetProps {
  data?: AnalyticsData;
  className?: string;
  refreshInterval?: number;
  onRefresh?: () => void;
  onExport?: (format: "csv" | "pdf" | "json") => void;
}

// Color schemes for different chart types
const CHART_COLORS = {
  primary: ["#3b82f6", "#1d4ed8", "#1e40af", "#1e3a8a"],
  success: ["#10b981", "#059669", "#047857", "#065f46"],
  warning: ["#f59e0b", "#d97706", "#b45309", "#92400e"],
  danger: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b"],
  neutral: ["#6b7280", "#4b5563", "#374151", "#1f2937"],
  gradient: ["#8b5cf6", "#a855f7", "#c084fc", "#d8b4fe"],
};

const RISK_COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

const STATUS_COLORS = {
  compliant: "#10b981",
  partial: "#f59e0b",
  non_compliant: "#ef4444",
  pending: "#6b7280",
};

export const EnhancedAnalyticsWidget: React.FC<
  EnhancedAnalyticsWidgetProps
> = ({
  data,
  className,
  refreshInterval = 300000, // 5 minutes
  onRefresh,
  onExport,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [chartType, setChartType] = useState<"area" | "bar" | "line" | "pie">(
    "area"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh functionality
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await onRefresh?.();
      setLastRefresh(new Date());
    } finally {
      setIsLoading(false);
    }
  }, [onRefresh]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        handleRefresh();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, handleRefresh]);

  // Filter data based on selected criteria
  const filteredData = useMemo(() => {
    if (!data) return null;

    const now = new Date();
    const timeRangeMs =
      {
        "1d": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "90d": 90 * 24 * 60 * 60 * 1000,
      }[selectedTimeRange] || 7 * 24 * 60 * 60 * 1000;

    const cutoffDate = new Date(now.getTime() - timeRangeMs);

    return {
      ...data,
      timeSeries: data.timeSeries.filter((item) => {
        const itemDate = new Date(item.timestamp);
        const matchesTimeRange = itemDate >= cutoffDate;
        const matchesCategory =
          selectedCategory === "all" || item.category === selectedCategory;
        return matchesTimeRange && matchesCategory;
      }),
      metrics: data.metrics.filter(
        (metric) =>
          selectedCategory === "all" || metric.category === selectedCategory
      ),
    };
  }, [data, selectedTimeRange, selectedCategory]);

  const handleExport = (format: "csv" | "pdf" | "json") => {
    onExport?.(format);
  };

  // Calculate trend indicators
  const getTrendIcon = (trend?: string, change?: number) => {
    if (!trend && change === undefined) return null;

    if (trend === "up" || (change && change > 0)) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend === "down" || (change && change < 0)) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "non_compliant":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "partial":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatValue = (value: number, unit?: string) => {
    const formatted = value.toLocaleString();
    return unit ? `${formatted} ${unit}` : formatted;
  };

  const formatPercentage = (value: number, total: number) => {
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatValue(entry.value, entry.payload.unit)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                GRC Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Last updated: {lastRefresh.toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedTimeRange}
                onValueChange={setSelectedTimeRange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="risk">Risk</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="efficiency">Efficiency</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
                />
              </Button>

              <Select onValueChange={handleExport}>
                <SelectTrigger className="w-32">
                  <Download className="h-4 w-4" />
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">Export CSV</SelectItem>
                  <SelectItem value="pdf">Export PDF</SelectItem>
                  <SelectItem value="json">Export JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overall Compliance
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {data.summary.totalCompliance.toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                Target: 95%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Risk Level
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {data.summary.averageRisk.toFixed(1)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Scale: 1-10
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Improving Trends
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {data.summary.trendsImproving}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                This month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Critical Issues
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {data.summary.criticalIssues}
                </p>
              </div>
              <Zap className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2">
              <Badge variant="destructive" className="text-xs">
                Requires attention
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Compliance Trends</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={chartType === "area" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("area")}
                  >
                    Area
                  </Button>
                  <Button
                    variant={chartType === "line" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("line")}
                  >
                    Line
                  </Button>
                  <Button
                    variant={chartType === "bar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType("bar")}
                  >
                    Bar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "area" && (
                    <AreaChart data={filteredData?.timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={CHART_COLORS.primary[0]}
                        fill={CHART_COLORS.primary[0]}
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  )}
                  {chartType === "line" && (
                    <LineChart data={filteredData?.timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={CHART_COLORS.primary[0]}
                        strokeWidth={2}
                      />
                    </LineChart>
                  )}
                  {chartType === "bar" && (
                    <BarChart data={filteredData?.timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" fill={CHART_COLORS.primary[0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Scores by Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.complianceScores}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="framework" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="score" fill={CHART_COLORS.success[0]} />
                      <Bar
                        dataKey="maxScore"
                        fill={CHART_COLORS.neutral[0]}
                        opacity={0.3}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.complianceScores.map((score) => ({
                          name: score.framework,
                          value: score.score,
                          status: score.status,
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.complianceScores.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={STATUS_COLORS[entry.status]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Compliance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.complianceScores.map((score, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(score.status)}
                      <div>
                        <h4 className="font-medium">{score.framework}</h4>
                        <p className="text-sm text-gray-600">
                          Last assessment:{" "}
                          {new Date(score.lastAssessment).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {score.score}/{score.maxScore}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPercentage(score.score, score.maxScore)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <span className="text-green-600">
                          {score.requirements.met}
                        </span>{" "}
                        met,{" "}
                        <span className="text-yellow-600">
                          {score.requirements.partial}
                        </span>{" "}
                        partial,{" "}
                        <span className="text-red-600">
                          {score.requirements.failed}
                        </span>{" "}
                        failed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Assessment Tab */}
        <TabsContent value="risks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Levels by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data.riskAssessments}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={90} domain={[0, 10]} />
                      <Radar
                        name="Risk Score"
                        dataKey="score"
                        stroke={CHART_COLORS.warning[0]}
                        fill={CHART_COLORS.warning[0]}
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          data.riskAssessments.reduce(
                            (acc, risk) => {
                              acc[risk.level] = (acc[risk.level] || 0) + 1;
                              return acc;
                            },
                            {} as Record<string, number>
                          )
                        ).map(([level, count]) => ({
                          name: level,
                          value: count,
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.keys(RISK_COLORS).map((level, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              RISK_COLORS[level as keyof typeof RISK_COLORS]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Details */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.riskAssessments.map((risk, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: RISK_COLORS[risk.level] }}
                      />
                      <div>
                        <h4 className="font-medium">{risk.category}</h4>
                        <p className="text-sm text-gray-600">
                          Last review:{" "}
                          {new Date(risk.lastReview).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{risk.score}/10</p>
                      <Badge
                        variant={
                          risk.level === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {risk.level}
                      </Badge>
                    </div>
                    <div className="text-center">
                      {getTrendIcon(risk.trend)}
                      <p className="text-xs text-gray-600">{risk.trend}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {risk.mitigationStatus.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData?.metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center gap-3">
                        {getTrendIcon(metric.trend, metric.change)}
                        <div>
                          <h4 className="font-medium">{metric.name}</h4>
                          <p className="text-sm text-gray-600">
                            {metric.category} • {metric.priority} priority
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {formatValue(metric.value, metric.unit)}
                        </p>
                        {metric.change && (
                          <p
                            className={cn(
                              "text-sm",
                              metric.change > 0
                                ? "text-green-600"
                                : "text-red-600"
                            )}
                          >
                            {metric.change > 0 ? "+" : ""}
                            {metric.change.toFixed(1)}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Target vs Actual Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={filteredData?.metrics
                        .filter((m) => m.target)
                        .map((m) => ({
                          name: m.name.substring(0, 10) + "...",
                          actual: m.value,
                          target: m.target,
                          achievement: (m.value / (m.target || 1)) * 100,
                        }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="actual"
                        fill={CHART_COLORS.primary[0]}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="target"
                        fill={CHART_COLORS.neutral[0]}
                        opacity={0.5}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="achievement"
                        stroke={CHART_COLORS.success[0]}
                        strokeWidth={2}
                      />
                      <ReferenceLine
                        yAxisId="right"
                        y={100}
                        stroke="red"
                        strokeDasharray="5 5"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsWidget;
