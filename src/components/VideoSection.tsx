
import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const VideoSection = () => {
  return (
    <div className="py-12 bg-white relative overflow-hidden">
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
            Discover how our platform is transforming the GRC landscape for professionals worldwide.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-xl">
          {/* YouTube placeholder with play button overlay */}
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center group cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-8 w-8 text-blue-600 ml-1" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-6 left-6 text-white text-left max-w-md">
                <h3 className="text-xl font-bold">GRC Infrastructure for Modern Professionals</h3>
                <p className="text-sm mt-2 text-gray-200">Learn how Synapses is transforming compliance workflows</p>
                
                <div className="flex items-center mt-4">
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage src="/lovable-uploads/06c9cfd1-9bb6-43dd-a1b8-2d3ff1f97ad1.png" alt="Product Manager" />
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
          
          {/* YouTube iframe - hidden initially, would be shown on click in a real implementation */}
          <div className="hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/your-video-id-here"
              title="Synapses Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Placeholder image for the video thumbnail */}
          <img 
            src="/placeholder.svg" 
            alt="Video Thumbnail" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2">
            Watch Full Demo <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
