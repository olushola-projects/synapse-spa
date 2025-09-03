import React from 'react';
import { NexusAgentChat } from '@/components/NexusAgentChatNew';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Bot, Database } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ChatDemo: React.FC = () => {
  return (
    <div className='min-h-screen bg-background p-6'>
      <div className='max-w-6xl mx-auto space-y-6'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold'>SFDR Navigator Chat Demo</h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Test the new AI chat integration with the ai-chat-backend service. Experience real-time
            streaming responses from Sophia, your SFDR compliance assistant.
          </p>

          <div className='flex justify-center space-x-2'>
            <Badge variant='outline' className='flex items-center space-x-1'>
              <Bot className='h-3 w-3' />
              <span>AI-Powered</span>
            </Badge>
            <Badge variant='outline' className='flex items-center space-x-1'>
              <Database className='h-3 w-3' />
              <span>Real-time API</span>
            </Badge>
          </div>
        </div>

        {/* API Status Alert */}
        <Alert>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            <strong>Backend Required:</strong> This chat interface connects to the ai-chat-backend
            service running on <code>http://localhost:3000</code>. Make sure the backend is running
            for full functionality.
            <br />
            <br />
            <strong>Features:</strong>
            <ul className='mt-2 space-y-1'>
              <li>• Real-time streaming responses from OpenAI</li>
              <li>• Persistent conversation threads</li>
              <li>• File attachments support</li>
              <li>• SFDR-specific system prompts</li>
              <li>• Message history with DynamoDB storage</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Main Chat Interface */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Chat Component */}
          <div className='lg:col-span-2'>
            <NexusAgentChat className='w-full' />
          </div>

          {/* Info Panel */}
          <div className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>API Configuration</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div>
                  <p className='text-sm font-medium'>Base URL</p>
                  <code className='text-xs bg-muted p-1 rounded'>
                    {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}
                  </code>
                </div>
                <div>
                  <p className='text-sm font-medium'>Timeout</p>
                  <code className='text-xs bg-muted p-1 rounded'>
                    {import.meta.env.VITE_API_TIMEOUT || '30000'}ms
                  </code>
                </div>
                <div>
                  <p className='text-sm font-medium'>Environment</p>
                  <code className='text-xs bg-muted p-1 rounded'>{import.meta.env.MODE}</code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Available Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center space-x-2'>
                    <div className='h-2 w-2 bg-green-500 rounded-full'></div>
                    <span>Thread Management</span>
                  </li>
                  <li className='flex items-center space-x-2'>
                    <div className='h-2 w-2 bg-green-500 rounded-full'></div>
                    <span>Streaming Responses</span>
                  </li>
                  <li className='flex items-center space-x-2'>
                    <div className='h-2 w-2 bg-green-500 rounded-full'></div>
                    <span>Message History</span>
                  </li>
                  <li className='flex items-center space-x-2'>
                    <div className='h-2 w-2 bg-green-500 rounded-full'></div>
                    <span>Error Handling</span>
                  </li>
                  <li className='flex items-center space-x-2'>
                    <div className='h-2 w-2 bg-yellow-500 rounded-full'></div>
                    <span>File Attachments (Beta)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Sample Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 text-sm'>
                  <p className='font-medium'>Try asking:</p>
                  <ul className='space-y-1 text-muted-foreground'>
                    <li>• "What is SFDR Article 8?"</li>
                    <li>• "Help me with PAI indicators"</li>
                    <li>• "Explain the difference between Article 6 and Article 9 funds"</li>
                    <li>• "What are the disclosure requirements for sustainable investments?"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDemo;
