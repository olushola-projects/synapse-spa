
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, ChevronLeft, Tag, Share2, Volume2, Pause, Play } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { blogPosts, BlogPost } from '@/data/blogData';
import { toast } from "sonner";
import { Slider } from '@/components/ui/slider';

const BlogArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Audio player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
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
  
  // Text-to-speech functionality using browser's built-in speech synthesis
  useEffect(() => {
    if (article.content) {
      // Create a dummy placeholder audio - we'll use Web Speech API since we don't have a backend TTS service
      const dummyAudio = new Audio();
      dummyAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      dummyAudio.onloadedmetadata = () => {
        // Dummy duration for demonstration (e.g., 1 minute per 500 characters of article content)
        const estimatedDuration = Math.max(Math.min(article.content.length / 500 * 60, 1800), 120);
        setDuration(estimatedDuration);
      };
      dummyAudio.ontimeupdate = () => {
        setCurrentTime(dummyAudio.currentTime);
      };
      dummyAudio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      setAudio(dummyAudio);
    }
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
    };
  }, [article.id]);
  
  // Toggle play/pause audio narration
  const toggleAudio = () => {
    if (!article.content) return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      if (audio) audio.pause();
    } else {
      // Clear any previous utterances
      window.speechSynthesis.cancel();
      
      const cleanText = article.content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/#{1,6} /g, '') // Remove Markdown headings
        .replace(/\*\*/g, ''); // Remove bold markers
      
      let utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = volume;
      
      // Show toast message
      toast("Reading article...", {
        description: "AI voice narration has started. Use the player controls to adjust or stop.",
      });
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      
      // Update time manually since we're using the Speech API
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
      
      utterance.onend = () => {
        setIsPlaying(false);
        if (audio) audio.pause();
      };
    }
  };
  
  // Format time for display (mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const value = newVolume[0];
    setVolume(value);
    if (audio) audio.volume = value;
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
      <div className="flex-grow bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Diagonal lines background inspired by the uploaded image */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-r from-orange-500/30 to-blue-400/30 transform rotate-6 translate-y-[-10%] translate-x-[-5%]"></div>
          <div className="absolute top-[20%] left-0 w-full h-[35%] bg-gradient-to-r from-blue-400/20 to-yellow-400/20 transform rotate-6 translate-y-[-5%]"></div>
          <div className="absolute bottom-[10%] right-0 w-full h-[40%] bg-gradient-to-r from-purple-300/20 to-blue-300/20 transform rotate-6"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center text-gray-600" 
            onClick={handleGoBack}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to all articles
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden">
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
                  
                  <div className="ml-auto flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={toggleAudio}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? "Pause" : "Listen"}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Share
                    </Button>
                  </div>
                </div>
                
                {/* Audio Player */}
                {isPlaying && (
                  <div className="mb-8 bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10"
                      onClick={toggleAudio}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 flex justify-between mb-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <Volume2 className="h-4 w-4 text-gray-500" />
                      <Slider
                        value={[volume]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="w-20"
                      />
                    </div>
                  </div>
                )}
                
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
                    <Card key={relatedArticle.id} className="overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
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
