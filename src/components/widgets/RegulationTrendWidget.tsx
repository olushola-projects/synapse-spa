
import { useState } from 'react';
import { Widget } from '../dashboard/WidgetGrid';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data for the charts
const euData = [
  { name: 'Jan', amt: 24 },
  { name: 'Feb', amt: 18 },
  { name: 'Mar', amt: 29 },
  { name: 'Apr', amt: 34 },
  { name: 'May', amt: 39 },
  { name: 'Jun', amt: 30 },
  { name: 'Jul', amt: 37 },
  { name: 'Aug', amt: 27 },
];

const ukData = [
  { name: 'Jan', amt: 15 },
  { name: 'Feb', amt: 22 },
  { name: 'Mar', amt: 17 },
  { name: 'Apr', amt: 25 },
  { name: 'May', amt: 30 },
  { name: 'Jun', amt: 22 },
  { name: 'Jul', amt: 28 },
  { name: 'Aug', amt: 19 },
];

const usData = [
  { name: 'Jan', amt: 28 },
  { name: 'Feb', amt: 32 },
  { name: 'Mar', amt: 21 },
  { name: 'Apr', amt: 29 },
  { name: 'May', amt: 37 },
  { name: 'Jun', amt: 40 },
  { name: 'Jul', amt: 33 },
  { name: 'Aug', amt: 35 },
];

interface RegulationTrendWidgetProps {
  onRemove?: () => void;
}

const RegulationTrendWidget = ({ onRemove }: RegulationTrendWidgetProps) => {
  const [jurisdiction, setJurisdiction] = useState('eu');

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

  return (
    <Widget title="Regulatory Compliance Trends" onRemove={onRemove}>
      <div className="h-full flex flex-col">
        <Tabs value={jurisdiction} onValueChange={setJurisdiction} className="mb-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="eu">EU</TabsTrigger>
            <TabsTrigger value="uk">UK</TabsTrigger>
            <TabsTrigger value="us">US</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getDataByJurisdiction()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amt" name="Regulatory Updates" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Displays regulatory updates and changes frequency for the selected jurisdiction.</p>
        </div>
      </div>
    </Widget>
  );
};

export default RegulationTrendWidget;
