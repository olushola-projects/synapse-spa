
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const WaitlistForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Store the waitlist entry in Supabase
      const { error } = await supabase
        .from('waitlist')
        .insert([
          { 
            email, 
            name, 
            company, 
            role,
            created_at: new Date().toISOString() 
          }
        ]);
      
      if (error) throw error;
      
      setIsSubmitted(true);
      
      toast({
        title: "Success!",
        description: "You've been added to the Synapses waitlist.",
        variant: "default",
      });
      
      // Clear form
      setEmail("");
      setName("");
      setCompany("");
      setRole("");
    } catch (error: any) {
      console.error("Error submitting to waitlist:", error);
      
      toast({
        title: "Something went wrong",
        description: "We couldn't add you to the waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {isSubmitted ? (
        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">You're on the list!</h3>
          <p className="text-gray-600">
            Thank you for joining the Synapses waitlist. We'll contact you soon with updates on our launch.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Work Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <Input
              id="company"
              type="text"
              placeholder="Your organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Job Role
            </label>
            <Input
              id="role"
              type="text"
              placeholder="Your position"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-800 py-6 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Join Waitlist <ArrowRight className="ml-2" size={18} />
              </span>
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            By joining, you agree to our <a href="/legal/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/legal/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </form>
      )}
    </div>
  );
};

export default WaitlistForm;
