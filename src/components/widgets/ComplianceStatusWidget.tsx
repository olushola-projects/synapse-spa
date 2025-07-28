import { Widget } from '../dashboard/WidgetGrid';
import { Shield, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ComplianceStatusWidgetProps {
  onRemove?: () => void;
}

// Sample compliance data
const complianceData = [
  { name: 'GDPR', status: 'compliant', score: 92 },
  { name: 'AMLD6', status: 'at-risk', score: 67 },
  { name: 'MiFID II', status: 'non-compliant', score: 43 },
  { name: 'PSD2', status: 'compliant', score: 88 }
];

// Control status data for donut chart
const controlStatusData = [
  { name: 'In-Progress', value: 97, fill: '#cbd5e1' },
  { name: 'Cancelled', value: 1, fill: '#e2e8f0' },
  { name: 'On Approval', value: 7, fill: '#fdba74' },
  { name: 'Overdue', value: 19, fill: '#ef4444' }
];

// Key controls data for donut chart
const keyControlsData = [
  { name: 'Tested', value: 7, fill: '#22c55e' },
  { name: 'Planned', value: 0, fill: '#f97316' },
  { name: 'Not Planned', value: 260, fill: '#94a3b8' }
];

// Risk profile data for donut chart
const riskProfileData = [
  { name: 'High Risk', value: 22, fill: '#ef4444' },
  { name: 'Medium Risk', value: 38, fill: '#f97316' },
  { name: 'Low Risk', value: 40, fill: '#22c55e' }
];

const ComplianceStatusWidget = ({ onRemove }: ComplianceStatusWidgetProps) => {
  const isMobile = useIsMobile();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className='w-5 h-5 text-green-500' />;
      case 'at-risk':
        return <AlertCircle className='w-5 h-5 text-amber-500' />;
      case 'non-compliant':
        return <XCircle className='w-5 h-5 text-red-500' />;
      default:
        return <Shield className='w-5 h-5 text-gray-400' />;
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) {
      return 'bg-green-500';
    }
    if (score >= 60) {
      return 'bg-amber-500';
    }
    return 'bg-red-500';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-2 border rounded shadow-sm text-xs'>
          <p className='font-medium'>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Widget title='Compliance Status' onRemove={onRemove}>
      <div className='space-y-6'>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
          {/* Overall Status Section */}
          <div className='flex flex-col items-center justify-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm'>
            <h3 className='text-sm font-medium text-gray-700'>Overall Status</h3>
            <div className='w-full h-32 mt-2 relative'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={riskProfileData}
                    cx='50%'
                    cy='50%'
                    innerRadius={35}
                    outerRadius={50}
                    dataKey='value'
                    startAngle={180}
                    endAngle={0}
                  >
                    {riskProfileData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
                <div className='text-2xl font-bold text-blue-700'>72</div>
                <div className='text-xs text-gray-500'>Score</div>
              </div>
            </div>
            <div className='w-full mt-2'>
              <div className='flex justify-between items-center text-xs text-gray-500'>
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
              <div className='w-full h-2 bg-gray-200 rounded-full mt-1'>
                <div className='h-full bg-amber-500 rounded-full' style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>

          {/* Control Status Donut Chart */}
          <div className='flex flex-col items-center justify-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm'>
            <h3 className='text-sm font-medium text-gray-700'>Control Status</h3>
            <div className='w-full h-32 mt-2'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={controlStatusData}
                    cx='50%'
                    cy='50%'
                    innerRadius={35}
                    outerRadius={50}
                    dataKey='value'
                  >
                    {controlStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='grid grid-cols-2 gap-2 w-full mt-2'>
              {controlStatusData.map((item, index) => (
                <div key={index} className='flex items-center text-xs'>
                  <div
                    className='w-3 h-3 rounded-full mr-1'
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <span className='text-gray-700'>{item.name}: </span>
                  <span className='font-medium ml-1'>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Standard Compliance Items */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-gray-700'>Regulatory Compliance</h3>
          {complianceData.map(item => (
            <div key={item.name} className='space-y-2'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  {getStatusIcon(item.status)}
                  <span className='ml-2 text-sm font-medium'>{item.name}</span>
                </div>
                <span className='text-sm font-medium'>{item.score}%</span>
              </div>
              <Progress value={item.score} className={`h-2 ${getProgressColor(item.score)}`} />
            </div>
          ))}
        </div>

        {/* Additional Controls Chart */}
        <div className='bg-white p-3 rounded-lg border border-gray-100 shadow-sm'>
          <h3 className='text-sm font-medium text-gray-700 mb-2'>Key Controls</h3>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-2'>
            <div className='w-28 h-28'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={keyControlsData}
                    cx='50%'
                    cy='50%'
                    innerRadius={25}
                    outerRadius={40}
                    dataKey='value'
                  >
                    {keyControlsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='text-center sm:text-left'>
              <div className='text-2xl font-bold text-blue-700'>267</div>
              <div className='text-xs text-gray-500'>Key Controls</div>
              <div className='space-y-1 mt-2'>
                {keyControlsData.map((item, index) => (
                  <div key={index} className='flex items-center text-xs'>
                    <div
                      className='w-3 h-3 rounded-full mr-1'
                      style={{ backgroundColor: item.fill }}
                    ></div>
                    <span className='text-gray-700'>{item.name}: </span>
                    <span className='font-medium ml-1'>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='pt-2 text-sm'>
          <div className='flex justify-between items-center'>
            <div className='text-gray-500'>Last assessment:</div>
            <div className='font-medium'>April 12, 2023</div>
          </div>
          <div className='flex justify-between items-center mt-1'>
            <div className='text-gray-500'>Next assessment due:</div>
            <div className='font-medium'>June 15, 2023</div>
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default ComplianceStatusWidget;
