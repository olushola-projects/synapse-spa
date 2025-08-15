import { useState, useCallback, useRef, useEffect } from 'react';
import { logger } from '@/utils/logger';

export interface UserPreferences {
  language: string;
  expertiseLevel: 'beginner' | 'intermediate' | 'expert';
  preferredArticle: 'Article6' | 'Article8' | 'Article9' | 'none';
  industry: string;
  complianceFocus: string[];
}

export interface ConversationContext {
  userPreferences: UserPreferences;
  recentTopics: string[];
  complianceHistory: Array<{
    type: 'user_message' | 'ai_response' | 'classification' | 'validation';
    content: string;
    timestamp: Date;
    confidence?: number;
    metadata?: any;
  }>;
  documentContext: Array<{
    id: string;
    name: string;
    type: string;
    uploadedAt: Date;
    analysis?: any;
  }>;
  sessionData: {
    startTime: Date;
    messageCount: number;
    lastInteraction: Date;
    currentTopic?: string;
    userIntent?: string;
  };
}

const defaultUserPreferences: UserPreferences = {
  language: 'en-US',
  expertiseLevel: 'intermediate',
  preferredArticle: 'none',
  industry: 'general',
  complianceFocus: []
};

const defaultContext: ConversationContext = {
  userPreferences: defaultUserPreferences,
  recentTopics: [],
  complianceHistory: [],
  documentContext: [],
  sessionData: {
    startTime: new Date(),
    messageCount: 0,
    lastInteraction: new Date()
  }
};

export const useConversationContext = () => {
  const [context, setContext] = useState<ConversationContext>(defaultContext);
  const contextRef = useRef<ConversationContext>(defaultContext);

  // Keep ref in sync with state
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const updateContext = useCallback((newContext: Partial<ConversationContext>) => {
    setContext(prev => {
      const updated = {
        ...prev,
        ...newContext,
        sessionData: {
          ...prev.sessionData,
          ...newContext.sessionData,
          lastInteraction: new Date()
        }
      };

      // Update recent topics if current topic is provided
      if (newContext.sessionData?.currentTopic) {
        const currentTopic = newContext.sessionData.currentTopic;
        updated.recentTopics = [
          ...prev.recentTopics.filter(topic => topic !== currentTopic),
          currentTopic
        ].slice(-10); // Keep only last 10 topics
      }

      return updated;
    });
  }, []);

  const addToHistory = useCallback((interaction: ConversationContext['complianceHistory'][0]) => {
    setContext(prev => ({
      ...prev,
      complianceHistory: [...prev.complianceHistory.slice(-49), interaction], // Keep last 50 interactions
      sessionData: {
        ...prev.sessionData,
        messageCount: prev.sessionData.messageCount + 1,
        lastInteraction: new Date()
      }
    }));
  }, []);

  const addDocumentContext = useCallback((document: ConversationContext['documentContext'][0]) => {
    setContext(prev => ({
      ...prev,
      documentContext: [
        ...prev.documentContext.filter(doc => doc.id !== document.id),
        document
      ].slice(-20), // Keep last 20 documents
      sessionData: {
        ...prev.sessionData,
        lastInteraction: new Date()
      }
    }));
  }, []);

  const updateUserPreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setContext(prev => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        ...preferences
      },
      sessionData: {
        ...prev.sessionData,
        lastInteraction: new Date()
      }
    }));
  }, []);

  const extractTopic = useCallback((message: string): string => {
    const topics = [
      'Article 6',
      'Article 8',
      'Article 9',
      'PAI',
      'Principal Adverse Impacts',
      'Taxonomy',
      'EU Taxonomy',
      'Compliance',
      'Reporting',
      'Disclosure',
      'Sustainability',
      'ESG',
      'Environmental',
      'Social',
      'Governance',
      'Classification',
      'Validation',
      'Document Upload',
      'File Processing'
    ];

    const lowerMessage = message.toLowerCase();
    const foundTopic = topics.find(topic => lowerMessage.includes(topic.toLowerCase()));

    return foundTopic || 'General Inquiry';
  }, []);

  const analyzeUserIntent = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('upload') ||
      lowerMessage.includes('document') ||
      lowerMessage.includes('file')
    ) {
      return 'document_upload';
    }
    if (lowerMessage.includes('classify') || lowerMessage.includes('article')) {
      return 'classification';
    }
    if (lowerMessage.includes('pai') || lowerMessage.includes('adverse')) {
      return 'pai_analysis';
    }
    if (lowerMessage.includes('taxonomy') || lowerMessage.includes('eu')) {
      return 'taxonomy_check';
    }
    if (lowerMessage.includes('compliance') || lowerMessage.includes('check')) {
      return 'compliance_check';
    }
    if (lowerMessage.includes('report') || lowerMessage.includes('generate')) {
      return 'report_generation';
    }

    return 'general_inquiry';
  }, []);

  const getContextSummary = useCallback(() => {
    const current = contextRef.current;
    return {
      userLevel: current.userPreferences.expertiseLevel,
      preferredArticle: current.userPreferences.preferredArticle,
      recentTopics: current.recentTopics.slice(-3),
      documentCount: current.documentContext.length,
      sessionDuration: Date.now() - current.sessionData.startTime.getTime(),
      messageCount: current.sessionData.messageCount,
      currentTopic: current.sessionData.currentTopic
    };
  }, []);

  const resetContext = useCallback(() => {
    setContext({
      ...defaultContext,
      sessionData: {
        ...defaultContext.sessionData,
        startTime: new Date()
      }
    });
  }, []);

  const exportContext = useCallback(() => {
    const current = contextRef.current;
    return {
      ...current,
      exportTimestamp: new Date().toISOString(),
      sessionDuration: Date.now() - current.sessionData.startTime.getTime()
    };
  }, []);

  // Auto-save context to localStorage
  useEffect(() => {
    const saveContext = () => {
      try {
        const contextToSave = {
          userPreferences: context.userPreferences,
          recentTopics: context.recentTopics,
          sessionData: {
            ...context.sessionData,
            startTime: context.sessionData.startTime.toISOString(),
            lastInteraction: context.sessionData.lastInteraction.toISOString()
          }
        };
        localStorage.setItem('nexus-conversation-context', JSON.stringify(contextToSave));
      } catch (error) {
        logger.error('Failed to save conversation context:', error);
      }
    };

    const timeoutId = setTimeout(saveContext, 5000); // Save every 5 seconds
    return () => clearTimeout(timeoutId);
  }, [context]);

  // Load context from localStorage on mount
  useEffect(() => {
    try {
      const savedContext = localStorage.getItem('nexus-conversation-context');
      if (savedContext) {
        const parsed = JSON.parse(savedContext);
        setContext(prev => ({
          ...prev,
          userPreferences: parsed.userPreferences || defaultUserPreferences,
          recentTopics: parsed.recentTopics || [],
          sessionData: {
            ...prev.sessionData,
            startTime: new Date(parsed.sessionData?.startTime) || new Date(),
            lastInteraction: new Date(parsed.sessionData?.lastInteraction) || new Date()
          }
        }));
      }
    } catch (error) {
      logger.error('Failed to load conversation context:', error);
    }
  }, []);

  return {
    context,
    updateContext,
    addToHistory,
    addDocumentContext,
    updateUserPreferences,
    extractTopic,
    analyzeUserIntent,
    getContextSummary,
    resetContext,
    exportContext
  };
};
