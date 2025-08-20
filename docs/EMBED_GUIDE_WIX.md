# Wix Iframe Embedding Guide

## Overview

This guide explains how to securely embed Synapse components in Wix websites using our secure iframe implementation.

## Security Features

### Content Security Policy (CSP)

- Frame ancestors restricted to Wix domains
- Script sources validated and sanitized
- XSS protection enabled

### PostMessage Security

- Origin validation for all communications
- Message sanitization and validation
- Error handling and logging

## Implementation

### 1. Basic Embedding

```html
<iframe
  src="https://your-synapse-domain.vercel.app/embed/component"
  width="100%"
  height="600"
  frameborder="0"
  sandbox="allow-scripts allow-same-origin allow-forms"
  referrerpolicy="strict-origin-when-cross-origin"
>
</iframe>
```

### 2. Using WixEmbedSecure Component

```tsx
import { WixEmbedSecure } from '@/components/WixEmbedSecure';

<WixEmbedSecure
  src='https://your-wix-content.wixsite.com/widget'
  title='Synapse Integration'
  allowedOrigins={['*.wix.com', '*.wixsite.com']}
  onMessage={data => console.log('Received:', data)}
  onError={error => console.error('Error:', error)}
/>;
```

## PostMessage Communication

### Sending Messages from Wix to Synapse

```javascript
// In your Wix website
window.parent.postMessage(
  {
    type: 'SYNAPSE_ACTION',
    action: 'UPDATE_DATA',
    data: {
      /* your data */
    }
  },
  'https://your-synapse-domain.vercel.app'
);
```

### Receiving Messages in Synapse

```javascript
// In Synapse application
window.addEventListener('message', event => {
  // Verify origin
  if (!event.origin.includes('wix.com')) return;

  // Process message
  if (event.data.type === 'WIX_UPDATE') {
    handleWixUpdate(event.data);
  }
});
```

## Security Headers Configuration

Our Vercel deployment includes these security headers:

```json
{
  "headers": [
    {
      "source": "/embed/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        },
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors *.wix.com *.wixsite.com;"
        }
      ]
    }
  ]
}
```

## Best Practices

### 1. Origin Validation

Always validate the origin of postMessage communications:

```javascript
const ALLOWED_ORIGINS = ['wix.com', 'wixsite.com'];

function isValidOrigin(origin) {
  return ALLOWED_ORIGINS.some(allowed => origin.includes(allowed));
}
```

### 2. Data Sanitization

Sanitize all data received via postMessage:

```javascript
function sanitizeData(data) {
  // Remove potentially dangerous properties
  const { __proto__, constructor, ...safeData } = data;
  return safeData;
}
```

### 3. Error Handling

Implement comprehensive error handling:

```javascript
try {
  // Process message
  handleMessage(event.data);
} catch (error) {
  console.error('Message processing error:', error);
  // Send error back to parent
  event.source.postMessage(
    {
      type: 'ERROR',
      message: 'Invalid message format'
    },
    event.origin
  );
}
```

## Testing

### 1. Local Testing

For local development, use ngrok to test iframe embedding:

```bash
ngrok http 8080
# Use the HTTPS URL for iframe src
```

### 2. CSP Testing

Verify CSP headers using browser developer tools:

- Check Network tab for CSP violations
- Monitor Console for security warnings

### 3. PostMessage Testing

Test communication between parent and iframe:

```javascript
// Test message sending
iframe.contentWindow.postMessage(
  {
    type: 'TEST',
    timestamp: Date.now()
  },
  '*'
);
```

## Troubleshooting

### Common Issues

1. **Iframe not loading**
   - Check CSP headers
   - Verify allowed origins
   - Check HTTPS requirements

2. **PostMessage not working**
   - Verify origin validation
   - Check message format
   - Ensure iframe is fully loaded

3. **CORS errors**
   - Configure server headers
   - Use proper referrer policy
   - Check domain whitelist

### Debug Mode

Enable debug mode for detailed logging:

```javascript
const DEBUG_MODE = process.env.NODE_ENV === 'development';

if (DEBUG_MODE) {
  console.log('PostMessage received:', event);
}
```

## Performance Optimization

### 1. Lazy Loading

Use intersection observer for iframe lazy loading:

```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadIframe(entry.target);
    }
  });
});
```

### 2. Preloading

Preload critical iframe content:

```html
<link rel="preload" href="iframe-content.html" as="document" />
```

## Support

For embedding support:

- Email: support@synapse-grc.com
- Documentation: https://docs.synapse-grc.com
- GitHub Issues: https://github.com/synapse-grc/platform
