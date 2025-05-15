
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Author {
  name: string;
  role: string;
  avatar: string;
}

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  author: Author;
  tags: string[];
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  excerpt,
  date,
  readTime,
  category,
  image,
  author,
  tags,
  featured = false
}) => {
  const navigate = useNavigate();
  
  const handleReadArticle = () => {
    navigate(`/resources/blog/${id}`);
  };
  
  if (featured) {
    return (
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden transform hover:shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="md:flex">
          <div className="md:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-synapse-primary/30 to-synapse-secondary/30 mix-blend-overlay z-10" />
            <img 
              src={image} 
              alt={title}
              className="h-64 w-full object-cover md:h-full transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="p-6 md:w-1/2 md:p-8 flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 flex-wrap">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                Featured
              </Badge>
              <Badge variant="outline" className="capitalize">{category}</Badge>
              <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readTime}</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-3">{title}</h2>
            <p className="text-gray-600 mb-6">{excerpt}</p>
            
            <div className="flex items-center mt-auto">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{author.name}</p>
                <p className="text-sm text-gray-500">{author.role}</p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={handleReadArticle}
              >
                Read More
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white/80 backdrop-blur-sm h-full flex flex-col">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-synapse-primary/20 to-synapse-secondary/20 mix-blend-overlay z-10" />
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 flex-wrap">
            <Badge variant="outline" className="capitalize">{category}</Badge>
            <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readTime}</span>
          </div>
          
          <h3 className="text-xl font-bold mb-2 hover:text-synapse-primary transition-colors">{title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
          
          <div className="flex flex-wrap gap-2 mb-4 mt-auto">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                <Tag className="w-3 h-3 mr-1" /> {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium truncate">{author.name}</p>
              <p className="text-xs text-gray-500 truncate">{author.role}</p>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleReadArticle}
            >
              Read
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
