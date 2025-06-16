# Enhanced Dashboard Components

This directory contains a set of enhanced dashboard components designed to provide a modern, flexible, and feature-rich dashboard experience for the Synapses application. These components were implemented in four phases to systematically improve the dashboard functionality and user experience.

## Implementation Phases

### Phase 1: Enhanced Dashboard Template

The `EnhancedDashboardTemplate` component provides a foundation for all dashboard views with consistent layout and styling. It includes:

- Flexible header with title, description, and view mode toggle
- Metrics overview section with status indicators and trend visualization
- Alerts section with priority indicators and status badges
- Quick actions section with progress tracking
- Customizable content area for dashboard-specific components

### Phase 2: Advanced Data Visualization Widgets

The `AdvancedDataWidget` component enhances data visualization capabilities with:

- Support for multiple chart types (bar, line, pie, table)
- Interactive controls for switching between visualization types
- Consistent loading, empty, and error states
- Action buttons for refresh, download, and sharing
- Responsive design for all screen sizes

### Phase 3: Enhanced Navigation and Organization

The `EnhancedSidebar` component improves navigation and organization with:

- Hierarchical navigation structure with collapsible sections
- Quick action buttons for common tasks
- Visual indicators for notifications and badges
- User profile section with status indicator
- Responsive design for mobile and desktop

### Phase 4: Integrated Dashboard Layout

The `EnhancedDashboardLayout` component ties everything together with:

- Responsive layout that works on all device sizes
- Integration of sidebar, top navigation, and content area
- Support for promotional banners and announcements
- User menu with profile information and actions
- Notification indicators for messages and alerts

### Phase 5: Regulatory Dashboard Components

The regulatory dashboard components provide comprehensive tools for monitoring and managing regulatory events:

- `EnhancedRegulatoryCalendar`: Interactive calendar of regulatory events with filtering capabilities
- `RegulatoryEventDetails`: Detailed view of regulatory events with impact analysis and suggested actions
- `RegulatoryAnalyticsWidget`: Data visualization for regulatory events by jurisdiction, type, priority, and status
- `RegulatorySourcesWidget`: Management interface for regulatory data sources
- `RegulatoryDashboard`: Dedicated page integrating all regulatory components with filtering and export capabilities

## Usage

### Basic Usage

```tsx
import { EnhancedDashboardLayout, EnhancedDashboardTemplate } from '@/components/dashboard';
import { AdvancedDataWidget } from '@/components/widgets';

const MyDashboard: React.FC = () => {
  return (
    <EnhancedDashboardLayout
      userName="John Doe"
      userRole="ESG Analyst"
      appName="Synapses"
      appBadge="ESG Pro"
    >
      <EnhancedDashboardTemplate
        title="My Dashboard"
        description="Overview of key metrics and tasks"
        metrics={myMetrics}
        alerts={myAlerts}
        actions={myActions}
      >
        <div className="grid grid-cols-2 gap-6">
          <AdvancedDataWidget
            title="Performance Metrics"
            data={chartData}
            defaultChartType="bar"
          />
          
          {/* Additional dashboard content */}
        </div>
      </EnhancedDashboardTemplate>
    </EnhancedDashboardLayout>
  );
};
```

### Regulatory Dashboard Example

```tsx
import { useNavigate } from 'react-router-dom';
import { EnhancedRegulatoryCalendar } from '@/components/widgets';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RegulatoryWidget: React.FC<{ onRemove: () => void }> = ({ onRemove }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">Regulatory Calendar</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onRemove}
          >
            <Trash2 size={14} />
          </Button>
        </div>
        <CardDescription>Upcoming regulatory events and deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        <EnhancedRegulatoryCalendar 
          showFilters={false} 
          maxEvents={5} 
          className="border-0 shadow-none" 
          onEventClick={() => navigate('/regulatory-dashboard')}
        />
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => navigate('/regulatory-dashboard')}
        >
          View Full Regulatory Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
};
```

### Complete Example

For a complete implementation example, see the `IntegratedDashboardExample.tsx` file, which demonstrates how to use all the enhanced dashboard components together.

## Component Structure

```
dashboard/
├── EnhancedDashboardTemplate.tsx  # Base dashboard template with metrics, alerts, and actions
├── EnhancedSidebar.tsx            # Enhanced navigation sidebar with hierarchical structure
├── EnhancedDashboardLayout.tsx    # Complete dashboard layout integrating all components
├── IntegratedDashboardExample.tsx # Example implementation of all components
└── index.ts                       # Exports all components and types

widgets/
├── AdvancedDataWidget.tsx         # Enhanced data visualization widget
├── EnhancedWidget.tsx             # Base widget component with consistent styling
├── WidgetStates.tsx               # Widget state management components
├── EnhancedRegulatoryCalendar.tsx # Interactive calendar of regulatory events
├── RegulatoryEventDetails.tsx     # Detailed view of regulatory events
├── RegulatoryAnalyticsWidget.tsx  # Data visualization for regulatory events
├── RegulatorySourcesWidget.tsx    # Management interface for regulatory data sources
└── index.ts                       # Exports all widget components and types

pages/
├── Dashboard.tsx                  # Main dashboard with widget management
├── RegulatoryDashboard.tsx        # Dedicated regulatory dashboard page
└── ... other pages
```

## Customization

All components accept a `className` prop for custom styling using Tailwind CSS or other CSS frameworks. Additionally, most components accept specific props for customizing their appearance and behavior.

Refer to the TypeScript interfaces in each component file for detailed information on available props and customization options.