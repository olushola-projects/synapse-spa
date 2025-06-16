import React, { useCallback } from 'react';
import { cn } from "@/lib/utils";

interface DashboardHeroEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}

export function DashboardHeroEmbed({ className, onClick, ...props }: DashboardHeroEmbedProps) {
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <div 
      className={cn(
        "relative w-full aspect-[16/9] overflow-hidden rounded-lg border bg-background shadow-xl",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/20">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Dashboard Preview</h3>
            <p className="text-muted-foreground">Interactive dashboard preview will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
