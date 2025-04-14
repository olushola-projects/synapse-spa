
import { Widget } from '../dashboard/WidgetGrid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

// Sample forum posts
const forumPosts = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      role: 'AML Expert'
    },
    title: 'AMLD6 Implementation Challenges',
    content: 'Has anyone developed a checklist for ensuring company compliance with the cybersecurity requirements in AMLD6?',
    replies: 12,
    views: 240,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    user: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?u=michael',
      role: 'Compliance Officer'
    },
    title: 'Cross-border Data Transfer Under GDPR',
    content: 'Looking for guidance on how others are handling the new EU-US data transfer framework after Privacy Shield invalidation.',
    replies: 8,
    views: 189,
    timestamp: '6 hours ago',
  },
  {
    id: 3,
    user: {
      name: 'Emma Watson',
      avatar: 'https://i.pravatar.cc/150?u=emma',
      role: 'Legal Counsel'
    },
    title: 'AML Jurisdictional Conflicts',
    content: 'How are firms reconciling contradictory requirements between UK and UAE AML frameworks?',
    replies: 5,
    views: 102,
    timestamp: '1 day ago',
  }
];

interface ForumPreviewWidgetProps {
  onRemove?: () => void;
}

const ForumPreviewWidget = ({ onRemove }: ForumPreviewWidgetProps) => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitWaitlist = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    // In production, this would call your API
    toast({
      title: "Success!",
      description: "You've been added to the waitlist"
    });
    
    setSubmitted(true);
  };

  return (
    <>
      <Widget title="Community Forum" onRemove={onRemove}>
        <div className="space-y-4">
          {forumPosts.map((post) => (
            <Card key={post.id} className="hover:border-blue-200 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{post.user.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full ml-2">
                      {post.user.role}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{post.timestamp}</span>
                </div>
                <h3 className="font-medium mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{post.content}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <div className="flex items-center mr-4">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {post.replies} replies
                  </div>
                  <div>{post.views} views</div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Our community forum is currently in beta. Join the waitlist for early access!
              </p>
              <Button onClick={() => setIsWaitlistOpen(true)}>Join Waitlist</Button>
            </div>
          </div>
        </div>
      </Widget>
      
      <Dialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Forum Waitlist</DialogTitle>
            <DialogDescription>
              {submitted ? 
                "Thank you for joining the waitlist! We'll notify you when forum access is available." :
                "Get early access to our community forum where GRC professionals share insights and best practices."
              }
            </DialogDescription>
          </DialogHeader>
          
          {!submitted && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input 
                    id="email" 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSubmitWaitlist}>Join Waitlist</Button>
              </DialogFooter>
            </>
          )}
          
          {submitted && (
            <div className="py-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <Button onClick={() => setIsWaitlistOpen(false)}>Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForumPreviewWidget;
