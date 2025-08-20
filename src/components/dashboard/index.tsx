import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Healthy</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Metrics</CardTitle>
            <CardDescription>Current compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-sm text-muted-foreground">Compliance Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">SFDR classification completed</div>
              <div className="text-sm">Document uploaded</div>
              <div className="text-sm">Report generated</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
