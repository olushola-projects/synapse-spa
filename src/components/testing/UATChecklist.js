import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Download, Upload, RotateCcw } from 'lucide-react';
// Save import removed - not used in this component
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
/**
 * Comprehensive UAT testing checklist component
 * Provides systematic testing framework for user acceptance testing
 * Includes test case management, progress tracking, and reporting
 */
const UATChecklist = () => {
  const [testCategories, setTestCategories] = useState([]);
  const [currentTester, setCurrentTester] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [testResults, setTestResults] = useState({});
  // Initialize test categories and cases
  useEffect(() => {
    const initialTestCategories = [
      {
        id: 'navigation',
        name: 'Navigation & Layout',
        description: 'Test overall site navigation, menu functionality, and responsive layout',
        testCases: [
          {
            id: 'nav-001',
            category: 'navigation',
            title: 'Main Navigation Menu',
            description: 'Verify all main navigation links work correctly',
            steps: [
              'Click on each main navigation item',
              'Verify correct page loads',
              'Check active state highlighting',
              'Test mobile hamburger menu'
            ],
            expectedResult:
              'All navigation links work, pages load correctly, active states show properly',
            priority: 'high',
            status: 'pending',
            notes: ''
          },
          {
            id: 'nav-002',
            category: 'navigation',
            title: 'Responsive Design',
            description: 'Test layout responsiveness across different screen sizes',
            steps: [
              'Test on desktop (1920x1080)',
              'Test on tablet (768x1024)',
              'Test on mobile (375x667)',
              'Check element positioning and readability'
            ],
            expectedResult: 'Layout adapts properly to all screen sizes, content remains readable',
            priority: 'high',
            status: 'pending',
            notes: ''
          },
          {
            id: 'nav-003',
            category: 'navigation',
            title: 'Footer Links',
            description: 'Verify footer navigation and external links',
            steps: [
              'Click all footer links',
              'Verify external links open in new tab',
              'Check social media links',
              'Test legal page links'
            ],
            expectedResult: 'All footer links work correctly, external links open appropriately',
            priority: 'medium',
            status: 'pending',
            notes: ''
          }
        ]
      },
      {
        id: 'content',
        name: 'Content & Messaging',
        description: 'Verify content accuracy, clarity, and effectiveness',
        testCases: [
          {
            id: 'content-001',
            category: 'content',
            title: 'Hero Section Content',
            description: 'Verify hero section messaging and call-to-action',
            steps: [
              'Read hero headline and subtext',
              'Check value proposition clarity',
              'Test primary CTA button',
              'Verify video/animation plays correctly'
            ],
            expectedResult: 'Hero content is clear, compelling, and CTA works properly',
            priority: 'high',
            status: 'pending',
            notes: ''
          },
          {
            id: 'content-002',
            category: 'content',
            title: 'Features Section',
            description: 'Review features presentation and descriptions',
            steps: [
              'Read all feature descriptions',
              'Check for typos and grammar',
              'Verify feature icons/images load',
              'Test any interactive elements'
            ],
            expectedResult: 'Features are clearly described, no errors, visuals load properly',
            priority: 'high',
            status: 'pending',
            notes: ''
          },
          {
            id: 'content-003',
            category: 'content',
            title: 'SFDR Content Accuracy',
            description: 'Verify SFDR-related content for regulatory accuracy',
            steps: [
              'Review SFDR terminology usage',
              'Check compliance statements',
              'Verify regulatory disclaimers',
              'Test SFDR classification examples'
            ],
            expectedResult: 'SFDR content is accurate and compliant with regulations',
            priority: 'high',
            status: 'pending',
            notes: ''
          }
        ]
      },
      {
        id: 'functionality',
        name: 'Core Functionality',
        description: 'Test key features and interactive elements',
        testCases: [
          {
            id: 'func-001',
            category: 'functionality',
            title: 'Contact Form Submission',
            description: 'Test contact form functionality and validation',
            steps: [
              'Fill out contact form with valid data',
              'Test form validation with invalid data',
              'Submit form and verify success message',
              'Check email notification (if applicable)'
            ],
            expectedResult: 'Form validates correctly, submits successfully, shows confirmation',
            priority: 'high',
            status: 'pending',
            notes: ''
          },
          {
            id: 'func-002',
            category: 'functionality',
            title: 'SFDR Gem Tool',
            description: 'Test SFDR classification tool functionality',
            steps: [
              'Access SFDR Gem tool',
              'Input sample investment data',
              'Process classification request',
              'Review and export results'
            ],
            expectedResult: 'Tool processes data correctly, provides accurate classification',
            priority: 'high',
            status: 'pending',
            notes: ''
          },
          {
            id: 'func-003',
            category: 'functionality',
            title: 'Search Functionality',
            description: 'Test site search capabilities',
            steps: [
              'Use search function with relevant terms',
              'Test search with invalid/empty queries',
              'Verify search results accuracy',
              'Test search filters (if available)'
            ],
            expectedResult: 'Search returns relevant results, handles edge cases properly',
            priority: 'medium',
            status: 'pending',
            notes: ''
          }
        ]
      },
      {
        id: 'performance',
        name: 'Performance & Loading',
        description: 'Test page load times, performance, and optimization',
        testCases: [
          {
            id: 'perf-001',
            category: 'performance',
            title: 'Page Load Speed',
            description: 'Measure and verify page loading performance',
            steps: [
              'Load homepage and measure time',
              'Test subsequent page loads',
              'Check image loading optimization',
              'Verify lazy loading functionality'
            ],
            expectedResult: 'Pages load within 3 seconds, images optimize properly',
            priority: 'high',
            status: 'pending',
            notes: ''
          },
          {
            id: 'perf-002',
            category: 'performance',
            title: 'Mobile Performance',
            description: 'Test performance on mobile devices and slow connections',
            steps: [
              'Test on mobile device',
              'Simulate slow 3G connection',
              'Check touch responsiveness',
              'Verify scroll performance'
            ],
            expectedResult: 'Good performance on mobile, responsive to touch, smooth scrolling',
            priority: 'medium',
            status: 'pending',
            notes: ''
          }
        ]
      },
      {
        id: 'accessibility',
        name: 'Accessibility & Usability',
        description: 'Test accessibility compliance and general usability',
        testCases: [
          {
            id: 'access-001',
            category: 'accessibility',
            title: 'Keyboard Navigation',
            description: 'Test site navigation using only keyboard',
            steps: [
              'Navigate using Tab key only',
              'Test all interactive elements',
              'Verify focus indicators are visible',
              'Check skip links functionality'
            ],
            expectedResult: 'All elements accessible via keyboard, clear focus indicators',
            priority: 'high',
            status: 'pending',
            notes: ''
          },
          {
            id: 'access-002',
            category: 'accessibility',
            title: 'Screen Reader Compatibility',
            description: 'Test compatibility with screen reading software',
            steps: [
              'Use screen reader to navigate site',
              'Check alt text for images',
              'Verify heading structure',
              'Test form labels and descriptions'
            ],
            expectedResult: 'Site is fully navigable with screen reader, proper semantics',
            priority: 'high',
            status: 'pending',
            notes: ''
          },
          {
            id: 'access-003',
            category: 'accessibility',
            title: 'Color Contrast',
            description: 'Verify color contrast meets accessibility standards',
            steps: [
              'Check text contrast ratios',
              'Test with color blindness simulation',
              'Verify interactive element contrast',
              'Check focus state visibility'
            ],
            expectedResult: 'All text meets WCAG AA contrast requirements',
            priority: 'medium',
            status: 'pending',
            notes: ''
          }
        ]
      },
      {
        id: 'security',
        name: 'Security & Privacy',
        description: 'Test security measures and privacy compliance',
        testCases: [
          {
            id: 'sec-001',
            category: 'security',
            title: 'Form Security',
            description: 'Test form security and data protection',
            steps: [
              'Test form with malicious input',
              'Verify HTTPS encryption',
              'Check CSRF protection',
              'Test input sanitization'
            ],
            expectedResult: 'Forms are secure, data transmitted safely, inputs sanitized',
            priority: 'high',
            status: 'pending',
            notes: ''
          },
          {
            id: 'sec-002',
            category: 'security',
            title: 'Privacy Compliance',
            description: 'Verify privacy policy and cookie compliance',
            steps: [
              'Review privacy policy accessibility',
              'Test cookie consent functionality',
              'Check data collection transparency',
              'Verify GDPR compliance measures'
            ],
            expectedResult: 'Privacy policy clear, cookie consent works, GDPR compliant',
            priority: 'medium',
            status: 'pending',
            notes: ''
          }
        ]
      }
    ];
    setTestCategories(initialTestCategories);
    setSelectedCategory(initialTestCategories[0]?.id || '');
    // Load saved test results
    const savedResults = localStorage.getItem('uat_test_results');
    if (savedResults) {
      setTestResults(JSON.parse(savedResults));
    }
    // Load tester name
    const savedTester = localStorage.getItem('uat_tester_name');
    if (savedTester) {
      setCurrentTester(savedTester);
    }
  }, []);
  // Update test case status and notes
  const updateTestCase = (testId, updates) => {
    const updatedCase = {
      ...testResults[testId],
      ...updates,
      timestamp: new Date().toISOString(),
      testerName: currentTester
    };
    const newResults = {
      ...testResults,
      [testId]: updatedCase
    };
    setTestResults(newResults);
    localStorage.setItem('uat_test_results', JSON.stringify(newResults));
  };
  // Save tester name
  const saveTesterName = name => {
    setCurrentTester(name);
    localStorage.setItem('uat_tester_name', name);
  };
  // Calculate progress statistics
  const getProgressStats = () => {
    const allTestCases = testCategories.flatMap(cat => cat.testCases);
    const totalTests = allTestCases.length;
    const completedTests = allTestCases.filter(test => {
      const result = testResults[test.id];
      return result && result.status !== 'pending';
    }).length;
    const passedTests = allTestCases.filter(test => {
      const result = testResults[test.id];
      return result && result.status === 'passed';
    }).length;
    const failedTests = allTestCases.filter(test => {
      const result = testResults[test.id];
      return result && result.status === 'failed';
    }).length;
    return {
      total: totalTests,
      completed: completedTests,
      passed: passedTests,
      failed: failedTests,
      progress: totalTests > 0 ? (completedTests / totalTests) * 100 : 0
    };
  };
  // Export test results
  const exportResults = () => {
    const stats = getProgressStats();
    const exportData = {
      metadata: {
        tester: currentTester,
        exportDate: new Date().toISOString(),
        totalTests: stats.total,
        completedTests: stats.completed,
        passedTests: stats.passed,
        failedTests: stats.failed
      },
      testResults,
      testCategories
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uat-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  // Import test results
  const importResults = event => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const importData = JSON.parse(e.target?.result);
          if (importData.testResults) {
            setTestResults(importData.testResults);
            localStorage.setItem('uat_test_results', JSON.stringify(importData.testResults));
          }
          if (importData.metadata?.tester) {
            saveTesterName(importData.metadata.tester);
          }
        } catch (error) {
          alert('Error importing file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };
  // Reset all test results
  const resetResults = () => {
    if (confirm('Are you sure you want to reset all test results? This action cannot be undone.')) {
      setTestResults({});
      localStorage.removeItem('uat_test_results');
    }
  };
  const stats = getProgressStats();
  return _jsxs('div', {
    className: 'max-w-6xl mx-auto p-6 space-y-6',
    children: [
      _jsxs('div', {
        className: 'text-center space-y-4',
        children: [
          _jsx('h1', {
            className: 'text-3xl font-bold text-gray-900',
            children: 'UAT Testing Checklist'
          }),
          _jsx('p', {
            className: 'text-gray-600 max-w-2xl mx-auto',
            children:
              'Comprehensive User Acceptance Testing framework for the Synapses Landing Page. Follow the systematic testing approach to ensure quality and compliance.'
          })
        ]
      }),
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, { children: _jsx(CardTitle, { children: 'Tester Information' }) }),
          _jsx(CardContent, {
            children: _jsxs('div', {
              className: 'flex gap-4 items-center',
              children: [
                _jsx('input', {
                  type: 'text',
                  placeholder: 'Enter your name',
                  value: currentTester,
                  onChange: e => saveTesterName(e.target.value),
                  className:
                    'flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                }),
                _jsxs('div', {
                  className: 'flex gap-2',
                  children: [
                    _jsxs(Button, {
                      onClick: exportResults,
                      variant: 'outline',
                      size: 'sm',
                      children: [_jsx(Download, { className: 'h-4 w-4 mr-2' }), 'Export Results']
                    }),
                    _jsxs('label', {
                      className: 'cursor-pointer',
                      children: [
                        _jsx(Button, {
                          variant: 'outline',
                          size: 'sm',
                          asChild: true,
                          children: _jsxs('span', {
                            children: [
                              _jsx(Upload, { className: 'h-4 w-4 mr-2' }),
                              'Import Results'
                            ]
                          })
                        }),
                        _jsx('input', {
                          type: 'file',
                          accept: '.json',
                          onChange: importResults,
                          className: 'hidden'
                        })
                      ]
                    }),
                    _jsxs(Button, {
                      onClick: resetResults,
                      variant: 'outline',
                      size: 'sm',
                      children: [_jsx(RotateCcw, { className: 'h-4 w-4 mr-2' }), 'Reset']
                    })
                  ]
                })
              ]
            })
          })
        ]
      }),
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, { children: _jsx(CardTitle, { children: 'Testing Progress' }) }),
          _jsx(CardContent, {
            children: _jsxs('div', {
              className: 'space-y-4',
              children: [
                _jsx(Progress, { value: stats.progress, className: 'w-full' }),
                _jsxs('div', {
                  className: 'grid grid-cols-2 md:grid-cols-4 gap-4 text-center',
                  children: [
                    _jsxs('div', {
                      children: [
                        _jsx('div', {
                          className: 'text-2xl font-bold text-blue-600',
                          children: stats.total
                        }),
                        _jsx('div', { className: 'text-sm text-gray-600', children: 'Total Tests' })
                      ]
                    }),
                    _jsxs('div', {
                      children: [
                        _jsx('div', {
                          className: 'text-2xl font-bold text-green-600',
                          children: stats.passed
                        }),
                        _jsx('div', { className: 'text-sm text-gray-600', children: 'Passed' })
                      ]
                    }),
                    _jsxs('div', {
                      children: [
                        _jsx('div', {
                          className: 'text-2xl font-bold text-red-600',
                          children: stats.failed
                        }),
                        _jsx('div', { className: 'text-sm text-gray-600', children: 'Failed' })
                      ]
                    }),
                    _jsxs('div', {
                      children: [
                        _jsx('div', {
                          className: 'text-2xl font-bold text-gray-600',
                          children: stats.total - stats.completed
                        }),
                        _jsx('div', { className: 'text-sm text-gray-600', children: 'Pending' })
                      ]
                    })
                  ]
                })
              ]
            })
          })
        ]
      }),
      _jsxs(Tabs, {
        value: selectedCategory,
        onValueChange: setSelectedCategory,
        children: [
          _jsx(TabsList, {
            className: 'grid w-full grid-cols-3 lg:grid-cols-6',
            children: testCategories.map(category => {
              const categoryTests = category.testCases;
              const completedInCategory = categoryTests.filter(test => {
                const result = testResults[test.id];
                return result && result.status !== 'pending';
              }).length;
              return _jsx(
                TabsTrigger,
                {
                  value: category.id,
                  className: 'text-xs',
                  children: _jsxs('div', {
                    className: 'flex flex-col items-center',
                    children: [
                      _jsx('span', { children: category.name }),
                      _jsxs(Badge, {
                        variant: 'secondary',
                        className: 'text-xs mt-1',
                        children: [completedInCategory, '/', categoryTests.length]
                      })
                    ]
                  })
                },
                category.id
              );
            })
          }),
          testCategories.map(category =>
            _jsx(
              TabsContent,
              {
                value: category.id,
                children: _jsxs(Card, {
                  children: [
                    _jsxs(CardHeader, {
                      children: [
                        _jsx(CardTitle, { children: category.name }),
                        _jsx('p', { className: 'text-gray-600', children: category.description })
                      ]
                    }),
                    _jsx(CardContent, {
                      children: _jsx('div', {
                        className: 'space-y-6',
                        children: category.testCases.map(testCase => {
                          const result = testResults[testCase.id] || testCase;
                          const status = result.status || 'pending';
                          return _jsxs(
                            Card,
                            {
                              className: 'border-l-4 border-l-gray-200',
                              children: [
                                _jsx(CardHeader, {
                                  className: 'pb-3',
                                  children: _jsxs('div', {
                                    className: 'flex items-start justify-between',
                                    children: [
                                      _jsxs('div', {
                                        className: 'flex-1',
                                        children: [
                                          _jsxs('div', {
                                            className: 'flex items-center gap-2',
                                            children: [
                                              _jsx('h4', {
                                                className: 'font-semibold',
                                                children: testCase.title
                                              }),
                                              _jsx(Badge, {
                                                variant:
                                                  testCase.priority === 'high'
                                                    ? 'destructive'
                                                    : testCase.priority === 'medium'
                                                      ? 'default'
                                                      : 'secondary',
                                                children: testCase.priority
                                              })
                                            ]
                                          }),
                                          _jsx('p', {
                                            className: 'text-sm text-gray-600 mt-1',
                                            children: testCase.description
                                          })
                                        ]
                                      }),
                                      _jsxs('div', {
                                        className: 'flex gap-2',
                                        children: [
                                          _jsx(Button, {
                                            size: 'sm',
                                            variant: status === 'passed' ? 'default' : 'outline',
                                            onClick: () =>
                                              updateTestCase(testCase.id, { status: 'passed' }),
                                            className:
                                              status === 'passed'
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : '',
                                            children: _jsx(Check, { className: 'h-4 w-4' })
                                          }),
                                          _jsx(Button, {
                                            size: 'sm',
                                            variant: status === 'failed' ? 'default' : 'outline',
                                            onClick: () =>
                                              updateTestCase(testCase.id, { status: 'failed' }),
                                            className:
                                              status === 'failed'
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : '',
                                            children: _jsx(X, { className: 'h-4 w-4' })
                                          }),
                                          _jsx(Button, {
                                            size: 'sm',
                                            variant: status === 'blocked' ? 'default' : 'outline',
                                            onClick: () =>
                                              updateTestCase(testCase.id, { status: 'blocked' }),
                                            className:
                                              status === 'blocked'
                                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                                : '',
                                            children: _jsx(AlertTriangle, { className: 'h-4 w-4' })
                                          })
                                        ]
                                      })
                                    ]
                                  })
                                }),
                                _jsx(CardContent, {
                                  children: _jsxs('div', {
                                    className: 'space-y-4',
                                    children: [
                                      _jsxs('div', {
                                        children: [
                                          _jsx('h5', {
                                            className: 'font-medium text-sm mb-2',
                                            children: 'Test Steps:'
                                          }),
                                          _jsx('ol', {
                                            className:
                                              'list-decimal list-inside space-y-1 text-sm text-gray-600',
                                            children: testCase.steps.map((step, index) =>
                                              _jsx('li', { children: step }, index)
                                            )
                                          })
                                        ]
                                      }),
                                      _jsxs('div', {
                                        children: [
                                          _jsx('h5', {
                                            className: 'font-medium text-sm mb-1',
                                            children: 'Expected Result:'
                                          }),
                                          _jsx('p', {
                                            className: 'text-sm text-gray-600',
                                            children: testCase.expectedResult
                                          })
                                        ]
                                      }),
                                      _jsxs('div', {
                                        children: [
                                          _jsx('label', {
                                            className: 'font-medium text-sm mb-1 block',
                                            children: 'Notes & Comments:'
                                          }),
                                          _jsx(Textarea, {
                                            placeholder:
                                              'Add your testing notes, observations, or issues found...',
                                            value: result.notes || '',
                                            onChange: e =>
                                              updateTestCase(testCase.id, {
                                                notes: e.target.value
                                              }),
                                            className: 'min-h-[80px]'
                                          })
                                        ]
                                      }),
                                      result.timestamp &&
                                        _jsxs('div', {
                                          className: 'text-xs text-gray-500 pt-2 border-t',
                                          children: [
                                            _jsxs('p', {
                                              children: [
                                                'Tested by: ',
                                                result.testerName || 'Unknown'
                                              ]
                                            }),
                                            _jsxs('p', {
                                              children: [
                                                'Last updated: ',
                                                new Date(result.timestamp).toLocaleString()
                                              ]
                                            })
                                          ]
                                        })
                                    ]
                                  })
                                })
                              ]
                            },
                            testCase.id
                          );
                        })
                      })
                    })
                  ]
                })
              },
              category.id
            )
          )
        ]
      }),
      _jsxs(Alert, {
        children: [
          _jsx(AlertTriangle, { className: 'h-4 w-4' }),
          _jsxs(AlertDescription, {
            children: [
              _jsx('strong', { children: 'Testing Guidelines:' }),
              ' Test each scenario thoroughly, document any issues found, and provide detailed notes for failed tests. Use the priority levels to focus on critical functionality first. Remember to test across different browsers and devices.'
            ]
          })
        ]
      })
    ]
  });
};
export default UATChecklist;
