
import React from 'react';
import { RegulatoryFocusChart, ComplianceRiskChart, ControlStatusChart } from './charts/DashboardCharts';

const MobileCharts = () => {
  return (
    <div className="md:hidden flex flex-col space-y-4 p-4">
      <div className="bg-white rounded-lg shadow p-4">
        <RegulatoryFocusChart />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <ComplianceRiskChart />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <ControlStatusChart />
      </div>
    </div>
  );
};

export default MobileCharts;
