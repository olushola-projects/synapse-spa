
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3, 
  Plus, 
  Settings, 
  Maximize2, 
  Minimize2, 
  MoreHorizontal,
  GripVertical,
  Eye,
  EyeOff
} from 'lucide-react';

interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'agent' | 'calendar' | 'insights';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  visible: boolean;
  customizable: boolean;
  data?: any;
}

interface CustomizableDashboardProps {
  widgets: DashboardWidget[];
  isCustomizing: boolean;
  onToggleCustomize: () => void;
  onWidgetUpdate: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  onAddWidget: (widget: DashboardWidget) => void;
}

export const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  widgets,
  isCustomizing,
  onToggleCustomize,
  onWidgetUpdate,
  onAddWidget
}) => {
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const handleDragStart = useCallback((widgetId: string) => {
    setDraggedWidget(widgetId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedWidget(null);
  }, []);

  const renderWidget = (widget: DashboardWidget) => {
    const sizeClasses = {
      small: 'col-span-1 row-span-1',
      medium: 'col-span-2 row-span-1',
      large: 'col-span-2 row-span-2'
    };

    return (
      <Card
        key={widget.id}
        className={`${sizeClasses[widget.size]} ${
          isCustomizing ? 'border-dashed border-2 border-blue-300' : ''
        } ${draggedWidget === widget.id ? 'opacity-50' : ''} transition-all`}
        draggable={isCustomizing}
        onDragStart={() => handleDragStart(widget.id)}
        onDragEnd={handleDragEnd}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
            {isCustomizing && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onWidgetUpdate(widget.id, { visible: !widget.visible })}
                >
                  {widget.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onWidgetUpdate(widget.id, { 
                    size: widget.size === 'small' ? 'medium' : 
                          widget.size === 'medium' ? 'large' : 'small' 
                  })}
                >
                  {widget.size === 'large' ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
                <div className="cursor-move p-1">
                  <GripVertical className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {widget.visible ? (
            <div className="text-center text-gray-500 text-sm">
              {widget.type} widget content
            </div>
          ) : (
            <div className="text-center text-gray-400 text-xs">
              Widget hidden
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customizable Dashboard</h2>
          <p className="text-gray-600">Tailor your workspace to your specific needs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isCustomizing ? "default" : "outline"}
            onClick={onToggleCustomize}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            {isCustomizing ? "Done Customizing" : "Customize Layout"}
          </Button>
          {isCustomizing && (
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Widget
            </Button>
          )}
        </div>
      </div>

      {isCustomizing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              Customization Mode
            </Badge>
          </div>
          <p className="text-sm text-blue-700">
            Drag widgets to reposition, use controls to resize, hide/show, or configure each widget.
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 auto-rows-fr">
        {widgets.map(renderWidget)}
        
        {isCustomizing && (
          <Card className="col-span-1 row-span-1 border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Add Widget</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
