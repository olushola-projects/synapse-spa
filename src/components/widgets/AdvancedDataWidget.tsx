import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { EnhancedWidget } from './EnhancedWidget';
import { WidgetState } from './WidgetStates';
import {
  BarChart3,
  LineChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Download,
  Share,
  MoreHorizontal,
  Maximize2,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';

type ChartType = 'bar' | 'line' | 'pie' | 'table';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: string;
}

interface AdvancedDataWidgetProps {
  title: string;
  description?: string;
  data: DataPoint[];
  defaultChartType?: ChartType;
  showControls?: boolean;
  showLegend?: boolean;
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => Promise<void>;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
  height?: string;
  maxItems?: number;
  emptyMessage?: string;
}

export const AdvancedDataWidget: React.FC<AdvancedDataWidgetProps> = ({
  title,
  description,
  data = [],
  defaultChartType = 'bar',
  showControls = true,
  showLegend = true,
  isLoading = false,
  error,
  onRefresh,
  onDownload,
  onShare,
  className = '',
  height = 'h-80',
  maxItems = 8,
  emptyMessage
}) => {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [widgetState, setWidgetState] = useState<WidgetState>(isLoading ? 'loading' : error ? 'error' : data.length === 0 ? 'empty' : 'idle');

  // Update widget state when props change
  React.useEffect(() => {
    if (isLoading) {
      setWidgetState('loading');
    } else if (error) {
      setWidgetState('error');
    } else if (data.length === 0) {
      setWidgetState('empty');
    } else {
      setWidgetState('idle');
    }
  }, [isLoading, error, data]);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setWidgetState('loading');
    try {
      await onRefresh();
      setWidgetState(data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      setWidgetState('error');
    }
  };

  // Limit data to maxItems
  const limitedData = data.slice(0, maxItems);

  // Calculate max value for scaling
  const maxValue = Math.max(...limitedData.map(d => d.value), 0);

  const renderChartContent = () => {
    if (chartType === 'bar') {
      return (
        <div className={`flex items-end justify-between gap-2 ${height}`}>
          {limitedData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group"
                style={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: '4px',
                  backgroundColor: item.color || undefined
                }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none">
                  {item.value}
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2 truncate w-full text-center">{item.label}</div>
              {item.trend && (
                <div className="flex items-center text-xs mt-1">
                  {item.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                  {item.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                  {item.trend === 'stable' && <ArrowRight className="h-3 w-3 text-gray-400" />}
                  {item.change && <span className={`ml-1 ${item.trend === 'up' ? 'text-green-500' : item.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>{item.change}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (chartType === 'line') {
      // Simple SVG line chart
      const chartHeight = 200;
      const chartWidth = 100 * limitedData.length;
      
      // Calculate points for the line
      const points = limitedData.map((item, index) => {
        const x = (index / (limitedData.length - 1)) * chartWidth;
        const y = chartHeight - ((item.value / maxValue) * chartHeight);
        return `${x},${y}`;
      }).join(' ');

      return (
        <div className={`${height} flex items-center justify-center overflow-x-auto`}>
          <svg width={chartWidth} height={chartHeight} className="overflow-visible">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((line, i) => (
              <line 
                key={i}
                x1="0"
                y1={chartHeight * (1 - line)}
                x2={chartWidth}
                y2={chartHeight * (1 - line)}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={points}
            />
            
            {/* Data points */}
            {limitedData.map((item, index) => {
              const x = (index / (limitedData.length - 1)) * chartWidth;
              const y = chartHeight - ((item.value / maxValue) * chartHeight);
              return (
                <g key={index}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="4" 
                    fill="white" 
                    stroke="#3b82f6" 
                    strokeWidth="2"
                    className="hover:r-5 transition-all"
                  />
                  <text 
                    x={x} 
                    y={chartHeight + 20} 
                    textAnchor="middle" 
                    fontSize="12" 
                    fill="#6b7280"
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    if (chartType === 'pie') {
      // Calculate total for percentages
      const total = limitedData.reduce((sum, item) => sum + item.value, 0);
      
      // Calculate segments
      let cumulativePercent = 0;
      const segments = limitedData.map((item, index) => {
        const percent = (item.value / total) * 100;
        const startPercent = cumulativePercent;
        cumulativePercent += percent;
        
        return {
          ...item,
          percent,
          startPercent,
          endPercent: cumulativePercent,
          color: item.color || `hsl(${index * 40}, 70%, 60%)`
        };
      });

      return (
        <div className={`${height} flex flex-col items-center justify-center`}>
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {segments.map((segment, index) => {
                // Convert percentages to coordinates on a circle
                const startAngle = (segment.startPercent / 100) * 360;
                const endAngle = (segment.endPercent / 100) * 360;
                
                // Calculate the two points on the circle
                const startX = 50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
                const startY = 50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
                const endX = 50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
                const endY = 50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));
                
                // Create the arc path
                const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
                const pathData = [
                  `M 50 50`,
                  `L ${startX} ${startY}`,
                  `A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                  `Z`
                ].join(' ');
                
                return (
                  <path 
                    key={index} 
                    d={pathData} 
                    fill={segment.color}
                    stroke="white"
                    strokeWidth="1"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                );
              })}
            </svg>
          </div>
          
          {showLegend && (
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
              {segments.map((segment, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-xs text-gray-700 truncate">{segment.label}</span>
                  <span className="text-xs text-gray-500">{segment.percent.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (chartType === 'table') {
      return (
        <div className={`${height} overflow-auto`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Label
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                {limitedData.some(d => d.trend) && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {limitedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {item.value}
                  </td>
                  {limitedData.some(d => d.trend) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.trend && (
                        <div className="flex items-center">
                          {item.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                          {item.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-500" />}
                          {item.trend === 'stable' && <ArrowRight className="h-4 w-4 text-gray-400" />}
                          {item.change && <span className={`ml-1 ${item.trend === 'up' ? 'text-green-500' : item.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>{item.change}</span>}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };

  return (
    <EnhancedWidget
      title={title}
      initialState={widgetState}
      onDataRefresh={onRefresh ? handleRefresh : undefined}
      emptyMessage={emptyMessage || `No data available for ${title}`}
      className={className}
    >
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}

      {showControls && (
        <div className="flex items-center justify-between mb-4">
          <Tabs defaultValue={chartType} onValueChange={(value) => setChartType(value as ChartType)} className="w-auto">
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="bar" className="text-xs px-2 py-1">
                <BarChart3 className="h-3 w-3 mr-1" />
                Bar
              </TabsTrigger>
              <TabsTrigger value="line" className="text-xs px-2 py-1">
                <LineChart className="h-3 w-3 mr-1" />
                Line
              </TabsTrigger>
              <TabsTrigger value="pie" className="text-xs px-2 py-1">
                <PieChart className="h-3 w-3 mr-1" />
                Pie
              </TabsTrigger>
              <TabsTrigger value="table" className="text-xs px-2 py-1">
                <Filter className="h-3 w-3 mr-1" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1">
            {onRefresh && (
              <Button variant="ghost" size="sm" onClick={handleRefresh} className="h-7 w-7 p-0">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDownload && (
              <Button variant="ghost" size="sm" onClick={onDownload} className="h-7 w-7 p-0">
                <Download className="h-3.5 w-3.5" />
              </Button>
            )}
            {onShare && (
              <Button variant="ghost" size="sm" onClick={onShare} className="h-7 w-7 p-0">
                <Share className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <TabsContent value={chartType} className="mt-0">
        {renderChartContent()}
      </TabsContent>
    </EnhancedWidget>
  );
};