
import React, { useState, useEffect } from 'react';
import { EnhancedWidget } from './EnhancedWidget';
import { Shield, AlertCircle, CheckCircle2, XCircle, FileBarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ComplianceItem {
  name: string;
  status: 'compliant' | 'at-risk' | 'non-compliant';
  score: number;
}

interface EnhancedComplianceStatusWidgetProps {
  onRemove?: () => void;
  initialData?: ComplianceItem[];
  forceState?: 'idle' | 'loading' | 'empty' | 'error';
}

// Sample compliance data
const sampleComplianceData: ComplianceItem[] = [
  { name: 'GDPR', status: 'compliant', score: 92 },
  { name: 'AMLD6', status: 'at-risk', score: 67 },
  { name: 'MiFID II', status: 'non-compliant', score: 43 },
  { name: 'PSD2', status: 'compliant', score: 88 },
];

const riskProfileData = [
  { name: 'High Risk', value: 22, fill: '#ef4444' },
  { name: 'Medium Risk', value: 38, fill: '#f97316' },
  { name: 'Low Risk', value: 40, fill: '#22c55e' },
];

export const EnhancedComplianceStatusWidget: React.FC<EnhancedComplianceStatusWidgetProps> = ({
  onRemove,
  initialData,
  forceState
}) => {
  const [complianceData, setComplianceData] = useState<ComplianceItem[]>(initialData || []);
  const [widgetState, setWidgetState] = useState<'idle' | 'loading' | 'empty' | 'error'>(
    forceState || (initialData?.length ? 'idle' : 'empty')
  );

  useEffect(() => {
    if (forceState) {
      setWidgetState(forceState);
    }
  }, [forceState]);

  const handleDataRefresh = async (): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Randomly succeed or fail for demo
    if (Math.random() > 0.7) {
      throw new Error('Failed to fetch compliance data');
    }
    
    setComplianceData(sampleComplianceData);
    setWidgetState('idle');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'at-risk':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'non-compliant':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const emptyIllustration = (
    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
      <FileBarChart className="w-8 h-8 text-gray-300" />
    </div>
  );

  return (
    <EnhancedWidget
      title="Compliance Status"
      onRemove={onRemove}
      initialState={widgetState}
      emptyMessage="No compliance data available. Connect your systems to start monitoring."
      emptyIllustration={emptyIllustration}
      onDataRefresh={handleDataRefresh}
    >
      <div className="space-y-6">
        {/* Overall Status Chart */}
        <div className="flex flex-col items-center bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Overall Compliance</h3>
          <div className="w-32 h-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskProfileData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  dataKey="value"
                >
                  {riskProfileData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">72</div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Compliance Items */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Regulatory Compliance</h3>
          {complianceData.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {getStatusIcon(item.status)}
                  <span className="ml-2 text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.score}%</span>
              </div>
              <Progress value={item.score} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </EnhancedWidget>
  );
};
