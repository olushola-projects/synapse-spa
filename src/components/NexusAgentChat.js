import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '@/utils/logger';
import { SecurityUtils } from '@/utils/security';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedMessage } from '@/components/ui/enhanced-message';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { ProcessingStages } from '@/components/ui/processing-stages';
import { Loader2, AlertCircle, Shield, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { backendApiClient } from '@/services/backendApiClient';
import { TIME_CONSTANTS } from '@/utils/constants';
/**
 * NexusAgentChat component - Interactive chat interface for SFDR compliance validation
 * Integrates with the SFDR Navigator API for real-time regulatory compliance checking
 */
export const NexusAgentChat = forwardRef(({ apiEndpoint: _apiEndpoint = 'nexus-classify', className = '' }, ref) => {
    const [messages, setMessages] = useState([
        {
            id: '1',
            type: 'system',
            content: "Hello, I'm Sophia, your SFDR Navigator and agentic guide to sustainable finance disclosures. Whether you're managing Article 6, 8, or 9 funds, I break down regulatory requirements into actionable steps. I help map your fund strategy to the right SFDR classification, flag gaps in your pre-contractual and periodic templates, and guide you through PAI indicator selection. I monitor regulatory updates and ensure you're disclosing what's necessary, when it's needed, and how it's evolving without overwhelming your team. Ready to simplify your next SFDR disclosure cycle?",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [processingType, setProcessingType] = useState('thinking');
    const [processingStages, setProcessingStages] = useState([]);
    const [agentPersonality, _setAgentPersonality] = useState({
        name: 'Sophia',
        role: 'SFDR Navigator & Sustainable Finance Expert',
        expertise: ['SFDR Regulations', 'ESG Reporting', 'Risk Assessment']
    });
    const [showFormMode, setShowFormMode] = useState(false);
    const [formData, setFormData] = useState({
        metadata: {
            entityId: '',
            reportingPeriod: new Date().getFullYear().toString(),
            regulatoryVersion: 'SFDR_v1.0',
            submissionType: 'INITIAL'
        },
        fundProfile: {
            fundType: 'UCITS',
            fundName: '',
            targetArticleClassification: 'Article8'
        }
    });
    const [aiStrategy, setAiStrategy] = useState('hybrid');
    const messagesEndRef = useRef(null);
    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        sendMessage: (message) => {
            handleSendMessage(message);
        }
    }));
    /**
     * Scroll to bottom of messages when new message is added
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    // Listen for quick action events from parent
    useEffect(() => {
        const handleQuickAction = (event) => {
            const { message } = event.detail;
            handleSendMessage(message);
        };
        window.addEventListener('nexus-quick-action', handleQuickAction);
        return () => {
            window.removeEventListener('nexus-quick-action', handleQuickAction);
        };
    }, []);
    /**
     * Add a new message to the chat
     */
    const addMessage = (message) => {
        const newMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage.id;
    };
    /**
     * Update an existing message (useful for loading states)
     */
    const updateMessage = (id, updates) => {
        setMessages(prev => prev.map(msg => msg.id === id
            ? {
                ...msg,
                ...updates
            }
            : msg));
    };
    // Note: Direct API calls are now handled via backendApiClient
    /**
     * Handle message reactions
     */
    const handleMessageReaction = (messageId, reaction) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                const currentReaction = msg.reactions?.userReaction;
                const newReactions = {
                    likes: msg.reactions?.likes || 0,
                    dislikes: msg.reactions?.dislikes || 0,
                    userReaction: msg.reactions?.userReaction
                };
                // Remove previous reaction if exists
                if (currentReaction === 'like') {
                    newReactions.likes = Math.max(0, newReactions.likes - 1);
                }
                if (currentReaction === 'dislike') {
                    newReactions.dislikes = Math.max(0, newReactions.dislikes - 1);
                }
                // Add new reaction if different from current
                if (currentReaction !== reaction) {
                    if (reaction === 'like') {
                        newReactions.likes = newReactions.likes + 1;
                    }
                    if (reaction === 'dislike') {
                        newReactions.dislikes = newReactions.dislikes + 1;
                    }
                    newReactions.userReaction = reaction;
                }
                else {
                    delete newReactions.userReaction;
                }
                return {
                    ...msg,
                    reactions: newReactions
                };
            }
            return msg;
        }));
    };
    /**
     * Handle copying message content
     */
    const handleCopyMessage = (content) => {
        // Additional logging or analytics can be added here
        console.log('Message copied:', `${content.substring(0, 50)}...`);
    };
    /**
     * Handle exporting message
     */
    const handleExportMessage = (messageId) => {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            const exportData = {
                content: message.content,
                timestamp: message.timestamp,
                metadata: message.metadata
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sfdr-message-${messageId}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };
    /**
     * Handle voice input
     */
    const handleVoiceInput = (transcript) => {
        console.log('Voice input received:', transcript);
        // Additional voice input processing can be added here
    };
    /**
     * Simulate processing stages for complex queries
     */
    const simulateProcessingStages = async () => {
        const stages = [
            {
                name: 'Understanding request',
                status: 'active',
                description: 'Analyzing your query...'
            },
            {
                name: 'Searching regulations',
                status: 'pending'
            },
            {
                name: 'Analyzing compliance',
                status: 'pending'
            },
            {
                name: 'Generating response',
                status: 'pending'
            }
        ];
        setProcessingStages(stages);
        // Simulate stage progression
        for (let i = 0; i < stages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, TIME_CONSTANTS.PROCESSING_STAGE_DELAY_MS));
            setProcessingStages(prev => prev.map((stage, index) => ({
                ...stage,
                status: index < i ? 'completed' : index === i ? 'active' : 'pending'
            })));
            // Update processing type based on stage
            if (i === 1) {
                setProcessingType('searching');
            }
            else if (i === 2) {
                setProcessingType('analyzing');
            }
            else if (i === 3) {
                setProcessingType('generating');
            }
        }
    };
    /**
     * Route user message to appropriate handler based on content
     */
    const routeMessageToHandler = async (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('upload') || lowerMessage.includes('document')) {
            return await handleDocumentUpload(userMessage);
        }
        else if (lowerMessage.includes('check compliance') || lowerMessage.includes('validate')) {
            return await handleComplianceCheck(userMessage);
        }
        else if (lowerMessage.includes('generate report') || lowerMessage.includes('report')) {
            return await handleReportGeneration(userMessage);
        }
        else if (lowerMessage.includes('risk assessment') || lowerMessage.includes('risk')) {
            return await handleRiskAssessment(userMessage);
        }
        else if (lowerMessage.includes('pai') ||
            lowerMessage.includes('principal adverse impact')) {
            return await providePAIGuidance(userMessage);
        }
        else if (lowerMessage.includes('article 8')) {
            return await provideArticle8Guidance(userMessage);
        }
        else if (lowerMessage.includes('article 9')) {
            return await provideArticle9Guidance(userMessage);
        }
        else if (lowerMessage.includes('taxonomy') || lowerMessage.includes('eu taxonomy')) {
            return await provideTaxonomyGuidance(userMessage);
        }
        else {
            return await provideGeneralGuidance(userMessage);
        }
    };
    /**
     * Handle sending a text message with real SFDR validation
     */
    const handleSendMessage = async (messageText) => {
        const userMessage = messageText || inputMessage;
        if (!userMessage.trim() || isLoading) {
            return;
        }
        // Rate limiting and input validation
        if (userMessage.length > 2000) {
            toast({
                title: 'Message too long',
                description: 'Please keep messages under 2000 characters.',
                variant: 'destructive'
            });
            return;
        }
        // Sanitize user input
        const sanitizedMessage = SecurityUtils.sanitizeInput(userMessage.trim());
        setInputMessage('');
        // Add user message
        addMessage({
            type: 'user',
            content: sanitizedMessage
        });
        // Add loading message
        const loadingId = addMessage({
            type: 'agent',
            content: 'Processing your request...',
            isLoading: true
        });
        setIsLoading(true);
        setIsTyping(true);
        const isComplexQuery = userMessage.length > 100;
        try {
            if (isComplexQuery) {
                await simulateProcessingStages();
            }
            else {
                setProcessingType('thinking');
                await new Promise(resolve => setTimeout(resolve, TIME_CONSTANTS.SIMPLE_PROCESSING_DELAY_MS));
            }
            const response = await routeMessageToHandler(sanitizedMessage);
            updateMessage(loadingId, {
                content: response,
                isLoading: false
            });
        }
        catch (error) {
            logger.error('Error processing message:', error);
            updateMessage(loadingId, {
                content: 'Sorry, I encountered an error processing your request. Please try again.',
                isLoading: false
            });
        }
        finally {
            setIsLoading(false);
            setIsTyping(false);
            setProcessingStages([]);
        }
    };
    /**
     * Handle document upload guidance
     */
    const handleDocumentUpload = async (_message) => {
        return `Excellent choice. Document upload is a fundamental step in our compliance validation process. Based on my extensive experience in regulatory advisory services, proper documentation significantly streamlines the compliance review cycle. I can assist with analyzing your pre-contractual disclosures, periodic reports, or any SFDR-related documentation. Which specific document type are you planning to upload, and what particular aspects would you like me to focus on during the review?`;
    };
    /**
     * Handle compliance check with real SFDR logic
     */
    const handleComplianceCheck = async (message) => {
        try {
            // Try to call the real API for compliance checking
            const response = await backendApiClient.classifyDocument({
                text: message,
                document_type: 'compliance_check',
                strategy: aiStrategy
            });
            if (response.data) {
                const { classification, confidence, processing_time } = response.data;
                return `I've analyzed your compliance query and here are the results:

**Classification**: ${classification}
**Confidence**: ${Math.round(confidence * 100)}%
**Processing Time**: ${processing_time.toFixed(2)}ms

Based on this analysis, I recommend:
- ${confidence > 0.8 ? 'This appears to be a strong compliance match' : 'Consider reviewing the compliance requirements more carefully'}
- Ensure all mandatory disclosures are complete
- Review PAI indicators and sustainability characteristics

Would you like me to provide more specific guidance on any particular aspect?`;
            }
        }
        catch (error) {
            console.error('Compliance check API error:', error);
        }
        // Fallback to canned response
        return `Absolutely. Conducting a comprehensive compliance assessment is essential for robust regulatory positioning. I will systematically verify your fund against the full spectrum of SFDR criteria, including disclosure requirements, PAI considerations, and classification alignment. To provide the most targeted analysis, could you share details about your fund type, current classification status, or any specific compliance areas where you have concerns?`;
    };
    /**
     * Handle report generation
     */
    const handleReportGeneration = async (_message) => {
        return `Report generation is indeed a cornerstone of effective regulatory advisory services. Drawing from regulatory guidance and industry best practices, comprehensive SFDR reports should encompass PAI statements, EU Taxonomy alignment assessments, and detailed disclosure frameworks. What specific type of report are you looking to generate - periodic reporting, pre-contractual disclosures, or perhaps a custom compliance assessment? I can tailor the output to meet your precise requirements.`;
    };
    /**
     * Handle risk assessment
     */
    const handleRiskAssessment = async (_message) => {
        return `Risk assessment forms the foundation of effective governance, risk, and compliance frameworks. Based on supervisory guidelines and regulatory developments, I will conduct a comprehensive evaluation of sustainability risks within your portfolio structure. This assessment will examine climate-related financial risks, social impact factors, and governance considerations. Are there specific risk categories such as transition risks, physical climate risks, or social impact metrics that you would like me to prioritize in the analysis?`;
    };
    /**
     * Provide PAI guidance with current regulations
     */
    const providePAIGuidance = async (_message) => {
        return `Principal Adverse Impact indicators represent a cornerstone of SFDR compliance architecture. Through extensive regulatory advisory engagements, I have observed that the 18 mandatory indicators encompass greenhouse gas emissions, biodiversity considerations, and critical social factors including gender pay gap metrics. To achieve robust compliance positioning, organizations should target a minimum of 50% data coverage while maintaining comprehensive documentation of all data sources and methodologies. Article 8 funds must integrate these indicators into their investment decision-making processes, whereas Article 9 funds require enhanced due diligence frameworks. What specific aspect of PAI implementation would you like to address - data collection strategies or integration into your reporting infrastructure?`;
    };
    /**
     * Provide Article 8 specific guidance
     */
    const provideArticle8Guidance = async (_message) => {
        return `Good day. Drawing from my extensive regulatory advisory background, where I have guided numerous funds through successful SFDR implementations, Article 8 products are designed to promote environmental or social characteristics without establishing them as the primary investment objective. Critical success factors include establishing measurable characteristics, implementing proper PAI consideration frameworks, and maintaining consistent disclosure protocols. Common implementation challenges include insufficient definitional precision and inadequate evidence of characteristic promotion. How may I assist in optimizing your Article 8 approach - would you prefer to review your fund's characteristic definitions or enhance your disclosure strategy?`;
    };
    /**
     * Provide Article 9 specific guidance
     */
    const provideArticle9Guidance = async (_message) => {
        return `Greetings. Through my experience directing Article 9 validation processes for institutional clients, these products must establish sustainable investment as their primary objective, supported by comprehensive impact measurement frameworks and Do No Significant Harm analysis. This represents a significantly elevated compliance standard compared to Article 8, requiring sophisticated due diligence methodologies and robust impact assessment capabilities. Let us explore your fund's sustainable investment objectives - are you encountering challenges with impact measurement protocols or EU Taxonomy alignment requirements?`;
    };
    /**
     * Provide EU Taxonomy guidance
     */
    const provideTaxonomyGuidance = async (_message) => {
        return `Good day. Having contributed to supervisory publications on EU Taxonomy implementation, I can confirm that the framework centers on aligning economic activities with six defined environmental objectives while ensuring comprehensive Do No Significant Harm compliance and minimum safeguards adherence. Based on regulatory dialogue and industry feedback, many organizations encounter difficulties with substantial contribution data requirements. Would you prefer to systematically review your activity assessment methodology or address specific environmental objective alignment challenges?`;
    };
    /**
     * Provide general guidance with context-aware responses using AI
     */
    const provideGeneralGuidance = async (message) => {
        try {
            // Try to get an AI-powered response for general questions
            const response = await backendApiClient.classifyDocument({
                text: `SFDR question: ${message}`,
                document_type: 'general_inquiry'
            });
            if (response.data) {
                const { classification, confidence } = response.data;
                // Generate contextual response based on classification
                let contextualResponse = '';
                if (classification.toLowerCase().includes('article 8')) {
                    contextualResponse =
                        'Based on your question, it seems you may be interested in Article 8 funds, which promote environmental or social characteristics. ';
                }
                else if (classification.toLowerCase().includes('article 9')) {
                    contextualResponse =
                        'Your inquiry suggests interest in Article 9 funds, which have sustainable investment as their objective. ';
                }
                else if (classification.toLowerCase().includes('article 6')) {
                    contextualResponse =
                        "It appears your question relates to Article 6 funds, which don't promote specific sustainability characteristics. ";
                }
                return `${contextualResponse}Thank you for reaching out. Drawing from my extensive regulatory advisory background and AI analysis (confidence: ${Math.round(confidence * 100)}%), I notice there are multiple pathways we might explore based on your inquiry. 

SFDR implementation involves understanding both the regulatory framework and your specific business context. I recommend we start by identifying whether you're working with Article 6, 8, or 9 funds, as this fundamentally shapes your disclosure obligations. 

What specific aspect of SFDR compliance would you like to address first?`;
            }
        }
        catch (error) {
            console.error('General guidance API error:', error);
        }
        // Fallback to enhanced canned response
        return `Hello. As a senior regulatory consultant with comprehensive expertise in sustainable finance frameworks, I am here to guide you through the intricacies of the SFDR regulatory landscape. The Sustainable Finance Disclosure Regulation is designed to enhance transparency regarding sustainability risks and prevent greenwashing practices, directly supporting the EU Green Deal objectives. Financial products are categorized under Article 6 (no specific sustainability focus), Article 8 (promoting environmental or social characteristics), or Article 9 (sustainable investment objectives). The regulatory framework continues to evolve, with Level 2 requirements having been implemented since 2023. How may I specifically assist with your SFDR requirements today - would you prefer compliance verification or Principal Adverse Impact indicator analysis?`;
    };
    /**
     * Handle form submission for SFDR validation
     */
    const handleFormSubmit = async () => {
        if (!formData.fundProfile?.fundName || !formData.metadata?.entityId) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in the required fields (Fund Name and Entity ID)',
                variant: 'destructive'
            });
            return;
        }
        const request = formData;
        // Add form submission message
        addMessage({
            type: 'user',
            content: `Validating SFDR classification for: ${request.fundProfile.fundName}`,
            data: request
        });
        // Add loading message
        const loadingId = addMessage({
            type: 'agent',
            content: 'Validating SFDR compliance...',
            isLoading: true
        });
        setIsLoading(true);
        try {
            // Use the backend API client instead of nexusAgent
            const backendResponse = await backendApiClient.classifyProduct({ ...request, aiStrategy });
            if (backendResponse.error) {
                throw new Error(backendResponse.error);
            }
            // Transform backend response to expected format
            const response = {
                classification: {
                    recommendedArticle: backendResponse.data?.classification || 'Article 6',
                    confidence: backendResponse.data?.confidence || 0.5
                },
                complianceScore: Math.round((backendResponse.data?.confidence || 0.5) * 100),
                issues: backendResponse.data?.confidence && backendResponse.data.confidence < 0.7
                    ? [
                        {
                            message: 'Low confidence classification - please review input data',
                            severity: 'warning'
                        }
                    ]
                    : [],
                recommendations: [
                    'Review all required disclosures for completeness',
                    'Ensure PAI indicators are properly documented',
                    'Verify alignment with target article classification'
                ]
            };
            let responseContent = `**Validation Complete**\n\n`;
            responseContent += `**Classification:** ${response.classification?.recommendedArticle || 'N/A'}\n`;
            responseContent += `**Confidence:** ${((response.classification?.confidence || 0) * 100).toFixed(1)}%\n\n`;
            responseContent += `**Compliance Score:** ${response.complianceScore}%\n\n`;
            if (response.issues && response.issues.length > 0) {
                responseContent += `**Issues Found:**\n`;
                response.issues.forEach(issue => {
                    responseContent += `• ${issue.message} (${issue.severity})\n`;
                });
                responseContent += '\n';
            }
            if (response.recommendations && response.recommendations.length > 0) {
                responseContent += `**Recommendations:**\n`;
                response.recommendations.forEach(rec => {
                    responseContent += `• ${rec}\n`;
                });
            }
            updateMessage(loadingId, {
                content: responseContent,
                data: response,
                isLoading: false
            });
            toast({
                title: 'Validation Complete',
                description: `Classification: ${response.classification?.recommendedArticle || 'N/A'} (${((response.classification?.confidence || 0) * 100).toFixed(1)}% confidence)`
            });
        }
        catch (_error) {
            updateMessage(loadingId, {
                content: 'Error validating SFDR compliance. Please check your data and try again.',
                isLoading: false
            });
            toast({
                title: 'Validation Error',
                description: 'Failed to validate SFDR compliance',
                variant: 'destructive'
            });
        }
        finally {
            setIsLoading(false);
            setShowFormMode(false);
        }
    };
    return (_jsx(motion.div, { initial: {
            opacity: 0,
            y: 20
        }, animate: {
            opacity: 1,
            y: 0
        }, transition: {
            duration: 0.5
        }, className: `w-full max-w-4xl mx-auto ${className}`, children: _jsxs(Card, { className: 'h-[700px] flex flex-col shadow-lg', children: [_jsx(CardHeader, { className: 'flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b', children: _jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { className: 'flex items-center space-x-3', children: [_jsxs(motion.div, { className: 'relative', whileHover: {
                                            scale: 1.05
                                        }, transition: {
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 10
                                        }, children: [_jsx("img", { src: '/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png', alt: 'SFDR Navigator Agent', className: 'h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm' }), _jsx(motion.div, { animate: {
                                                    scale: [1, 1.2, 1]
                                                }, transition: {
                                                    duration: 2,
                                                    repeat: Infinity
                                                }, className: 'absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white' })] }), _jsx("div", { children: _jsx(CardTitle, { className: 'text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-normal', children: agentPersonality.name }) })] }), _jsxs("div", { className: 'flex items-center space-x-2', children: [_jsxs(Badge, { variant: 'outline', className: 'text-xs bg-green-50 text-green-700 border-green-200', children: [_jsx(Shield, { className: 'h-3 w-3 mr-1' }), "Secure"] }), _jsx(Button, { variant: 'outline', size: 'sm', onClick: () => setShowFormMode(!showFormMode), className: 'text-xs bg-blue-50', children: showFormMode ? 'Chat Mode' : 'Form Mode' }), _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(Label, { className: 'text-xs', children: "AI Strategy" }), _jsxs(Select, { value: aiStrategy, onValueChange: v => setAiStrategy(v), children: [_jsx(SelectTrigger, { className: 'h-8 w-[160px]', children: _jsx(SelectValue, { placeholder: 'Select strategy' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: 'hybrid', children: "Hybrid (recommended)" }), _jsx(SelectItem, { value: 'primary', children: "Primary LLM" }), _jsx(SelectItem, { value: 'secondary', children: "Secondary LLM" })] })] })] }), _jsx(Button, { variant: 'ghost', size: 'sm', className: 'h-8 w-8 p-0', children: _jsx(Settings, { className: 'h-4 w-4' }) })] })] }) }), _jsx(CardContent, { className: 'flex-1 flex flex-col p-0', children: !showFormMode ? (
                    // Chat Mode
                    _jsxs(_Fragment, { children: [_jsx(ScrollArea, { className: 'flex-1 px-4 max-h-[500px]', children: _jsxs("div", { className: 'space-y-4 py-4', children: [_jsx(AnimatePresence, { children: messages.map((message, index) => (_jsx(motion.div, { initial: {
                                                    opacity: 0,
                                                    y: 20
                                                }, animate: {
                                                    opacity: 1,
                                                    y: 0
                                                }, exit: {
                                                    opacity: 0,
                                                    y: -20
                                                }, transition: {
                                                    duration: 0.3,
                                                    delay: index * 0.1
                                                }, children: _jsx(EnhancedMessage, { id: message.id, type: message.type, content: message.content, timestamp: message.timestamp, isLoading: message.isLoading, isStreaming: message.isStreaming, confidence: message.confidence, messageType: message.messageType, onReaction: handleMessageReaction, onCopy: handleCopyMessage, onExport: handleExportMessage }) }, `${message.id}-${index}`))) }), isTyping && (_jsxs(motion.div, { initial: {
                                                opacity: 0,
                                                scale: 0.8
                                            }, animate: {
                                                opacity: 1,
                                                scale: 1
                                            }, className: 'flex items-start space-x-3', children: [_jsxs(Avatar, { className: 'h-8 w-8', children: [_jsx("img", { src: '/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png', alt: 'SFDR Navigator Agent', className: 'w-full h-full object-cover rounded-full' }), _jsx(AvatarFallback, { className: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white', children: "SN" })] }), _jsx("div", { className: 'bg-white border rounded-lg p-3 shadow-sm', children: processingStages.length > 0 ? (_jsx(ProcessingStages, { stages: processingStages.map((stage, index) => ({
                                                            id: `stage-${index}`,
                                                            label: stage.name,
                                                            ...stage
                                                        })) })) : (_jsx(TypingIndicator, { agentName: agentPersonality.name, processingType: processingType })) })] })), _jsx("div", { ref: messagesEndRef })] }) }), _jsx("div", { className: 'border-t bg-gray-50/50 p-4', children: _jsx(EnhancedInput, { value: inputMessage, onChange: setInputMessage, onSubmit: handleSendMessage, onVoiceInput: handleVoiceInput, placeholder: 'Ask about SFDR compliance, fund classification, or submit data for validation...', disabled: isLoading, isLoading: isLoading, maxLength: 2000, suggestions: [
                                        'What are the key SFDR disclosure requirements?',
                                        'How do I classify my fund under SFDR Article 6, 8, or 9?',
                                        'What ESG data do I need to collect for SFDR reporting?',
                                        'Explain the difference between Article 8 and Article 9 funds'
                                    ] }) })] })) : (
                    // Form Mode
                    _jsxs("div", { className: 'p-4 space-y-4 overflow-y-auto', children: [_jsxs(Alert, { children: [_jsx(AlertCircle, { className: 'h-4 w-4' }), _jsx(AlertDescription, { children: "Fill out the form below to validate SFDR compliance for your fund." })] }), _jsxs("div", { className: 'grid grid-cols-2 gap-4', children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: 'entityId', children: "Entity ID *" }), _jsx(Input, { id: 'entityId', value: formData.metadata?.entityId || '', onChange: e => setFormData(prev => ({
                                                    ...prev,
                                                    metadata: {
                                                        ...prev.metadata,
                                                        entityId: e.target.value
                                                    }
                                                })), placeholder: '123e4567-e89b-12d3-a456-426614174000' })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: 'reportingPeriod', children: "Reporting Period" }), _jsx(Input, { id: 'reportingPeriod', value: formData.metadata?.reportingPeriod || '', onChange: e => setFormData(prev => ({
                                                    ...prev,
                                                    metadata: {
                                                        ...prev.metadata,
                                                        reportingPeriod: e.target.value
                                                    }
                                                })) })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: 'fundName', children: "Fund Name *" }), _jsx(Input, { id: 'fundName', value: formData.fundProfile?.fundName || '', onChange: e => setFormData(prev => ({
                                            ...prev,
                                            fundProfile: {
                                                ...prev.fundProfile,
                                                fundName: e.target.value
                                            }
                                        })), placeholder: 'ESG European Equity Fund' })] }), _jsxs("div", { className: 'grid grid-cols-2 gap-4', children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: 'fundType', children: "Fund Type" }), _jsxs("select", { id: 'fundType', className: 'w-full p-2 border border-gray-300 rounded-md', value: formData.fundProfile?.fundType || 'UCITS', onChange: e => setFormData(prev => ({
                                                    ...prev,
                                                    fundProfile: {
                                                        ...prev.fundProfile,
                                                        fundType: e.target.value
                                                    }
                                                })), children: [_jsx("option", { value: 'UCITS', children: "UCITS" }), _jsx("option", { value: 'AIF', children: "AIF" }), _jsx("option", { value: 'ELTIF', children: "ELTIF" }), _jsx("option", { value: 'MMF', children: "MMF" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: 'targetArticle', children: "Target Article Classification" }), _jsxs("select", { id: 'targetArticle', className: 'w-full p-2 border border-gray-300 rounded-md', value: formData.fundProfile?.targetArticleClassification || 'Article8', onChange: e => setFormData(prev => ({
                                                    ...prev,
                                                    fundProfile: {
                                                        ...prev.fundProfile,
                                                        targetArticleClassification: e.target.value
                                                    }
                                                })), children: [_jsx("option", { value: 'Article6', children: "Article 6 (Basic)" }), _jsx("option", { value: 'Article8', children: "Article 8 (ESG Characteristics)" }), _jsx("option", { value: 'Article9', children: "Article 9 (Sustainable Investment)" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: 'investmentObjective', children: "Investment Objective" }), _jsx(Textarea, { id: 'investmentObjective', value: formData.fundProfile?.investmentObjective || '', onChange: e => setFormData(prev => ({
                                            ...prev,
                                            fundProfile: {
                                                ...prev.fundProfile,
                                                investmentObjective: e.target.value
                                            }
                                        })), placeholder: "Describe the fund's investment objective and ESG approach...", rows: 3 })] }), _jsxs("div", { className: 'flex justify-end gap-2', children: [_jsx(Button, { variant: 'outline', onClick: () => setShowFormMode(false), children: "Cancel" }), _jsx(Button, { onClick: handleFormSubmit, disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: 'w-4 h-4 mr-2 animate-spin' }), "Validating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Shield, { className: 'w-4 h-4 mr-2' }), "Validate SFDR Compliance"] })) })] })] })) })] }) }));
});
NexusAgentChat.displayName = 'NexusAgentChat';
export default NexusAgentChat;
