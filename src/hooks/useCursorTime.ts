/**
 * Cursor Time Hook
 * React hook for using live time and date from the computer in components
 * Ensures all cursor settings and activities use current system time
 */

import {
  CursorTimeConfig,
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
  TIME_FORMATS,
  TIMEZONE_CONFIG
} from '@/utils/timeUtils';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook return interface
 */
export interface UseCursorTimeReturn {
  // Current time values
  currentTime: Date;
  currentTimestamp: number;
  formattedTime: string;

  // Timestamp creation functions
  createCursorTimestamp: () => ReturnType<typeof createCursorTimestamp>;
  createDocumentTimestamp: () => ReturnType<typeof createDocumentTimestamp>;
  createApiTimestamp: () => ReturnType<typeof createApiTimestamp>;

  // Formatting functions
  formatTime: (date: Date | string | number, format?: keyof typeof TIME_FORMATS) => string;
  formatRelativeTime: (date: Date | string | number, short?: boolean) => string;

  // Configuration
  config: CursorTimeConfig;
  updateConfig: (newConfig: Partial<CursorTimeConfig>) => void;

  // Activity tracking
  logActivity: (type: string, data?: any) => void;
  getActivityLog: () => Array<{ id: string; type: string; timestamp: string; data?: any }>;

  // Timezone information
  userTimezone: string;
  supportedTimezones: string[];

  // Performance utilities
  startTimer: () => void;
  getElapsedTime: () => number;
  getElapsedFormatted: () => string;
}

/**
 * Cursor time hook options
 */
export interface UseCursorTimeOptions {
  // Update interval in milliseconds (default: 1000ms)
  updateInterval?: number;

  // Initial configuration
  config?: Partial<CursorTimeConfig>;

  // Whether to enable activity tracking
  enableActivityTracking?: boolean;

  // Whether to enable performance timing
  enablePerformanceTiming?: boolean;
}

/**
 * React hook for cursor time management
 * @param options - Hook configuration options
 * @returns Cursor time utilities and state
 */
export function useCursorTime(options: UseCursorTimeOptions = {}): UseCursorTimeReturn {
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
  const [currentTime, setCurrentTime] = useState<Date>(getCurrentTime());
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(getCurrentTimestamp());
  const [formattedTime, setFormattedTime] = useState<string>(
    formatDateTime(getCurrentTime(), timeManager.getConfig().timeSettings.format)
  );

  // Performance timer ref
  const timerRef = useRef<{ startTime: number; endTime?: number }>({
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
    const handleTimeUpdate = (event: CustomEvent) => {
      updateTimeState();
    };

    // Listen for cursor time update events
    if (typeof window !== 'undefined') {
      window.addEventListener('cursorTimeUpdate', handleTimeUpdate as EventListener);
    }

    // Initial time update
    updateTimeState();

    // Set up interval for time updates
    const interval = setInterval(updateTimeState, updateInterval);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('cursorTimeUpdate', handleTimeUpdate as EventListener);
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
  const formatTimeFn = useCallback(
    (date: Date | string | number, format?: keyof typeof TIME_FORMATS) => {
      return formatDateTime(date, format || timeManager.getConfig().timeSettings.format);
    },
    [timeManager]
  );

  // Format relative time
  const formatRelativeTimeFn = useCallback(
    (date: Date | string | number, short: boolean = false) => {
      return formatRelativeTime(
        typeof date === 'string' || typeof date === 'number' ? new Date(date) : date,
        short
      );
    },
    []
  );

  // Update configuration
  const updateConfigFn = useCallback(
    (newConfig: Partial<CursorTimeConfig>) => {
      timeManager.updateConfig(newConfig);
      updateTimeState();
    },
    [timeManager, updateTimeState]
  );

  // Log activity
  const logActivityFn = useCallback(
    (type: string, data?: any) => {
      if (enableActivityTracking) {
        timeManager.logActivity(type, data);
      }
    },
    [timeManager, enableActivityTracking]
  );

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
 * @returns Basic time utilities
 */
export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<Date>(getCurrentTime());
  const [formattedTime, setFormattedTime] = useState<string>(
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
    formatTime: (date: Date | string | number, format?: keyof typeof TIME_FORMATS) =>
      formatDateTime(date, format || 'SHORT_DATETIME')
  };
}

/**
 * Hook for document timestamp creation
 * @returns Document timestamp utilities
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
 * @returns API timestamp utilities
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
