import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, Upload, MessageSquare, Brain, Target, TrendingUp, AlertTriangle, CheckCircle, 
// Clock, // Removed - not used in this component
Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
/**
 * SFDR Gem - Advanced AI-powered SFDR compliance assistant
 * Provides intelligent document analysis, classification, and compliance guidance
 */
export const SFDRGem = () => {
    // Core state management
    const [activeTab, setActiveTab] = useState('chat');
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [classificationResult, setClassificationResult] = useState(null);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [contextualMemory, setContextualMemory] = useState([]);
    // Form state for classification
    const [formData, setFormData] = useState({
        fundName: '',
        description: '',
        investmentStrategy: '',
        esgIntegration: '',
        sustainabilityObjectives: '',
        principalAdverseImpacts: '',
        taxonomyAlignment: ''
    });
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    /**
     * Scroll to bottom of messages when new message is added
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    /**
     * Add a new message to the chat
     */
    const addMessage = (type, content, metadata) => {
        const newMessage = {
            id: Date.now().toString(),
            type,
            content,
            timestamp: new Date(),
            metadata
        };
        setMessages(prev => [...prev, newMessage]);
    };
    /**
     * Handle sending a chat message
     */
    const handleSendMessage = async () => {
        if (!inputValue.trim()) {
            return;
        }
        const userMessage = inputValue;
        setInputValue('');
        addMessage('user', userMessage);
        setIsLoading(true);
        try {
            // Simulate AI response with contextual awareness
            await new Promise(resolve => setTimeout(resolve, 1500));
            let response = '';
            if (userMessage.toLowerCase().includes('article 8')) {
                response =
                    'Article 8 funds promote environmental or social characteristics. They must disclose how these characteristics are met and provide information on sustainability indicators. Key requirements include pre-contractual disclosures, website disclosures, and periodic reporting.';
            }
            else if (userMessage.toLowerCase().includes('article 9')) {
                response =
                    'Article 9 funds have sustainable investment as their objective. They must demonstrate measurable positive impact and "do no significant harm" to other sustainability objectives. These funds have the highest disclosure requirements under SFDR.';
            }
            else if (userMessage.toLowerCase().includes('pai') ||
                userMessage.toLowerCase().includes('principal adverse')) {
                response =
                    'Principal Adverse Impacts (PAI) are negative effects on sustainability factors. Large financial market participants must consider and disclose how they address PAI in their investment decisions. This includes metrics on GHG emissions, biodiversity, water, waste, and social issues.';
            }
            else if (userMessage.toLowerCase().includes('taxonomy')) {
                response =
                    'The EU Taxonomy Regulation establishes criteria for environmentally sustainable economic activities. SFDR Article 8 and 9 funds must disclose the proportion of investments that are taxonomy-aligned, helping investors understand the environmental impact of their investments.';
            }
            else {
                response = `I understand you're asking about: "${userMessage}". Based on our conversation context and uploaded documents, I can provide specific SFDR guidance. Could you clarify which aspect of SFDR compliance you'd like me to focus on?`;
            }
            // Update contextual memory
            setContextualMemory(prev => [...prev.slice(-4), userMessage]);
            addMessage('agent', response);
        }
        catch (error) {
            addMessage('system', 'Sorry, I encountered an error processing your request. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    /**
     * Handle document upload and analysis
     */
    const handleDocumentUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            return;
        }
        setIsLoading(true);
        try {
            for (const file of Array.from(files)) {
                // Simulate document analysis
                await new Promise(resolve => setTimeout(resolve, 2000));
                const mockAnalysis = {
                    fileName: file.name,
                    extractedText: `Extracted content from ${file.name}...`,
                    entities: ['ESG Integration', 'Sustainable Investment', 'Climate Risk'],
                    sentiment: 'positive',
                    topics: ['Environmental Impact', 'Social Responsibility', 'Governance'],
                    summary: `This document discusses sustainable investment strategies and ESG integration approaches relevant to SFDR compliance.`,
                    sfdrRelevance: Math.random() * 40 + 60 // 60-100% relevance
                };
                setUploadedDocuments(prev => [...prev, mockAnalysis]);
                addMessage('system', `Document "${file.name}" analyzed successfully. SFDR relevance: ${mockAnalysis.sfdrRelevance.toFixed(1)}%`);
            }
        }
        catch (error) {
            addMessage('system', 'Error analyzing documents. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    /**
     * Handle SFDR classification form submission
     */
    const handleClassification = async () => {
        if (!formData.fundName || !formData.description) {
            addMessage('system', 'Please provide at least fund name and description for classification.');
            return;
        }
        setIsLoading(true);
        try {
            // Simulate classification API call
            await new Promise(resolve => setTimeout(resolve, 3000));
            const mockResult = {
                classification: formData.sustainabilityObjectives
                    ? 'Article 9'
                    : formData.esgIntegration
                        ? 'Article 8'
                        : 'Article 6',
                confidence: Math.random() * 20 + 80, // 80-100% confidence
                reasoning: `Based on the provided information, this fund appears to be ${formData.sustainabilityObjectives ? 'an Article 9 fund with sustainable investment objectives' : formData.esgIntegration ? 'an Article 8 fund promoting ESG characteristics' : 'an Article 6 fund with no specific sustainability claims'}.`,
                recommendations: [
                    'Enhance ESG integration documentation',
                    'Develop comprehensive PAI consideration framework',
                    'Implement robust sustainability measurement processes'
                ],
                issues: [
                    'Limited disclosure on taxonomy alignment',
                    'Insufficient detail on sustainability indicators'
                ],
                complianceScore: Math.random() * 15 + 85 // 85-100% compliance
            };
            setClassificationResult(mockResult);
            addMessage('agent', `Classification complete: ${mockResult.classification} with ${mockResult.confidence.toFixed(1)}% confidence.`);
        }
        catch (error) {
            addMessage('system', 'Classification failed. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    /**
     * Export analysis results
     */
    const handleExport = (format) => {
        const exportData = {
            classification: classificationResult,
            documents: uploadedDocuments,
            chatHistory: messages,
            timestamp: new Date().toISOString()
        };
        // Simulate export
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sfdr-analysis-${Date.now()}.${format === 'json' ? 'json' : format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addMessage('system', `Analysis exported as ${format.toUpperCase()} file.`);
    };
    return (_jsxs("div", { className: 'w-full max-w-7xl mx-auto p-6 space-y-6', children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: 'text-center space-y-4', children: [_jsxs("div", { className: 'flex items-center justify-center space-x-3', children: [_jsx("div", { className: 'p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl', children: _jsx(Brain, { className: 'h-8 w-8 text-white' }) }), _jsx("h1", { className: 'text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent', children: "SFDR Gem" }), _jsxs(Badge, { variant: 'secondary', className: 'px-3 py-1', children: [_jsx(Zap, { className: 'h-4 w-4 mr-1' }), "MVP"] })] }), _jsx("p", { className: 'text-lg text-muted-foreground max-w-2xl mx-auto', children: "Your intelligent SFDR compliance assistant with advanced AI-powered analysis, contextual memory, and seamless export capabilities." })] }), _jsxs(Card, { className: 'border-2', children: [_jsx(CardHeader, { children: _jsx(Tabs, { value: activeTab, onValueChange: setActiveTab, className: 'w-full', children: _jsxs(TabsList, { className: 'grid w-full grid-cols-4', children: [_jsxs(TabsTrigger, { value: 'chat', className: 'flex items-center space-x-2', children: [_jsx(MessageSquare, { className: 'h-4 w-4' }), _jsx("span", { children: "AI Chat" })] }), _jsxs(TabsTrigger, { value: 'classify', className: 'flex items-center space-x-2', children: [_jsx(Target, { className: 'h-4 w-4' }), _jsx("span", { children: "Classify" })] }), _jsxs(TabsTrigger, { value: 'documents', className: 'flex items-center space-x-2', children: [_jsx(FileText, { className: 'h-4 w-4' }), _jsx("span", { children: "Documents" })] }), _jsxs(TabsTrigger, { value: 'export', className: 'flex items-center space-x-2', children: [_jsx(Download, { className: 'h-4 w-4' }), _jsx("span", { children: "Export" })] })] }) }) }), _jsxs(CardContent, { children: [_jsxs(TabsContent, { value: 'chat', className: 'space-y-4', children: [_jsxs(ScrollArea, { className: 'h-96 w-full border rounded-lg p-4', children: [_jsx(AnimatePresence, { children: messages.map(message => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: `mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[80%] p-3 rounded-lg ${message.type === 'user'
                                                            ? 'bg-blue-500 text-white'
                                                            : message.type === 'agent'
                                                                ? 'bg-gray-100 text-gray-900'
                                                                : 'bg-yellow-100 text-yellow-900'}`, children: [_jsx("p", { className: 'text-sm', children: message.content }), _jsx("span", { className: 'text-xs opacity-70', children: message.timestamp.toLocaleTimeString() })] }) }, message.id))) }), isLoading && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: 'flex justify-start mb-4', children: _jsx("div", { className: 'bg-gray-100 p-3 rounded-lg', children: _jsxs("div", { className: 'flex items-center space-x-2', children: [_jsx("div", { className: 'animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500' }), _jsx("span", { className: 'text-sm text-gray-600', children: "AI is thinking..." })] }) }) })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: 'flex space-x-2', children: [_jsx(Input, { value: inputValue, onChange: e => setInputValue(e.target.value), placeholder: 'Ask about SFDR compliance, regulations, or upload documents...', onKeyPress: e => e.key === 'Enter' && handleSendMessage(), disabled: isLoading }), _jsx(Button, { onClick: handleSendMessage, disabled: isLoading || !inputValue.trim(), children: "Send" })] }), contextualMemory.length > 0 && (_jsxs(Alert, { children: [_jsx(Brain, { className: 'h-4 w-4' }), _jsxs(AlertDescription, { children: [_jsx("strong", { children: "Context:" }), " ", contextualMemory.slice(-2).join(' → ')] })] }))] }), _jsxs(TabsContent, { value: 'classify', className: 'space-y-4', children: [_jsxs("div", { className: 'grid grid-cols-1 md:grid-cols-2 gap-4', children: [_jsxs("div", { className: 'space-y-4', children: [_jsx(Input, { placeholder: 'Fund Name', value: formData.fundName, onChange: e => setFormData(prev => ({ ...prev, fundName: e.target.value })) }), _jsx(Input, { placeholder: 'Fund Description', value: formData.description, onChange: e => setFormData(prev => ({ ...prev, description: e.target.value })) }), _jsx(Input, { placeholder: 'Investment Strategy', value: formData.investmentStrategy, onChange: e => setFormData(prev => ({ ...prev, investmentStrategy: e.target.value })) }), _jsx(Input, { placeholder: 'ESG Integration Approach', value: formData.esgIntegration, onChange: e => setFormData(prev => ({ ...prev, esgIntegration: e.target.value })) })] }), _jsxs("div", { className: 'space-y-4', children: [_jsx(Input, { placeholder: 'Sustainability Objectives (optional)', value: formData.sustainabilityObjectives, onChange: e => setFormData(prev => ({ ...prev, sustainabilityObjectives: e.target.value })) }), _jsx(Input, { placeholder: 'Principal Adverse Impacts Consideration', value: formData.principalAdverseImpacts, onChange: e => setFormData(prev => ({ ...prev, principalAdverseImpacts: e.target.value })) }), _jsx(Input, { placeholder: 'Taxonomy Alignment', value: formData.taxonomyAlignment, onChange: e => setFormData(prev => ({ ...prev, taxonomyAlignment: e.target.value })) }), _jsx(Button, { onClick: handleClassification, disabled: isLoading, className: 'w-full', children: isLoading ? 'Classifying...' : 'Classify Fund' })] })] }), classificationResult && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: 'space-y-4 mt-6', children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center space-x-2', children: [_jsx(CheckCircle, { className: 'h-5 w-5 text-green-500' }), _jsx("span", { children: "Classification Result" })] }) }), _jsxs(CardContent, { className: 'space-y-4', children: [_jsxs("div", { className: 'flex items-center justify-between', children: [_jsx("span", { className: 'font-semibold', children: "Classification:" }), _jsx(Badge, { variant: classificationResult.classification === 'Article 9'
                                                                        ? 'default'
                                                                        : 'secondary', children: classificationResult.classification })] }), _jsxs("div", { className: 'space-y-2', children: [_jsxs("div", { className: 'flex items-center justify-between', children: [_jsx("span", { children: "Confidence:" }), _jsxs("span", { children: [classificationResult.confidence.toFixed(1), "%"] })] }), _jsx(Progress, { value: classificationResult.confidence, className: 'w-full' })] }), _jsxs("div", { className: 'space-y-2', children: [_jsxs("div", { className: 'flex items-center justify-between', children: [_jsx("span", { children: "Compliance Score:" }), _jsxs("span", { children: [classificationResult.complianceScore.toFixed(1), "%"] })] }), _jsx(Progress, { value: classificationResult.complianceScore, className: 'w-full' })] }), _jsxs("div", { children: [_jsx("h4", { className: 'font-semibold mb-2', children: "Reasoning:" }), _jsx("p", { className: 'text-sm text-muted-foreground', children: classificationResult.reasoning })] }), _jsxs("div", { children: [_jsxs("h4", { className: 'font-semibold mb-2 flex items-center', children: [_jsx(TrendingUp, { className: 'h-4 w-4 mr-1' }), "Recommendations:"] }), _jsx("ul", { className: 'text-sm space-y-1', children: classificationResult.recommendations.map((rec, index) => (_jsxs("li", { className: 'flex items-start', children: [_jsx(CheckCircle, { className: 'h-3 w-3 text-green-500 mr-2 mt-1 flex-shrink-0' }), rec] }, index))) })] }), classificationResult.issues.length > 0 && (_jsxs("div", { children: [_jsxs("h4", { className: 'font-semibold mb-2 flex items-center', children: [_jsx(AlertTriangle, { className: 'h-4 w-4 mr-1 text-yellow-500' }), "Issues to Address:"] }), _jsx("ul", { className: 'text-sm space-y-1', children: classificationResult.issues.map((issue, index) => (_jsxs("li", { className: 'flex items-start', children: [_jsx(AlertTriangle, { className: 'h-3 w-3 text-yellow-500 mr-2 mt-1 flex-shrink-0' }), issue] }, index))) })] }))] })] }) }))] }), _jsxs(TabsContent, { value: 'documents', className: 'space-y-4', children: [_jsxs("div", { className: 'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center', children: [_jsx(Upload, { className: 'h-12 w-12 text-gray-400 mx-auto mb-4' }), _jsx("h3", { className: 'text-lg font-semibold mb-2', children: "Upload Documents" }), _jsx("p", { className: 'text-muted-foreground mb-4', children: "Upload fund documents, prospectuses, or ESG reports for AI analysis" }), _jsx("input", { ref: fileInputRef, type: 'file', multiple: true, accept: '.pdf,.doc,.docx,.txt', onChange: handleDocumentUpload, className: 'hidden' }), _jsx(Button, { onClick: () => fileInputRef.current?.click(), disabled: isLoading, children: isLoading ? 'Processing...' : 'Choose Files' })] }), uploadedDocuments.length > 0 && (_jsxs("div", { className: 'space-y-4', children: [_jsx("h3", { className: 'text-lg font-semibold', children: "Analyzed Documents" }), uploadedDocuments.map((doc, index) => (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, children: _jsx(Card, { children: _jsxs(CardContent, { className: 'p-4', children: [_jsxs("div", { className: 'flex items-start justify-between mb-3', children: [_jsxs("div", { className: 'flex items-center space-x-2', children: [_jsx(FileText, { className: 'h-5 w-5 text-blue-500' }), _jsx("span", { className: 'font-medium', children: doc.fileName })] }), _jsxs(Badge, { variant: 'outline', children: [doc.sfdrRelevance.toFixed(1), "% SFDR Relevant"] })] }), _jsx("p", { className: 'text-sm text-muted-foreground mb-3', children: doc.summary }), _jsx("div", { className: 'flex flex-wrap gap-2 mb-3', children: doc.entities.map((entity, i) => (_jsx(Badge, { variant: 'secondary', className: 'text-xs', children: entity }, i))) }), _jsxs("div", { className: 'flex items-center justify-between text-xs text-muted-foreground', children: [_jsxs("span", { children: ["Sentiment: ", doc.sentiment] }), _jsxs("span", { children: [doc.topics.length, " topics identified"] })] })] }) }) }, index)))] }))] }), _jsx(TabsContent, { value: 'export', className: 'space-y-4', children: _jsxs("div", { className: 'text-center space-y-6', children: [_jsxs("div", { children: [_jsx("h3", { className: 'text-lg font-semibold mb-2', children: "Export Analysis" }), _jsx("p", { className: 'text-muted-foreground', children: "Export your SFDR analysis results in various formats" })] }), _jsxs("div", { className: 'grid grid-cols-1 md:grid-cols-3 gap-4', children: [_jsx(Card, { className: 'cursor-pointer hover:shadow-lg transition-shadow', onClick: () => handleExport('pdf'), children: _jsxs(CardContent, { className: 'p-6 text-center', children: [_jsx(FileText, { className: 'h-12 w-12 text-red-500 mx-auto mb-3' }), _jsx("h4", { className: 'font-semibold mb-2', children: "PDF Report" }), _jsx("p", { className: 'text-sm text-muted-foreground', children: "Comprehensive analysis report with charts and recommendations" })] }) }), _jsx(Card, { className: 'cursor-pointer hover:shadow-lg transition-shadow', onClick: () => handleExport('excel'), children: _jsxs(CardContent, { className: 'p-6 text-center', children: [_jsx(TrendingUp, { className: 'h-12 w-12 text-green-500 mx-auto mb-3' }), _jsx("h4", { className: 'font-semibold mb-2', children: "Excel Workbook" }), _jsx("p", { className: 'text-sm text-muted-foreground', children: "Structured data with analysis metrics and compliance scores" })] }) }), _jsx(Card, { className: 'cursor-pointer hover:shadow-lg transition-shadow', onClick: () => handleExport('json'), children: _jsxs(CardContent, { className: 'p-6 text-center', children: [_jsx(Download, { className: 'h-12 w-12 text-blue-500 mx-auto mb-3' }), _jsx("h4", { className: 'font-semibold mb-2', children: "JSON Data" }), _jsx("p", { className: 'text-sm text-muted-foreground', children: "Raw data for integration with other systems and APIs" })] }) })] }), (classificationResult || uploadedDocuments.length > 0) && (_jsxs(Alert, { children: [_jsx(CheckCircle, { className: 'h-4 w-4' }), _jsxs(AlertDescription, { children: ["Ready to export:", ' ', classificationResult ? '1 classification' : '0 classifications', ",", uploadedDocuments.length, " document", uploadedDocuments.length !== 1 ? 's' : '', ",", messages.length, " chat messages"] })] }))] }) })] })] })] }));
};
export default SFDRGem;
