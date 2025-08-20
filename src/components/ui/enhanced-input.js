import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Mic, MicOff, Paperclip, X, FileText, Image, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
/**
 * Enhanced input component with voice input, file upload, and smart suggestions
 * Provides modern interaction methods for SFDR compliance conversations
 */
export const EnhancedInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Ask about SFDR compliance, ESG reporting, or regulatory requirements...',
  disabled = false,
  isLoading = false,
  maxLength = 2000,
  suggestions = [],
  onVoiceInput,
  supportedFileTypes = ['.pdf', '.docx', '.xlsx', '.csv', '.txt'],
  maxFileSize = 10
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  // Default suggestions for SFDR compliance
  const defaultSuggestions = [
    'What are the key SFDR disclosure requirements?',
    'How do I classify my fund under SFDR Article 6, 8, or 9?',
    'What ESG data do I need to collect for SFDR reporting?',
    'Explain the difference between Article 8 and Article 9 funds',
    'What are the principal adverse impacts (PAI) indicators?',
    'How often do I need to update SFDR disclosures?',
    'What penalties exist for SFDR non-compliance?',
    'Help me prepare for an SFDR audit'
  ];
  const allSuggestions = [...suggestions, ...defaultSuggestions];
  /**
   * Initialize speech recognition
   */
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = event => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        onChange(value + transcript);
        onVoiceInput?.(transcript);
        setIsRecording(false);
        toast({
          title: 'Voice input captured',
          description: 'Your speech has been converted to text.'
        });
      };
      recognitionRef.current.onerror = event => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          title: 'Voice input failed',
          description: 'Unable to capture voice input. Please try again.',
          variant: 'destructive'
        });
      };
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [value, onChange, onVoiceInput]);
  /**
   * Filter suggestions based on current input
   */
  useEffect(() => {
    if (value.trim().length > 0) {
      const filtered = allSuggestions
        .filter(suggestion => suggestion.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions(allSuggestions.slice(0, 5));
      setShowSuggestions(false);
    }
    setSelectedSuggestionIndex(-1);
  }, [value]);
  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = e => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
      } else if (e.key === 'Tab' && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        onChange(filteredSuggestions[selectedSuggestionIndex] || '');
        setShowSuggestions(false);
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };
  /**
   * Handle form submission
   */
  const handleSubmit = () => {
    if (value.trim() && !disabled && !isLoading) {
      const files = attachedFiles.map(af => af.file);
      onSubmit(value.trim(), files.length > 0 ? files : undefined);
      onChange('');
      setAttachedFiles([]);
      setShowSuggestions(false);
    }
  };
  /**
   * Toggle voice recording
   */
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Voice input not supported',
        description: "Your browser doesn't support voice input.",
        variant: 'destructive'
      });
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      toast({
        title: 'Listening...',
        description: 'Speak now to input your message.'
      });
    }
  };
  /**
   * Handle file selection
   */
  const handleFileSelect = e => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      // Validate file type
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!supportedFileTypes.includes(fileExtension)) {
        toast({
          title: 'Unsupported file type',
          description: `${file.name} is not a supported file type.`,
          variant: 'destructive'
        });
        return;
      }
      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds the ${maxFileSize}MB limit.`,
          variant: 'destructive'
        });
        return;
      }
      const attachedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9)
      };
      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          attachedFile.preview = e.target?.result;
          setAttachedFiles(prev => [...prev, attachedFile]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachedFiles(prev => [...prev, attachedFile]);
      }
    });
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  /**
   * Remove attached file
   */
  const removeFile = fileId => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };
  /**
   * Select suggestion
   */
  const selectSuggestion = suggestion => {
    onChange(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };
  /**
   * Get file icon based on type
   */
  const getFileIcon = fileName => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return _jsx(Image, { className: 'h-4 w-4' });
    }
    return _jsx(FileText, { className: 'h-4 w-4' });
  };
  return _jsxs('div', {
    className: 'relative',
    children: [
      _jsx(AnimatePresence, {
        children:
          showSuggestions &&
          filteredSuggestions.length > 0 &&
          _jsx(motion.div, {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 10 },
            className: 'absolute bottom-full mb-2 w-full z-50',
            children: _jsx(Card, {
              className: 'shadow-lg border',
              children: _jsxs(CardContent, {
                className: 'p-2',
                children: [
                  _jsxs('div', {
                    className: 'flex items-center space-x-2 mb-2 px-2',
                    children: [
                      _jsx(Sparkles, { className: 'h-3 w-3 text-muted-foreground' }),
                      _jsx('span', {
                        className: 'text-xs text-muted-foreground font-medium',
                        children: 'Suggestions'
                      })
                    ]
                  }),
                  _jsx('div', {
                    className: 'space-y-1',
                    children: filteredSuggestions.map((suggestion, index) =>
                      _jsx(
                        'button',
                        {
                          onClick: () => selectSuggestion(suggestion),
                          className: cn(
                            'w-full text-left px-2 py-2 rounded-md text-sm transition-colors',
                            'hover:bg-muted',
                            selectedSuggestionIndex === index && 'bg-muted'
                          ),
                          children: suggestion
                        },
                        index
                      )
                    )
                  })
                ]
              })
            })
          })
      }),
      attachedFiles.length > 0 &&
        _jsx('div', {
          className: 'mb-3',
          children: _jsx('div', {
            className: 'flex flex-wrap gap-2',
            children: attachedFiles.map(attachedFile =>
              _jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                  className: 'flex items-center space-x-2 bg-muted rounded-lg p-2',
                  children: [
                    attachedFile.preview
                      ? _jsx('img', {
                          src: attachedFile.preview,
                          alt: attachedFile.file.name,
                          className: 'h-8 w-8 object-cover rounded'
                        })
                      : getFileIcon(attachedFile.file.name),
                    _jsx('span', {
                      className: 'text-sm font-medium truncate max-w-32',
                      children: attachedFile.file.name
                    }),
                    _jsxs(Badge, {
                      variant: 'secondary',
                      className: 'text-xs',
                      children: [(attachedFile.file.size / 1024).toFixed(1), 'KB']
                    }),
                    _jsx(Button, {
                      variant: 'ghost',
                      size: 'sm',
                      onClick: () => removeFile(attachedFile.id),
                      className:
                        'h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground',
                      children: _jsx(X, { className: 'h-3 w-3' })
                    })
                  ]
                },
                attachedFile.id
              )
            )
          })
        }),
      _jsxs('div', {
        className: 'relative',
        children: [
          _jsx(Textarea, {
            ref: textareaRef,
            value: value,
            onChange: e => onChange(e.target.value),
            onKeyDown: handleKeyDown,
            onFocus: () => setShowSuggestions(value.trim().length === 0),
            placeholder: placeholder,
            disabled: disabled || isLoading,
            maxLength: maxLength,
            className: cn(
              'min-h-[60px] max-h-[200px] resize-none pr-24',
              'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              isRecording && 'border-red-300 bg-red-50'
            )
          }),
          _jsxs('div', {
            className: 'absolute bottom-2 left-3 text-xs text-muted-foreground',
            children: [value.length, '/', maxLength]
          }),
          _jsxs('div', {
            className: 'absolute bottom-2 right-2 flex items-center space-x-1',
            children: [
              _jsx(Button, {
                variant: 'ghost',
                size: 'sm',
                onClick: () => fileInputRef.current?.click(),
                disabled: disabled || isLoading,
                className: 'h-8 w-8 p-0',
                children: _jsx(Paperclip, { className: 'h-4 w-4' })
              }),
              recognitionRef.current &&
                _jsx(Button, {
                  variant: 'ghost',
                  size: 'sm',
                  onClick: toggleRecording,
                  disabled: disabled || isLoading,
                  className: cn(
                    'h-8 w-8 p-0',
                    isRecording && 'bg-red-100 text-red-600 hover:bg-red-200'
                  ),
                  children: isRecording
                    ? _jsx(motion.div, {
                        animate: { scale: [1, 1.2, 1] },
                        transition: { duration: 1, repeat: Infinity },
                        children: _jsx(MicOff, { className: 'h-4 w-4' })
                      })
                    : _jsx(Mic, { className: 'h-4 w-4' })
                }),
              _jsx(Separator, { orientation: 'vertical', className: 'h-6' }),
              _jsx(Button, {
                onClick: handleSubmit,
                disabled: !value.trim() || disabled || isLoading,
                size: 'sm',
                className: 'h-8 w-8 p-0',
                children: isLoading
                  ? _jsx(Loader2, { className: 'h-4 w-4 animate-spin' })
                  : _jsx(Send, { className: 'h-4 w-4' })
              })
            ]
          })
        ]
      }),
      _jsx('input', {
        ref: fileInputRef,
        type: 'file',
        multiple: true,
        accept: supportedFileTypes.join(','),
        onChange: handleFileSelect,
        className: 'hidden'
      }),
      _jsxs('div', {
        className: 'mt-2 flex items-center justify-between text-xs text-muted-foreground',
        children: [
          _jsxs('div', {
            className: 'flex items-center space-x-4',
            children: [
              _jsxs('span', {
                className: 'flex items-center space-x-1',
                children: [
                  _jsx('kbd', {
                    className: 'px-1 py-0.5 bg-muted rounded text-xs',
                    children: 'Enter'
                  }),
                  _jsx('span', { children: 'to send' })
                ]
              }),
              _jsxs('span', {
                className: 'flex items-center space-x-1',
                children: [
                  _jsx('kbd', {
                    className: 'px-1 py-0.5 bg-muted rounded text-xs',
                    children: 'Shift+Enter'
                  }),
                  _jsx('span', { children: 'for new line' })
                ]
              }),
              showSuggestions &&
                _jsxs('span', {
                  className: 'flex items-center space-x-1',
                  children: [
                    _jsx('kbd', {
                      className: 'px-1 py-0.5 bg-muted rounded text-xs',
                      children: 'Tab'
                    }),
                    _jsx('span', { children: 'to accept suggestion' })
                  ]
                })
            ]
          }),
          _jsxs('div', {
            className: 'text-xs',
            children: ['Supported: ', supportedFileTypes.join(', '), ' (max ', maxFileSize, 'MB)']
          })
        ]
      })
    ]
  });
};
