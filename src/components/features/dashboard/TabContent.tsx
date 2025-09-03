import { Suspense } from 'react';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { NexusAgentChatStreamlined } from '@/components/NexusAgentChatStreamlined';
import { NexusTestExecutor } from '@/components/testing/NexusTestExecutor';
import { DocumentAnalysisList } from '@/components/features/document-analysis/DocumentAnalysisList';

interface TabContentProps {
  activeTab: 'chat' | 'overview' | 'testing';
  chatRef: React.RefObject<HTMLDivElement>;
}

export const TabContent = ({ activeTab, chatRef }: TabContentProps) => {
  if (activeTab === 'chat') {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Chat Interface */}
        <div className='lg:col-span-3 nexus-agent-container' data-testid='nexus-chat'>
          <Suspense fallback={<EnhancedSkeleton className='h-96 w-full' />}>
            <NexusAgentChatStreamlined className='shadow-lg' ref={chatRef} />
          </Suspense>
        </div>
      </div>
    );
  }

  if (activeTab === 'overview') {
    return (
      <div className='space-y-6'>
        <Suspense fallback={<EnhancedSkeleton className='h-96 w-full' />}>
          <DocumentAnalysisList />
        </Suspense>
      </div>
    );
  }

  if (activeTab === 'testing') {
    return (
      <div className='space-y-6'>
        <div className='bg-background border border-border rounded-lg shadow-sm p-6'>
          <h3 className='text-lg font-semibold text-foreground mb-4'>
            User Acceptance Testing Suite
          </h3>
          <p className='text-muted-foreground mb-6'>
            Execute comprehensive testing scenarios to validate SFDR Navigator functionality across
            different regulatory use cases and compliance requirements.
          </p>

          <Suspense fallback={<EnhancedSkeleton className='h-32 w-full' />}>
            <NexusTestExecutor />
          </Suspense>
        </div>
      </div>
    );
  }

  return null;
};
