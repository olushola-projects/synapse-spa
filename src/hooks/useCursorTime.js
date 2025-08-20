/**
 * Cursor Time Hook (JavaScript Version)
 * React hook for using live time and date from the computer in components
 * Ensures all cursor settings and activities use current system time
 */

import {
    DEFAULT_CURSOR_TIME_CONFIG,
    getCursorTimeManager
} from '@/config/cursorTimeConfig';
import {
    createApiTimestamp,
    createCursorTimestamp,
    createDocumentTimestamp,
    formatDateTime,
    formatRelativeTime,
    getCurrentTime,
    getCurrentTimestamp,
    TIMEZONE_CONFIG
} from '@/utils/timeUtils';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * React hook for cursor time management
 * @param {Object} options - Hook configuration options
 * @returns {Object} Cursor time utilities and state
 */
export function useCursorTime(options = {}) {
  const {
    updateInterval = 1000,
    config: initialConfig = {},
    enableActivityTracking = true,
    enablePerformanceTiming = true
  } = options;

  // Get or create cursor time manager
  const timeManager = getCursorTimeManager({
    ...DEFAULT_CURSOR_TIME_CONFIG,
    ...initialConfig,
    timeSettings: {
      ...DEFAULT_CURSOR_TIME_CONFIG.timeSettings,
      ...initialConfig.timeSettings,
      updateInterval
    },
    activitySettings: {
      ...DEFAULT_CURSOR_TIME_CONFIG.activitySettings,
      ...initialConfig.activitySettings,
      trackUserActions: enableActivityTracking
    },
    performanceSettings: {
      ...DEFAULT_CURSOR_TIME_CONFIG.performanceSettings,
      ...initialConfig.performanceSettings,
      enableTiming: enablePerformanceTiming
    }
  });

  // State for current time
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [currentTimestamp, setCurrentTimestamp] = useState(getCurrentTimestamp());
  const [formattedTime, setFormattedTime] = useState(
    formatDateTime(getCurrentTime(), timeManager.getConfig().timeSettings.format)
  );

  // Performance timer ref
  const timerRef = useRef({
    startTime: getCurrentTimestamp()
  });

  // Update time state
  const updateTimeState = useCallback(() => {
    const now = getCurrentTime();
    const timestamp = getCurrentTimestamp();
    const formatted = formatDateTime(now, timeManager.getConfig().timeSettings.format);
    
    setCurrentTime(now);
    setCurrentTimestamp(timestamp);
    setFormattedTime(formatted);
  }, [timeManager]);

  // Listen for time update events
  useEffect(() => {
    const handleTimeUpdate = (event) => {
      updateTimeState();
    };

    // Listen for cursor time update events
    if (typeof window !== 'undefined') {
      window.addEventListener('cursorTimeUpdate', handleTimeUpdate);
    }

    // Initial time update
    updateTimeState();

    // Set up interval for time updates
    const interval = setInterval(updateTimeState, updateInterval);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('cursorTimeUpdate', handleTimeUpdate);
      }
      clearInterval(interval);
    };
  }, [updateTimeState, updateInterval]);

  // Create cursor timestamp
  const createCursorTimestampFn = useCallback(() => {
    const timestamp = createCursorTimestamp();
    
    // Log activity if enabled
    if (enableActivityTracking) {
      timeManager.logActivity('cursor_timestamp_created', { timestamp });
    }
    
    return timestamp;
  }, [timeManager, enableActivityTracking]);

  // Create document timestamp
  const createDocumentTimestampFn = useCallback(() => {
    const timestamp = createDocumentTimestamp();
    
    // Log activity if enabled
    if (enableActivityTracking) {
      timeManager.logActivity('document_timestamp_created', { timestamp });
    }
    
    return timestamp;
  }, [timeManager, enableActivityTracking]);

  // Create API timestamp
  const createApiTimestampFn = useCallback(() => {
    const timestamp = createApiTimestamp();
    
    // Log activity if enabled
    if (enableActivityTracking) {
      timeManager.logActivity('api_timestamp_created', { timestamp });
    }
    
    return timestamp;
  }, [timeManager, enableActivityTracking]);

  // Format time
  const formatTimeFn = useCallback((date, format) => {
    return formatDateTime(date, format || timeManager.getConfig().timeSettings.format);
  }, [timeManager]);

  // Format relative time
  const formatRelativeTimeFn = useCallback((date, short = false) => {
    return formatRelativeTime(
      typeof date === 'string' || typeof date === 'number' ? new Date(date) : date,
      short
    );
  }, []);

  // Update configuration
  const updateConfigFn = useCallback((newConfig) => {
    timeManager.updateConfig(newConfig);
    updateTimeState();
  }, [timeManager, updateTimeState]);

  // Log activity
  const logActivityFn = useCallback((type, data) => {
    if (enableActivityTracking) {
      timeManager.logActivity(type, data);
    }
  }, [timeManager, enableActivityTracking]);

  // Get activity log
  const getActivityLogFn = useCallback(() => {
    return timeManager.getActivityLog();
  }, [timeManager]);

  // Start performance timer
  const startTimerFn = useCallback(() => {
    if (enablePerformanceTiming) {
      timerRef.current = {
        startTime: getCurrentTimestamp()
      };
    }
  }, [enablePerformanceTiming]);

  // Get elapsed time
  const getElapsedTimeFn = useCallback(() => {
    if (!enablePerformanceTiming) return 0;
    
    const endTime = timerRef.current.endTime || getCurrentTimestamp();
    return endTime - timerRef.current.startTime;
  }, [enablePerformanceTiming]);

  // Get elapsed time formatted
  const getElapsedFormattedFn = useCallback(() => {
    const elapsed = getElapsedTimeFn();
    if (elapsed < 1000) {
      return `${elapsed}ms`;
    } else if (elapsed < 60000) {
      return `${(elapsed / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(elapsed / 60000);
      const seconds = ((elapsed % 60000) / 1000).toFixed(2);
      return `${minutes}m ${seconds}s`;
    }
  }, [getElapsedTimeFn]);

  return {
    // Current time values
    currentTime,
    currentTimestamp,
    formattedTime,
    
    // Timestamp creation functions
    createCursorTimestamp: createCursorTimestampFn,
    createDocumentTimestamp: createDocumentTimestampFn,
    createApiTimestamp: createApiTimestampFn,
    
    // Formatting functions
    formatTime: formatTimeFn,
    formatRelativeTime: formatRelativeTimeFn,
    
    // Configuration
    config: timeManager.getConfig(),
    updateConfig: updateConfigFn,
    
    // Activity tracking
    logActivity: logActivityFn,
    getActivityLog: getActivityLogFn,
    
    // Timezone information
    userTimezone: TIMEZONE_CONFIG.USER_TIMEZONE,
    supportedTimezones: TIMEZONE_CONFIG.SUPPORTED_TIMEZONES,
    
    // Performance utilities
    startTimer: startTimerFn,
    getElapsedTime: getElapsedTimeFn,
    getElapsedFormatted: getElapsedFormattedFn
  };
}

/**
 * Simplified hook for basic time operations
 * @returns {Object} Basic time utilities
 */
export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [formattedTime, setFormattedTime] = useState(
    formatDateTime(getCurrentTime(), 'SHORT_DATETIME')
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = getCurrentTime();
      setCurrentTime(now);
      setFormattedTime(formatDateTime(now, 'SHORT_DATETIME'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    currentTime,
    formattedTime,
    timestamp: currentTime.getTime(),
    formatTime: (date, format) => 
      formatDateTime(date, format || 'SHORT_DATETIME')
  };
}

/**
 * Hook for document timestamp creation
 * @returns {Object} Document timestamp utilities
 */
export function useDocumentTimestamp() {
  const { createDocumentTimestamp, logActivity } = useCursorTime({
    enableActivityTracking: true
  });

  const createTimestamp = useCallback(() => {
    const timestamp = createDocumentTimestamp();
    logActivity('document_created', { timestamp });
    return timestamp;
  }, [createDocumentTimestamp, logActivity]);

  return {
    createTimestamp,
    createDocumentTimestamp
  };
}

/**
 * Hook for API timestamp creation
 * @returns {Object} API timestamp utilities
 */
export function useApiTimestamp() {
  const { createApiTimestamp, logActivity } = useCursorTime({
    enableActivityTracking: true
  });

  const createTimestamp = useCallback(() => {
    const timestamp = createApiTimestamp();
    logActivity('api_call', { timestamp });
    return timestamp;
  }, [createApiTimestamp, logActivity]);

  return {
    createTimestamp,
    createApiTimestamp
  };
}

// Export default for backward compatibility
export default useCursorTime;
