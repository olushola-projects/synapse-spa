
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Linkedin, Mail, Loader2 } from "lucide-react";

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
      <DialogContent className="sm:max-w-md">
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

          <form onSubmit={handleEmailSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting || !email}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </div>
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
