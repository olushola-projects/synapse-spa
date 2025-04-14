
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const CTASection = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-synapse-primary to-synapse-secondary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Transform Your GRC Experience?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join the waitlist today and be among the first to access Synapse when we launch.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-2xl font-bold mb-6">Join the Community</h3>
                <ul className="space-y-4">
                  {[
                    "Early access to all platform features",
                    "Personalized onboarding experience",
                    "Exclusive invitation to launch events",
                    "Opportunity to shape product roadmap",
                    "Free premium features during beta"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 mt-1">
                        <Check size={16} className="text-synapse-accent" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Sign Up for Early Access</h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Work Email"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 text-white"
                    />
                  </div>
                  <div>
                    <select
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 text-white"
                    >
                      <option value="">Select your role</option>
                      <option value="Compliance Officer">Compliance Officer</option>
                      <option value="Risk Manager">Risk Manager</option>
                      <option value="Legal Counsel">Legal Counsel</option>
                      <option value="Auditor">Auditor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <Button className="w-full bg-white hover:bg-white/90 text-synapse-primary font-medium py-6">
                    Join Waitlist
                  </Button>
                  <p className="text-xs text-center opacity-70">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
