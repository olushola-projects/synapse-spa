
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock, Tag, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blogData';

const Blog = () => {
  const navigate = useNavigate();
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
  
  // Function to navigate to article details
  const handleReadArticle = (articleId: number) => {
    navigate(`/resources/blog/${articleId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Diagonal lines background inspired by the uploaded image */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-r from-orange-500/30 to-blue-400/30 transform rotate-6 translate-y-[-10%] translate-x-[-5%]"></div>
          <div className="absolute top-[20%] left-0 w-full h-[35%] bg-gradient-to-r from-blue-400/20 to-yellow-400/20 transform rotate-6 translate-y-[-5%]"></div>
          <div className="absolute bottom-[10%] right-0 w-full h-[40%] bg-gradient-to-r from-purple-300/20 to-blue-300/20 transform rotate-6"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
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
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden transform hover:shadow-md transition-all duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img 
                        src={featuredPost.image} 
                        alt={featuredPost.title}
                        className="h-64 w-full object-cover md:h-full"
                      />
                    </div>
                    <div className="p-6 md:w-1/2 md:p-8 flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 flex-wrap">
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
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => handleReadArticle(featuredPost.id)}
                        >
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
                          <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 flex-wrap">
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
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="ml-auto"
                                  onClick={() => handleReadArticle(post.id)}
                                >
                                  Read More
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
