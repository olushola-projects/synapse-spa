
// React import removed - using modern JSX transform
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { Bot } from 'lucide-react';

// Sample data for mobile charts
const regulationData = [
  { name: 'Anti-Money Laundering', value: 35 },
  { name: 'GDPR', value: 25 },
  { name: 'DORA', value: 20 },
  { name: 'PSD2', value: 15 },
  { name: 'SFDR', value: 5 },
];

// Line data removed - not used in this component

// Agent types - matching desktop version
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
            {regulationData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={
                  index === 0 ? '#4F46E5' : 
                  index === 1 ? '#EC4899' : 
                  index === 2 ? '#10B981' :
                  index === 3 ? '#F59E0B' : '#8B5CF6'
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
        <div className="text-[8px] font-medium mb-1 text-gray-600">Compliance Risk Profile</div>
        <div className="flex justify-center">
          <div className="w-16 h-16 relative">
            <div className="w-full h-full rounded-full border-4 border-green-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[10px] font-bold text-gray-800">72</div>
                <div className="text-[6px] text-gray-500">Score</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-1 text-[5px]">
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-1 rounded-full bg-red-400"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-1 rounded-full bg-orange-400"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-1 rounded-full bg-green-400"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-[8px] font-medium mb-1 flex items-center gap-1 text-gray-600">
          <Bot size={8} className="text-blue-500" />
          <span>GRC Agent Gallery</span>
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
