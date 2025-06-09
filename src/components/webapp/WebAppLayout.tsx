
import React, { useState, useEffect } from 'react';
import { RoleSelector } from '../onboarding/RoleSelector';
import { ESGOfficerDashboard } from './ESGOfficerDashboard';
import { KYCAnalystDashboard } from './KYCAnalystDashboard';
import { ComplianceLeadDashboard } from './ComplianceLeadDashboard';
import { WebAppSidebar } from './WebAppSidebar';
import { WebAppPromoBar } from './WebAppPromoBar';
import { WebAppTopNav } from './WebAppTopNav';
import { SidebarProvider } from '@/components/ui/sidebar';

export const WebAppLayout: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(true);
  const [userName, setUserName] = useState('Alex');

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setShowRoleSelector(false);
    // Store in localStorage for persistence
    localStorage.setItem('userRole', roleId);
  };

  useEffect(() => {
    // Check if user has already selected a role
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setSelectedRole(storedRole);
      setShowRoleSelector(false);
    }
  }, []);

  const renderDashboard = () => {
    switch (selectedRole) {
      case 'esg-officer':
        return <ESGOfficerDashboard />;
      case 'kyc-analyst':
        return <KYCAnalystDashboard />;
      case 'compliance-lead':
        return <ComplianceLeadDashboard />;
      default:
        return <ESGOfficerDashboard />; // Default fallback
    }
  };

  if (showRoleSelector) {
    return <RoleSelector open={showRoleSelector} onRoleSelect={handleRoleSelect} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-gray-50">
        {/* Promo Bar */}
        <WebAppPromoBar />
        
        {/* Top Navigation */}
        <WebAppTopNav userName={userName} />
        
        {/* Main Content Area with Sidebar */}
        <div className="flex flex-1">
          <WebAppSidebar />
          
          {/* Dashboard Content */}
          <main className="flex-1 p-6">
            {renderDashboard()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
