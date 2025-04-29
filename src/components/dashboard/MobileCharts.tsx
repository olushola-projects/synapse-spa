
import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

// Sample data for mobile charts
const regulationData = [
  { name: 'Anti-Money Laundering', value: 85 },
  { name: 'GDPR', value: 72 },
  { name: 'SFDR', value: 64 },
  { name: 'DORA', value: 56 },
  { name: 'MiFID II', value: 42 },
];

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
    </div>
  );
};

export default MobileCharts;
