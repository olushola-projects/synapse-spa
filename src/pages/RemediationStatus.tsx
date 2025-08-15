/**
 * Remediation Status Page
 * Complete monitoring dashboard for the comprehensive remediation plan
 */

import { RemediationDashboard } from '@/components/testing/RemediationDashboard';
import { SeoHead } from '@/components/SEO/SeoHead';

export default function RemediationStatus() {
  return (
    <>
      <SeoHead
        title='Remediation Status | SFDR Navigator'
        description='Complete status dashboard for the SFDR Navigator security and compliance remediation plan'
        keywords={['remediation', 'security', 'compliance', 'SFDR', 'monitoring']}
      />

      <div className='min-h-screen bg-background py-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold tracking-tight'>Remediation Status Dashboard</h1>
              <p className='text-muted-foreground mt-2'>
                Complete monitoring of security and compliance remediation implementation
              </p>
            </div>

            <RemediationDashboard />
          </div>
        </div>
      </div>
    </>
  );
}
