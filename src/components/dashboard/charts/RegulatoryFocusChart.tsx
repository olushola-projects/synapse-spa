// React import removed - using modern JSX transform
import { PieChart } from 'lucide-react';
import { PieChart as ReChartPie, Cell, ResponsiveContainer } from 'recharts';
// Pie import removed - not used in this component

const pieChartData = [
  { name: 'GDPR', value: 35, fill: '#4F46E5' },
  { name: 'AMLD6', value: 25, fill: '#EC4899' },
  { name: 'DORA', value: 20, fill: '#10B981' },
  { name: 'PSD2', value: 15, fill: '#F59E0B' },
  { name: 'SFDR', value: 5, fill: '#8B5CF6' }
];

export const RegulatoryFocusChart = () => {
  return (
    <div className='h-[30%] bg-white rounded-md p-1 border border-gray-100 shadow-sm cursor-pointer'>
      <div className='flex items-center justify-between mb-0.5'>
        <div className='flex items-center gap-1'>
          <PieChart size={8} className='text-violet-500' />
          <div className='text-gray-800 text-[6px] sm:text-[7px] font-medium'>
            Regulatory Focus Areas
          </div>
        </div>
        <div className='text-gray-500 text-[4px] sm:text-[5px]'>Distribution</div>
      </div>

      <div className='h-[80%] flex'>
        <div className='w-2/3 h-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <ReChartPie data={pieChartData} cx='50%' cy='50%' innerRadius={15} outerRadius={25}>
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </ReChartPie>
          </ResponsiveContainer>
        </div>
        <div className='w-1/3 flex flex-col justify-center space-y-0.5'>
          {pieChartData.map((entry, index) => (
            <div key={index} className='flex items-center text-[4px]'>
              <div
                className='w-1 h-1 rounded-full mr-0.5'
                style={{ backgroundColor: entry.fill }}
              ></div>
              <span className='text-gray-700'>{entry.name}</span>
              <span className='ml-auto text-gray-500'>{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
