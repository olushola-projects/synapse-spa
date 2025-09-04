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
      <div className='w-full'>
        {/* Chat Interface - Full Width */}
        <div className='nexus-agent-container' data-testid='nexus-chat'>
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

  return null;
};
