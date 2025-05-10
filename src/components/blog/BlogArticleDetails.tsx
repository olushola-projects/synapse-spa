
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, ChevronLeft, Tag, Share2 } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { blogPosts, BlogPost } from '@/data/blogData';
import { toast } from "sonner";

const BlogArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get article from our data source
  const article: BlogPost = blogPosts.find(post => post.id === parseInt(id || "0")) || {
    id: 0,
    title: "Article not found",
    excerpt: "The article you're looking for couldn't be found.",
    author: {
      name: "Unknown Author",
      role: "GRC Professional",
      avatar: "/placeholder.svg"
    },
    date: "May 10, 2025",
    readTime: "5 min read",
    tags: ["GRC", "Compliance"],
    image: "/placeholder.svg",
    category: "General",
    content: "This article could not be found. Please check the URL and try again."
  };
  
  // Get related articles (same category, excluding current article)
  const relatedArticles = blogPosts
    .filter(post => post.category === article.category && post.id !== article.id)
    .slice(0, 2);
  
  const handleGoBack = () => {
    navigate('/resources/blog');
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      console.log('Web Share API not supported');
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast("Article URL copied to clipboard!", {
        description: "You can now paste the link to share this article."
      });
    }
  };
  
  const handleRelatedArticleClick = (articleId: number) => {
    navigate(`/resources/blog/${articleId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center text-gray-600" 
            onClick={handleGoBack}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to all articles
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-72 object-cover"
              />
              
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                  <Badge variant="outline" className="capitalize">{article.category}</Badge>
                  <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {article.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>
                
                <div className="flex items-center mb-8 border-b pb-6">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={article.author.avatar} alt={article.author.name} />
                    <AvatarFallback>{article.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{article.author.name}</p>
                    <p className="text-sm text-gray-500">{article.author.role}</p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                </div>
                
                {/* Article Content */}
                <div className="prose max-w-none mb-8">
                  <p className="text-lg text-gray-700 mb-4">{article.excerpt}</p>
                  
                  {/* Render article content */}
                  {article.content ? (
                    <div className="article-content" 
                      dangerouslySetInnerHTML={{ 
                        __html: article.content
                          .split('\n')
                          .map(line => {
                            // Handle Markdown-style headings
                            if (line.startsWith('# ')) {
                              return `<h1 class="text-3xl font-bold mt-8 mb-4">${line.slice(2)}</h1>`;
                            } else if (line.startsWith('## ')) {
                              return `<h2 class="text-2xl font-bold mt-8 mb-3">${line.slice(3)}</h2>`;
                            } else if (line.startsWith('### ')) {
                              return `<h3 class="text-xl font-bold mt-6 mb-2">${line.slice(4)}</h3>`;
                            } else if (line.startsWith('**') && line.endsWith('**')) {
                              // Bold text
                              return `<p class="font-bold my-2">${line.slice(2, -2)}</p>`;
                            } else if (line.trim() === '') {
                              // Empty lines become breaks
                              return '<br>';
                            } else if (line.startsWith('- ')) {
                              // List items
                              return `<li class="ml-6 mb-1">${line.slice(2)}</li>`;
                            } else {
                              // Regular paragraphs
                              return `<p class="mb-4">${line}</p>`;
                            }
                          })
                          .join('')
                      }} 
                    />
                  ) : (
                    <p className="text-gray-700">No content available for this article.</p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="flex items-center text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full">
                      <Tag className="w-3 h-3 mr-1" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Card key={relatedArticle.id} className="overflow-hidden">
                      <img 
                        src={relatedArticle.image} 
                        alt={relatedArticle.title}
                        className="w-full h-40 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-2">{relatedArticle.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 p-0"
                          onClick={() => handleRelatedArticleClick(relatedArticle.id)}
                        >
                          Read More
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogArticleDetails;
