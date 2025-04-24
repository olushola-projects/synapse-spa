import React from 'react';
import { PieChart as PieChartIcon, Cpu } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

// Chart data
const pieChartData = [
  { name: 'GDPR', value: 35, fill: '#4F46E5' },
  { name: 'AMLD6', value: 25, fill: '#EC4899' },
  { name: 'DORA', value: 20, fill: '#10B981' },
  { name: 'PSD2', value: 15, fill: '#F59E0B' },
  { name: 'SFDR', value: 5, fill: '#8B5CF6' },
];

const donutPieData = [
  { name: 'High Risk', value: 22, fill: '#ef4444' },
  { name: 'Medium Risk', value: 38, fill: '#f97316' },
  { name: 'Low Risk', value: 40, fill: '#22c55e' },
];

const barChartData = [
  { name: 'Engagement', value: 27, fill: '#cbd5e1' },
  { name: 'Cancelled', value: 5, fill: '#e2e8f0' },
  { name: 'Projects', value: 7, fill: '#fdba74' },
  { name: 'Contributions', value: 19, fill: '#ef4444' },
  { name: 'CV Matches', value: 32, fill: '#4F46E5' },
  { name: 'Badges', value: 65, fill: '#10B981' }
];

export const RegulatoryFocusChart: React.FC = () => {
  return (
    <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1">
          <PieChartIcon size={8} className="text-violet-500" />
          <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Regulatory Focus Areas</div>
        </div>
        <div className="text-gray-500 text-[4px] sm:text-[5px]">Distribution</div>
      </div>
      
      <div className="h-[80%] flex">
        <div className="w-2/3 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={15}
                outerRadius={25}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/3 flex flex-col justify-center space-y-0.5">
          {pieChartData.map((entry, index) => (
            <div key={index} className="flex items-center text-[4px]">
              <div className="w-1 h-1 rounded-full mr-0.5" style={{ backgroundColor: entry.fill }}></div>
              <span className="text-gray-700">{entry.name}</span>
              <span className="ml-auto text-gray-500">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ComplianceRiskChart: React.FC = () => {
  return (
    <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1">
          <PieChartIcon size={8} className="text-indigo-500" />
          <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Compliance Risk Profile</div>
        </div>
        <div className="text-gray-500 text-[4px] sm:text-[5px]">Q2 2025</div>
      </div>
      
      <div className="h-[80%] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutPieData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={30}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              {donutPieData.map((entry, index) => (
                <Cell key={`donut-cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-800 text-[6px] font-bold">72</div>
            <div className="text-gray-500 text-[4px]">Score</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-1 px-0.5">
        {donutPieData.map((entry, index) => (
          <div key={index} className="flex items-center text-[3px] sm:text-[4px]">
            <div className="w-1 h-1 rounded-full mr-0.5" style={{ backgroundColor: entry.fill }}></div>
            <span className="text-gray-700">{entry.name}</span>
            <span className="ml-1 text-gray-500">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ControlStatusChart: React.FC = () => {
  return (
    <div className="h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer">
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1">
          <Cpu size={8} className="text-emerald-500" />
          <div className="text-gray-800 text-[6px] sm:text-[7px] font-medium">Bar Chart</div>
        </div>
        <div className="text-gray-500 text-[4px] sm:text-[5px]">124 Total</div>
      </div>
      
      <div className="h-[80%] flex items-center">
        <div className="w-full flex flex-wrap gap-1 justify-center">
          {barChartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-1 px-1 py-0.5 bg-white rounded border border-gray-100">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: entry.fill }}></div>
              <div className="text-[3px] sm:text-[4px] text-gray-700">{entry.name}</div>
              <div className="text-[3px] sm:text-[4px] font-medium">{entry.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
