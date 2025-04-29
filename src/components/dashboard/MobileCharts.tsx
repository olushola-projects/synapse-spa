
import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, LineChart, Line, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Bot } from 'lucide-react';

// Sample data for mobile charts
const regulationData = [
  { name: 'Anti-Money Laundering', value: 85 },
  { name: 'GDPR', value: 72 },
  { name: 'SFDR', value: 64 },
  { name: 'DORA', value: 56 },
  { name: 'MiFID II', value: 42 },
];

// Sample line data
const lineData = [
  { name: 'Jan', risk: 40, compliance: 24 },
  { name: 'Feb', risk: 30, compliance: 28 },
  { name: 'Mar', risk: 20, compliance: 39 },
  { name: 'Apr', risk: 27, compliance: 43 },
  { name: 'May', risk: 18, compliance: 52 },
  { name: 'Jun', risk: 23, compliance: 65 },
];

// Agent types
const agentTypes = ['AML', 'ESG', 'MiFID II', 'DORA', 'Privacy'];

const MobileCharts: React.FC = () => {
  return (
    <div className="w-full h-full p-1">
      <div className="text-[8px] font-medium mb-1 text-gray-600">Regulatory Focus Areas</div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart
          data={regulationData}
          layout="vertical"
          barCategoryGap={4}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <XAxis type="number" hide />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {regulationData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={
                  index === 0 ? '#8884d8' : 
                  index === 1 ? '#82ca9d' : 
                  index === 2 ? '#ffc658' :
                  index === 3 ? '#ff8042' : '#ca82b8'
                } 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="flex flex-col gap-1 mt-2">
        {regulationData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-[6px]">
            <span className="truncate max-w-[100px] text-gray-700">{item.name}</span>
            <span className="text-gray-500">{item.value}%</span>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <div className="text-[8px] font-medium mb-1 text-gray-600">Compliance Trends</div>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart
            data={lineData}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <YAxis hide={true} />
            <XAxis dataKey="name" tick={{ fontSize: 6 }} />
            <Tooltip contentStyle={{ fontSize: '8px' }} />
            <Line type="monotone" dataKey="risk" stroke="#ff8042" dot={{ r: 1 }} strokeWidth={1} />
            <Line type="monotone" dataKey="compliance" stroke="#8884d8" dot={{ r: 1 }} strokeWidth={1} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3">
        <div className="text-[8px] font-medium mb-1 flex items-center gap-1 text-gray-600">
          <Bot size={8} className="text-blue-500" />
          <span>Available Agents</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {agentTypes.map((agent, index) => (
            <div key={index} className="bg-white px-2 py-0.5 rounded-full border border-gray-200 text-[6px] font-medium text-gray-700 flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${['bg-red-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-amber-400'][index]}`}></div>
              {agent}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileCharts;
