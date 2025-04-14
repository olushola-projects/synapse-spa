
import { useState } from 'react';
import { Widget } from '../dashboard/WidgetGrid';
import { Button } from '@/components/ui/button';
import { Award, Trophy, Medal, Star, Gift, Flag, Target, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GamificationComponent } from '@/components/GamificationComponent';

interface GamificationWidgetProps {
  onRemove?: () => void;
}

const GamificationWidget = ({ onRemove }: GamificationWidgetProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Sample badges data
  const badges = [
    { id: 1, name: "GDPR Expert", icon: Trophy, color: "amber", progress: 100 },
    { id: 2, name: "AML Champion", icon: Medal, color: "blue", progress: 75 },
    { id: 3, name: "Risk Analyst", icon: Star, color: "green", progress: 45 },
    { id: 4, name: "Compliance Leader", icon: Award, color: "purple", progress: 20 },
  ];

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "amber": return "bg-amber-100 text-amber-600";
      case "blue": return "bg-blue-100 text-blue-600";
      case "green": return "bg-green-100 text-green-600";
      case "purple": return "bg-purple-100 text-purple-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <Widget title="Your Achievements" onRemove={onRemove}>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Your Badges</h3>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setIsDetailsOpen(true)}>
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center justify-center p-3 border rounded-lg hover:border-blue-200 transition-all cursor-pointer">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${getBadgeColor(badge.color)}`}>
                  <badge.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center">{badge.name}</span>
                {badge.progress < 100 && (
                  <div className="w-full mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Current Level</h4>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-blue-700 mr-1">3</span>
                  <span className="text-xs text-gray-500">/ 10</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Points</h4>
                <div className="text-xl font-bold text-blue-700">425</div>
              </div>
              <div>
                <Button size="sm" variant="outline">Claim Rewards</Button>
              </div>
            </div>
          </div>
        </div>
      </Widget>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Gamification &amp; Achievements</DialogTitle>
            <DialogDescription>
              Track your progress, earn badges, and compete with your peers
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <GamificationComponent />
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GamificationWidget;
