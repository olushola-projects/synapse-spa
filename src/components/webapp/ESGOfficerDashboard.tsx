
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentCard } from '../agents/AgentCard';
import { TaskButton } from '../tasks/TaskButton';
import { BadgeTracker } from '../gamification/BadgeTracker';
import { RegulatoryCalendar } from '../widgets/RegulatoryCalendar';
import { Leaf, Building2, FileText, Users, Plus, ExternalLink } from 'lucide-react';

const esgAgents = [
  {
    id: 'sfdr-agent',
    name: 'SFDR Compliance Assistant',
    description: 'Navigate Sustainable Finance Disclosure Regulation requirements',
    category: 'ESG Disclosure',
    color: 'bg-green-600',
    isRecommended: true,
    isActivated: true,
    useCases: [
      {
        title: 'Article Classification',
        description: 'Determine if your fund qualifies as Article 6, 8, or 9'
      },
      {
        title: 'PAI Reporting',
        description: 'Generate Principal Adverse Impact statements'
      }
    ]
  },
  {
    id: 'taxonomy-agent',
    name: 'EU Taxonomy Navigator',
    description: 'Assess taxonomy alignment and environmental objectives',
    category: 'Taxonomy',
    color: 'bg-emerald-600',
    isRecommended: false,
    isActivated: false,
    useCases: [
      {
        title: 'Alignment Assessment',
        description: 'Check activities against technical screening criteria'
      },
      {
        title: 'DNSH Analysis',
        description: 'Verify Do No Significant Harm compliance'
      }
    ]
  }
];

const sfdrTasks = [
  {
    title: 'Explain SFDR Article 8 requirements',
    description: 'Get detailed breakdown of light green fund obligations',
    complexity: 'Simple' as const,
    estimatedTime: '2 min'
  },
  {
    title: 'Draft investor disclosure for ESG integration',
    description: 'Create compliant language for fund documentation',
    complexity: 'Moderate' as const,
    estimatedTime: '5 min'
  },
  {
    title: 'Map Article 6-8 transition strategy',
    description: 'Plan upgrade path from Article 6 to Article 8 classification',
    complexity: 'Complex' as const,
    estimatedTime: '10 min'
  }
];

export const ESGOfficerDashboard: React.FC = () => {
  const [activeAgents, setActiveAgents] = useState(['sfdr-agent']);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleActivateAgent = (agentId: string) => {
    setActiveAgents([...activeAgents, agentId]);
  };

  const handleTaskClick = (taskTitle: string) => {
    console.log('Opening Dara for task:', taskTitle);
    // Here you would integrate with your Dara chat system
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Synapses</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ESG Officer
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Users size={14} className="mr-2" />
                Invite Team
              </Button>
              <Button variant="outline" size="sm">
                <Building2 size={14} className="mr-2" />
                Enterprise Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Welcome back, Sarah! 🌱
                    </h2>
                    <p className="text-gray-600">
                      You have 3 active agents and 2 pending regulatory updates.
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Impact Score: 156
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Agent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  SFDR Agent Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {sfdrTasks.map((task, index) => (
                    <TaskButton
                      key={index}
                      title={task.title}
                      description={task.description}
                      complexity={task.complexity}
                      estimatedTime={task.estimatedTime}
                      onClick={() => handleTaskClick(task.title)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Agent Gallery */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    Agent Gallery
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus size={14} className="mr-2" />
                    Browse All Agents
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {esgAgents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      {...agent}
                      isActivated={activeAgents.includes(agent.id)}
                      onActivate={handleActivateAgent}
                      onViewDetails={(id) => console.log('View details for:', id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <BadgeTracker userRole="esg-officer" />
            <RegulatoryCalendar />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink size={14} className="mr-2" />
                  View ESG Reporting Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users size={14} className="mr-2" />
                  Join ESG Community Forum
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={14} className="mr-2" />
                  Download Compliance Checklist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
