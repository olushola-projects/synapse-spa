import React from 'react';

interface DashboardContentProps {
  onAmlDialogOpen?: () => void;
  children?: React.ReactNode;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  onAmlDialogOpen = () => {},
  children
}) => {
  // If children are provided, combine them with default dashboard content
  if (children) {
    return (
      <main className='flex-1 overflow-auto bg-gray-50 p-4'>
        <div className='space-y-6'>
          {/* Custom dashboard content (widgets, tabs, etc.) */}
          <div>{children}</div>

          {/* Default dashboard components - TEMPORARILY HIDDEN */}
          {/* 
          <div className='border-t pt-8'>
            <h2 className='text-2xl font-bold mb-6'>System Overview</h2>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
              <div className='space-y-8'>
                <div className='min-h-[120px] [&_*]:!text-sm [&_*]:!p-4 [&_*]:!gap-3 [&_*]:!mb-2'>
                  <StatusCards />
                </div>
                <div className='min-h-[300px] [&_*]:!text-sm [&_*]:!p-4'>
                  <AmlAnalysisCard onAmlDialogOpen={onAmlDialogOpen} />
                </div>
                <div className='min-h-[300px] [&_*]:!text-sm [&_*]:!p-4'>
                  <NetworkingCard />
                </div>
                <div className='min-h-[400px]'>
                  <RegulatoryFocusChart />
                </div>
              </div>

              <div className='space-y-8'>
                <div className='min-h-[300px] [&_*]:!text-sm [&_*]:!p-4'>
                  <AgentGalleryCard />
                </div>
                <div className='min-h-[300px]'>
                  <ComplianceRiskChart />
                </div>
                <div className='min-h-[300px]'>
                  <ControlStatusChart />
                </div>
              </div>
            </div>
          </div>
          */}
        </div>
      </main>
    );
  }

  // Default dashboard content (when no children are provided) - TEMPORARILY HIDDEN
  return (
    <main className='flex-1 overflow-auto bg-gray-50 p-6'>
      <div className='flex items-center justify-center h-full'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-700 mb-4'>Dashboard</h2>
          <p className='text-gray-500'>
            Welcome to your dashboard. The system overview components are temporarily hidden while
            being improved.
          </p>
        </div>
      </div>
      {/* SYSTEM OVERVIEW TEMPORARILY HIDDEN - WILL BE RE-ENABLED AFTER FIXES
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
        <div className='space-y-8'>
          <div className='min-h-[120px] [&_*]:!text-sm [&_*]:!p-4 [&_*]:!gap-3 [&_*]:!mb-2'>
            <StatusCards />
          </div>
          <div className='min-h-[300px] [&_*]:!text-sm [&_*]:!p-4'>
            <AmlAnalysisCard onAmlDialogOpen={onAmlDialogOpen} />
          </div>
          <div className='min-h-[300px] [&_*]:!text-sm [&_*]:!p-4'>
            <NetworkingCard />
          </div>
          <div className='min-h-[400px]'>
            <RegulatoryFocusChart />
          </div>
        </div>

        <div className='space-y-8'>
          <div className='min-h-[300px] [&_*]:!text-sm [&_*]:!p-4'>
            <AgentGalleryCard />
          </div>
          <div className='min-h-[300px]'>
            <ComplianceRiskChart />
          </div>
          <div className='min-h-[300px]'>
            <ControlStatusChart />
          </div>
        </div>
      </div>
      */}
    </main>
  );
};
