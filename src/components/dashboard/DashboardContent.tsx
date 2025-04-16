
import React from "react";

interface DashboardContentProps {
  children: React.ReactNode;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
      {children}
    </main>
  );
};

export default DashboardContent;
