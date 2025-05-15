
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { blogPosts } from '@/data/blogData';
import { BlogCard } from '@/components/blog/BlogCard';
import { motion } from 'framer-motion';
import { StripeSection } from '@/components/ui/stripe-elements';

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

  // Reset page when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <StripeSection withGrid withStripes className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <header className="text-center mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-synapse-primary to-synapse-secondary bg-clip-text text-transparent">
              Synapse GRC Intelligence Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert insights, industry trends, and best practices for governance, risk, and compliance professionals.
            </p>
            
            <div className="max-w-md mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 border-gray-200 focus:border-synapse-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </header>
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-8">
            {/* Featured Post */}
            {!searchTerm && activeTab === "all" && (
              <BlogCard {...featuredPost} featured />
            )}
            
            {/* Category Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 flex flex-wrap bg-white/70 backdrop-blur-sm p-1 shadow-sm border border-gray-100 rounded-lg">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="capitalize data-[state=active]:bg-gradient-to-r data-[state=active]:from-synapse-primary data-[state=active]:to-synapse-secondary data-[state=active]:text-white"
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
                        <BlogCard key={post.id} {...post} />
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
                  <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
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
      </StripeSection>
      <Footer />
    </div>
  );
};

export default Blog;
