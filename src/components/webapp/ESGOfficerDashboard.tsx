
import React, { useState } from 'react';
import { AgentCard } from '../agents/AgentCard';
import { TaskButton } from '../tasks/TaskButton';
import { BadgeTracker } from '../gamification/BadgeTracker';
import { RegulatoryCalendar } from '../widgets/RegulatoryCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, FileText, Users } from 'lucide-react';

export const ESGOfficerDashboard: React.FC = () => {
  const [activatedAgents, setActivatedAgents] = useState<string[]>(['esg-disclosure']);

  const handleAgentActivate = (agentId: string) => {
    setActivatedAgents(prev => [...prev, agentId]);
  };

  const handleAgentViewDetails = (agentId: string) => {
    console.log('Viewing details for agent:', agentId);
  };

  const handleTaskClick = () => {
    console.log('Opening Dara AI assistant...');
  };

  const agents = [
    {
      id: 'esg-disclosure',
      name: 'ESG Disclosure Expert',
      description: 'Navigate SFDR, CSRD, and taxonomy regulations with confidence',
      category: 'ESG Compliance',
      useCases: [
        { title: 'SFDR Article Classification', description: 'Determine if your fund qualifies as Article 6, 8, or 9' },
        { title: 'CSRD Reporting', description: 'Generate compliant sustainability reports' }
      ],
      isActivated: activatedAgents.includes('esg-disclosure'),
      isRecommended: true,
      color: 'bg-green-500',
      onActivate: handleAgentActivate,
      onViewDetails: handleAgentViewDetails
    },
    {
      id: 'taxonomy-analyzer',
      name: 'EU Taxonomy Analyzer',
      description: 'Assess economic activities against taxonomy criteria',
      category: 'Sustainable Finance',
      useCases: [
        { title: 'Activity Screening', description: 'Check if activities are taxonomy-eligible' },
        { title: 'DNSH Assessment', description: 'Evaluate Do No Significant Harm criteria' }
      ],
      isActivated: activatedAgents.includes('taxonomy-analyzer'),
      isRecommended: false,
      color: 'bg-blue-500',
      onActivate: handleAgentActivate,
      onViewDetails: handleAgentViewDetails
    }
  ];

  const tasks = [
    {
      title: 'SFDR Article 8 Fund Classification',
      description: 'Review fund documentation and determine appropriate article classification under SFDR',
      complexity: 'Moderate' as const,
      estimatedTime: '15 min'
    },
    {
      title: 'Generate CSRD Double Materiality Assessment',
      description: 'Create materiality matrix for upcoming CSRD compliance deadline',
      complexity: 'Complex' as const,
      estimatedTime: '30 min'
    },
    {
      title: 'Taxonomy Alignment Calculation',
      description: 'Calculate taxonomy-aligned revenue percentage for Q3 reporting',
      complexity: 'Simple' as const,
      estimatedTime: '10 min'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <Card className="border-l-4 border-l-orange-500 bg-orange-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-900">Action Required</h3>
              <p className="text-sm text-orange-700 mt-1">
                CSRD compliance deadline approaches. 2 materiality assessments need completion by Dec 31.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-blue-600">{activatedAgents.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={16} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-green-600">94%</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp size={16} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-purple-600">23</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText size={16} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Impact</p>
                <p className="text-2xl font-bold text-orange-600">156</p>
              </div>
              <Progress value={78} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks and Agents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Priority Tasks
                <Badge variant="destructive" className="ml-auto">3 Urgent</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <TaskButton
                    key={index}
                    title={task.title}
                    description={task.description}
                    complexity={task.complexity}
                    estimatedTime={task.estimatedTime}
                    onClick={handleTaskClick}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agent Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} className="text-primary" />
                ESG Agent Gallery
                <Badge variant="outline" className="ml-auto">2 Available</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <AgentCard key={agent.id} {...agent} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar and Progress */}
        <div className="space-y-6">
          <RegulatoryCalendar />
          <BadgeTracker userRole="esg-officer" />
        </div>
      </div>
    </div>
  );
};
