
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Target, 
  Users,
  CheckSquare,
  BookOpen,
  Share2,
  Download,
  Bookmark
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { RegulatoryEvent, NormalizedRegulatoryEvent } from '@/types/regulatory';

interface RegulatoryEventDetailsProps {
  event: RegulatoryEvent | NormalizedRegulatoryEvent;
  onBack?: () => void;
  className?: string;
}

const RegulatoryEventDetails: React.FC<RegulatoryEventDetailsProps> = ({
  event,
  onBack,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Type guard to check if event is normalized
  const isNormalizedEvent = (event: any): event is NormalizedRegulatoryEvent => {
    return 'normalizedTitle' in event;
  };

  const normalizedEvent = isNormalizedEvent(event) ? event : null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'past': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'delayed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'Not specified';
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, 'MMMM dd, yyyy');
    } catch {
      return typeof date === 'string' ? date : 'Invalid date';
    }
  };

  const handleShare = () => {
    // Implementation for sharing functionality
    navigator.share?.({
      title: event.title,
      text: event.description,
      url: window.location.href
    }).catch(() => {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
    });
  };

  const handleDownload = () => {
    // Implementation for download functionality
    console.log('Download functionality would be implemented here');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Implementation for bookmark functionality
    console.log('Bookmark functionality would be implemented here');
  };

  const handleSourceClick = () => {
    if (event.sourceUrl) {
      window.open(event.sourceUrl, '_blank');
    }
  };

  // Mock data for demonstration - in real implementation, this would come from the normalized event
  const mockSummary = `This ${event.type} from ${event.source} addresses ${event.framework} requirements in the ${event.jurisdiction} jurisdiction.`;
  const mockRiskScore = event.impactScore || Math.floor(Math.random() * 40) + 60; // Default to impact score or random
  const mockImpactAreas = ['Compliance Programs', 'Risk Management', 'Reporting Obligations'];
  const mockAffectedEntities = ['Financial Institutions', 'Investment Firms', 'Asset Managers'];
  const mockRequirements = [
    'Review and update existing policies',
    'Implement new reporting procedures', 
    'Train relevant staff members',
    'Establish monitoring mechanisms'
  ];
  const mockSuggestedActions = [
    'Conduct gap analysis against new requirements',
    'Update compliance framework documentation',
    'Schedule training sessions for affected teams',
    'Set up project management for implementation'
  ];

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={getPriorityColor(event.priority)}>
                {event.priority}
              </Badge>
              <Badge variant="outline" className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
              <Badge variant="outline">
                {event.framework.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {event.jurisdiction.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBookmark}
            className={`gap-2 ${isBookmarked ? 'bg-blue-50 text-blue-700' : ''}`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Event Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {event.description}
                  </p>
                  
                  {normalizedEvent?.normalizedDescription && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">AI Summary</h4>
                      <p className="text-blue-800 text-sm">
                        {mockSummary}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-6">
              <div className="space-y-6">
                {/* Risk Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Risk Score</span>
                          <span className="text-sm font-bold">{mockRiskScore}/100</span>
                        </div>
                        <Progress value={mockRiskScore} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          {mockRiskScore >= 80 ? 'High Risk' : mockRiskScore >= 60 ? 'Medium Risk' : 'Low Risk'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Areas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Impact Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockImpactAreas.map((area, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          <span className="text-sm">{area}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Affected Entities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Affected Entities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockAffectedEntities.map((entity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full" />
                          <span className="text-sm">{entity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    Key Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5" />
                        <span className="text-sm flex-1">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Suggested Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSuggestedActions.map((action, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-5 h-5 bg-blue-100 border-2 border-blue-300 rounded mt-0.5" />
                        <span className="text-sm flex-1">{action}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Key Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Published
                </label>
                <p className="text-sm font-medium">{formatDate(event.publishedDate)}</p>
              </div>
              {event.effectiveDate && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Effective Date
                  </label>
                  <p className="text-sm font-medium">{formatDate(event.effectiveDate)}</p>
                </div>
              )}
              {event.deadlineDate && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Deadline
                  </label>
                  <p className="text-sm font-medium text-red-600">{formatDate(event.deadlineDate)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Source Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Source Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Authority
                </label>
                <p className="text-sm font-medium">{event.source}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Framework
                </label>
                <p className="text-sm font-medium">{event.framework.toUpperCase()}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Jurisdiction
                </label>
                <p className="text-sm font-medium">{event.jurisdiction.toUpperCase()}</p>
              </div>
              {event.sourceUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSourceClick}
                  className="w-full gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Original Source
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Impact Score */}
          {event.impactScore !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle>Impact Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {event.impactScore}
                  </div>
                  <Progress value={event.impactScore} className="h-2 mb-2" />
                  <p className="text-xs text-gray-500">
                    Impact assessment score
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegulatoryEventDetails;
