/**
 * Logging Utility
 *
 * Provides centralized logging functionality with environment-based controls
 * Replaces direct console usage for better production management
 */

/**
 * Log levels for controlling output verbosity
 */
const LOG_LEVEL_DEBUG = 3;

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = LOG_LEVEL_DEBUG
}

/**
 * Logger configuration interface
 */
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  prefix: string;
}

/**
 * Log entry structure for consistent formatting
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: Date;
  context?: string;
}

/**
 * Centralized logging utility class
 */
class Logger {
  private config: LoggerConfig;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 1000;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: this.getEnvironmentLogLevel(),
      enableConsole: process.env.NODE_ENV !== 'production',
      enableRemote: process.env.NODE_ENV === 'production',
      prefix: 'Synapse',
      ...config
    };
  }

  /**
   * Determine log level based on environment
   */
  private getEnvironmentLogLevel(): LogLevel {
    const envLevel = process.env.VITE_LOG_LEVEL?.toUpperCase();

    switch (envLevel) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        return process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
    }
  }

  /**
   * Create a formatted log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: string
  ): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date(),
      context
    };
  }

  /**
   * Format log message for console output
   */
  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}]` : '';

    return `[${this.config.prefix}] ${timestamp} ${levelName} ${context} ${entry.message}`;
  }

  /**
   * Log a message if it meets the current log level threshold
   */
  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    if (level > this.config.level) {
      return;
    }

    const entry = this.createLogEntry(level, message, data, context);

    // Add to history
    this.addToHistory(entry);

    // Console output
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Remote logging (if enabled)
    if (this.config.enableRemote && level <= LogLevel.WARN) {
      this.logToRemote(entry);
    }
  }

  /**
   * Output to console with appropriate method
   */
  private logToConsole(entry: LogEntry): void {
    const formattedMessage = this.formatMessage(entry);

    switch (entry.level) {
      case LogLevel.ERROR:
        // eslint-disable-next-line no-console
        console.error(formattedMessage, entry.data);
        break;
      case LogLevel.WARN:
        // eslint-disable-next-line no-console
        console.warn(formattedMessage, entry.data);
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(formattedMessage, entry.data);
        break;
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(formattedMessage, entry.data);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log(formattedMessage, entry.data);
        break;
    }
  }

  /**
   * Send logs to remote service (placeholder for future implementation)
   */
  private logToRemote(entry: LogEntry): void {
    // TODO: Implement remote logging service integration
    // This could send to services like LogRocket, Sentry, or custom endpoints
    if (entry.level <= LogLevel.ERROR) {
      // For now, just ensure critical errors are noted
      // eslint-disable-next-line no-console
      console.error('REMOTE LOG:', this.formatMessage(entry), entry.data);
    }
  }

  /**
   * Add entry to log history with size management
   */
  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);

    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory = this.logHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Log an error message
   */
  public error(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.ERROR, message, data, context);
  }

  /**
   * Log a warning message
   */
  public warn(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  /**
   * Log an info message
   */
  public info(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  /**
   * Log a debug message
   */
  public debug(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  /**
   * Get recent log entries
   */
  public getRecentLogs(limit = 50): LogEntry[] {
    return this.logHistory.slice(-limit);
  }

  /**
   * Get logs by level
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logHistory.filter(entry => entry.level === level);
  }

  /**
   * Clear log history
   */
  public clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Update logger configuration
   */
  public updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Create a child logger with specific context
   */
  public createChild(context: string): ChildLogger {
    return new ChildLogger(this, context);
  }
}

/**
 * Child logger for component-specific logging
 */
class ChildLogger {
  constructor(
    private parent: Logger,
    private context: string
  ) {}

  public error(message: string, data?: unknown): void {
    this.parent.error(message, data, this.context);
  }

  public warn(message: string, data?: unknown): void {
    this.parent.warn(message, data, this.context);
  }

  public info(message: string, data?: unknown): void {
    this.parent.info(message, data, this.context);
  }

  public debug(message: string, data?: unknown): void {
    this.parent.debug(message, data, this.context);
  }
}

// Create and export default logger instance
const defaultLogger = new Logger();

export { Logger, ChildLogger };
export default defaultLogger;

// Named export for compatibility
export const logger = defaultLogger;

// Convenience exports for common usage
export const log = {
  error: (message: string, data?: unknown, context?: string) =>
    defaultLogger.error(message, data, context),
  warn: (message: string, data?: unknown, context?: string) =>
    defaultLogger.warn(message, data, context),
  info: (message: string, data?: unknown, context?: string) =>
    defaultLogger.info(message, data, context),
  debug: (message: string, data?: unknown, context?: string) =>
    defaultLogger.debug(message, data, context)
};
