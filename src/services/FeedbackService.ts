/**
 * Comprehensive feedback service for managing user feedback collection,
 * analytics integration, and data processing
 */

interface FeedbackData {
  id?: string;
  rating: number;
  category: string;
  message: string;
  page: string;
  url: string;
  timestamp: string;
  userAgent: string;
  sessionId?: string;
  userId?: string;
  screenshot?: string;
  metadata?: Record<string, any>;
}

interface FeedbackAnalytics {
  totalFeedback: number;
  averageRating: number;
  categoryBreakdown: Record<string, number>;
  pageBreakdown: Record<string, number>;
  trendData: Array<{ date: string; count: number; avgRating: number }>;
}

interface FeedbackConfig {
  apiEndpoint: string;
  enableAnalytics: boolean;
  enableHotjar: boolean;
  enableGoogleAnalytics: boolean;
  enableTypeform: boolean;
  storageKey: string;
  maxRetries: number;
  retryDelay: number;
}

class FeedbackService {
  private config: FeedbackConfig;
  private sessionId: string;
  private retryQueue: FeedbackData[] = [];

  constructor(config: Partial<FeedbackConfig> = {}) {
    this.config = {
      apiEndpoint: 'https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/feedback',
      enableAnalytics: true,
      enableHotjar: false,
      enableGoogleAnalytics: true,
      enableTypeform: false,
      storageKey: 'synapses_feedback',
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    };

    this.sessionId = this.generateSessionId();
    this.initializeIntegrations();
  }

  /**
   * Generate unique session ID for tracking user sessions
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize third-party integrations
   */
  private initializeIntegrations(): void {
    // Initialize Hotjar if enabled
    if (this.config.enableHotjar && typeof window !== 'undefined') {
      this.initializeHotjar();
    }

    // Initialize Google Analytics if enabled
    if (this.config.enableGoogleAnalytics && typeof window !== 'undefined') {
      this.initializeGoogleAnalytics();
    }

    // Process any queued feedback from previous sessions
    this.processRetryQueue();
  }

  /**
   * Initialize Hotjar integration
   */
  private initializeHotjar(): void {
    if (typeof window.hj === 'undefined') {
      // Load Hotjar script if not already loaded
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://static.hotjar.com/c/hotjar-';
      document.head.appendChild(script);
    }
  }

  /**
   * Initialize Google Analytics integration
   */
  private initializeGoogleAnalytics(): void {
    // Google Analytics is typically loaded globally
    // This method can be extended for custom GA configuration
  }

  /**
   * Submit feedback with retry mechanism and analytics tracking
   */
  async submitFeedback(
    feedbackData: Omit<FeedbackData, 'id' | 'timestamp' | 'sessionId'>
  ): Promise<boolean> {
    const enrichedFeedback: FeedbackData = {
      ...feedbackData,
      id: this.generateFeedbackId(),
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      metadata: {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height
        },
        referrer: document.referrer,
        language: navigator.language,
        platform: navigator.platform
      }
    };

    try {
      // Attempt to submit feedback
      const success = await this.sendFeedbackToAPI(enrichedFeedback);

      if (success) {
        // Track successful submission
        this.trackFeedbackEvent(enrichedFeedback);

        // Store locally for analytics
        this.storeFeedbackLocally(enrichedFeedback);

        // Send to third-party services
        this.sendToIntegrations(enrichedFeedback);

        return true;
      } else {
        // Add to retry queue
        this.addToRetryQueue(enrichedFeedback);
        return false;
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      this.addToRetryQueue(enrichedFeedback);
      return false;
    }
  }

  /**
   * Generate unique feedback ID
   */
  private generateFeedbackId(): string {
    return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Send feedback to API endpoint
   */
  private async sendFeedbackToAPI(feedback: FeedbackData): Promise<boolean> {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId
        },
        body: JSON.stringify(feedback)
      });

      return response.ok;
    } catch (error) {
      console.error('API submission error:', error);
      return false;
    }
  }

  /**
   * Track feedback event in analytics
   */
  private trackFeedbackEvent(feedback: FeedbackData): void {
    // Google Analytics 4
    if (typeof gtag !== 'undefined' && this.config.enableGoogleAnalytics) {
      gtag('event', 'feedback_submitted', {
        event_category: 'engagement',
        event_label: feedback.category,
        value: feedback.rating,
        custom_parameters: {
          page: feedback.page,
          session_id: feedback.sessionId
        }
      });
    }

    // Hotjar event tracking
    if (typeof window.hj !== 'undefined' && this.config.enableHotjar) {
      window.hj('event', 'feedback_submitted');
      window.hj('identify', feedback.sessionId, {
        last_feedback_rating: feedback.rating,
        last_feedback_category: feedback.category
      });
    }

    // Custom analytics event
    if (typeof window.analytics !== 'undefined') {
      window.analytics.track('Feedback Submitted', {
        rating: feedback.rating,
        category: feedback.category,
        page: feedback.page,
        sessionId: feedback.sessionId
      });
    }
  }

  /**
   * Store feedback locally for offline capability and analytics
   */
  private storeFeedbackLocally(feedback: FeedbackData): void {
    try {
      const existingFeedback = this.getLocalFeedback();
      existingFeedback.push(feedback);

      // Keep only last 100 feedback items to prevent storage bloat
      const trimmedFeedback = existingFeedback.slice(-100);

      localStorage.setItem(this.config.storageKey, JSON.stringify(trimmedFeedback));
    } catch (error) {
      console.error('Local storage error:', error);
    }
  }

  /**
   * Get locally stored feedback
   */
  private getLocalFeedback(): FeedbackData[] {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Local storage retrieval error:', error);
      return [];
    }
  }

  /**
   * Send feedback to third-party integrations
   */
  private sendToIntegrations(feedback: FeedbackData): void {
    // Typeform integration (if enabled)
    if (this.config.enableTypeform) {
      this.sendToTypeform(feedback);
    }

    // Additional integrations can be added here
    // Examples: Slack notifications, email alerts, etc.
  }

  /**
   * Send feedback to Typeform (example integration)
   */
  private async sendToTypeform(feedback: FeedbackData): Promise<void> {
    try {
      // This would integrate with Typeform's API
      // Implementation depends on specific Typeform setup
      console.log('Typeform integration:', feedback);
    } catch (error) {
      console.error('Typeform integration error:', error);
    }
  }

  /**
   * Add feedback to retry queue for failed submissions
   */
  private addToRetryQueue(feedback: FeedbackData): void {
    this.retryQueue.push(feedback);

    // Store retry queue in localStorage
    try {
      localStorage.setItem(`${this.config.storageKey}_retry`, JSON.stringify(this.retryQueue));
    } catch (error) {
      console.error('Retry queue storage error:', error);
    }
  }

  /**
   * Process retry queue for failed submissions
   */
  private async processRetryQueue(): Promise<void> {
    try {
      // Load retry queue from localStorage
      const storedQueue = localStorage.getItem(`${this.config.storageKey}_retry`);
      if (storedQueue) {
        this.retryQueue = JSON.parse(storedQueue);
      }

      // Process queued items
      const failedItems: FeedbackData[] = [];

      for (const feedback of this.retryQueue) {
        const success = await this.sendFeedbackToAPI(feedback);
        if (!success) {
          failedItems.push(feedback);
        } else {
          this.trackFeedbackEvent(feedback);
        }

        // Add delay between retries
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
      }

      // Update retry queue with failed items
      this.retryQueue = failedItems;
      localStorage.setItem(`${this.config.storageKey}_retry`, JSON.stringify(this.retryQueue));
    } catch (error) {
      console.error('Retry queue processing error:', error);
    }
  }

  /**
   * Get feedback analytics and insights
   */
  getFeedbackAnalytics(): FeedbackAnalytics {
    const localFeedback = this.getLocalFeedback();

    if (localFeedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        categoryBreakdown: {},
        pageBreakdown: {},
        trendData: []
      };
    }

    // Calculate analytics
    const totalFeedback = localFeedback.length;
    const averageRating = localFeedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;

    // Category breakdown
    const categoryBreakdown = localFeedback.reduce(
      (acc, f) => {
        acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Page breakdown
    const pageBreakdown = localFeedback.reduce(
      (acc, f) => {
        acc[f.page] = (acc[f.page] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Trend data (last 30 days)
    const trendData = this.calculateTrendData(localFeedback);

    return {
      totalFeedback,
      averageRating: Math.round(averageRating * 100) / 100,
      categoryBreakdown,
      pageBreakdown,
      trendData
    };
  }

  /**
   * Calculate trend data for analytics
   */
  private calculateTrendData(
    feedback: FeedbackData[]
  ): Array<{ date: string; count: number; avgRating: number }> {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentFeedback = feedback.filter(f => new Date(f.timestamp) >= last30Days);

    // Group by date using Map for better TypeScript support
    const groupedByDate = new Map<string, FeedbackData[]>();
    
    recentFeedback.forEach(f => {
      const dateStr = new Date(f.timestamp).toISOString().split('T')[0];
      if (dateStr && !groupedByDate.has(dateStr)) {
        groupedByDate.set(dateStr, []);
      }
      if (dateStr) {
        groupedByDate.get(dateStr)!.push(f);
      }
    });

    // Calculate daily metrics
    return Array.from(groupedByDate.entries())
      .map(([date, dayFeedback]) => ({
        date,
        count: dayFeedback.length,
        avgRating: dayFeedback.reduce((sum, f) => sum + f.rating, 0) / dayFeedback.length
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Export feedback data for analysis
   */
  exportFeedbackData(format: 'json' | 'csv' = 'json'): string {
    const feedback = this.getLocalFeedback();

    if (format === 'csv') {
      const headers = ['id', 'rating', 'category', 'message', 'page', 'timestamp', 'userAgent'];
      const csvContent = [
        headers.join(','),
        ...feedback.map(f =>
          [
            f.id,
            f.rating,
            f.category,
            `"${f.message.replace(/"/g, '""')}"`,
            f.page,
            f.timestamp,
            `"${f.userAgent}"`
          ].join(',')
        )
      ].join('\n');

      return csvContent;
    }

    return JSON.stringify(feedback, null, 2);
  }

  /**
   * Clear all stored feedback data
   */
  clearFeedbackData(): void {
    try {
      localStorage.removeItem(this.config.storageKey);
      localStorage.removeItem(`${this.config.storageKey}_retry`);
      this.retryQueue = [];
    } catch (error) {
      console.error('Clear feedback data error:', error);
    }
  }

  /**
   * Get configuration
   */
  getConfig(): FeedbackConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<FeedbackConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const feedbackService = new FeedbackService();
export default FeedbackService;

// Type exports
export type { FeedbackData, FeedbackAnalytics, FeedbackConfig };
