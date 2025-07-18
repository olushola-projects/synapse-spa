import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NexusAgentChat } from "@/components/NexusAgentChat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  TrendingUp, 
  FileCheck, 
  AlertTriangle,
  CheckCircle2,
  Bot,
  Zap,
  Globe,
  Users
} from "lucide-react";

/**
 * NexusAgent page - Main interface for SFDR compliance validation
 * Provides both chat and form-based interaction with the Nexus Agent API
 */
const NexusAgent = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'overview'>('chat');

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "SFDR Compliance Validation",
      description: "Real-time validation of fund classifications against SFDR requirements"
    },
    {
      icon: <FileCheck className="w-6 h-6 text-green-600" />,
      title: "Article Classification",
      description: "Automated classification for Article 6, 8, and 9 fund categories"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      title: "PAI Indicator Analysis",
      description: "Principal Adverse Impact indicator compliance checking"
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
      title: "Risk Assessment",
      description: "Identify potential compliance issues before submission"
    }
  ];

  const stats = [
    { label: "Validation Accuracy", value: "99.2%", icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> },
    { label: "Processing Time", value: "<2s", icon: <Zap className="w-5 h-5 text-yellow-600" /> },
    { label: "Regulatory Coverage", value: "EU+UK", icon: <Globe className="w-5 h-5 text-blue-600" /> },
    { label: "Active Users", value: "500+", icon: <Users className="w-5 h-5 text-purple-600" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nexus Agent
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered SFDR compliance validation and regulatory guidance for financial institutions
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary">SFDR Compliant</Badge>
            <Badge variant="secondary">Real-time Validation</Badge>
            <Badge variant="secondary">EU Regulatory</Badge>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('chat')}
              className="mr-1"
            >
              <Bot className="w-4 h-4 mr-2" />
              Chat Interface
            </Button>
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Features Overview
            </Button>
          </div>
        </div>

        {/* Content Section */}
        {activeTab === 'chat' ? (
          <div className="max-w-4xl mx-auto">
            <NexusAgentChat className="shadow-lg" />
            
            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <FileCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Quick Validation</h3>
                    <p className="text-sm text-gray-600">Validate fund classification in seconds</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">PAI Analysis</h3>
                    <p className="text-sm text-gray-600">Check PAI indicator compliance</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Risk Assessment</h3>
                    <p className="text-sm text-gray-600">Identify compliance risks early</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {feature.icon}
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* How It Works */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-center">How Nexus Agent Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Submit Fund Data</h3>
                    <p className="text-gray-600">Provide fund information through chat or structured form</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-purple-600">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">AI Analysis</h3>
                    <p className="text-gray-600">Advanced AI validates against SFDR requirements</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-green-600">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Get Results</h3>
                    <p className="text-gray-600">Receive detailed validation results and recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory Coverage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Regulatory Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      SFDR Requirements
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Article 6, 8, and 9 classification</li>
                      <li>• Principal Adverse Impact (PAI) indicators</li>
                      <li>• Taxonomy alignment validation</li>
                      <li>• Disclosure requirement compliance</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-green-600" />
                      Geographic Coverage
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• European Union (EU)</li>
                      <li>• United Kingdom (UK)</li>
                      <li>• EEA Member States</li>
                      <li>• Cross-border fund structures</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default NexusAgent;