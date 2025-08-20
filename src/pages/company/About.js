import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Globe, Users, Target, ArrowRight, Quote, ExternalLink } from 'lucide-react';
import { getSortedPerspectives } from '@/data/industryPerspectivesData';
import ArticleDialog from '@/components/ArticleDialog';
const About = () => {
  // State for article dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPerspective, setSelectedPerspective] = useState(null);
  // Get sorted perspectives
  const sortedPerspectives = getSortedPerspectives();
  // Industry perspectives data
  const leadershipTeam = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-founder',
      bio: 'Former Compliance Officer at HSBC with 15+ years experience in global financial regulations.',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80'
    },
    {
      name: 'David Okonkwo',
      role: 'CTO & Co-founder',
      bio: 'AI researcher and former RegTech lead at Accenture, specialized in machine learning for regulatory compliance.',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Chief Product Officer',
      bio: 'Previously led product at a leading GRC platform with deep expertise in user-centered design for complex workflows.',
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=922&q=80'
    },
    {
      name: 'Michael Chang',
      role: 'Chief Compliance Strategist',
      bio: 'Former regulator with the SEC and compliance consultant to Fortune 500 companies.',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
    }
  ];
  const handleOpenArticle = perspective => {
    setSelectedPerspective(perspective);
    setIsDialogOpen(true);
  };
  return _jsxs('div', {
    className: 'min-h-screen flex flex-col',
    children: [
      _jsx(Navbar, {}),
      _jsxs('div', {
        className: 'flex-grow',
        children: [
          _jsx('section', {
            className:
              'bg-gradient-to-br from-synapse-primary to-synapse-secondary text-white py-20',
            children: _jsx('div', {
              className: 'container mx-auto px-4',
              children: _jsxs('div', {
                className: 'max-w-4xl mx-auto text-center',
                children: [
                  _jsx('h1', {
                    className: 'text-4xl md:text-5xl font-bold mb-6',
                    children: 'Our Mission'
                  }),
                  _jsx('p', {
                    className: 'text-xl md:text-2xl opacity-90 leading-relaxed',
                    children:
                      "We're empowering GRC professionals to navigate complexity with confidence through intelligent tools, specialized knowledge, and community."
                  })
                ]
              })
            })
          }),
          _jsx('section', {
            className: 'py-20',
            children: _jsx('div', {
              className: 'container mx-auto px-4',
              children: _jsx('div', {
                className: 'max-w-6xl mx-auto',
                children: _jsxs('div', {
                  className: 'grid md:grid-cols-2 gap-12 items-center',
                  children: [
                    _jsxs('div', {
                      children: [
                        _jsx(Badge, {
                          variant: 'outline',
                          className: 'mb-4',
                          children: 'Our Story'
                        }),
                        _jsx('h2', {
                          className: 'text-3xl font-bold mb-6',
                          children: 'Building the Future of GRC'
                        }),
                        _jsx('p', {
                          className: 'text-gray-600 mb-4',
                          children:
                            'Synapses was founded in 2025 with a clear vision: to democratize access to regulatory agents for GRC professionals\u2014empowering them not just to navigate, but to lead the future of compliance.'
                        }),
                        _jsx('p', {
                          className: 'text-gray-600 mb-4',
                          children:
                            'As regulatory complexity accelerates, Synapses is designed to fundamentally upskill and reskill compliance teams, enabling them to operate as strategic conductors in the era of agentic compliance. Our intuitive AI copilots and intelligent agents augment\u2014not replace\u2014human judgment, transforming how compliance work is done by enhancing expertise, insight, and strategic decision-making.'
                        }),
                        _jsx('p', {
                          className: 'text-gray-600 mb-4',
                          children:
                            'We recognized that compliance professionals deserved better\u2014a platform that combines emerging technologie with deep domain expertise to simplify compliance tasks and foster professional growth.'
                        }),
                        _jsx('p', {
                          className: 'text-gray-600 mb-4',
                          children:
                            "Today, we're building the most comprehensive GRC intelligence platform that serves as the central nervous system for compliance operations, connecting professionals, knowledge, and tools in one integrated ecosystem."
                        })
                      ]
                    }),
                    _jsx('div', {
                      className: 'relative',
                      children: _jsxs('div', {
                        className:
                          'bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 relative z-10',
                        children: [
                          _jsx('div', {
                            className:
                              'absolute top-0 right-0 w-20 h-20 bg-synapse-primary/10 rounded-full -mt-6 -mr-6'
                          }),
                          _jsx('div', {
                            className:
                              'absolute bottom-0 left-0 w-16 h-16 bg-synapse-secondary/10 rounded-full -mb-4 -ml-4'
                          }),
                          _jsx('h3', {
                            className: 'text-xl font-bold mb-4',
                            children: 'Our Values'
                          }),
                          _jsx('div', {
                            className: 'space-y-4',
                            children: [
                              {
                                icon: _jsx(Shield, { className: 'h-5 w-5' }),
                                title: 'Integrity',
                                text: 'We uphold the highest ethical standards in everything we do'
                              },
                              {
                                icon: _jsx(Users, { className: 'h-5 w-5' }),
                                title: 'Community',
                                text: 'We believe in the power of connection and shared knowledge'
                              },
                              {
                                icon: _jsx(Globe, { className: 'h-5 w-5' }),
                                title: 'Innovation',
                                text: 'We continuously push boundaries to solve complex problems'
                              },
                              {
                                icon: _jsx(Target, { className: 'h-5 w-5' }),
                                title: 'Excellence',
                                text: 'We strive for exceptional quality in our platform and service'
                              }
                            ].map((value, index) =>
                              _jsxs(
                                'div',
                                {
                                  className: 'flex gap-3',
                                  children: [
                                    _jsx('div', {
                                      className:
                                        'flex-shrink-0 bg-white p-2 rounded-full shadow-sm',
                                      children: value.icon
                                    }),
                                    _jsxs('div', {
                                      children: [
                                        _jsx('h4', {
                                          className: 'font-medium',
                                          children: value.title
                                        }),
                                        _jsx('p', {
                                          className: 'text-sm text-gray-600',
                                          children: value.text
                                        })
                                      ]
                                    })
                                  ]
                                },
                                index
                              )
                            )
                          })
                        ]
                      })
                    })
                  ]
                })
              })
            })
          }),
          _jsxs('section', {
            className: 'py-24 relative overflow-hidden',
            children: [
              _jsx('div', {
                className:
                  'absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30 opacity-70 z-0'
              }),
              _jsx('div', {
                className:
                  'absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)] z-0'
              }),
              _jsx('div', {
                className: 'container mx-auto px-4 relative z-10',
                children: _jsxs('div', {
                  className: 'max-w-6xl mx-auto',
                  children: [
                    _jsxs('div', {
                      className: 'text-center mb-16',
                      children: [
                        _jsx(Badge, {
                          variant: 'outline',
                          className: 'mb-4',
                          children: 'Industry Insights'
                        }),
                        _jsx('h2', {
                          className: 'text-3xl font-bold mb-4',
                          children: 'Perspectives Powering the Future of GRC'
                        }),
                        _jsx('p', {
                          className: 'text-gray-600 max-w-2xl mx-auto',
                          children:
                            'Industry leaders and analysts agree that AI and technology are transforming the landscape of governance, risk, and compliance.'
                        })
                      ]
                    }),
                    _jsx('div', {
                      className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-8',
                      children: sortedPerspectives.map((perspective, index) =>
                        _jsx(
                          'div',
                          {
                            className: 'h-full group animate-gentle-rotate',
                            children: _jsxs('div', {
                              className:
                                'h-full flex flex-col p-7 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-synapse-primary/20 hover:shadow-md transition-all duration-300',
                              children: [
                                _jsx('div', {
                                  className: 'flex-1 flex flex-col mb-5',
                                  children: _jsxs('div', {
                                    className: 'relative',
                                    children: [
                                      _jsx(Quote, {
                                        className:
                                          'text-synapse-primary/30 absolute top-0 left-0 h-8 w-8 transform -translate-x-1 -translate-y-1'
                                      }),
                                      _jsx('p', {
                                        className:
                                          'text-gray-700 pl-7 font-medium leading-relaxed text-lg',
                                        children: perspective.bio
                                      })
                                    ]
                                  })
                                }),
                                _jsxs('div', {
                                  className: 'mt-auto border-t border-gray-100 pt-4',
                                  children: [
                                    _jsxs('div', {
                                      className: 'flex items-start gap-3',
                                      children: [
                                        _jsx('div', {
                                          className: `mt-1 ${perspective.color}`,
                                          children: perspective.icon
                                        }),
                                        _jsxs('div', {
                                          children: [
                                            _jsx('h3', {
                                              className: 'font-bold text-lg text-gray-800',
                                              children: perspective.name
                                            }),
                                            _jsx('p', {
                                              className:
                                                'text-synapse-primary/80 font-medium text-sm',
                                              children: perspective.role
                                            })
                                          ]
                                        })
                                      ]
                                    }),
                                    _jsx('div', {
                                      className: 'mt-4 text-right',
                                      children: _jsxs(Button, {
                                        variant: 'link',
                                        className: `text-sm ${perspective.color} font-medium flex items-center justify-end ml-auto gap-1`,
                                        onClick: () => handleOpenArticle(perspective),
                                        children: ['Learn More ', _jsx(ExternalLink, { size: 14 })]
                                      })
                                    })
                                  ]
                                })
                              ]
                            })
                          },
                          index
                        )
                      )
                    })
                  ]
                })
              })
            ]
          }),
          _jsx('section', {
            className: 'py-20',
            children: _jsx('div', {
              className: 'container mx-auto px-4',
              children: _jsxs('div', {
                className: 'max-w-6xl mx-auto',
                children: [
                  _jsxs('div', {
                    className: 'text-center mb-16',
                    children: [
                      _jsx(Badge, { variant: 'outline', className: 'mb-4', children: 'Our Team' }),
                      _jsx('h2', { className: 'text-3xl font-bold mb-4', children: 'Leadership' }),
                      _jsx('p', {
                        className: 'text-gray-600 max-w-2xl mx-auto',
                        children:
                          'Our team brings together expertise in compliance, technology, and user experience to build a platform that truly meets the needs of GRC professionals.'
                      })
                    ]
                  }),
                  _jsx('div', {
                    className: 'grid md:grid-cols-2 lg:grid-cols-4 gap-8',
                    children: leadershipTeam.map((member, index) =>
                      _jsxs(
                        'div',
                        {
                          className:
                            'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow',
                          children: [
                            _jsx('div', {
                              className: 'h-48 overflow-hidden',
                              children: _jsx('img', {
                                src: member.image,
                                alt: member.name,
                                className: 'w-full h-full object-cover'
                              })
                            }),
                            _jsxs('div', {
                              className: 'p-6',
                              children: [
                                _jsx('h3', {
                                  className: 'font-bold text-lg',
                                  children: member.name
                                }),
                                _jsx('p', {
                                  className: 'text-synapse-primary font-medium text-sm mb-3',
                                  children: member.role
                                }),
                                _jsx('p', {
                                  className: 'text-gray-600 text-sm',
                                  children: member.bio
                                })
                              ]
                            })
                          ]
                        },
                        index
                      )
                    )
                  }),
                  _jsx('div', {
                    className: 'text-center mt-12',
                    children: _jsxs(Button, {
                      variant: 'outline',
                      className: 'inline-flex items-center gap-2',
                      children: ['View Full Team ', _jsx(ArrowRight, { className: 'h-4 w-4' })]
                    })
                  })
                ]
              })
            })
          }),
          _jsx('section', {
            className: 'py-20 bg-gray-50',
            children: _jsx('div', {
              className: 'container mx-auto px-4',
              children: _jsxs('div', {
                className: 'max-w-4xl mx-auto text-center',
                children: [
                  _jsx(Badge, { variant: 'outline', className: 'mb-4', children: 'Careers' }),
                  _jsx('h2', { className: 'text-3xl font-bold mb-4', children: 'Join Our Team' }),
                  _jsx('p', {
                    className: 'text-gray-600 mb-8 max-w-2xl mx-auto',
                    children:
                      "We're looking for passionate individuals who want to transform the GRC industry through innovative technology and deep domain expertise."
                  }),
                  _jsxs('div', {
                    className: 'flex flex-col sm:flex-row justify-center gap-4',
                    children: [
                      _jsx(Button, { children: 'View Open Positions' }),
                      _jsx(Button, { variant: 'outline', children: 'Our Culture' })
                    ]
                  })
                ]
              })
            })
          })
        ]
      }),
      _jsx(Footer, {}),
      _jsx(ArticleDialog, {
        isOpen: isDialogOpen,
        onOpenChange: setIsDialogOpen,
        perspective: selectedPerspective
      })
    ]
  });
};
export default About;
