import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
const RegulationTrendWidget = ({ onRemove }) => {
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
        return _jsxs(LineChart, {
          data: data,
          margin: { top: 5, right: 20, bottom: 5, left: 0 },
          children: [
            _jsx(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e0e0e0' }),
            _jsx(XAxis, { dataKey: 'name', tick: { fill: '#6B7280' } }),
            _jsx(YAxis, { tick: { fill: '#6B7280' } }),
            _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
            _jsx(Legend, {}),
            _jsx(Line, {
              type: 'monotone',
              dataKey: 'updates',
              name: 'Regulatory Updates',
              stroke: '#6E59A5',
              strokeWidth: 2,
              dot: { r: 4 },
              activeDot: { r: 6 }
            }),
            _jsx(Line, {
              type: 'monotone',
              dataKey: 'compliance',
              name: 'Compliance Score',
              stroke: '#F97316',
              strokeWidth: 2,
              dot: { r: 4 },
              activeDot: { r: 6 }
            })
          ]
        });
      case 'area':
        return _jsxs(AreaChart, {
          data: data,
          margin: { top: 5, right: 20, bottom: 5, left: 0 },
          children: [
            _jsx(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e0e0e0' }),
            _jsx(XAxis, { dataKey: 'name', tick: { fill: '#6B7280' } }),
            _jsx(YAxis, { tick: { fill: '#6B7280' } }),
            _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
            _jsx(Legend, {}),
            _jsx(Area, {
              type: 'monotone',
              dataKey: 'updates',
              name: 'Regulatory Updates',
              fill: '#9b87f5',
              stroke: '#7E69AB',
              fillOpacity: 0.6
            }),
            _jsx(Area, {
              type: 'monotone',
              dataKey: 'compliance',
              name: 'Compliance Score',
              fill: '#33C3F0',
              stroke: '#0EA5E9',
              fillOpacity: 0.6
            })
          ]
        });
      case 'composed':
        return _jsxs(ComposedChart, {
          data: data,
          margin: { top: 5, right: 20, bottom: 5, left: 0 },
          children: [
            _jsx(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e0e0e0' }),
            _jsx(XAxis, { dataKey: 'name', tick: { fill: '#6B7280' } }),
            _jsx(YAxis, { tick: { fill: '#6B7280' } }),
            _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
            _jsx(Legend, {}),
            _jsx(Bar, {
              dataKey: 'updates',
              name: 'Regulatory Updates',
              fill: '#9b87f5',
              barSize: 20
            }),
            _jsx(Line, {
              type: 'monotone',
              dataKey: 'compliance',
              name: 'Compliance Score',
              stroke: '#F97316',
              strokeWidth: 2,
              dot: { r: 4 }
            }),
            _jsx(Line, {
              type: 'monotone',
              dataKey: 'riskScore',
              name: 'Risk Score',
              stroke: '#1EAEDB',
              strokeWidth: 2,
              dot: { r: 4 }
            })
          ]
        });
      default:
        return _jsxs(BarChart, {
          data: data,
          margin: { top: 5, right: 20, bottom: 5, left: 0 },
          children: [
            _jsx(CartesianGrid, { strokeDasharray: '3 3', stroke: '#e0e0e0' }),
            _jsx(XAxis, { dataKey: 'name', tick: { fill: '#6B7280' } }),
            _jsx(YAxis, { tick: { fill: '#6B7280' } }),
            _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }),
            _jsx(Legend, {}),
            _jsx(Bar, { dataKey: 'updates', name: 'Regulatory Updates', fill: '#9b87f5' }),
            _jsx(Bar, { dataKey: 'riskScore', name: 'Risk Score', fill: '#1EAEDB' })
          ]
        });
    }
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return _jsxs('div', {
        className: 'bg-white p-3 border border-gray-200 rounded-md shadow-md',
        children: [
          _jsx('p', { className: 'text-sm font-medium text-gray-500', children: `${label}` }),
          payload.map((entry, index) =>
            _jsx(
              'p',
              {
                className: 'text-sm',
                style: { color: entry.color },
                children: `${entry.name}: ${entry.value}`
              },
              `item-${index}`
            )
          )
        ]
      });
    }
    return null;
  };
  return _jsx(Widget, {
    title: 'Regulatory Compliance Trends',
    onRemove: onRemove,
    children: _jsxs('div', {
      className: 'h-full flex flex-col',
      children: [
        _jsxs('div', {
          className: 'flex flex-col sm:flex-row justify-between items-start mb-4 gap-4',
          children: [
            _jsx(Tabs, {
              value: jurisdiction,
              onValueChange: setJurisdiction,
              className: 'sm:mb-0',
              children: _jsxs(TabsList, {
                className: 'grid grid-cols-3',
                children: [
                  _jsx(TabsTrigger, { value: 'eu', children: 'EU' }),
                  _jsx(TabsTrigger, { value: 'uk', children: 'UK' }),
                  _jsx(TabsTrigger, { value: 'us', children: 'US' })
                ]
              })
            }),
            _jsx(Tabs, {
              value: chartType,
              onValueChange: setChartType,
              children: _jsxs(TabsList, {
                className: 'grid grid-cols-4 w-full sm:w-auto',
                children: [
                  _jsx(TabsTrigger, { value: 'line', children: 'Line' }),
                  _jsx(TabsTrigger, { value: 'bar', children: 'Bar' }),
                  _jsx(TabsTrigger, { value: 'area', children: 'Area' }),
                  _jsx(TabsTrigger, { value: 'composed', children: 'Mixed' })
                ]
              })
            })
          ]
        }),
        _jsx('div', {
          className: 'flex-1 min-h-[300px] md:min-h-[350px]',
          children: _jsx(ResponsiveContainer, {
            width: '100%',
            height: '100%',
            children: renderChart()
          })
        }),
        _jsx('div', {
          className: 'mt-4 text-sm text-gray-500',
          children: _jsx('p', {
            children:
              'Displays regulatory updates and compliance metrics for the selected jurisdiction.'
          })
        })
      ]
    })
  });
};
export default RegulationTrendWidget;
