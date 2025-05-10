
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock, Tag, Search, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: BlogAuthor;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  category: string;
  featured?: boolean;
}

// Blog authors
const authors = {
  phoebe: {
    name: "Phoebe Banks",
    role: "Compliance Transformation Officer at Complia",
    avatar: "/placeholder.svg"
  },
  alfred: {
    name: "Alfred Frodes",
    role: "Compliance Automation Lead",
    avatar: "/placeholder.svg"
  }
};

// Blog posts data
const blogPosts: BlogPost[] = [
  // Theme 1: AI-Powered Investigation & Compliance
  {
    id: 1,
    title: "The Future of AML Investigation: AI Agents and Human Expertise",
    excerpt: "How investigation-centered approaches powered by AI are revolutionizing financial crime detection while keeping human expertise at the core of decision-making.",
    author: authors.phoebe,
    date: "May 8, 2025",
    readTime: "8 min read",
    tags: ["AML", "Financial Crime", "AI Investigations"],
    image: "/placeholder.svg",
    category: "AI-Powered Investigation",
    featured: true
  },
  {
    id: 2,
    title: "Beyond Rule-Based Systems: AI's Impact on Modern Compliance",
    excerpt: "Discover how AI is transforming traditional compliance from reactive rule-following to proactive risk management with enhanced detection capabilities.",
    author: authors.alfred,
    date: "May 5, 2025",
    readTime: "6 min read",
    tags: ["AI", "Compliance Evolution", "Risk Management"],
    image: "/placeholder.svg",
    category: "AI-Powered Investigation"
  },
  {
    id: 3,
    title: "Strategic Implementation of AI in GRC Programs: 2025 Framework",
    excerpt: "A comprehensive framework for implementing AI across governance, risk, and compliance functions with practical steps for integration.",
    author: authors.phoebe,
    date: "April 28, 2025",
    readTime: "10 min read",
    tags: ["GRC", "Implementation Framework", "Strategy"],
    image: "/placeholder.svg",
    category: "AI-Powered Investigation"
  },
  {
    id: 4,
    title: "How Banks Are Using Generative AI to Transform Risk Management in 2025",
    excerpt: "Case studies of leading financial institutions leveraging generative AI to enhance risk identification, assessment, and mitigation strategies.",
    author: authors.alfred,
    date: "April 20, 2025",
    readTime: "9 min read",
    tags: ["Banking", "Generative AI", "Risk Management"],
    image: "/placeholder.svg",
    category: "AI-Powered Investigation"
  },
  
  // Theme 2: Future of Compliance Professionals
  {
    id: 5,
    title: "From Regulator to Orchestrator: The Evolved Role of Compliance Officers",
    excerpt: "How AI is transforming compliance professionals from rule enforcers into strategic business partners who orchestrate regulatory technology ecosystems.",
    author: authors.phoebe,
    date: "May 2, 2025",
    readTime: "7 min read",
    tags: ["Career Development", "Future Skills", "Compliance Leadership"],
    image: "/placeholder.svg",
    category: "Future of Compliance Professionals"
  },
  {
    id: 6,
    title: "The AI-Enhanced Compliance Professional: Critical Skills for 2025 and Beyond",
    excerpt: "Identifying and developing the essential skills that will define successful compliance professionals in an AI-augmented regulatory landscape.",
    author: authors.alfred,
    date: "April 25, 2025",
    readTime: "8 min read",
    tags: ["Skills Development", "Career Planning", "AI Literacy"],
    image: "/placeholder.svg",
    category: "Future of Compliance Professionals"
  },
  {
    id: 7,
    title: "Human-AI Collaboration: The New Compliance Operating Model",
    excerpt: "Building effective partnership models between compliance teams and AI systems to maximize regulatory coverage and business value.",
    author: authors.phoebe,
    date: "April 15, 2025",
    readTime: "6 min read",
    tags: ["Collaboration", "Operating Models", "Team Structure"],
    image: "/placeholder.svg",
    category: "Future of Compliance Professionals"
  },
  
  // Theme 3: Embedding AI in Regulatory Processes
  {
    id: 8,
    title: "Regulatory Technology Ecosystems: Integrating AI Throughout the Compliance Lifecycle",
    excerpt: "A holistic approach to embedding AI capabilities across all stages of the compliance process from regulatory change management to reporting.",
    author: authors.alfred,
    date: "April 12, 2025",
    readTime: "11 min read",
    tags: ["RegTech", "Process Automation", "Integration"],
    image: "/placeholder.svg",
    category: "Embedding AI in Regulatory Processes"
  },
  {
    id: 9,
    title: "Compliance by Design: AI-Driven Approaches to Regulatory Architecture",
    excerpt: "How organizations are reimagining compliance architectures with AI at the core to ensure regulations are embedded into business processes from the ground up.",
    author: authors.phoebe,
    date: "April 8, 2025",
    readTime: "9 min read",
    tags: ["Compliance by Design", "Architecture", "Process Integration"],
    image: "/placeholder.svg",
    category: "Embedding AI in Regulatory Processes"
  },
  
  // Theme 4: Specialized Compliance Areas
  {
    id: 10,
    title: "AI vs. Greenwashing: The New Frontier in ESG Compliance",
    excerpt: "How advanced AI systems are being deployed to identify greenwashing and ensure accurate ESG reporting in financial services.",
    author: authors.alfred,
    date: "April 3, 2025",
    readTime: "7 min read",
    tags: ["ESG", "Sustainability", "Reporting"],
    image: "/placeholder.svg",
    category: "Specialized Compliance Areas"
  },
  {
    id: 11,
    title: "Balancing Innovation and Governance: Navigating AI Compliance in 2025",
    excerpt: "Strategies for maintaining regulatory compliance while leveraging AI's transformative potential across business functions.",
    author: authors.phoebe,
    date: "March 30, 2025",
    readTime: "8 min read",
    tags: ["AI Governance", "Innovation", "Regulatory Balance"],
    image: "/placeholder.svg",
    category: "Specialized Compliance Areas"
  },
  {
    id: 12,
    title: "Industry-Specific AI Compliance Challenges and Solutions",
    excerpt: "A comprehensive analysis of how different sectors are addressing unique regulatory challenges with tailored AI compliance approaches.",
    author: authors.alfred,
    date: "March 25, 2025",
    readTime: "10 min read",
    tags: ["Industry Analysis", "Sectoral Regulation", "Case Studies"],
    image: "/placeholder.svg",
    category: "Specialized Compliance Areas"
  },
];

const Blog = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get featured post
  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  
  // Filter posts based on active tab and search term
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeTab === "all" || post.category === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  }).filter(post => post.id !== featuredPost.id); // Remove featured post from regular listing
  
  // Get categories for tabs
  const categories = ["all", ...Array.from(new Set(blogPosts.map(post => post.category)))];
  
  // Pagination
  const postsPerPage = 6;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Synapse GRC Intelligence Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert insights, industry trends, and best practices for governance, risk, and compliance professionals.
            </p>
            
            <div className="max-w-md mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>
            </div>
          </header>
          
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-8">
              {/* Featured Post */}
              {!searchTerm && activeTab === "all" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img 
                        src={featuredPost.image} 
                        alt={featuredPost.title}
                        className="h-64 w-full object-cover md:h-full"
                      />
                    </div>
                    <div className="p-6 md:w-1/2 md:p-8 flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          Featured
                        </Badge>
                        <Badge variant="outline">{featuredPost.category}</Badge>
                        <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {featuredPost.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredPost.readTime}</span>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-3">{featuredPost.title}</h2>
                      <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                      
                      <div className="flex items-center mt-auto">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={featuredPost.author.avatar} alt={featuredPost.author.name} />
                          <AvatarFallback>{featuredPost.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{featuredPost.author.name}</p>
                          <p className="text-sm text-gray-500">{featuredPost.author.role}</p>
                        </div>
                        
                        <Button variant="outline" size="sm" className="ml-auto">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Category Tabs */}
              <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                setCurrentPage(1); // Reset to first page on tab change
              }}>
                <TabsList className="mb-6 flex flex-wrap">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="capitalize"
                    >
                      {category === "all" ? "All Articles" : category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  {currentPosts.length > 0 ? (
                    <>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentPosts.map((post) => (
                          <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <Badge variant="outline" className="capitalize">{post.category}</Badge>
                                <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {post.date}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                              </div>
                              
                              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.map((tag, index) => (
                                  <span key={index} className="flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                    <Tag className="w-3 h-3 mr-1" /> {tag}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                  <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{post.author.name}</p>
                                  <p className="text-xs text-gray-500">{post.author.role}</p>
                                </div>
                                
                                <Button variant="ghost" size="sm" className="ml-auto">
                                  Read
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <Pagination className="mt-10">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                            
                            {Array.from({ length: totalPages }).map((_, index) => (
                              <PaginationItem key={index}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(index + 1)}
                                  isActive={currentPage === index + 1}
                                >
                                  {index + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No articles found matching your search criteria.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("");
                          setActiveTab("all");
                        }}
                      >
                        Clear Search
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
