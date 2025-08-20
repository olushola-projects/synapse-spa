import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
export const useVoiceInput = () => {
  const [state, setState] = useState({
    isListening: false,
    transcript: '',
    isSupported: false,
    error: null
  });
  // Check if speech recognition is supported
  useEffect(() => {
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setState(prev => ({ ...prev, isSupported }));
    if (!isSupported) {
      logger.warn('Speech recognition not supported in this browser');
    }
  }, []);
  const startListening = useCallback(() => {
    if (!state.isSupported) {
      toast({
        title: 'Voice Input Not Supported',
        description:
          'Your browser does not support voice input. Please use a modern browser like Chrome or Edge.',
        variant: 'destructive'
      });
      return;
    }
    try {
      // Use the appropriate speech recognition API
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      // Configure recognition settings
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      // Set up event handlers
      recognition.onstart = () => {
        setState(prev => ({
          ...prev,
          isListening: true,
          error: null,
          transcript: ''
        }));
        logger.info('Voice recognition started');
      };
      recognition.onresult = event => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        setState(prev => ({
          ...prev,
          transcript: finalTranscript || interimTranscript
        }));
      };
      recognition.onerror = event => {
        let errorMessage = 'Voice recognition error occurred';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone access denied. Please check your microphone permissions.';
            break;
          case 'not-allowed':
            errorMessage =
              'Microphone access denied. Please allow microphone access in your browser settings.';
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your internet connection.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Voice recognition service not available.';
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }
        setState(prev => ({
          ...prev,
          isListening: false,
          error: errorMessage
        }));
        toast({
          title: 'Voice Input Error',
          description: errorMessage,
          variant: 'destructive'
        });
        logger.error('Voice recognition error:', event.error);
      };
      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
        logger.info('Voice recognition ended');
      };
      // Start recognition
      recognition.start();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to start voice recognition';
      setState(prev => ({
        ...prev,
        isListening: false,
        error: errorMessage
      }));
      toast({
        title: 'Voice Input Error',
        description: errorMessage,
        variant: 'destructive'
      });
      logger.error('Failed to start voice recognition:', error);
    }
  }, [state.isSupported]);
  const stopListening = useCallback(() => {
    setState(prev => ({ ...prev, isListening: false }));
    logger.info('Voice recognition stopped by user');
  }, []);
  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', error: null }));
  }, []);
  const reset = useCallback(() => {
    setState({
      isListening: false,
      transcript: '',
      isSupported: state.isSupported,
      error: null
    });
  }, [state.isSupported]);
  return {
    ...state,
    startListening,
    stopListening,
    clearTranscript,
    reset
  };
};
