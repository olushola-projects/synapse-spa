
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Lucide } from 'lucide-react';

// Define the widget type
export interface WidgetType {
  id: string;
  name: string;
  description: string;
  icon: Lucide;
}

// Context for the dashboard
interface DashboardContextValue {
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export const DashboardContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DashboardContext.Provider value={{ isDragging, setIsDragging }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardContextProvider');
  }
  return context;
};

interface WidgetGridProps {
  children: ReactNode;
  className?: string;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({ children, className }) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4', className)}>
      {children}
    </div>
  );
};

interface WidgetProps {
  title: string;
  children: ReactNode;
  onRemove?: () => void;
  className?: string;
}

export const Widget: React.FC<WidgetProps> = ({ title, children, onRemove, className }) => {
  return (
    <div className={cn('bg-white rounded-lg border shadow-sm h-full flex flex-col', className)}>
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-medium">{title}</h3>
        {onRemove && (
          <button 
            onClick={onRemove} 
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Remove widget"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
};
