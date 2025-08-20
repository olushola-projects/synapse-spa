import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock, Tag, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blogData';
const Blog = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // Get featured post
  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];
  // Filter posts based on active tab and search term
  const filteredPosts = blogPosts
    .filter(post => {
      const matchesCategory = activeTab === 'all' || post.category === activeTab;
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .filter(post => post.id !== featuredPost?.id); // Remove featured post from regular listing
  // Get categories for tabs
  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  // Pagination
  const postsPerPage = 6;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  // Function to navigate to article details
  const handleReadArticle = articleId => {
    navigate(`/resources/blog/${articleId}`);
  };
  return _jsxs('div', {
    className: 'min-h-screen flex flex-col',
    children: [
      _jsx(Navbar, {}),
      _jsxs('div', {
        className:
          'flex-grow bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden',
        children: [
          _jsxs('div', {
            className: 'absolute inset-0 overflow-hidden z-0',
            children: [
              _jsx('div', {
                className:
                  'absolute top-0 left-0 w-full h-[35%] bg-gradient-to-r from-orange-500/30 to-blue-400/30 transform rotate-6 translate-y-[-10%] translate-x-[-5%]'
              }),
              _jsx('div', {
                className:
                  'absolute top-[20%] left-0 w-full h-[35%] bg-gradient-to-r from-blue-400/20 to-yellow-400/20 transform rotate-6 translate-y-[-5%]'
              }),
              _jsx('div', {
                className:
                  'absolute bottom-[10%] right-0 w-full h-[40%] bg-gradient-to-r from-purple-300/20 to-blue-300/20 transform rotate-6'
              })
            ]
          }),
          _jsxs('div', {
            className: 'container mx-auto px-4 py-12 relative z-10',
            children: [
              _jsxs('header', {
                className: 'text-center mb-12',
                children: [
                  _jsx('h1', {
                    className: 'text-4xl font-bold mb-4',
                    children: 'Synapse GRC Intelligence Blog'
                  }),
                  _jsx('p', {
                    className: 'text-xl text-gray-600 max-w-3xl mx-auto',
                    children:
                      'Expert insights, industry trends, and best practices for governance, risk, and compliance professionals.'
                  }),
                  _jsx('div', {
                    className: 'max-w-md mx-auto mt-8',
                    children: _jsxs('div', {
                      className: 'relative',
                      children: [
                        _jsx(Search, {
                          className:
                            'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400',
                          size: 18
                        }),
                        _jsx(Input, {
                          placeholder: 'Search articles...',
                          className: 'pl-10',
                          value: searchTerm,
                          onChange: e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                          }
                        })
                      ]
                    })
                  })
                ]
              }),
              _jsx('div', {
                className: 'max-w-6xl mx-auto',
                children: _jsxs('div', {
                  className: 'flex flex-col gap-8',
                  children: [
                    !searchTerm &&
                      activeTab === 'all' &&
                      featuredPost &&
                      _jsx('div', {
                        className:
                          'bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden transform hover:shadow-md transition-all duration-300',
                        children: _jsxs('div', {
                          className: 'md:flex',
                          children: [
                            _jsx('div', {
                              className: 'md:w-1/2',
                              children: _jsx('img', {
                                src: featuredPost.image,
                                alt: featuredPost.title,
                                className: 'h-64 w-full object-cover md:h-full'
                              })
                            }),
                            _jsxs('div', {
                              className: 'p-6 md:w-1/2 md:p-8 flex flex-col',
                              children: [
                                _jsxs('div', {
                                  className:
                                    'flex items-center gap-2 text-sm text-gray-500 mb-3 flex-wrap',
                                  children: [
                                    _jsx(Badge, {
                                      className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
                                      children: 'Featured'
                                    }),
                                    _jsx(Badge, {
                                      variant: 'outline',
                                      children: featuredPost?.category
                                    }),
                                    _jsxs('span', {
                                      className: 'flex items-center gap-1',
                                      children: [
                                        _jsx(CalendarIcon, { className: 'w-3 h-3' }),
                                        ' ',
                                        featuredPost?.date
                                      ]
                                    }),
                                    _jsxs('span', {
                                      className: 'flex items-center gap-1',
                                      children: [
                                        _jsx(Clock, { className: 'w-3 h-3' }),
                                        ' ',
                                        featuredPost?.readTime
                                      ]
                                    })
                                  ]
                                }),
                                _jsx('h2', {
                                  className: 'text-2xl font-bold mb-3',
                                  children: featuredPost?.title
                                }),
                                _jsx('p', {
                                  className: 'text-gray-600 mb-6',
                                  children: featuredPost?.excerpt
                                }),
                                _jsxs('div', {
                                  className: 'flex items-center mt-auto',
                                  children: [
                                    _jsxs(Avatar, {
                                      className: 'h-10 w-10 mr-3',
                                      children: [
                                        _jsx(AvatarImage, {
                                          src: featuredPost?.author.avatar,
                                          alt: featuredPost?.author.name
                                        }),
                                        _jsx(AvatarFallback, {
                                          children: featuredPost?.author.name
                                            .split(' ')
                                            .map(n => n[0])
                                            .join('')
                                        })
                                      ]
                                    }),
                                    _jsxs('div', {
                                      children: [
                                        _jsx('p', {
                                          className: 'font-medium',
                                          children: featuredPost?.author.name
                                        }),
                                        _jsx('p', {
                                          className: 'text-sm text-gray-500',
                                          children: featuredPost?.author.role
                                        })
                                      ]
                                    }),
                                    _jsx(Button, {
                                      variant: 'outline',
                                      size: 'sm',
                                      className: 'ml-auto',
                                      onClick: () =>
                                        featuredPost && handleReadArticle(featuredPost.id),
                                      children: 'Read More'
                                    })
                                  ]
                                })
                              ]
                            })
                          ]
                        })
                      }),
                    _jsxs(Tabs, {
                      value: activeTab,
                      onValueChange: value => {
                        setActiveTab(value);
                        setCurrentPage(1); // Reset to first page on tab change
                      },
                      children: [
                        _jsx(TabsList, {
                          className: 'mb-6 flex flex-wrap',
                          children: categories.map(category =>
                            _jsx(
                              TabsTrigger,
                              {
                                value: category,
                                className: 'capitalize',
                                children: category === 'all' ? 'All Articles' : category
                              },
                              category
                            )
                          )
                        }),
                        _jsx(TabsContent, {
                          value: activeTab,
                          className: 'mt-0',
                          children:
                            currentPosts.length > 0
                              ? _jsxs(_Fragment, {
                                  children: [
                                    _jsx('div', {
                                      className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6',
                                      children: currentPosts.map(post =>
                                        _jsxs(
                                          Card,
                                          {
                                            className:
                                              'overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white/80 backdrop-blur-sm',
                                            children: [
                                              _jsx('img', {
                                                src: post.image,
                                                alt: post.title,
                                                className: 'w-full h-48 object-cover'
                                              }),
                                              _jsxs('div', {
                                                className: 'p-6',
                                                children: [
                                                  _jsxs('div', {
                                                    className:
                                                      'flex items-center gap-2 text-sm text-gray-500 mb-3 flex-wrap',
                                                    children: [
                                                      _jsx(Badge, {
                                                        variant: 'outline',
                                                        className: 'capitalize',
                                                        children: post.category
                                                      }),
                                                      _jsxs('span', {
                                                        className: 'flex items-center gap-1',
                                                        children: [
                                                          _jsx(CalendarIcon, {
                                                            className: 'w-3 h-3'
                                                          }),
                                                          ' ',
                                                          post.date
                                                        ]
                                                      }),
                                                      _jsxs('span', {
                                                        className: 'flex items-center gap-1',
                                                        children: [
                                                          _jsx(Clock, { className: 'w-3 h-3' }),
                                                          ' ',
                                                          post.readTime
                                                        ]
                                                      })
                                                    ]
                                                  }),
                                                  _jsx('h3', {
                                                    className: 'text-xl font-bold mb-2',
                                                    children: post.title
                                                  }),
                                                  _jsx('p', {
                                                    className: 'text-gray-600 mb-4 line-clamp-3',
                                                    children: post.excerpt
                                                  }),
                                                  _jsx('div', {
                                                    className: 'flex flex-wrap gap-2 mb-4',
                                                    children: post.tags.map((tag, index) =>
                                                      _jsxs(
                                                        'span',
                                                        {
                                                          className:
                                                            'flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full',
                                                          children: [
                                                            _jsx(Tag, {
                                                              className: 'w-3 h-3 mr-1'
                                                            }),
                                                            ' ',
                                                            tag
                                                          ]
                                                        },
                                                        index
                                                      )
                                                    )
                                                  }),
                                                  _jsxs('div', {
                                                    className: 'flex items-center',
                                                    children: [
                                                      _jsxs(Avatar, {
                                                        className: 'h-8 w-8 mr-3',
                                                        children: [
                                                          _jsx(AvatarImage, {
                                                            src: post.author.avatar,
                                                            alt: post.author.name
                                                          }),
                                                          _jsx(AvatarFallback, {
                                                            children: post.author.name
                                                              .split(' ')
                                                              .map(n => n[0])
                                                              .join('')
                                                          })
                                                        ]
                                                      }),
                                                      _jsxs('div', {
                                                        children: [
                                                          _jsx('p', {
                                                            className: 'text-sm font-medium',
                                                            children: post.author.name
                                                          }),
                                                          _jsx('p', {
                                                            className: 'text-xs text-gray-500',
                                                            children: post.author.role
                                                          })
                                                        ]
                                                      }),
                                                      _jsx(Button, {
                                                        variant: 'ghost',
                                                        size: 'sm',
                                                        className: 'ml-auto',
                                                        onClick: () => handleReadArticle(post.id),
                                                        children: 'Read More'
                                                      })
                                                    ]
                                                  })
                                                ]
                                              })
                                            ]
                                          },
                                          post.id
                                        )
                                      )
                                    }),
                                    totalPages > 1 &&
                                      _jsx(Pagination, {
                                        className: 'mt-10',
                                        children: _jsxs(PaginationContent, {
                                          children: [
                                            _jsx(PaginationItem, {
                                              children: _jsx(PaginationPrevious, {
                                                onClick: () =>
                                                  setCurrentPage(prev => Math.max(prev - 1, 1)),
                                                className:
                                                  currentPage === 1
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                              })
                                            }),
                                            Array.from({ length: totalPages }).map((_, index) =>
                                              _jsx(
                                                PaginationItem,
                                                {
                                                  children: _jsx(PaginationLink, {
                                                    onClick: () => setCurrentPage(index + 1),
                                                    isActive: currentPage === index + 1,
                                                    children: index + 1
                                                  })
                                                },
                                                index
                                              )
                                            ),
                                            _jsx(PaginationItem, {
                                              children: _jsx(PaginationNext, {
                                                onClick: () =>
                                                  setCurrentPage(prev =>
                                                    Math.min(prev + 1, totalPages)
                                                  ),
                                                className:
                                                  currentPage === totalPages
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                              })
                                            })
                                          ]
                                        })
                                      })
                                  ]
                                })
                              : _jsxs('div', {
                                  className: 'text-center py-12',
                                  children: [
                                    _jsx('p', {
                                      className: 'text-gray-500',
                                      children: 'No articles found matching your search criteria.'
                                    }),
                                    _jsx(Button, {
                                      variant: 'outline',
                                      className: 'mt-4',
                                      onClick: () => {
                                        setSearchTerm('');
                                        setActiveTab('all');
                                      },
                                      children: 'Clear Search'
                                    })
                                  ]
                                })
                        })
                      ]
                    })
                  ]
                })
              })
            ]
          })
        ]
      }),
      _jsx(Footer, {})
    ]
  });
};
export default Blog;
