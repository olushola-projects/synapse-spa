
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  // State to handle the animated background gradient
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  
  // Track mouse position for gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setGradientPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Navigate to form section on CTA click
  const handleJoinWaitlist = () => {
    // Scroll to the form on the homepage
    const element = document.getElementById('cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative overflow-hidden">
      {/* Animated background inspired by Stripe */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 opacity-90 pointer-events-none"
        style={{
          backgroundPosition: `${gradientPosition.x * 100}% ${gradientPosition.y * 100}%`,
          transition: "background-position 0.5s ease-out",
        }}
      />
      
      <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_100%)] pointer-events-none" />
      
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-fade-in">
            Launching Soon — Join the Waitlist
          </div>
          
          <h1 className="heading-xl mb-6 text-slate-900">
            The Future of <span className="text-blue-700">GRC</span> is Connected
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-10">
            Synapse empowers GRC professionals with intelligent tools, specialized knowledge, 
            and a vibrant community to navigate complex regulatory landscapes.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-blue-700 hover:bg-blue-800 text-white"
              onClick={handleJoinWaitlist}
            >
              Join Waitlist <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="border-blue-700 text-blue-700 hover:bg-blue-50">
              Learn More
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-500 justify-center">
            <span className="text-green-600 font-medium">● Early Access</span>
            <span>300+ Professionals Joined</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
