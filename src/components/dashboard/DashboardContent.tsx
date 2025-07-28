import React from 'react';
import { AmlAnalysisCard } from './AmlAnalysisCard';
import { NetworkingCard } from './NetworkingCard';
import {
  RegulatoryFocusChart,
  ComplianceRiskChart,
  ControlStatusChart
} from './charts/DashboardCharts';
import { AgentGalleryCard } from './AgentGalleryCard';
import { StatusCards } from './StatusCards';

interface DashboardContentProps {
  onAmlDialogOpen?: () => void;
  children?: React.ReactNode;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  onAmlDialogOpen = () => {},
  children
}) => {
  return (
    <div className='flex gap-1 flex-1 text-[1.125rem] p-2'>
      <div className='flex-1 flex flex-col gap-1'>
        <StatusCards />
        <AmlAnalysisCard onAmlDialogOpen={onAmlDialogOpen} />
        <NetworkingCard />
        <RegulatoryFocusChart />
      </div>

      <div className='flex-1 flex flex-col gap-1'>
        <AgentGalleryCard />
        <ComplianceRiskChart />
        <ControlStatusChart />
      </div>
      {children}
    </div>
  );
};
