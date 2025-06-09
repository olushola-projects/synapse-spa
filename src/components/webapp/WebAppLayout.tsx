
import React, { useState, useEffect } from 'react';
import { RoleSelector } from '../onboarding/RoleSelector';
import { ESGOfficerDashboard } from './ESGOfficerDashboard';
import { KYCAnalystDashboard } from './KYCAnalystDashboard';
import { ComplianceLeadDashboard } from './ComplianceLeadDashboard';

export const WebAppLayout: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(true);

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

  return (
    <>
      <RoleSelector open={showRoleSelector} onRoleSelect={handleRoleSelect} />
      {selectedRole && renderDashboard()}
    </>
  );
};
