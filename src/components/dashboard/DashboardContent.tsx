
import React from 'react';
import { AmlAnalysisCard } from './AmlAnalysisCard';
import { NetworkingCard } from './NetworkingCard';
import { RegulatoryFocusChart, ComplianceRiskChart, ControlStatusChart } from './charts/DashboardCharts';
import { InterviewPrepCard } from './InterviewPrepCard';

interface DashboardContentProps {
  onAmlDialogOpen: () => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ onAmlDialogOpen }) => {
  return (
    <div className="flex gap-1 flex-1">
      <div className="flex-1 flex flex-col gap-1">
        <AmlAnalysisCard onAmlDialogOpen={onAmlDialogOpen} />
        <NetworkingCard />
        <RegulatoryFocusChart />
      </div>
      
      <div className="flex-1 flex flex-col gap-1">
        <InterviewPrepCard />
        <ComplianceRiskChart />
        <ControlStatusChart />
      </div>
    </div>
  );
};
