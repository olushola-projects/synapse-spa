import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Settings } from 'lucide-react';

interface CriticalAuthAlertProps {
  onConfigure?: () => void;
  onDismiss?: () => void;
}

export const CriticalAuthAlert: React.FC<CriticalAuthAlertProps> = ({ onConfigure, onDismiss }) => {
  return (
    <Alert className='border-red-500 bg-red-50 dark:bg-red-950/20'>
      <AlertTriangle className='h-4 w-4 text-red-600' />
      <AlertTitle className='text-red-800 dark:text-red-200'>
        🔴 CRITICAL: Authentication Architecture Crisis
      </AlertTitle>
      <AlertDescription className='text-red-700 dark:text-red-300 space-y-3'>
        <div className='space-y-2'>
          <p className='font-semibold'>IMMEDIATE ACTION REQUIRED:</p>
          <ul className='list-disc list-inside space-y-1 text-sm'>
            <li>Client-side API key exposure detected</li>
            <li>Placeholder values in production environment</li>
            <li>Supabase secrets configuration mismatch</li>
            <li>All LLM functionality currently broken</li>
          </ul>
        </div>

        <div className='bg-red-100 dark:bg-red-900/30 p-3 rounded-md'>
          <p className='text-sm font-medium'>Security Fixes Implemented:</p>
          <ul className='text-xs space-y-1 mt-1'>
            <li>✅ Removed VITE_NEXUS_API_KEY from client-side code</li>
            <li>✅ Updated to use secure edge function proxy</li>
            <li>✅ Implemented proper authentication flow</li>
            <li>✅ Added comprehensive error handling</li>
          </ul>
        </div>

        <div className='flex gap-2 pt-2'>
          {onConfigure && (
            <Button
              size='sm'
              variant='destructive'
              onClick={onConfigure}
              className='bg-red-600 hover:bg-red-700'
            >
              <Settings className='h-4 w-4 mr-2' />
              Configure API Keys
            </Button>
          )}
          {onDismiss && (
            <Button
              size='sm'
              variant='outline'
              onClick={onDismiss}
              className='border-red-300 text-red-700 hover:bg-red-100'
            >
              Dismiss
            </Button>
          )}
        </div>

        <div className='text-xs text-red-600 dark:text-red-400 pt-2 border-t border-red-200 dark:border-red-800'>
          <Shield className='h-3 w-3 inline mr-1' />
          Next Steps: Configure NEXUS_API_KEY in Supabase Secrets and deploy edge functions
        </div>
      </AlertDescription>
    </Alert>
  );
};
