
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "The Future of Compliance in a Digital-First World",
    excerpt: "Explore how AI and automation are transforming regulatory compliance workflows for GRC professionals in 2025 and beyond.",
    author: {
      name: "Maria Rodriguez",
      role: "Chief Compliance Officer",
      avatar: "/placeholder.svg"
    },
    date: "April 10, 2025",
    readTime: "8 min read",
    tags: ["AI", "Compliance", "Future of GRC"],
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Navigating Cross-Border Data Regulations",
    excerpt: "A comprehensive guide to managing compliance across multiple jurisdictions with conflicting regulatory requirements.",
    author: {
      name: "David Chen",
      role: "Regulatory Expert",
      avatar: "/placeholder.svg"
    },
    date: "April 3, 2025",
    readTime: "12 min read",
    tags: ["Global Compliance", "Data Privacy", "GDPR"],
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Building a Culture of Compliance from the Ground Up",
    excerpt: "How to foster a compliance-first mindset across your organization through effective training, communication, and leadership.",
    author: {
      name: "Jennifer Moss",
      role: "Training Specialist",
      avatar: "/placeholder.svg"
    },
    date: "March 28, 2025",
    readTime: "6 min read",
    tags: ["Training", "Culture", "Best Practices"],
    image: "/placeholder.svg"
  },
  {
    id: 4,
    title: "The Role of Blockchain in Audit Verification",
    excerpt: "Examining how distributed ledger technologies are creating immutable audit trails for better regulatory transparency.",
    author: {
      name: "Tanaka Hiroshi",
      role: "Technology Compliance Specialist",
      avatar: "/placeholder.svg"
    },
    date: "March 21, 2025",
    readTime: "10 min read",
    tags: ["Blockchain", "Audit", "Technology"],
    image: "/placeholder.svg"
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <header className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Synapse GRC Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert insights, industry trends, and best practices for governance, risk, and compliance professionals.
            </p>
          </header>
          
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-8">
              {/* Featured Post */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={blogPosts[0].image} 
                      alt={blogPosts[0].title}
                      className="h-64 w-full object-cover md:h-full"
                    />
                  </div>
                  <div className="p-6 md:w-1/2 md:p-8 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                      <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {blogPosts[0].date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blogPosts[0].readTime}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3">{blogPosts[0].title}</h2>
                    <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                    
                    <div className="flex items-center mt-auto">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={blogPosts[0].author.avatar} alt={blogPosts[0].author.name} />
                        <AvatarFallback>{blogPosts[0].author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{blogPosts[0].author.name}</p>
                        <p className="text-sm text-gray-500">{blogPosts[0].author.role}</p>
                      </div>
                      
                      <Button variant="outline" size="sm" className="ml-auto">
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Regular Posts */}
              <div className="grid md:grid-cols-2 gap-6">
                {blogPosts.slice(1).map((post) => (
                  <Card key={post.id} className="overflow-hidden hover-lift">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      
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
              
              {/* Load More Button */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
