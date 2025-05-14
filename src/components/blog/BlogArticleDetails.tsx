
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
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
  
  // Infographics that will be inserted into the article content
  const infographics = {
    "RegTech": "/lovable-uploads/6ac8bd07-6906-427c-b832-be14819a3aed.png", // Tech and code visual
    "AI": "/lovable-uploads/93f022b9-560f-49fe-95a3-72816c483659.png", // Abstract AI visualization
    "Compliance": "/lovable-uploads/1d282686-82bd-4818-948a-3a844c5ea12e.png", // Business/compliance visual
    "Risk": "/lovable-uploads/6a778cb7-3cb5-4529-9cc0-fdd90cbe4ddb.png", // Analytics visual
    "Governance": "/lovable-uploads/b580e547-9e9f-4145-9649-3b9f79e59b32.png", // Structure/governance visual
    "Career": "/lovable-uploads/24bc5b6a-2ffe-469d-ae66-bec6fe163be5.png" // People/career visual
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
      
      // Set voice to English UK - female professional
      const voices = window.speechSynthesis.getVoices();
      const ukFemaleVoice = voices.find(voice => 
        voice.lang.includes('en-GB') && voice.name.includes('Female')
      );
      
      // If we can't find a specific UK female voice, try to find any UK voice
      const ukVoice = voices.find(voice => voice.lang.includes('en-GB'));
      
      utterance.voice = ukFemaleVoice || ukVoice || null;
      utterance.lang = 'en-GB';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = volume;
      
      // Show toast message
      toast("Reading article...", {
        description: "UK English female voice narration has started. Use the player controls to adjust or stop.",
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
  
  // Ensure voices are loaded
  useEffect(() => {
    // Chrome needs this event handling to load voices properly
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  // Function to insert infographics into the content
  const renderEnhancedContent = () => {
    if (!article.content) return <p>No content available for this article.</p>;
    
    // Split the content into paragraphs
    const paragraphs = article.content.split('\n');
    
    // Function to determine which infographic to use based on paragraph content
    const getInfographicForParagraph = (paragraph: string) => {
      const lowercaseContent = paragraph.toLowerCase();
      
      if (lowercaseContent.includes('regtech') || lowercaseContent.includes('technology')) 
        return infographics.RegTech;
      if (lowercaseContent.includes('ai') || lowercaseContent.includes('artificial intelligence'))
        return infographics.AI;
      if (lowercaseContent.includes('compliance') || lowercaseContent.includes('regulation'))
        return infographics.Compliance;
      if (lowercaseContent.includes('risk') || lowercaseContent.includes('assessment'))
        return infographics.Risk;
      if (lowercaseContent.includes('governance') || lowercaseContent.includes('structure'))
        return infographics.Governance;
      if (lowercaseContent.includes('career') || lowercaseContent.includes('professional'))
        return infographics.Career;
      
      return null;
    };
    
    // Process paragraphs and insert infographics every ~3 paragraphs
    let processedContent = [];
    let infographicCounter = 0;
    
    paragraphs.forEach((para, index) => {
      // Process paragraph
      let element;
      
      if (para.startsWith('# ')) {
        element = <h1 key={`para-${index}`} className="text-3xl font-bold mt-8 mb-4">{para.slice(2)}</h1>;
      } else if (para.startsWith('## ')) {
        element = <h2 key={`para-${index}`} className="text-2xl font-bold mt-8 mb-3">{para.slice(3)}</h2>;
      } else if (para.startsWith('### ')) {
        element = <h3 key={`para-${index}`} className="text-xl font-bold mt-6 mb-2">{para.slice(4)}</h3>;
      } else if (para.startsWith('**') && para.endsWith('**')) {
        element = <p key={`para-${index}`} className="font-bold my-2">{para.slice(2, -2)}</p>;
      } else if (para.trim() === '') {
        element = <br key={`para-${index}`} />;
      } else if (para.startsWith('- ')) {
        element = <li key={`para-${index}`} className="ml-6 mb-1">{para.slice(2)}</li>;
      } else {
        element = <p key={`para-${index}`} className="mb-4">{para}</p>;
      }
      
      processedContent.push(element);
      
      // Insert infographic after heading or every ~3 paragraphs
      if (
        (para.startsWith('#') && para.length > 10) || // After substantial headings
        (infographicCounter === 0 && index > 2) || // First infographic after some intro
        (index > 0 && (index % 3 === 0) && !para.trim().startsWith('#')) // Every 3 paragraphs
      ) {
        const infographicSrc = getInfographicForParagraph(para);
        
        if (infographicSrc) {
          infographicCounter++;
          
          // Create a professional infographic display
          processedContent.push(
            <div key={`infographic-${index}`} className="my-8 bg-gray-50 rounded-xl overflow-hidden shadow-sm">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <img 
                  src={infographicSrc}
                  alt={`GRC Infographic illustration for ${article.title}`} 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <div className="p-4 text-sm text-center text-gray-500">
                Figure {infographicCounter}: {
                  infographicSrc.includes('RegTech') ? 'Regulatory Technology Framework' :
                  infographicSrc.includes('AI') ? 'AI-Driven Compliance Process' :
                  infographicSrc.includes('Compliance') ? 'Compliance Workflow Visualization' : 
                  infographicSrc.includes('Risk') ? 'Risk Assessment Matrix' :
                  infographicSrc.includes('Governance') ? 'Governance Structure' :
                  'Professional Development Path'
                }
              </div>
            </div>
          );
        }
      }
    });
    
    return processedContent;
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
                      {isPlaying ? "Pause" : "Listen (UK Voice)"}
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
                
                {/* Article Content with Infographics */}
                <div className="prose max-w-none mb-8">
                  <p className="text-lg text-gray-700 mb-4">{article.excerpt}</p>
                  
                  {/* Render article content with infographics */}
                  <div className="article-content">
                    {renderEnhancedContent()}
                  </div>
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
