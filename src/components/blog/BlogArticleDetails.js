import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, ChevronLeft, Tag, Share2, Volume2, Pause, Play } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { blogPosts } from '@/data/blogData';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import DOMPurify from 'dompurify';
const BlogArticleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // Audio player states
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    // Get article from our data source
    const article = blogPosts.find(post => post.id === parseInt(id || '0')) || {
        id: 0,
        title: 'Article not found',
        excerpt: "The article you're looking for couldn't be found.",
        author: {
            name: 'Unknown Author',
            role: 'GRC Professional',
            avatar: '/placeholder.svg'
        },
        date: 'May 10, 2025',
        readTime: '5 min read',
        tags: ['GRC', 'Compliance'],
        image: '/placeholder.svg',
        category: 'General',
        content: 'This article could not be found. Please check the URL and try again.'
    };
    // Text-to-speech functionality using browser's built-in speech synthesis
    useEffect(() => {
        if (article.content) {
            // Create a dummy placeholder audio - we'll use Web Speech API since we don't have a backend TTS service
            const dummyAudio = new Audio();
            dummyAudio.src =
                'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            dummyAudio.onloadedmetadata = () => {
                // Dummy duration for demonstration (e.g., 1 minute per 500 characters of article content)
                const estimatedDuration = Math.max(Math.min((article.content.length / 500) * 60, 1800), 120);
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
        if (!article.content) {
            return;
        }
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            if (audio) {
                audio.pause();
            }
        }
        else {
            // Clear any previous utterances
            window.speechSynthesis.cancel();
            const cleanText = article.content
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/#{1,6} /g, '') // Remove Markdown headings
                .replace(/\*\*/g, ''); // Remove bold markers
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = volume;
            // Show toast message
            toast('Reading article...', {
                description: 'AI voice narration has started. Use the player controls to adjust or stop.'
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
                if (audio) {
                    audio.pause();
                }
            };
        }
    };
    // Format time for display (mm:ss)
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    // Handle volume change
    const handleVolumeChange = (newVolume) => {
        const value = newVolume[0] ?? 0;
        setVolume(value);
        if (audio) {
            audio.volume = value;
        }
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
            navigator
                .share({
                title: article.title,
                text: article.excerpt,
                url: window.location.href
            })
                .catch(error => console.log('Error sharing', error));
        }
        else {
            console.log('Web Share API not supported');
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast('Article URL copied to clipboard!', {
                description: 'You can now paste the link to share this article.'
            });
        }
    };
    const handleRelatedArticleClick = (articleId) => {
        navigate(`/resources/blog/${articleId}`);
    };
    return (_jsxs("div", { className: 'min-h-screen flex flex-col', children: [_jsx(Navbar, {}), _jsxs("div", { className: 'flex-grow bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden', children: [_jsxs("div", { className: 'absolute inset-0 overflow-hidden z-0', children: [_jsx("div", { className: 'absolute top-0 left-0 w-full h-[35%] bg-gradient-to-r from-orange-500/30 to-blue-400/30 transform rotate-6 translate-y-[-10%] translate-x-[-5%]' }), _jsx("div", { className: 'absolute top-[20%] left-0 w-full h-[35%] bg-gradient-to-r from-blue-400/20 to-yellow-400/20 transform rotate-6 translate-y-[-5%]' }), _jsx("div", { className: 'absolute bottom-[10%] right-0 w-full h-[40%] bg-gradient-to-r from-purple-300/20 to-blue-300/20 transform rotate-6' })] }), _jsxs("div", { className: 'container mx-auto px-4 py-12 relative z-10', children: [_jsxs(Button, { variant: 'ghost', className: 'mb-6 flex items-center text-gray-600', onClick: handleGoBack, children: [_jsx(ChevronLeft, { className: 'mr-2 h-4 w-4' }), " Back to all articles"] }), _jsxs("div", { className: 'max-w-4xl mx-auto', children: [_jsxs("div", { className: 'bg-white/90 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden', children: [_jsx("img", { src: article.image, alt: article.title, className: 'w-full h-72 object-cover' }), _jsxs("div", { className: 'p-8', children: [_jsxs("div", { className: 'flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4', children: [_jsx(Badge, { variant: 'outline', className: 'capitalize', children: article.category }), _jsxs("span", { className: 'flex items-center gap-1', children: [_jsx(CalendarIcon, { className: 'w-3 h-3' }), " ", article.date] }), _jsxs("span", { className: 'flex items-center gap-1', children: [_jsx(Clock, { className: 'w-3 h-3' }), " ", article.readTime] })] }), _jsx("h1", { className: 'text-3xl md:text-4xl font-bold mb-6', children: article.title }), _jsxs("div", { className: 'flex items-center mb-8 border-b pb-6', children: [_jsxs(Avatar, { className: 'h-12 w-12 mr-4', children: [_jsx(AvatarImage, { src: article.author.avatar, alt: article.author.name }), _jsx(AvatarFallback, { children: article.author.name
                                                                            .split(' ')
                                                                            .map(n => n[0])
                                                                            .join('') })] }), _jsxs("div", { children: [_jsx("p", { className: 'font-medium', children: article.author.name }), _jsx("p", { className: 'text-sm text-gray-500', children: article.author.role })] }), _jsxs("div", { className: 'ml-auto flex items-center gap-3', children: [_jsxs(Button, { variant: 'outline', size: 'sm', className: 'flex items-center gap-2', onClick: toggleAudio, children: [isPlaying ? _jsx(Pause, { className: 'h-4 w-4' }) : _jsx(Play, { className: 'h-4 w-4' }), isPlaying ? 'Pause' : 'Listen'] }), _jsxs(Button, { variant: 'ghost', size: 'sm', onClick: handleShare, children: [_jsx(Share2, { className: 'h-4 w-4 mr-2' }), " Share"] })] })] }), isPlaying && (_jsxs("div", { className: 'mb-8 bg-gray-50 p-4 rounded-lg flex items-center gap-4', children: [_jsx(Button, { variant: 'ghost', size: 'icon', className: 'h-10 w-10', onClick: toggleAudio, children: isPlaying ? _jsx(Pause, { className: 'h-5 w-5' }) : _jsx(Play, { className: 'h-5 w-5' }) }), _jsxs("div", { className: 'flex-1', children: [_jsxs("div", { className: 'text-xs text-gray-500 flex justify-between mb-1', children: [_jsx("span", { children: formatTime(currentTime) }), _jsx("span", { children: formatTime(duration) })] }), _jsx("div", { className: 'w-full bg-gray-300 rounded-full h-1.5', children: _jsx("div", { className: 'bg-blue-600 h-1.5 rounded-full', style: { width: `${(currentTime / duration) * 100}%` } }) })] }), _jsxs("div", { className: 'flex items-center gap-2 min-w-[100px]', children: [_jsx(Volume2, { className: 'h-4 w-4 text-gray-500' }), _jsx(Slider, { value: [volume], min: 0, max: 1, step: 0.1, onValueChange: handleVolumeChange, className: 'w-20' })] })] })), _jsxs("div", { className: 'prose max-w-none mb-8', children: [_jsx("p", { className: 'text-lg text-gray-700 mb-4', children: article.excerpt }), article.content ? (_jsx("div", { className: 'article-content', dangerouslySetInnerHTML: {
                                                                    __html: DOMPurify.sanitize(article.content
                                                                        .split('\n')
                                                                        .map(line => {
                                                                        // Handle Markdown-style headings
                                                                        if (line.startsWith('# ')) {
                                                                            return `<h1 class="text-3xl font-bold mt-8 mb-4">${DOMPurify.sanitize(line.slice(2))}</h1>`;
                                                                        }
                                                                        else if (line.startsWith('## ')) {
                                                                            return `<h2 class="text-2xl font-bold mt-8 mb-3">${DOMPurify.sanitize(line.slice(3))}</h2>`;
                                                                        }
                                                                        else if (line.startsWith('### ')) {
                                                                            return `<h3 class="text-xl font-bold mt-6 mb-2">${DOMPurify.sanitize(line.slice(4))}</h3>`;
                                                                        }
                                                                        else if (line.startsWith('**') && line.endsWith('**')) {
                                                                            // Bold text
                                                                            return `<p class="font-bold my-2">${DOMPurify.sanitize(line.slice(2, -2))}</p>`;
                                                                        }
                                                                        else if (line.trim() === '') {
                                                                            // Empty lines become breaks
                                                                            return '<br>';
                                                                        }
                                                                        else if (line.startsWith('- ')) {
                                                                            // List items
                                                                            return `<li class="ml-6 mb-1">${DOMPurify.sanitize(line.slice(2))}</li>`;
                                                                        }
                                                                        else {
                                                                            // Regular paragraphs
                                                                            return `<p class="mb-4">${DOMPurify.sanitize(line)}</p>`;
                                                                        }
                                                                    })
                                                                        .join(''), {
                                                                        ALLOWED_TAGS: [
                                                                            'h1',
                                                                            'h2',
                                                                            'h3',
                                                                            'p',
                                                                            'br',
                                                                            'li',
                                                                            'ul',
                                                                            'ol',
                                                                            'strong',
                                                                            'em',
                                                                            'a'
                                                                        ],
                                                                        ALLOWED_ATTR: ['class', 'href', 'target'],
                                                                        ALLOW_DATA_ATTR: false
                                                                    })
                                                                } })) : (_jsx("p", { className: 'text-gray-700', children: "No content available for this article." }))] }), _jsx("div", { className: 'flex flex-wrap gap-2 mt-6', children: article.tags.map((tag, index) => (_jsxs("span", { className: 'flex items-center text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full', children: [_jsx(Tag, { className: 'w-3 h-3 mr-1' }), " ", tag] }, index))) })] })] }), relatedArticles.length > 0 && (_jsxs("div", { className: 'mt-12', children: [_jsx("h2", { className: 'text-2xl font-bold mb-6', children: "Related Articles" }), _jsx("div", { className: 'grid md:grid-cols-2 gap-6', children: relatedArticles.map(relatedArticle => (_jsxs(Card, { className: 'overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300', children: [_jsx("img", { src: relatedArticle.image, alt: relatedArticle.title, className: 'w-full h-40 object-cover' }), _jsxs(CardContent, { className: 'p-4', children: [_jsx("h3", { className: 'font-bold mb-2', children: relatedArticle.title }), _jsx("p", { className: 'text-sm text-gray-600 line-clamp-2', children: relatedArticle.excerpt }), _jsx(Button, { variant: 'ghost', size: 'sm', className: 'mt-2 p-0', onClick: () => handleRelatedArticleClick(relatedArticle.id), children: "Read More" })] })] }, relatedArticle.id))) })] }))] })] })] }), _jsx(Footer, {})] }));
};
export default BlogArticleDetails;
