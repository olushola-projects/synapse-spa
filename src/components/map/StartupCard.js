import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { ExternalLink, MapPin, Calendar, Building, Users, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const BadgeColors = {
  use_cases: 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100',
  regulations: 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100',
  technologies: 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100',
  industries: 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100',
  investors: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
  funding_stage: 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
};
export function StartupCard({
  startup,
  viewMode,
  className,
  onToggleSaved,
  onToggleInterested,
  isSaved = false,
  isInterested = false
}) {
  const {
    name,
    // logo, // Removed - not used in current implementation
    country,
    founded,
    description,
    website,
    use_cases,
    regulations,
    technologies,
    investors,
    funding_stage
  } = startup;
  const handleLearnMore = () => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };
  if (viewMode === 'list') {
    return _jsx(Card, {
      className: cn(
        'hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white',
        className
      ),
      children: _jsx(CardContent, {
        className: 'p-6',
        children: _jsxs('div', {
          className: 'flex gap-6',
          children: [
            _jsx('div', {
              className: 'shrink-0',
              children: _jsx('div', {
                className:
                  'w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200',
                children: _jsx(Building, { className: 'h-8 w-8 text-gray-600' })
              })
            }),
            _jsxs('div', {
              className: 'flex-1 min-w-0',
              children: [
                _jsxs('div', {
                  className: 'flex items-start justify-between mb-3',
                  children: [
                    _jsxs('div', {
                      children: [
                        _jsx('h3', {
                          className: 'text-xl font-semibold text-gray-900 mb-2',
                          children: name
                        }),
                        _jsxs('div', {
                          className: 'flex items-center gap-4 text-sm text-gray-600',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-center gap-1',
                              children: [
                                _jsx(MapPin, { className: 'h-4 w-4 text-gray-400' }),
                                country
                              ]
                            }),
                            _jsxs('div', {
                              className: 'flex items-center gap-1',
                              children: [
                                _jsx(Calendar, { className: 'h-4 w-4 text-gray-400' }),
                                'Founded ',
                                founded
                              ]
                            }),
                            _jsx(Badge, {
                              className:
                                startup.company_stage === 'Mature Leader'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : BadgeColors.funding_stage,
                              children:
                                startup.company_stage === 'Mature Leader' ? 'Leader' : funding_stage
                            })
                          ]
                        })
                      ]
                    }),
                    _jsxs('div', {
                      className: 'flex items-center gap-2',
                      children: [
                        onToggleSaved &&
                          _jsx(Button, {
                            variant: 'ghost',
                            size: 'sm',
                            onClick: onToggleSaved,
                            className: cn(
                              'h-8 w-8 p-0',
                              isSaved ? 'text-red-600' : 'text-gray-400'
                            ),
                            children: _jsx(Heart, {
                              className: 'h-4 w-4',
                              fill: isSaved ? 'currentColor' : 'none'
                            })
                          }),
                        onToggleInterested &&
                          _jsx(Button, {
                            variant: 'ghost',
                            size: 'sm',
                            onClick: onToggleInterested,
                            className: cn(
                              'h-8 w-8 p-0',
                              isInterested ? 'text-yellow-600' : 'text-gray-400'
                            ),
                            children: _jsx(Star, {
                              className: 'h-4 w-4',
                              fill: isInterested ? 'currentColor' : 'none'
                            })
                          }),
                        website &&
                          _jsxs(Button, {
                            variant: 'outline',
                            size: 'sm',
                            onClick: handleLearnMore,
                            className: 'border-gray-300 text-gray-700 hover:bg-gray-50',
                            children: [
                              _jsx(ExternalLink, { className: 'h-4 w-4 mr-2' }),
                              'Learn More'
                            ]
                          })
                      ]
                    })
                  ]
                }),
                _jsx('p', {
                  className: 'text-gray-600 mb-4 line-clamp-2 leading-relaxed',
                  children: description
                }),
                _jsxs('div', {
                  className: 'space-y-3',
                  children: [
                    use_cases.length > 0 &&
                      _jsxs('div', {
                        className: 'flex flex-wrap gap-2',
                        children: [
                          _jsx('span', {
                            className: 'text-xs font-medium text-muted-foreground min-w-20',
                            children: 'Use Cases:'
                          }),
                          use_cases.slice(0, 3).map(useCase =>
                            _jsx(
                              Badge,
                              {
                                variant: 'secondary',
                                className: BadgeColors.use_cases,
                                children: useCase
                              },
                              useCase
                            )
                          ),
                          use_cases.length > 3 &&
                            _jsxs(Badge, {
                              variant: 'outline',
                              children: ['+', use_cases.length - 3, ' more']
                            })
                        ]
                      }),
                    _jsxs('div', {
                      className: 'flex flex-wrap items-center gap-4',
                      children: [
                        technologies.length > 0 &&
                          _jsxs('div', {
                            className: 'flex flex-wrap gap-1',
                            children: [
                              _jsx('span', {
                                className: 'text-xs font-medium text-muted-foreground min-w-20',
                                children: 'Tech:'
                              }),
                              technologies.slice(0, 2).map(tech =>
                                _jsx(
                                  Badge,
                                  {
                                    variant: 'secondary',
                                    className: BadgeColors.technologies,
                                    children: tech
                                  },
                                  tech
                                )
                              )
                            ]
                          }),
                        investors.length > 0 &&
                          _jsxs('div', {
                            className: 'flex flex-wrap gap-1',
                            children: [
                              _jsx('span', {
                                className: 'text-xs font-medium text-muted-foreground',
                                children: _jsx(Users, { className: 'h-3 w-3 inline mr-1' })
                              }),
                              investors.slice(0, 2).map(investor =>
                                _jsx(
                                  Badge,
                                  {
                                    variant: 'secondary',
                                    className: BadgeColors.investors,
                                    children: investor
                                  },
                                  investor
                                )
                              )
                            ]
                          })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      })
    });
  }
  return _jsxs(Card, {
    className: cn(
      'hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-fit',
      className
    ),
    children: [
      _jsxs(CardHeader, {
        className: 'pb-4',
        children: [
          _jsxs('div', {
            className: 'flex items-start justify-between mb-3',
            children: [
              _jsx('div', {
                className: 'w-12 h-12 bg-muted rounded-lg flex items-center justify-center',
                children: _jsx(Building, { className: 'h-6 w-6 text-muted-foreground' })
              }),
              _jsx(Badge, { className: BadgeColors.funding_stage, children: funding_stage })
            ]
          }),
          _jsx(CardTitle, {
            className: 'text-lg font-semibold text-foreground line-clamp-1',
            children: name
          }),
          _jsxs('div', {
            className: 'flex items-center gap-3 text-sm text-muted-foreground',
            children: [
              _jsxs('div', {
                className: 'flex items-center gap-1',
                children: [_jsx(MapPin, { className: 'h-3 w-3' }), country]
              }),
              _jsxs('div', {
                className: 'flex items-center gap-1',
                children: [_jsx(Calendar, { className: 'h-3 w-3' }), founded]
              })
            ]
          }),
          _jsx(CardDescription, {
            className: 'line-clamp-3 text-sm leading-relaxed',
            children: description
          })
        ]
      }),
      _jsxs(CardContent, {
        className: 'pt-0',
        children: [
          use_cases.length > 0 &&
            _jsxs('div', {
              className: 'mb-4',
              children: [
                _jsx('h4', {
                  className:
                    'text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide',
                  children: 'Use Cases'
                }),
                _jsxs('div', {
                  className: 'flex flex-wrap gap-1',
                  children: [
                    use_cases.slice(0, 2).map(useCase =>
                      _jsx(
                        Badge,
                        {
                          variant: 'secondary',
                          className: cn(BadgeColors.use_cases, 'text-xs'),
                          children: useCase
                        },
                        useCase
                      )
                    ),
                    use_cases.length > 2 &&
                      _jsxs(Badge, {
                        variant: 'outline',
                        className: 'text-xs',
                        children: ['+', use_cases.length - 2]
                      })
                  ]
                })
              ]
            }),
          technologies.length > 0 &&
            _jsxs('div', {
              className: 'mb-4',
              children: [
                _jsx('h4', {
                  className:
                    'text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide',
                  children: 'AI Technologies'
                }),
                _jsxs('div', {
                  className: 'flex flex-wrap gap-1',
                  children: [
                    technologies.slice(0, 2).map(tech =>
                      _jsx(
                        Badge,
                        {
                          variant: 'secondary',
                          className: cn(BadgeColors.technologies, 'text-xs'),
                          children: tech
                        },
                        tech
                      )
                    ),
                    technologies.length > 2 &&
                      _jsxs(Badge, {
                        variant: 'outline',
                        className: 'text-xs',
                        children: ['+', technologies.length - 2]
                      })
                  ]
                })
              ]
            }),
          regulations.length > 0 &&
            _jsxs('div', {
              className: 'mb-4',
              children: [
                _jsx('h4', {
                  className:
                    'text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide',
                  children: 'Regulations'
                }),
                _jsxs('div', {
                  className: 'flex flex-wrap gap-1',
                  children: [
                    regulations.slice(0, 3).map(regulation =>
                      _jsx(
                        Badge,
                        {
                          variant: 'secondary',
                          className: cn(BadgeColors.regulations, 'text-xs'),
                          children: regulation
                        },
                        regulation
                      )
                    ),
                    regulations.length > 3 &&
                      _jsxs(Badge, {
                        variant: 'outline',
                        className: 'text-xs',
                        children: ['+', regulations.length - 3]
                      })
                  ]
                })
              ]
            }),
          investors.length > 0 &&
            _jsxs('div', {
              className: 'mb-6',
              children: [
                _jsxs('h4', {
                  className:
                    'text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1',
                  children: [_jsx(Users, { className: 'h-3 w-3' }), 'Backed By']
                }),
                _jsxs('div', {
                  className: 'flex flex-wrap gap-1',
                  children: [
                    investors.slice(0, 2).map(investor =>
                      _jsx(
                        Badge,
                        {
                          variant: 'secondary',
                          className: cn(BadgeColors.investors, 'text-xs'),
                          children: investor
                        },
                        investor
                      )
                    ),
                    investors.length > 2 &&
                      _jsxs(Badge, {
                        variant: 'outline',
                        className: 'text-xs',
                        children: ['+', investors.length - 2]
                      })
                  ]
                })
              ]
            }),
          _jsxs('div', {
            className: 'flex items-center gap-2',
            children: [
              onToggleSaved &&
                _jsxs(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: onToggleSaved,
                  className: cn(
                    'flex-1 h-9',
                    isSaved
                      ? 'text-red-600 bg-red-50 hover:bg-red-100'
                      : 'text-gray-400 hover:bg-gray-50'
                  ),
                  children: [
                    _jsx(Heart, {
                      className: 'h-4 w-4 mr-2',
                      fill: isSaved ? 'currentColor' : 'none'
                    }),
                    isSaved ? 'Saved' : 'Save'
                  ]
                }),
              onToggleInterested &&
                _jsxs(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: onToggleInterested,
                  className: cn(
                    'flex-1 h-9',
                    isInterested
                      ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                      : 'text-gray-400 hover:bg-gray-50'
                  ),
                  children: [
                    _jsx(Star, {
                      className: 'h-4 w-4 mr-2',
                      fill: isInterested ? 'currentColor' : 'none'
                    }),
                    isInterested ? 'Interested' : 'Interest'
                  ]
                })
            ]
          }),
          website &&
            _jsxs(Button, {
              variant: 'outline',
              className: 'w-full group mt-2',
              onClick: handleLearnMore,
              children: [
                'Learn More',
                _jsx(ExternalLink, {
                  className: 'h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform'
                })
              ]
            })
        ]
      })
    ]
  });
}
