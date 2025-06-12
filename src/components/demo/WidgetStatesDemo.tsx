
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedComplianceStatusWidget } from '../widgets/EnhancedComplianceStatusWidget';
import { AgentInteractionFlow } from '../agents/AgentInteractionFlow';
import { Badge } from '@/components/ui/badge';

const sampleAgents = [
  {
    id: '1',
    name: 'AML Compliance Agent',
    description: 'Analyzes anti-money laundering requirements and identifies compliance gaps',
    category: 'Financial Crime'
  },
  {
    id: '2',
    name: 'GDPR Privacy Agent',
    description: 'Ensures data protection compliance and privacy impact assessments',
    category: 'Data Privacy'
  },
  {
    id: '3',
    name: 'ESG Reporting Agent',
    description: 'Monitors environmental, social, and governance reporting requirements',
    category: 'Sustainability'
  }
];

export const WidgetStatesDemo: React.FC = () => {
  const [selectedState, setSelectedState] = useState<'idle' | 'loading' | 'empty' | 'error'>('idle');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Widget States & Interaction Demo</h1>
        <p className="text-gray-600">
          Comprehensive demonstration of error states, loading states, and end-to-end agent interactions
        </p>
      </div>

      <Tabs defaultValue="states" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="states">Widget States</TabsTrigger>
          <TabsTrigger value="interactions">Agent Interactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="states" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">State Controls</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {(['idle', 'loading', 'empty', 'error'] as const).map((state) => (
                <Button
                  key={state}
                  variant={selectedState === state ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedState(state)}
                  className="capitalize focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                  aria-label={`Set widget to ${state} state`}
                >
                  {state}
                </Button>
              ))}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Current State: 
                  <Badge variant="outline" className="ml-2 capitalize">
                    {selectedState}
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <EnhancedComplianceStatusWidget forceState={selectedState} />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">Accessibility Features:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• ARIA-live regions announce state changes</li>
                  <li>• Focus management with 2px blue outline (offset: 2px)</li>
                  <li>• Screen reader compatible error messages</li>
                  <li>• Reduced motion respect for animations</li>
                  <li>• Semantic HTML with proper roles</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="interactions" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">End-to-End Agent Flow</h2>
            <p className="text-gray-600 mb-6">
              Click any agent card to experience the complete interaction flow with proper timing and accessibility.
            </p>
            
            <AgentInteractionFlow agents={sampleAgents} />
            
            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Interaction Flow Storyboard:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Frame 1</Badge>
                  <span>Agent card hover (200ms scale + focus ring)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Frame 2</Badge>
                  <span>Loading modal with spinner (1.5s duration)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Frame 3</Badge>
                  <span>Results panel slide-in (300ms from right)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Frame 4</Badge>
                  <span>Badge completion with toast (1s display)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Frame 5</Badge>
                  <span>Modal fade out and reset (300ms transition)</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
