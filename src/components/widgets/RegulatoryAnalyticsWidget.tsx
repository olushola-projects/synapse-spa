import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { WidgetStateWrapper } from '@/components/widgets/WidgetStates';
import { RegulatoryJurisdiction } from '@/types/regulatory';
import { useRegulatoryEvents } from '@/hooks/useRegulatoryEvents';

interface RegulatoryAnalyticsWidgetProps {
  title?: string;
  description?: string;
  className?: string;
}

export const RegulatoryAnalyticsWidget: React.FC<RegulatoryAnalyticsWidgetProps> = ({
  title = "Regulatory Analytics",
  description = "Analysis of regulatory events by different dimensions",
  className = "",
}) => {
  // State for active tab and selected jurisdiction
  const [activeTab, setActiveTab] = useState<string>('jurisdiction');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<RegulatoryJurisdiction | 'ALL'>('ALL');
  
  // Get regulatory events using the hook
  const {
    events,
    isLoading,
    error,
    fetchEvents,
    stats
  } = useRegulatoryEvents({
    filter: {},
    autoFetch: true,
    includeStats: true
  });
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  const PRIORITY_COLORS = {
    'CRITICAL': '#ef4444',
    'HIGH': '#f97316',
    'MEDIUM': '#eab308',
    'LOW': '#22c55e'
  };
  
  const STATUS_COLORS = {
    'PUBLISHED': '#3b82f6',
    'IN_PROGRESS': '#8b5cf6',
    'IMPLEMENTED': '#10b981',
    'DELAYED': '#f97316',
    'CANCELLED': '#6b7280'
  };
  
  // Prepare data for charts
  const getJurisdictionData = () => {
    if (!stats?.byJurisdiction) return [];
    
    return Object.entries(stats.byJurisdiction).map(([jurisdiction, count], index) => ({
      name: jurisdiction,
      value: count,
      color: COLORS[index % COLORS.length]
    }));
  };
  
  const getTypeData = () => {
    if (!stats?.byType) return [];
    
    return Object.entries(stats.byType)
      .filter(([_, count]) => count > 0)
      .map(([type, count], index) => ({
        name: type,
        value: count,
        color: COLORS[index % COLORS.length]
      }));
  };
  
  const getPriorityData = () => {
    if (!stats?.byPriority) return [];
    
    return Object.entries(stats.byPriority)
      .filter(([_, count]) => count > 0)
      .map(([priority, count]) => ({
        name: priority,
        value: count,
        color: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || COLORS[0]
      }));
  };
  
  const getStatusData = () => {
    if (!stats?.byStatus) return [];
    
    return Object.entries(stats.byStatus)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status,
        value: count,
        color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || COLORS[0]
      }));
  };
  
  const getTimelineData = () => {
    if (!stats?.byMonth) return [];
    
    return Object.entries(stats.byMonth)
      .sort(([monthA], [monthB]) => {
        const [yearA, monthNumA] = monthA.split('-').map(Number);
        const [yearB, monthNumB] = monthB.split('-').map(Number);
        return (yearA - yearB) || (monthNumA - monthNumB);
      })
      .map(([month, counts]) => {
        const [year, monthNum] = month.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const displayMonth = `${monthNames[parseInt(monthNum) - 1]} ${year}`;
        
        return {
          name: displayMonth,
          ...counts
        };
      });
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Determine widget state
  const widgetState = isLoading ? 'loading' : error ? 'error' : 
                     !stats ? 'empty' : 'idle';
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <WidgetStateWrapper 
        state={widgetState} 
        widgetName="Regulatory Analytics"
        onRetry={fetchEvents}
        emptyMessage="No regulatory data available for analysis"
      >
        <CardContent className="pt-3">
          <div className="flex justify-between items-center mb-4">
            <Tabs defaultValue="jurisdiction" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="jurisdiction">Jurisdiction</TabsTrigger>
                <TabsTrigger value="type">Type</TabsTrigger>
                <TabsTrigger value="priority">Priority</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {activeTab !== 'timeline' && (
              <Select 
                value={selectedJurisdiction} 
                onValueChange={(value) => setSelectedJurisdiction(value as RegulatoryJurisdiction | 'ALL')}
              >
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue placeholder="All Jurisdictions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Jurisdictions</SelectItem>
                  <SelectItem value="EU">European Union</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="SINGAPORE">Singapore</SelectItem>
                  <SelectItem value="AUSTRALIA">Australia</SelectItem>
                  <SelectItem value="UAE">UAE</SelectItem>
                  <SelectItem value="SAUDI_ARABIA">Saudi Arabia</SelectItem>
                  <SelectItem value="CHINA">China</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="h-[300px]">
            <TabsContent value="jurisdiction" className="m-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getJurisdictionData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getJurisdictionData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="type" className="m-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getTypeData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getTypeData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="priority" className="m-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getPriorityData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getPriorityData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="status" className="m-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="timeline" className="m-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getTimelineData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="PUBLISHED" stackId="a" fill="#3b82f6" name="Published" />
                  <Bar dataKey="IMPLEMENTED" stackId="a" fill="#10b981" name="Implemented" />
                  <Bar dataKey="IN_PROGRESS" stackId="a" fill="#8b5cf6" name="In Progress" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>
        </CardContent>
      </WidgetStateWrapper>
    </Card>
  );
};

export default RegulatoryAnalyticsWidget;