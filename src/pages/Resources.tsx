
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, BookOpen, Download, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Resources = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              GRC Resources & Knowledge Hub
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Expand your GRC knowledge with our collection of guides, templates, and industry insights
            </p>
          </div>
        </div>
      </div>

      {/* Resource Categories */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Guides & Articles */}
            <Card className="hover-lift">
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Guides & Articles</CardTitle>
                <CardDescription>
                  In-depth articles and practical guides on GRC best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="text-blue-700 hover:underline">Getting Started with Modern GRC</li>
                  <li className="text-blue-700 hover:underline">Regulatory Intelligence: The Complete Guide</li>
                  <li className="text-blue-700 hover:underline">Building a Resilient Compliance Program</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-800">
                  Browse All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Templates & Tools */}
            <Card className="hover-lift">
              <CardHeader>
                <Download className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Templates & Tools</CardTitle>
                <CardDescription>
                  Downloadable resources to streamline your compliance workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="text-blue-700 hover:underline">Risk Assessment Matrix Template</li>
                  <li className="text-blue-700 hover:underline">Compliance Program Checklist</li>
                  <li className="text-blue-700 hover:underline">Regulatory Change Management Tracker</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-800">
                  Browse All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Webinars & Events */}
            <Card className="hover-lift">
              <CardHeader>
                <Video className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Webinars & Events</CardTitle>
                <CardDescription>
                  Educational sessions with industry experts and thought leaders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="text-blue-700 hover:underline">The Future of AI in Compliance</li>
                  <li className="text-blue-700 hover:underline">Navigating Cross-Border Data Regulations</li>
                  <li className="text-blue-700 hover:underline">Building a Culture of Compliance</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-800">
                  Browse All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Featured Resources */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Resources</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">2025 GRC Trends Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Explore the evolving landscape of governance, risk, and compliance. Our comprehensive
                    report highlights emerging trends, challenges, and opportunities in the GRC space.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Download Report</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Regulatory Compliance Toolkit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    A collection of essential templates, checklists, and guides to help you build and maintain
                    an effective compliance program, tailored for modern regulatory environments.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Access Toolkit</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="bg-blue-50 rounded-xl p-8">
            <div className="max-w-2xl mx-auto text-center">
              <BookOpen className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter to receive the latest resources, regulatory updates, and industry insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-md border border-gray-300 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
