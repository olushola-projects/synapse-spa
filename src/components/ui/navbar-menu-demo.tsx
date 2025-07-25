
// import React, { useState } from 'react';
// React import removed - using modern JSX transform
import { useState } from 'react';
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";

/**
 * Demo component showcasing the navbar menu functionality
 */
export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
      <p className="text-black dark:text-white">
        The Navbar will show on top of the page
      </p>
    </div>
  );
}

/**
 * Main navbar component with GRC-focused menu items
 */
function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Solutions">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink to="/solutions/compliance">Compliance Management</HoveredLink>
            <HoveredLink to="/solutions/risk-assessment">Risk Assessment</HoveredLink>
            <HoveredLink to="/solutions/regulatory-intelligence">Regulatory Intelligence</HoveredLink>
            <HoveredLink to="/solutions/audit-automation">Audit Automation</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="AI Agents">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="SFDR Navigator"
              to="/agents/sfdr-navigator"
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
              description="Navigate SFDR compliance with AI-powered guidance and automated reporting."
            />
            <ProductItem
              title="AML Investigator"
              to="/agents/aml-investigator"
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop"
              description="Advanced AI agent for anti-money laundering investigations and case management."
            />
            <ProductItem
              title="Risk Analyzer"
              to="/agents/risk-analyzer"
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
              description="Real-time risk assessment and predictive analytics for proactive risk management."
            />
            <ProductItem
              title="Compliance Monitor"
              to="/agents/compliance-monitor"
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop"
              description="Continuous compliance monitoring with automated alerts and remediation suggestions."
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Platform">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink to="/platform/dashboard">Dashboard</HoveredLink>
            <HoveredLink to="/platform/analytics">Analytics</HoveredLink>
            <HoveredLink to="/platform/integrations">Integrations</HoveredLink>
            <HoveredLink to="/platform/api">API Access</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Resources">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink to="/resources/documentation">Documentation</HoveredLink>
            <HoveredLink to="/resources/blog">Blog</HoveredLink>
            <HoveredLink to="/resources/case-studies">Case Studies</HoveredLink>
            <HoveredLink to="/resources/webinars">Webinars</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
