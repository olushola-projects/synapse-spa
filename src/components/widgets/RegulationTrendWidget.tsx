import { useState } from 'react';
import { Widget } from '../dashboard/WidgetGrid';
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Sample data for the charts
const euData = [
  { name: 'Jan', updates: 24, compliance: 76, riskScore: 15 },
  { name: 'Feb', updates: 18, compliance: 73, riskScore: 12 },
  { name: 'Mar', updates: 29, compliance: 80, riskScore: 18 },
  { name: 'Apr', updates: 34, compliance: 85, riskScore: 22 },
  { name: 'May', updates: 39, compliance: 88, riskScore: 24 },
  { name: 'Jun', updates: 30, compliance: 82, riskScore: 19 },
  { name: 'Jul', updates: 37, compliance: 87, riskScore: 21 },
  { name: 'Aug', updates: 27, compliance: 79, riskScore: 14 }
];

const ukData = [
  { name: 'Jan', updates: 15, compliance: 68, riskScore: 12 },
  { name: 'Feb', updates: 22, compliance: 72, riskScore: 15 },
  { name: 'Mar', updates: 17, compliance: 70, riskScore: 14 },
  { name: 'Apr', updates: 25, compliance: 76, riskScore: 18 },
  { name: 'May', updates: 30, compliance: 81, riskScore: 20 },
  { name: 'Jun', updates: 22, compliance: 75, riskScore: 16 },
  { name: 'Jul', updates: 28, compliance: 79, riskScore: 19 },
  { name: 'Aug', updates: 19, compliance: 73, riskScore: 15 }
];

const usData = [
  { name: 'Jan', updates: 28, compliance: 74, riskScore: 18 },
  { name: 'Feb', updates: 32, compliance: 78, riskScore: 20 },
  { name: 'Mar', updates: 21, compliance: 72, riskScore: 16 },
  { name: 'Apr', updates: 29, compliance: 77, riskScore: 19 },
  { name: 'May', updates: 37, compliance: 83, riskScore: 23 },
  { name: 'Jun', updates: 40, compliance: 86, riskScore: 25 },
  { name: 'Jul', updates: 33, compliance: 79, riskScore: 21 },
  { name: 'Aug', updates: 35, compliance: 81, riskScore: 22 }
];

interface RegulationTrendWidgetProps {
  onRemove?: () => void;
}

const RegulationTrendWidget = ({ onRemove }: RegulationTrendWidgetProps) => {
  const [jurisdiction, setJurisdiction] = useState('eu');
  const [chartType, setChartType] = useState('line');

  const getDataByJurisdiction = () => {
    switch (jurisdiction) {
      case 'eu':
        return euData;
      case 'uk':
        return ukData;
      case 'us':
        return usData;
      default:
        return euData;
    }
  };

  const renderChart = () => {
    const data = getDataByJurisdiction();

    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
            <XAxis dataKey='name' tick={{ fill: '#6B7280' }} />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type='monotone'
              dataKey='updates'
              name='Regulatory Updates'
              stroke='#6E59A5'
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type='monotone'
              dataKey='compliance'
              name='Compliance Score'
              stroke='#F97316'
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
            <XAxis dataKey='name' tick={{ fill: '#6B7280' }} />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type='monotone'
              dataKey='updates'
              name='Regulatory Updates'
              fill='#9b87f5'
              stroke='#7E69AB'
              fillOpacity={0.6}
            />
            <Area
              type='monotone'
              dataKey='compliance'
              name='Compliance Score'
              fill='#33C3F0'
              stroke='#0EA5E9'
              fillOpacity={0.6}
            />
          </AreaChart>
        );
      case 'composed':
        return (
          <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
            <XAxis dataKey='name' tick={{ fill: '#6B7280' }} />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey='updates' name='Regulatory Updates' fill='#9b87f5' barSize={20} />
            <Line
              type='monotone'
              dataKey='compliance'
              name='Compliance Score'
              stroke='#F97316'
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type='monotone'
              dataKey='riskScore'
              name='Risk Score'
              stroke='#1EAEDB'
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        );
      default:
        return (
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
            <XAxis dataKey='name' tick={{ fill: '#6B7280' }} />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey='updates' name='Regulatory Updates' fill='#9b87f5' />
            <Bar dataKey='riskScore' name='Risk Score' fill='#1EAEDB' />
          </BarChart>
        );
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 border border-gray-200 rounded-md shadow-md'>
          <p className='text-sm font-medium text-gray-500'>{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className='text-sm' style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Widget title='Regulatory Compliance Trends' onRemove={onRemove}>
      <div className='h-full flex flex-col'>
        <div className='flex flex-col sm:flex-row justify-between items-start mb-4 gap-4'>
          <Tabs value={jurisdiction} onValueChange={setJurisdiction} className='sm:mb-0'>
            <TabsList className='grid grid-cols-3'>
              <TabsTrigger value='eu'>EU</TabsTrigger>
              <TabsTrigger value='uk'>UK</TabsTrigger>
              <TabsTrigger value='us'>US</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={chartType} onValueChange={setChartType}>
            <TabsList className='grid grid-cols-4 w-full sm:w-auto'>
              <TabsTrigger value='line'>Line</TabsTrigger>
              <TabsTrigger value='bar'>Bar</TabsTrigger>
              <TabsTrigger value='area'>Area</TabsTrigger>
              <TabsTrigger value='composed'>Mixed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className='flex-1 min-h-[300px] md:min-h-[350px]'>
          <ResponsiveContainer width='100%' height='100%'>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        <div className='mt-4 text-sm text-gray-500'>
          <p>Displays regulatory updates and compliance metrics for the selected jurisdiction.</p>
        </div>
      </div>
    </Widget>
  );
};

export default RegulationTrendWidget;
