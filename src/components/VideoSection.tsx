
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const VideoSection = () => {
  // Function to handle video play (in a real implementation, this would show the actual video)
  const handlePlayVideo = () => {
    console.log("Playing video");
    // Future implementation could include opening a modal with the actual video
  };

  // Handle the scroll to this section when How It Works is clicked
  useEffect(() => {
    const scrollToVideo = () => {
      const hash = window.location.hash;
      if (hash === '#how-it-works') {
        const videoSection = document.getElementById('how-it-works');
        if (videoSection) {
          const yOffset = -80; // Account for header height
          const y = videoSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    };
    
    // Run on mount and when hash changes
    scrollToVideo();
    window.addEventListener('hashchange', scrollToVideo);
    
    return () => {
      window.removeEventListener('hashchange', scrollToVideo);
    };
  }, []);

  return (
    <div className="py-12 bg-white relative overflow-hidden" id="how-it-works">
      {/* Fluid background like Stripe */}
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8e9ac2,#d8b5c1,#f5d2ae,#d8b5c1,#8e9ac2)] animate-gradient-x"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900">
            See Synapses in Action
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how our platform is transforming the Governance, Risk, and Compliance landscape for professionals worldwide.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-xl">
          {/* YouTube placeholder with play button overlay */}
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center group cursor-pointer" onClick={handlePlayVideo}>
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-8 w-8 text-blue-600 ml-1" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-6 left-6 text-white text-left max-w-md">
                <h3 className="text-xl font-bold">GRC Infrastructure for Modern Professionals</h3>
                <p className="text-sm mt-2 text-gray-200">Learn how Synapses is transforming compliance workflows</p>
                
                <div className="flex items-center mt-4">
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage src="/lovable-uploads/db02338b-7e4e-46d0-bfe8-e9b9d9005d3f.png" alt="Product Manager" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p className="text-sm font-medium">Jane Doe</p>
                    <p className="text-xs opacity-80">Product Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder image for the video thumbnail */}
          <img 
            src="/lovable-uploads/45cf99e7-e503-4ed3-b858-be606a5dd904.png" 
            alt="Synapses Demo Video" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2" onClick={handlePlayVideo}>
            Watch Full Demo <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
