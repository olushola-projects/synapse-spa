module.exports = {
  ci: {
    collect: {
      // Collect from multiple URLs
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/sfdr-navigator',
        'http://localhost:5173/dashboard',
        'http://localhost:5173/compliance'
      ],
      // Number of runs to perform
      numberOfRuns: 3,
      // Start the dev server before collecting
      startServerCommand: 'npm run dev',
      // Wait for the server to be ready
      startServerReadyPattern: 'Local:',
      // Wait for the server to be ready
      startServerReadyTimeout: 60000,
      // Chrome flags for better performance
      chromeFlags: '--no-sandbox --disable-dev-shm-usage --disable-gpu',
      // Settings for collecting
      settings: {
        // Emulate mobile device
        emulatedFormFactor: 'desktop',
        // Throttling settings
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        // Only run these audits
        onlyAudits: [
          'first-contentful-paint',
          'largest-contentful-paint',
          'first-meaningful-paint',
          'speed-index',
          'cumulative-layout-shift',
          'total-blocking-time',
          'max-potential-fid',
          'server-response-time',
          'render-blocking-resources',
          'unused-css-rules',
          'unused-javascript',
          'modern-image-formats',
          'uses-optimized-images',
          'uses-text-compression',
          'uses-responsive-images',
          'efficient-animated-content',
          'preload-lcp-image',
          'total-byte-weight',
          'uses-long-cache-ttl',
          'dom-size',
          'critical-request-chains',
          'user-timings',
          'bootup-time',
          'mainthread-work-breakdown',
          'font-display',
          'resource-summary',
          'third-party-summary',
          'largest-contentful-paint-element',
          'layout-shift-elements',
          'long-tasks',
          'non-composited-animations',
          'unsized-images'
        ]
      }
    },
    assert: {
      // Assertions for performance budgets
      assertions: {
        // Core Web Vitals thresholds
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Performance metrics thresholds
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-meaningful-paint': ['error', { maxNumericValue: 2000 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'max-potential-fid': ['error', { maxNumericValue: 130 }],

        // Resource optimization
        'total-byte-weight': ['warn', { maxNumericValue: 500000 }], // 500KB
        'render-blocking-resources': ['warn', { maxLength: 5 }],
        'unused-css-rules': ['warn', { maxLength: 10 }],
        'unused-javascript': ['warn', { maxLength: 10 }],

        // Image optimization
        'modern-image-formats': ['warn', { maxLength: 5 }],
        'uses-optimized-images': ['warn', { maxLength: 5 }],
        'uses-responsive-images': ['warn', { maxLength: 5 }],

        // Caching and compression
        'uses-text-compression': ['error', { maxLength: 0 }],
        'uses-long-cache-ttl': ['warn', { maxLength: 10 }],

        // Accessibility
        'color-contrast': ['error', { maxLength: 0 }],
        'image-alt': ['error', { maxLength: 0 }],
        label: ['error', { maxLength: 0 }],
        'link-name': ['error', { maxLength: 0 }],

        // Best practices
        'no-document-write': ['error', { maxLength: 0 }],
        'external-anchors-use-rel-noopener': ['error', { maxLength: 0 }],
        'geolocation-on-start': ['error', { maxLength: 0 }],
        'no-vulnerable-libraries': ['error', { maxLength: 0 }],
        'notification-on-start': ['error', { maxLength: 0 }],
        'password-inputs-can-be-pasted-into': ['error', { maxLength: 0 }],
        'uses-http2': ['warn', { maxLength: 5 }],
        'uses-passive-event-listeners': ['warn', { maxLength: 5 }]
      }
    },
    upload: {
      // Upload results to temporary public storage
      target: 'temporary-public-storage',
      // GitHub token for CI integration
      token: process.env.LHCI_GITHUB_APP_TOKEN
    }
  },

  // Performance budgets
  budgets: [
    {
      path: '/*',
      timings: [
        { metric: 'first-contentful-paint', budget: 2000 },
        { metric: 'largest-contentful-paint', budget: 2500 },
        { metric: 'first-meaningful-paint', budget: 2000 },
        { metric: 'speed-index', budget: 3000 },
        { metric: 'cumulative-layout-shift', budget: 0.1 },
        { metric: 'total-blocking-time', budget: 300 },
        { metric: 'max-potential-fid', budget: 130 }
      ],
      resourceSizes: [
        { resourceType: 'script', budget: 200 },
        { resourceType: 'stylesheet', budget: 50 },
        { resourceType: 'image', budget: 100 },
        { resourceType: 'media', budget: 50 },
        { resourceType: 'font', budget: 20 },
        { resourceType: 'document', budget: 50 },
        { resourceType: 'other', budget: 30 }
      ],
      resourceCounts: [
        { resourceType: 'script', budget: 20 },
        { resourceType: 'stylesheet', budget: 5 },
        { resourceType: 'image', budget: 30 },
        { resourceType: 'media', budget: 5 },
        { resourceType: 'font', budget: 5 },
        { resourceType: 'document', budget: 1 },
        { resourceType: 'other', budget: 10 }
      ]
    }
  ],

  // Custom configurations for different environments
  environments: {
    development: {
      collect: {
        url: ['http://localhost:5173/'],
        numberOfRuns: 1
      },
      assert: {
        assertions: {
          'categories:performance': ['warn', { minScore: 0.7 }],
          'categories:accessibility': ['warn', { minScore: 0.8 }],
          'categories:best-practices': ['warn', { minScore: 0.8 }],
          'categories:seo': ['warn', { minScore: 0.8 }]
        }
      }
    },
    staging: {
      collect: {
        url: ['https://staging.synapses-grc.com/'],
        numberOfRuns: 3
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 0.85 }],
          'categories:accessibility': ['error', { minScore: 0.9 }],
          'categories:best-practices': ['error', { minScore: 0.85 }],
          'categories:seo': ['error', { minScore: 0.85 }]
        }
      }
    },
    production: {
      collect: {
        url: ['https://synapses-grc.com/'],
        numberOfRuns: 5
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 0.9 }],
          'categories:accessibility': ['error', { minScore: 0.95 }],
          'categories:best-practices': ['error', { minScore: 0.9 }],
          'categories:seo': ['error', { minScore: 0.9 }]
        }
      }
    }
  },

  // CI/CD integration
  ci: {
    // GitHub Actions integration
    github: {
      statusCheck: true,
      commitStatus: true
    },

    // Slack notifications
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: '#performance-alerts'
    },

    // Email notifications
    email: {
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      },
      recipients: ['team@synapses-grc.com']
    }
  }
};
