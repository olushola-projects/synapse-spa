import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Play } from "lucide-react";
import { Helmet } from "react-helmet";

const Webinars = () => {
  const upcomingWebinars = [
    {
      id: 1,
      title: "AI-Driven Regulatory Compliance: Beyond Traditional Approaches",
      description: "Explore how artificial intelligence is transforming regulatory compliance workflows and risk management frameworks.",
      date: "January 25, 2024",
      time: "2:00 PM GMT",
      duration: "60 minutes",
      speakers: ["Dr. Sarah Chen", "Marcus Rodriguez"],
      tags: ["AI", "Compliance", "RegTech"],
      registrationOpen: true
    },
    {
      id: 2,
      title: "Global AML Standards: Navigating Cross-Border Compliance",
      description: "Understanding the evolving landscape of anti-money laundering regulations across different jurisdictions.",
      date: "February 8, 2024",
      time: "3:00 PM GMT",
      duration: "45 minutes",
      speakers: ["James Wilson", "Emma Thompson"],
      tags: ["AML", "Global", "Standards"],
      registrationOpen: true
    },
    {
      id: 3,
      title: "Digital Asset Regulation: Preparing for the Future",
      description: "How financial institutions can prepare for emerging digital asset regulations and compliance requirements.",
      date: "February 22, 2024",
      time: "1:00 PM GMT",
      duration: "75 minutes",
      speakers: ["Alex Kumar", "Lisa Park"],
      tags: ["Digital Assets", "Crypto", "Regulation"],
      registrationOpen: true
    }
  ];

  const pastWebinars = [
    {
      id: 4,
      title: "ESG Reporting Excellence: Best Practices and Frameworks",
      description: "Comprehensive guide to environmental, social, and governance reporting standards and implementation strategies.",
      date: "January 11, 2024",
      duration: "50 minutes",
      speakers: ["Rachel Green", "Tom Anderson"],
      tags: ["ESG", "Reporting", "Sustainability"],
      recordingAvailable: true
    },
    {
      id: 5,
      title: "Risk Management in the Age of Digital Transformation",
      description: "How digital transformation is reshaping risk management practices and compliance monitoring.",
      date: "December 14, 2023",
      duration: "65 minutes",
      speakers: ["Michael Brown", "Ana Rodriguez"],
      tags: ["Risk Management", "Digital", "Transformation"],
      recordingAvailable: true
    },
    {
      id: 6,
      title: "Regulatory Technology Implementation: Lessons Learned",
      description: "Real-world case studies and best practices from successful RegTech implementations.",
      date: "November 30, 2023",
      duration: "55 minutes",
      speakers: ["David Kim", "Jennifer White"],
      tags: ["RegTech", "Implementation", "Case Studies"],
      recordingAvailable: true
    }
  ];

  return (
    <>
      <Helmet>
        <title>Webinars - Synapses | GRC Professional Development</title>
        <meta name="description" content="Join our expert-led webinars on governance, risk, and compliance topics. Learn from industry leaders and stay ahead of regulatory changes." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              GRC Webinars
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay ahead of regulatory changes and industry best practices with our expert-led webinars designed for GRC professionals.
            </p>
          </div>
        </section>

        {/* Upcoming Webinars */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">Upcoming Webinars</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingWebinars.map((webinar) => (
                <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {webinar.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <CardTitle className="text-lg">{webinar.title}</CardTitle>
                    <CardDescription>{webinar.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {webinar.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {webinar.time} • {webinar.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {webinar.speakers.join(", ")}
                      </div>
                      <Button className="w-full mt-4">
                        Register Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Past Webinars */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">On-Demand Recordings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastWebinars.map((webinar) => (
                <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {webinar.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                    <CardTitle className="text-lg">{webinar.title}</CardTitle>
                    <CardDescription>{webinar.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {webinar.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {webinar.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {webinar.speakers.join(", ")}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Recording
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Never Miss a Webinar</h2>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to our newsletter and get notified about upcoming webinars and exclusive content.
            </p>
            <Button size="lg" variant="secondary">
              Subscribe to Updates
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Webinars;