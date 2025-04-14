
import { useState } from 'react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    id: 1,
    content: "Synapses has revolutionized how I stay updated on regulatory changes. The AI-powered insights save me hours of research every week.",
    name: "Sarah Johnson",
    role: "Chief Compliance Officer",
    company: "Financial Services Inc.",
    avatar: "/lovable-uploads/06c9cfd1-9bb6-43dd-a1b8-2d3ff1f97ad1.png"
  },
  {
    id: 2,
    content: "The networking capabilities on Synapses have connected me with peers facing similar challenges. The collaborative problem-solving has been invaluable.",
    name: "Michael Chang",
    role: "GRC Director",
    company: "TechGiant Corp",
    avatar: "/lovable-uploads/c5b1f529-364b-4a3f-9e4e-29fe1862e7b3.png"
  },
  {
    id: 3,
    content: "As someone new to the GRC field, the mentorship and learning resources on Synapses have accelerated my professional growth tremendously.",
    name: "Emma Rodriguez",
    role: "Compliance Analyst",
    company: "Healthcare Systems",
    avatar: "/lovable-uploads/6856e5f8-5b1a-4520-bdc7-da986d98d082.png"
  }
];

const supportTeam = [
  {
    name: "Alex Morgan",
    role: "GRC Specialist",
    avatar: "/lovable-uploads/06c9cfd1-9bb6-43dd-a1b8-2d3ff1f97ad1.png",
    status: "online"
  },
  {
    name: "Taylor Reed",
    role: "Compliance Expert",
    avatar: "/lovable-uploads/c5b1f529-364b-4a3f-9e4e-29fe1862e7b3.png",
    status: "online"
  },
  {
    name: "Jordan Smith",
    role: "Customer Success",
    avatar: "/lovable-uploads/6856e5f8-5b1a-4520-bdc7-da986d98d082.png",
    status: "away" 
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from GRC professionals who are already benefiting from early access to Synapses.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Desktop Testimonials */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          {/* Mobile Testimonial Carousel */}
          <div className="md:hidden">
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out" 
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-6 gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i === currentIndex ? 'bg-synapse-primary' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentIndex(i)}
                  ></button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  onClick={prev}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  onClick={next}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Still have questions section with profile bubbles */}
        <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="text-left max-w-md">
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">
                Our team of GRC experts is available to help you navigate compliance challenges and maximize the value of Synapses.
              </p>
              <div className="flex">
                <Link to="/company/contact">
                  <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                    Contact Us <MessageCircle className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex mb-4 relative">
                {supportTeam.map((member, index) => (
                  <div key={index} className="relative" style={{ marginLeft: index === 0 ? "0" : "-1rem" }}>
                    <Avatar className="h-14 w-14 border-2 border-white">
                      <AvatarImage src={member.avatar} alt={member.name} />
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-green-500' : 'bg-amber-400'}`}></div>
                  </div>
                ))}
                <div className="h-14 w-14 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-800 font-medium ml-[-1rem]">
                  +4
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center">Our team is ready to help</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-gray-50 rounded-full text-sm font-medium text-gray-600">
            <span>Trusted by</span>
            <span className="font-bold text-synapse-primary">300+</span>
            <span>GRC Professionals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="feature-card h-full flex flex-col">
    <div className="flex justify-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    <p className="text-gray-600 flex-grow mb-6">"{testimonial.content}"</p>
    <div className="flex items-center">
      <Avatar className="h-10 w-10 mr-4">
        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
      </Avatar>
      <div>
        <p className="font-semibold">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
      </div>
    </div>
  </div>
);

export default TestimonialsSection;
