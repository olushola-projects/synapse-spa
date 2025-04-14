
import { Widget } from '../dashboard/WidgetGrid';
import { Shield, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ComplianceStatusWidgetProps {
  onRemove?: () => void;
}

// Sample compliance data
const complianceData = [
  { name: 'GDPR', status: 'compliant', score: 92 },
  { name: 'AMLD6', status: 'at-risk', score: 67 },
  { name: 'MiFID II', status: 'non-compliant', score: 43 },
  { name: 'PSD2', status: 'compliant', score: 88 },
];

const ComplianceStatusWidget = ({ onRemove }: ComplianceStatusWidgetProps) => {
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

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Widget title="Compliance Status" onRemove={onRemove}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Overall Status</h3>
            <div className="flex items-center mt-1">
              <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
              <span className="text-amber-700 font-medium">At Risk</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">72%</div>
            <div className="text-xs text-gray-500">Compliance Score</div>
          </div>
        </div>
        
        <div className="space-y-4">
          {complianceData.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {getStatusIcon(item.status)}
                  <span className="ml-2 text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.score}%</span>
              </div>
              <Progress value={item.score} className={`h-2 ${getProgressColor(item.score)}`} />
            </div>
          ))}
        </div>
        
        <div className="pt-2 text-sm">
          <div className="flex justify-between items-center">
            <div className="text-gray-500">Last assessment:</div>
            <div className="font-medium">April 12, 2023</div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-gray-500">Next assessment due:</div>
            <div className="font-medium">June 15, 2023</div>
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default ComplianceStatusWidget;
