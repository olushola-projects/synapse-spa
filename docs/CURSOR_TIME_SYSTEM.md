# Cursor Time System Documentation

## Overview

The Cursor Time System ensures that all cursor settings and activities use live time and date from the computer. This system provides centralized time management, consistent formatting, and automatic timezone handling across the entire application.

## Key Features

- ✅ **Live Time from Computer**: All timestamps use the current system time
- ✅ **Automatic Timezone Detection**: Uses the user's local timezone
- ✅ **Consistent Formatting**: Standardized time display across the application
- ✅ **Activity Tracking**: Logs all cursor and document activities with timestamps
- ✅ **Performance Monitoring**: Built-in timing utilities for performance tracking
- ✅ **React Integration**: Hooks for easy use in React components

## Architecture

### Core Components

1. **Time Utilities** (`src/utils/timeUtils.ts/js`)
   - Core time functions and formatting
   - Timezone handling
   - Performance timing utilities

2. **Cursor Time Configuration** (`src/config/cursorTimeConfig.ts`)
   - Centralized configuration management
   - Activity tracking settings
   - Performance monitoring settings

3. **React Hooks** (`src/hooks/useCursorTime.ts/js`)
   - React integration for components
   - Real-time time updates
   - Activity logging

## Usage Examples

### Basic Time Operations

```typescript
import { 
  getCurrentTime, 
  getCurrentTimestamp, 
  formatDateTime,
  createCursorTimestamp,
  createDocumentTimestamp 
} from '@/utils/timeUtils';

// Get current live time
const now = getCurrentTime();
const timestamp = getCurrentTimestamp();

// Format time for display
const formatted = formatDateTime(now, 'LONG_DATETIME');

// Create timestamps for different purposes
const cursorTimestamp = createCursorTimestamp();
const documentTimestamp = createDocumentTimestamp();
```

### React Component Usage

```tsx
import { useCursorTime, useCurrentTime } from '@/hooks/useCursorTime';

function MyComponent() {
  // Full cursor time functionality
  const {
    currentTime,
    formattedTime,
    createDocumentTimestamp,
    logActivity,
    formatTime
  } = useCursorTime({
    updateInterval: 1000, // Update every second
    enableActivityTracking: true
  });

  // Or use simplified hook for basic time
  const { currentTime, formattedTime } = useCurrentTime();

  const handleDocumentCreate = () => {
    const timestamp = createDocumentTimestamp();
    logActivity('document_created', { timestamp });
    
    console.log(`Document created at: ${formatTime(timestamp.created_at_iso)}`);
  };

  return (
    <div>
      <p>Current Time: {formattedTime}</p>
      <button onClick={handleDocumentCreate}>Create Document</button>
    </div>
  );
}
```

### Document Creation with Timestamps

```typescript
import { createDocumentTimestamp } from '@/utils/timeUtils';

function createNewDocument() {
  const timestamp = createDocumentTimestamp();
  
  const document = {
    id: `doc_${timestamp.created_at_timestamp}`,
    title: 'New Document',
    content: 'Document content...',
    created_at: timestamp.created_at_iso,
    created_at_formatted: timestamp.created_at,
    created_at_relative: timestamp.created_at_relative
  };
  
  return document;
}
```

### API Operations with Timestamps

```typescript
import { createApiTimestamp } from '@/utils/timeUtils';

async function makeApiCall() {
  const startTime = createApiTimestamp();
  
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    
    const endTime = createApiTimestamp();
    const processingTime = endTime.timestamp_ms - startTime.timestamp_ms;
    
    console.log(`API call completed in ${processingTime}ms`);
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
  }
}
```

## Configuration

### Default Configuration

```typescript
import { DEFAULT_CURSOR_TIME_CONFIG } from '@/config/cursorTimeConfig';

const config = {
  timeSettings: {
    useLiveTime: true,
    timezone: 'America/New_York', // User's timezone
    format: 'SHORT_DATETIME',
    updateInterval: 1000 // 1 second
  },
  documentSettings: {
    autoTimestamp: true,
    includeTimezone: true,
    format: 'LONG_DATETIME'
  },
  activitySettings: {
    trackCursorMovement: true,
    trackDocumentChanges: true,
    trackUserActions: true,
    retentionPeriod: 30 // 30 days
  },
  performanceSettings: {
    enableTiming: true,
    logPerformance: true,
    thresholdMs: 100
  }
};
```

### Custom Configuration

```typescript
import { getCursorTimeManager } from '@/config/cursorTimeConfig';

const timeManager = getCursorTimeManager({
  timeSettings: {
    updateInterval: 500, // Update every 500ms
    format: 'LONG_DATETIME'
  },
  activitySettings: {
    retentionPeriod: 7 // Keep activities for 7 days
  }
});
```

## Time Formats

### Available Formats

```typescript
import { TIME_FORMATS } from '@/utils/timeUtils';

// Short formats for UI display
TIME_FORMATS.SHORT_TIME        // "14:30"
TIME_FORMATS.SHORT_DATE        // "Jan 15, 2024"
TIME_FORMATS.SHORT_DATETIME    // "Jan 15, 2024 14:30"

// Long formats for detailed display
TIME_FORMATS.LONG_TIME         // "14:30:45"
TIME_FORMATS.LONG_DATE         // "Monday, January 15, 2024"
TIME_FORMATS.LONG_DATETIME     // "Monday, January 15, 2024 14:30:45"

// ISO formats for API and storage
TIME_FORMATS.ISO_DATE          // "2024-01-15"
TIME_FORMATS.ISO_DATETIME      // "2024-01-15T14:30:45.123Z"
TIME_FORMATS.ISO_DATETIME_UTC  // "2024-01-15T14:30:45.123Z"

// Relative time formats
TIME_FORMATS.RELATIVE          // "2 hours ago"
TIME_FORMATS.RELATIVE_SHORT    // "2h ago"

// Timestamp formats
TIME_FORMATS.TIMESTAMP         // "1705329045123"
TIME_FORMATS.TIMESTAMP_MS      // "1705329045123"
```

### Formatting Examples

```typescript
import { formatDateTime, formatRelativeTime } from '@/utils/timeUtils';

const date = new Date();

// Different format examples
formatDateTime(date, 'SHORT_TIME')        // "14:30"
formatDateTime(date, 'LONG_DATE')         // "Monday, January 15, 2024"
formatDateTime(date, 'ISO_DATETIME')      // "2024-01-15T14:30:45.123Z"
formatDateTime(date, 'RELATIVE')          // "just now" or "2 hours ago"

// Relative time formatting
formatRelativeTime(date)                  // "2 hours ago"
formatRelativeTime(date, true)            // "2h ago"
```

## Activity Tracking

### Logging Activities

```typescript
import { useCursorTime } from '@/hooks/useCursorTime';

function MyComponent() {
  const { logActivity, getActivityLog } = useCursorTime();

  const handleUserAction = () => {
    // Log user activity
    logActivity('button_clicked', {
      buttonId: 'save-button',
      page: 'document-editor'
    });
  };

  const viewRecentActivities = () => {
    const activities = getActivityLog();
    console.log('Recent activities:', activities);
  };
}
```

### Activity Types

Common activity types that are automatically tracked:

- `cursor_timestamp_created` - When cursor timestamps are created
- `document_timestamp_created` - When document timestamps are created
- `api_timestamp_created` - When API timestamps are created
- `document_created` - When documents are created
- `api_call` - When API calls are made
- `user_action` - General user actions
- `performance_measurement` - Performance timing events

## Performance Monitoring

### Using Performance Timer

```typescript
import { createTimer } from '@/utils/timeUtils';

function performOperation() {
  const timer = createTimer();
  
  // Perform some operation
  const result = expensiveOperation();
  
  const elapsed = timer.stop().getElapsedFormatted();
  console.log(`Operation completed in ${elapsed}`);
  
  return result;
}
```

### React Hook Performance Timing

```tsx
import { useCursorTime } from '@/hooks/useCursorTime';

function PerformanceComponent() {
  const { startTimer, getElapsedTime, getElapsedFormatted } = useCursorTime({
    enablePerformanceTiming: true
  });

  const handleExpensiveOperation = () => {
    startTimer();
    
    // Perform expensive operation
    setTimeout(() => {
      const elapsed = getElapsedFormatted();
      console.log(`Operation took: ${elapsed}`);
    }, 1000);
  };

  return (
    <button onClick={handleExpensiveOperation}>
      Run Expensive Operation
    </button>
  );
}
```

## Timezone Handling

### Automatic Timezone Detection

```typescript
import { TIMEZONE_CONFIG } from '@/utils/timeUtils';

// Automatically detects user's timezone
console.log('User timezone:', TIMEZONE_CONFIG.USER_TIMEZONE);

// Supported timezones
console.log('Supported timezones:', TIMEZONE_CONFIG.SUPPORTED_TIMEZONES);
```

### Timezone Conversion

```typescript
import { 
  convertToUserTimezone, 
  getCurrentTimeInTimezone 
} from '@/utils/timeUtils';

// Convert UTC time to user's timezone
const utcTime = new Date('2024-01-15T14:30:00Z');
const userTime = convertToUserTimezone(utcTime);

// Get current time in specific timezone
const tokyoTime = getCurrentTimeInTimezone('Asia/Tokyo');
```

## Migration Guide

### From Direct Date Usage

**Before:**
```typescript
const timestamp = new Date().toISOString();
const formatted = new Date().toLocaleTimeString();
```

**After:**
```typescript
import { createApiTimestamp, formatDateTime } from '@/utils/timeUtils';

const timestamp = createApiTimestamp();
const formatted = formatDateTime(new Date(), 'SHORT_TIME');
```

### From Manual Time Formatting

**Before:**
```typescript
const formatTime = (date) => {
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

**After:**
```typescript
import { formatDateTime } from '@/utils/timeUtils';

const formatted = formatDateTime(date, 'SHORT_TIME');
```

## Best Practices

### 1. Always Use Live Time

```typescript
// ✅ Good - Uses live time from computer
const timestamp = createCursorTimestamp();

// ❌ Bad - Uses cached or static time
const timestamp = { time: '2024-01-15T14:30:00Z' };
```

### 2. Use Appropriate Timestamp Functions

```typescript
// For cursor activities
const cursorTime = createCursorTimestamp();

// For document creation
const documentTime = createDocumentTimestamp();

// For API operations
const apiTime = createApiTimestamp();
```

### 3. Consistent Formatting

```typescript
// ✅ Good - Consistent formatting
const displayTime = formatDateTime(date, 'SHORT_DATETIME');

// ❌ Bad - Inconsistent formatting
const displayTime = date.toLocaleString();
```

### 4. Activity Tracking

```typescript
// ✅ Good - Track important activities
logActivity('document_saved', { documentId, userId });

// ❌ Bad - No activity tracking
// Missing activity logging
```

### 5. Performance Monitoring

```typescript
// ✅ Good - Monitor performance
const timer = createTimer();
const result = expensiveOperation();
console.log(`Operation took: ${timer.stop().getElapsedFormatted()}`);

// ❌ Bad - No performance monitoring
const result = expensiveOperation();
```

## Troubleshooting

### Common Issues

1. **Timezone Issues**
   ```typescript
   // Check user timezone
   console.log('User timezone:', TIMEZONE_CONFIG.USER_TIMEZONE);
   
   // Validate timezone
   import { isValidTimezone } from '@/utils/timeUtils';
   const isValid = isValidTimezone('America/New_York');
   ```

2. **Performance Issues**
   ```typescript
   // Monitor update frequency
   const timeManager = getCursorTimeManager();
   timeManager.updateConfig({
     timeSettings: { updateInterval: 2000 } // Reduce updates
   });
   ```

3. **Activity Log Memory**
   ```typescript
   // Reduce retention period
   timeManager.updateConfig({
     activitySettings: { retentionPeriod: 7 } // 7 days instead of 30
   });
   ```

### Debug Mode

```typescript
import { getCursorTimeManager } from '@/config/cursorTimeConfig';

const timeManager = getCursorTimeManager({
  performanceSettings: {
    logPerformance: true,
    thresholdMs: 0 // Log all operations
  }
});
```

## API Reference

### Time Utilities

- `getCurrentTime()` - Get current live time
- `getCurrentTimestamp()` - Get current timestamp in milliseconds
- `formatDateTime(date, format, timezone)` - Format date/time
- `formatRelativeTime(date, short)` - Format relative time
- `createCursorTimestamp()` - Create cursor timestamp
- `createDocumentTimestamp()` - Create document timestamp
- `createApiTimestamp()` - Create API timestamp

### React Hooks

- `useCursorTime(options)` - Full cursor time functionality
- `useCurrentTime()` - Basic time utilities
- `useDocumentTimestamp()` - Document timestamp utilities
- `useApiTimestamp()` - API timestamp utilities

### Configuration

- `getCursorTimeManager(config)` - Get or create time manager
- `initializeCursorTime(config)` - Initialize time management
- `DEFAULT_CURSOR_TIME_CONFIG` - Default configuration

## Conclusion

The Cursor Time System provides a comprehensive solution for ensuring all cursor settings and activities use live time and date from the computer. By following the patterns and best practices outlined in this documentation, you can ensure consistent, accurate, and reliable time handling throughout your application.

For additional support or questions, refer to the source code in:
- `src/utils/timeUtils.ts/js`
- `src/config/cursorTimeConfig.ts`
- `src/hooks/useCursorTime.ts/js`
