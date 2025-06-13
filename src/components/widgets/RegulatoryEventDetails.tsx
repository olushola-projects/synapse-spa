import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, AlertTriangle, FileText, Globe, Bookmark, ArrowLeft, ExternalLink, Download } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { RegulatoryEvent } from '@/types/regulatory';

interface RegulatoryEventDetailsProps {
  event: RegulatoryEvent;
  onBack?: () => void;
  className?: string;
}

export const RegulatoryEventDetails: React.FC<RegulatoryEventDetailsProps> = ({
  event,
  onBack,
  className = "",
}) => {
  // Helper functions for UI
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEADLINE':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'IMPLEMENTATION':
        return <Calendar size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-purple-600" />;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(parseISO(dateString), 'MMMM d, yyyy');
  };
  
  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="h-8 w-8 p-0 mr-1"
              >
                <ArrowLeft size={16} />
              </Button>
            )}
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {getTypeIcon(event.type)}
                {event.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {event.summary}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={getPriorityColor(event.priority)}>
            {event.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="overview" className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
            <TabsTrigger value="actions">Suggested Actions</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="m-0">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Jurisdiction</p>
                <div className="flex items-center gap-1">
                  <Globe size={14} className="text-muted-foreground" />
                  <p className="text-sm font-medium">{event.jurisdiction}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Framework</p>
                <div className="flex items-center gap-1">
                  <Bookmark size={14} className="text-muted-foreground" />
                  <p className="text-sm font-medium">{event.framework || 'N/A'}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium">{event.category || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-medium">{event.status}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Published Date</p>
                <p className="text-sm font-medium">{formatDate(event.publishedDate)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Effective Date</p>
                <p className="text-sm font-medium">{formatDate(event.effectiveDate)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Deadline Date</p>
                <p className="text-sm font-medium">{formatDate(event.deadlineDate)}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Description</p>
              <div className="text-sm">
                {event.description || 'No detailed description available.'}
              </div>
            </div>
            
            {event.sourceUrl && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => window.open(event.sourceUrl, '_blank')}
                >
                  <ExternalLink size={14} />
                  View Source Document
                </Button>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="impact" className="m-0">
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Risk Score</h4>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{
                      width: `${event.riskScore || 50}%`,
                      backgroundColor: event.riskScore && event.riskScore > 70 ? '#ef4444' : 
                                      event.riskScore && event.riskScore > 40 ? '#f97316' : '#22c55e'
                    }}
                  />
                  <span className="text-sm font-medium">{event.riskScore || 'N/A'}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Impact Areas</h4>
                {event.impactAreas && event.impactAreas.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {event.impactAreas.map((area, index) => (
                      <Badge key={index} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No impact areas identified</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Affected Entities</h4>
                {event.affectedEntities && event.affectedEntities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {event.affectedEntities.map((entity, index) => (
                      <Badge key={index} variant="outline">{entity}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No affected entities identified</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Key Requirements</h4>
                {event.requirements && event.requirements.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {event.requirements.map((req, index) => (
                      <li key={index} className="text-sm">{req}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific requirements identified</p>
                )}
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="actions" className="m-0">
          <CardContent className="pt-4">
            {event.suggestedActions && event.suggestedActions.length > 0 ? (
              <div className="space-y-4">
                {event.suggestedActions.map((action, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-1">{action.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{action.priority}</Badge>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Assign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No suggested actions available</p>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="border-t flex justify-between py-3">
        <div className="text-xs text-muted-foreground">
          Source: {event.source || 'Unknown'}
        </div>
        <Button variant="ghost" size="sm" className="h-7">
          <Download size={14} className="mr-1" />
          Export
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegulatoryEventDetails;