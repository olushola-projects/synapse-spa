
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Linkedin, Mail, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JoinWaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinWaitlistDialog = ({ open, onOpenChange }: JoinWaitlistDialogProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("You've been added to our waitlist!");
      onOpenChange(false);
      setEmail("");
    }, 1500);
  };

  const handleSocialSignup = (provider: 'linkedin' | 'gmail') => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Successfully joined waitlist with ${provider}!`);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Join the Synapses Waitlist</DialogTitle>
          <DialogDescription>
            Get early access to our Governance, Risk, and Compliance platform and shape the future of GRC.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 flex items-center gap-2"
              onClick={() => handleSocialSignup('linkedin')}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Linkedin className="h-4 w-4" />}
              Continue with LinkedIn
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-[#DB4437] text-white hover:bg-[#DB4437]/90 flex items-center gap-2"
              onClick={() => handleSocialSignup('gmail')}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Continue with Gmail
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text" 
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email" 
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  type="text" 
                  placeholder="Your position"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Select>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="sg">Singapore</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  type="text" 
                  placeholder="Your organization"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="missing-capability" className="text-sm font-medium">
                  What's one capability, workflow, or tool you believe is missing from the current compliance landscape?
                </Label>
                <p className="text-xs text-gray-500">
                  Think about your day-to-day—what would make your work significantly more efficient, insightful, or impactful?
                </p>
                <Textarea
                  id="missing-capability"
                  placeholder="Share your thoughts..."
                  className="min-h-24"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="limiting-tools" className="text-sm font-medium">
                  Are there any existing tools or platforms you've found limiting in your compliance work? If so, what challenges have you experienced?
                </Label>
                <p className="text-xs text-gray-500">
                  Your perspective will help us understand where existing solutions may fall short—and where new value can be created.
                </p>
                <Textarea
                  id="limiting-tools"
                  placeholder="Share your experiences..."
                  className="min-h-24"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="engagement" className="text-sm font-medium">
                  How do you currently engage with platforms like LinkedIn, GRC forums, or associations to stay informed, upskill, or solve regulatory challenges?
                </Label>
                <p className="text-xs text-gray-500">
                  We'd love to learn how you gather insights, build networks, or contribute to the professional community.
                </p>
                <Textarea
                  id="engagement"
                  placeholder="Share your approaches..."
                  className="min-h-24"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !email}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </form>
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          By joining, you agree to our <a href="/legal/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/legal/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinWaitlistDialog;
