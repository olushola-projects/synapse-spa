
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, ChevronLeft, Tag, Share2 } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

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
  content?: string;
}

// This would typically come from a database or API
// For now, we'll just use a placeholder
const getArticle = (id: string): BlogPost => {
  return {
    id: parseInt(id),
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
    content: "This is a placeholder for article content. In a real application, this would contain the full article text with proper formatting, images, and other rich content elements."
  };
};

const BlogArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // In a real app, you would fetch the article data based on the ID
  const article = getArticle(id || "0");
  
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
      alert('Article URL copied to clipboard!');
    }
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
                
                {/* Article Content - In a real app, this would be rich formatted content */}
                <div className="prose max-w-none mb-8">
                  <p className="text-lg text-gray-700 mb-4">{article.excerpt}</p>
                  
                  {/* This is placeholder content */}
                  <p className="text-gray-700 mb-4">
                    This is a placeholder for the full article content. In a real application, 
                    this section would contain the complete article with proper formatting, 
                    headings, paragraphs, lists, images, and other rich content elements.
                  </p>
                  <p className="text-gray-700 mb-4">
                    The content would be stored in a database or content management system
                    and retrieved based on the article ID. It could be formatted as Markdown,
                    HTML, or using a rich text editor format.
                  </p>
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
            
            {/* Related Articles Placeholder */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="Related article"
                    className="w-full h-40 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">Related Article Title</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      Brief excerpt from the related article would appear here.
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 p-0">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="Related article"
                    className="w-full h-40 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">Related Article Title</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      Brief excerpt from the related article would appear here.
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 p-0">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogArticleDetails;
