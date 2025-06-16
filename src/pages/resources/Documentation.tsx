import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search, FileText, Book, Code, Video, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Synapse Documentation</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to use the Synapse platform effectively with our
              comprehensive documentation.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8 relative">
              <Input
                type="text"
                placeholder="Search documentation..."
                className="pl-10 py-6 pr-4 rounded-lg shadow-sm border border-gray-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  title: "Getting Started",
                  icon: <FileText />,
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  title: "API Reference",
                  icon: <Code />,
                  color: "bg-green-100 text-green-700",
                },
                {
                  title: "User Guides",
                  icon: <Book />,
                  color: "bg-purple-100 text-purple-700",
                },
                {
                  title: "Video Tutorials",
                  icon: <Video />,
                  color: "bg-orange-100 text-orange-700",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex items-center hover:shadow-md transition-shadow"
                >
                  <div
                    className={`${item.color} p-2 rounded-full mr-4 flex-shrink-0`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Categories */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3">Platform Basics</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Getting Started Guide{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Navigation & Interface{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Account Management <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      User Preferences <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-gray-600"
                >
                  View All (12)
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3">Compliance Tools</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Regulatory Framework Library{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Assessment Builder <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Control Mapping <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Evidence Collection{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-gray-600"
                >
                  View All (15)
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3">AI Copilot (Dara)</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Dara Capabilities <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Asking Effective Questions{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Interpreting Responses{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Customizing Dara <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-gray-600"
                >
                  View All (8)
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3">
                  Collaboration Features
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Team Workspaces <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Task Assignment <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Document Sharing <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Review Workflows <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-gray-600"
                >
                  View All (10)
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3">Reporting</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Dashboard Analytics{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Custom Reports <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Export Options <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Scheduled Reports <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-gray-600"
                >
                  View All (7)
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3">Integration & API</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      API Reference <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Available Integrations{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Authentication <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Webhooks <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-gray-600"
                >
                  View All (14)
                </Button>
              </Card>
            </div>
          </div>

          {/* Helpful Resources */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-2xl font-semibold mb-6">
              Additional Resources
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  title: "Community Forum",
                  description: "Connect with other Synapse users",
                },
                {
                  title: "Video Tutorials",
                  description: "Visual guides for platform features",
                },
                {
                  title: "Webinar Recordings",
                  description: "Expert-led training sessions",
                },
                {
                  title: "GRC Templates",
                  description: "Ready-to-use compliance resources",
                },
              ].map((resource, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {resource.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Documentation;
