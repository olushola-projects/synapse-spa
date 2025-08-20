/**
 * Cursor Time Configuration
 * Ensures all cursor settings and activities use live time and date from the computer
 * Provides centralized configuration for time-based cursor operations
 */

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

/**
 * Cursor time configuration interface
 */
export interface CursorTimeConfig {
  // Time settings for cursor operations
  timeSettings: {
    useLiveTime: boolean;
    timezone: string;
    format: keyof typeof TIME_FORMATS;
    updateInterval: number; // milliseconds
  };

  // Document creation settings
  documentSettings: {
    autoTimestamp: boolean;
    includeTimezone: boolean;
    format: keyof typeof TIME_FORMATS;
  };

  // Activity tracking settings
  activitySettings: {
    trackCursorMovement: boolean;
    trackDocumentChanges: boolean;
    trackUserActions: boolean;
    retentionPeriod: number; // days
  };

  // Performance monitoring settings
  performanceSettings: {
    enableTiming: boolean;
    logPerformance: boolean;
    thresholdMs: number;
  };
}

/**
 * Default cursor time configuration
 */
export const DEFAULT_CURSOR_TIME_CONFIG: CursorTimeConfig = {
  timeSettings: {
    useLiveTime: true,
    timezone: TIMEZONE_CONFIG.USER_TIMEZONE,
    format: 'SHORT_DATETIME',
    updateInterval: 1000 // Update every second
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
    thresholdMs: 100 // Log if operation takes more than 100ms
  }
};

/**
 * Cursor time manager class
 * Manages all time-related cursor operations
 */
export class CursorTimeManager {
  private config: CursorTimeConfig;
  private lastUpdate: number;
  private updateTimer?: NodeJS.Timeout;
  private activityLog: Array<{
    id: string;
    type: string;
    timestamp: string;
    data?: any;
  }> = [];

  constructor(config: Partial<CursorTimeConfig> = {}) {
    this.config = { ...DEFAULT_CURSOR_TIME_CONFIG, ...config };
    this.lastUpdate = getCurrentTimestamp();
    this.initializeTimeUpdates();
  }

  /**
   * Initialize automatic time updates
   */
  private initializeTimeUpdates(): void {
    if (this.config.timeSettings.useLiveTime && this.config.timeSettings.updateInterval > 0) {
      this.updateTimer = setInterval(() => {
        this.updateTime();
      }, this.config.timeSettings.updateInterval);
    }
  }

  /**
   * Update current time
   */
  private updateTime(): void {
    this.lastUpdate = getCurrentTimestamp();

    // Trigger any time-based events
    this.onTimeUpdate();
  }

  /**
   * Handle time update events
   */
  private onTimeUpdate(): void {
    // Emit time update event for components that need it
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cursorTimeUpdate', {
          detail: {
            timestamp: this.getCurrentCursorTime(),
            formatted: this.getFormattedCurrentTime()
          }
        })
      );
    }
  }

  /**
   * Get current cursor time
   */
  getCurrentCursorTime(): ReturnType<typeof createCursorTimestamp> {
    return createCursorTimestamp();
  }

  /**
   * Get formatted current time
   */
  getFormattedCurrentTime(): string {
    return formatDateTime(
      getCurrentTime(),
      this.config.timeSettings.format,
      this.config.timeSettings.timezone
    );
  }

  /**
   * Create timestamp for document creation
   */
  createDocumentTimestamp(): ReturnType<typeof createDocumentTimestamp> {
    const timestamp = createDocumentTimestamp();

    // Log document creation activity
    if (this.config.activitySettings.trackDocumentChanges) {
      this.logActivity('document_created', {
        timestamp: timestamp.created_at_iso,
        format: this.config.documentSettings.format
      });
    }

    return timestamp;
  }

  /**
   * Create timestamp for API operations
   */
  createApiTimestamp(): ReturnType<typeof createApiTimestamp> {
    return createApiTimestamp();
  }

  /**
   * Log cursor activity
   */
  logActivity(type: string, data?: any): void {
    if (!this.config.activitySettings.trackUserActions) {
      return;
    }

    const activity = {
      id: `activity_${getCurrentTimestamp()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: formatDateTime(getCurrentTime(), 'ISO_DATETIME'),
      data
    };

    this.activityLog.push(activity);

    // Clean up old activities based on retention period
    this.cleanupOldActivities();
  }

  /**
   * Clean up old activities based on retention period
   */
  private cleanupOldActivities(): void {
    const cutoffDate = getCurrentTime();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.activitySettings.retentionPeriod);

    this.activityLog = this.activityLog.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate > cutoffDate;
    });
  }

  /**
   * Get activity log
   */
  getActivityLog(): typeof this.activityLog {
    return [...this.activityLog];
  }

  /**
   * Get activities by type
   */
  getActivitiesByType(type: string): typeof this.activityLog {
    return this.activityLog.filter(activity => activity.type === type);
  }

  /**
   * Get recent activities
   */
  getRecentActivities(hours: number = 24): typeof this.activityLog {
    const cutoffTime = getCurrentTimestamp() - hours * 60 * 60 * 1000;
    return this.activityLog.filter(activity => {
      const activityTime = new Date(activity.timestamp).getTime();
      return activityTime > cutoffTime;
    });
  }

  /**
   * Format time for display
   */
  formatTime(date: Date | string | number, format?: keyof typeof TIME_FORMATS): string {
    return formatDateTime(
      date,
      format || this.config.timeSettings.format,
      this.config.timeSettings.timezone
    );
  }

  /**
   * Format relative time
   */
  formatRelativeTime(date: Date | string | number, short: boolean = false): string {
    return formatRelativeTime(
      typeof date === 'string' || typeof date === 'number' ? new Date(date) : date,
      short
    );
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CursorTimeConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Restart time updates if interval changed
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
    this.initializeTimeUpdates();
  }

  /**
   * Get current configuration
   */
  getConfig(): CursorTimeConfig {
    return { ...this.config };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
    this.activityLog = [];
  }
}

/**
 * Global cursor time manager instance
 */
let globalCursorTimeManager: CursorTimeManager | null = null;

/**
 * Get or create global cursor time manager
 */
export function getCursorTimeManager(config?: Partial<CursorTimeConfig>): CursorTimeManager {
  if (!globalCursorTimeManager) {
    globalCursorTimeManager = new CursorTimeManager(config);
  }
  return globalCursorTimeManager;
}

/**
 * Initialize cursor time management
 */
export function initializeCursorTime(config?: Partial<CursorTimeConfig>): CursorTimeManager {
  if (globalCursorTimeManager) {
    globalCursorTimeManager.destroy();
  }
  globalCursorTimeManager = new CursorTimeManager(config);
  return globalCursorTimeManager;
}

/**
 * Utility functions for cursor time operations
 */
export const cursorTimeUtils = {
  /**
   * Get current cursor time
   */
  getCurrentTime: () => getCurrentTime(),

  /**
   * Get current timestamp
   */
  getCurrentTimestamp: () => getCurrentTimestamp(),

  /**
   * Create cursor timestamp
   */
  createCursorTimestamp: () => createCursorTimestamp(),

  /**
   * Create document timestamp
   */
  createDocumentTimestamp: () => createDocumentTimestamp(),

  /**
   * Create API timestamp
   */
  createApiTimestamp: () => createApiTimestamp(),

  /**
   * Format time
   */
  formatTime: (date: Date | string | number, format?: keyof typeof TIME_FORMATS) =>
    formatDateTime(date, format || 'SHORT_DATETIME'),

  /**
   * Format relative time
   */
  formatRelativeTime: (date: Date | string | number, short: boolean = false) =>
    formatRelativeTime(
      typeof date === 'string' || typeof date === 'number' ? new Date(date) : date,
      short
    ),

  /**
   * Get user timezone
   */
  getUserTimezone: () => TIMEZONE_CONFIG.USER_TIMEZONE,

  /**
   * Get supported timezones
   */
  getSupportedTimezones: () => TIMEZONE_CONFIG.SUPPORTED_TIMEZONES
};

// Export default for backward compatibility
export default {
  CursorTimeManager,
  getCursorTimeManager,
  initializeCursorTime,
  cursorTimeUtils,
  DEFAULT_CURSOR_TIME_CONFIG
};
