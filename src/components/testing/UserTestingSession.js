import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Mic, MicOff, Camera, CameraOff, Users, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
/**
 * User testing session manager
 * Facilitates live user testing sessions with task management,
 * real-time collaboration, and comprehensive data collection
 */
const UserTestingSession = () => {
    const [session, setSession] = useState(null);
    const [currentUser] = useState('Test Moderator');
    const [newNote, setNewNote] = useState('');
    const [noteType, setNoteType] = useState('observation');
    const [sessionTimer, setSessionTimer] = useState(0);
    const [taskTimer, setTaskTimer] = useState(0);
    const timerRef = useRef(null);
    const taskTimerRef = useRef(null);
    // Initialize default testing session
    useEffect(() => {
        const defaultSession = {
            id: `session-${Date.now()}`,
            name: 'Synapses Landing Page UAT Session',
            description: 'User acceptance testing for the Synapses landing page focusing on user experience, navigation, and SFDR tool functionality',
            status: 'preparing',
            currentTaskIndex: 0,
            participants: [
                {
                    id: 'mod-1',
                    name: 'Test Moderator',
                    email: 'moderator@synapses.com',
                    role: 'Moderator',
                    joinedAt: new Date().toISOString(),
                    status: 'active'
                }
            ],
            tasks: [
                {
                    id: 'task-1',
                    title: 'First Impression & Navigation',
                    description: 'Evaluate initial user reaction and basic navigation',
                    instructions: [
                        'Land on the homepage and share your first impression',
                        'Explore the main navigation menu',
                        'Try to understand what Synapses does within 30 seconds',
                        'Navigate to different sections of the site'
                    ],
                    expectedOutcome: 'User understands the value proposition and can navigate easily',
                    timeLimit: 10,
                    priority: 'high',
                    category: 'Navigation'
                },
                {
                    id: 'task-2',
                    title: 'SFDR Tool Discovery & Usage',
                    description: 'Test the SFDR Gem tool discovery and usage flow',
                    instructions: [
                        'Find the SFDR classification tool on the website',
                        'Attempt to use the tool with sample data',
                        'Complete a classification process',
                        'Try to understand the results provided'
                    ],
                    expectedOutcome: 'User can find and successfully use the SFDR tool',
                    timeLimit: 15,
                    priority: 'high',
                    category: 'Functionality'
                },
                {
                    id: 'task-3',
                    title: 'Contact & Engagement',
                    description: 'Test contact mechanisms and engagement features',
                    instructions: [
                        'Find ways to contact the company',
                        'Try to request more information or a demo',
                        'Look for pricing or service information',
                        'Evaluate the call-to-action effectiveness'
                    ],
                    expectedOutcome: 'User can easily find contact options and feels encouraged to engage',
                    timeLimit: 8,
                    priority: 'medium',
                    category: 'Engagement'
                },
                {
                    id: 'task-4',
                    title: 'Mobile Experience',
                    description: 'Test the mobile responsiveness and usability',
                    instructions: [
                        'Switch to mobile view or use a mobile device',
                        'Navigate through the main sections',
                        'Test the SFDR tool on mobile',
                        'Evaluate overall mobile experience'
                    ],
                    expectedOutcome: 'Mobile experience is smooth and functional',
                    timeLimit: 12,
                    priority: 'medium',
                    category: 'Responsive Design'
                },
                {
                    id: 'task-5',
                    title: 'Content Comprehension',
                    description: 'Evaluate content clarity and regulatory compliance understanding',
                    instructions: [
                        'Read through the main content sections',
                        'Try to understand SFDR regulations explanation',
                        'Evaluate the clarity of technical terms',
                        'Assess if the content builds trust and credibility'
                    ],
                    expectedOutcome: 'User understands the content and feels confident about the service',
                    timeLimit: 10,
                    priority: 'high',
                    category: 'Content'
                }
            ],
            notes: [],
            recordings: {
                screen: false,
                audio: false,
                webcam: false
            }
        };
        setSession(defaultSession);
    }, []);
    // Timer management
    useEffect(() => {
        if (session?.status === 'active') {
            timerRef.current = setInterval(() => {
                setSessionTimer(prev => prev + 1);
            }, 1000);
            taskTimerRef.current = setInterval(() => {
                setTaskTimer(prev => prev + 1);
            }, 1000);
        }
        else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (taskTimerRef.current) {
                clearInterval(taskTimerRef.current);
            }
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (taskTimerRef.current) {
                clearInterval(taskTimerRef.current);
            }
        };
    }, [session?.status]);
    // Start session
    const startSession = () => {
        if (!session) {
            return;
        }
        setSession({
            ...session,
            status: 'active',
            startTime: new Date().toISOString()
        });
        setSessionTimer(0);
        setTaskTimer(0);
    };
    // Pause session
    const pauseSession = () => {
        if (!session) {
            return;
        }
        setSession({
            ...session,
            status: 'paused'
        });
    };
    // End session
    const endSession = () => {
        if (!session) {
            return;
        }
        setSession({
            ...session,
            status: 'completed',
            endTime: new Date().toISOString()
        });
    };
    // Move to next task
    const nextTask = () => {
        if (!session || session.currentTaskIndex >= session.tasks.length - 1) {
            return;
        }
        setSession({
            ...session,
            currentTaskIndex: session.currentTaskIndex + 1
        });
        setTaskTimer(0);
    };
    // Move to previous task
    const previousTask = () => {
        if (!session || session.currentTaskIndex <= 0) {
            return;
        }
        setSession({
            ...session,
            currentTaskIndex: session.currentTaskIndex - 1
        });
        setTaskTimer(0);
    };
    // Add note
    const addNote = () => {
        if (!session || !newNote.trim()) {
            return;
        }
        const note = {
            id: `note-${Date.now()}`,
            timestamp: new Date().toISOString(),
            author: currentUser,
            content: newNote.trim(),
            type: noteType,
            taskId: session.tasks[session.currentTaskIndex]?.id
        };
        setSession({
            ...session,
            notes: [...session.notes, note]
        });
        setNewNote('');
    };
    // Toggle recording
    const toggleRecording = (type) => {
        if (!session) {
            return;
        }
        setSession({
            ...session,
            recordings: {
                ...session.recordings,
                [type]: !session.recordings[type]
            }
        });
    };
    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    // Export session data
    const exportSession = () => {
        if (!session) {
            return;
        }
        const exportData = {
            ...session,
            exportedAt: new Date().toISOString(),
            sessionDuration: sessionTimer,
            summary: {
                totalTasks: session.tasks.length,
                completedTasks: session.currentTaskIndex + (session.status === 'completed' ? 1 : 0),
                totalNotes: session.notes.length,
                notesByType: session.notes.reduce((acc, note) => {
                    acc[note.type] = (acc[note.type] || 0) + 1;
                    return acc;
                }, {})
            }
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `testing-session-${session.id}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    if (!session) {
        return _jsx("div", { className: 'flex items-center justify-center h-64', children: "Loading session..." });
    }
    const currentTask = session.tasks[session.currentTaskIndex];
    const progress = ((session.currentTaskIndex + 1) / session.tasks.length) * 100;
    return (_jsxs("div", { className: 'max-w-7xl mx-auto p-6 space-y-6', children: [_jsxs("div", { className: 'flex justify-between items-start', children: [_jsxs("div", { children: [_jsx("h1", { className: 'text-3xl font-bold text-gray-900', children: session.name }), _jsx("p", { className: 'text-gray-600 mt-1', children: session.description }), _jsxs("div", { className: 'flex items-center gap-4 mt-2', children: [_jsx(Badge, { variant: session.status === 'active'
                                            ? 'default'
                                            : session.status === 'paused'
                                                ? 'secondary'
                                                : session.status === 'completed'
                                                    ? 'outline'
                                                    : 'destructive', children: session.status.charAt(0).toUpperCase() + session.status.slice(1) }), _jsxs("span", { className: 'text-sm text-gray-500', children: ["Session Time: ", formatTime(sessionTimer)] }), _jsxs("span", { className: 'text-sm text-gray-500', children: ["Task Time: ", formatTime(taskTimer)] })] })] }), _jsxs("div", { className: 'flex gap-2', children: [session.status === 'preparing' && (_jsxs(Button, { onClick: startSession, children: [_jsx(Play, { className: 'h-4 w-4 mr-2' }), "Start Session"] })), session.status === 'active' && (_jsxs(_Fragment, { children: [_jsxs(Button, { onClick: pauseSession, variant: 'outline', children: [_jsx(Pause, { className: 'h-4 w-4 mr-2' }), "Pause"] }), _jsxs(Button, { onClick: endSession, variant: 'destructive', children: [_jsx(Square, { className: 'h-4 w-4 mr-2' }), "End Session"] })] })), session.status === 'paused' && (_jsxs(_Fragment, { children: [_jsxs(Button, { onClick: startSession, children: [_jsx(Play, { className: 'h-4 w-4 mr-2' }), "Resume"] }), _jsxs(Button, { onClick: endSession, variant: 'destructive', children: [_jsx(Square, { className: 'h-4 w-4 mr-2' }), "End Session"] })] })), _jsx(Button, { onClick: exportSession, variant: 'outline', children: "Export Data" })] })] }), _jsx(Card, { children: _jsx(CardContent, { className: 'p-4', children: _jsxs("div", { className: 'space-y-2', children: [_jsxs("div", { className: 'flex justify-between text-sm', children: [_jsx("span", { children: "Task Progress" }), _jsxs("span", { children: [session.currentTaskIndex + 1, " of ", session.tasks.length] })] }), _jsx(Progress, { value: progress, className: 'w-full' })] }) }) }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(Camera, { className: 'h-5 w-5' }), "Recording Controls"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'flex gap-4', children: [_jsxs(Button, { variant: session.recordings.screen ? 'default' : 'outline', onClick: () => toggleRecording('screen'), size: 'sm', children: [_jsx(Camera, { className: 'h-4 w-4 mr-2' }), "Screen ", session.recordings.screen ? 'ON' : 'OFF'] }), _jsxs(Button, { variant: session.recordings.audio ? 'default' : 'outline', onClick: () => toggleRecording('audio'), size: 'sm', children: [session.recordings.audio ? (_jsx(Mic, { className: 'h-4 w-4 mr-2' })) : (_jsx(MicOff, { className: 'h-4 w-4 mr-2' })), "Audio ", session.recordings.audio ? 'ON' : 'OFF'] }), _jsxs(Button, { variant: session.recordings.webcam ? 'default' : 'outline', onClick: () => toggleRecording('webcam'), size: 'sm', children: [session.recordings.webcam ? (_jsx(Camera, { className: 'h-4 w-4 mr-2' })) : (_jsx(CameraOff, { className: 'h-4 w-4 mr-2' })), "Webcam ", session.recordings.webcam ? 'ON' : 'OFF'] })] }) })] }), _jsxs("div", { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6', children: [_jsxs("div", { className: 'lg:col-span-2 space-y-6', children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: 'flex justify-between items-start', children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: 'flex items-center gap-2', children: ["Task ", session.currentTaskIndex + 1, ": ", currentTask?.title, _jsx(Badge, { variant: currentTask?.priority === 'high'
                                                                        ? 'destructive'
                                                                        : currentTask?.priority === 'medium'
                                                                            ? 'default'
                                                                            : 'secondary', children: currentTask?.priority })] }), _jsx("p", { className: 'text-gray-600 mt-1', children: currentTask?.description })] }), currentTask?.timeLimit && (_jsxs("div", { className: 'text-right', children: [_jsx("div", { className: 'text-sm text-gray-500', children: "Time Limit" }), _jsxs("div", { className: 'text-lg font-bold', children: [currentTask.timeLimit, " min"] })] }))] }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'space-y-4', children: [_jsxs("div", { children: [_jsx("h4", { className: 'font-medium mb-2', children: "Instructions:" }), _jsx("ol", { className: 'list-decimal list-inside space-y-1 text-sm text-gray-600', children: currentTask?.instructions.map((instruction, index) => (_jsx("li", { children: instruction }, index))) })] }), _jsxs("div", { children: [_jsx("h4", { className: 'font-medium mb-1', children: "Expected Outcome:" }), _jsx("p", { className: 'text-sm text-gray-600', children: currentTask?.expectedOutcome })] }), _jsxs("div", { className: 'flex gap-2 pt-4', children: [_jsx(Button, { onClick: previousTask, disabled: session.currentTaskIndex === 0, variant: 'outline', children: "Previous Task" }), _jsx(Button, { onClick: nextTask, disabled: session.currentTaskIndex >= session.tasks.length - 1, children: "Next Task" })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(MessageSquare, { className: 'h-5 w-5' }), "Add Observation"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'space-y-4', children: [_jsx("div", { className: 'flex gap-2', children: _jsxs("select", { value: noteType, onChange: e => setNoteType(e.target.value), className: 'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500', children: [_jsx("option", { value: 'observation', children: "Observation" }), _jsx("option", { value: 'issue', children: "Issue" }), _jsx("option", { value: 'suggestion', children: "Suggestion" }), _jsx("option", { value: 'question', children: "Question" })] }) }), _jsx(Textarea, { placeholder: 'Add your observation, note any issues, or record user feedback...', value: newNote, onChange: e => setNewNote(e.target.value), className: 'min-h-[100px]' }), _jsx(Button, { onClick: addNote, disabled: !newNote.trim(), children: "Add Note" })] }) })] })] }), _jsxs("div", { className: 'space-y-6', children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: 'flex items-center gap-2', children: [_jsx(Users, { className: 'h-5 w-5' }), "Participants (", session.participants.length, ")"] }) }), _jsx(CardContent, { children: _jsx("div", { className: 'space-y-2', children: session.participants.map(participant => (_jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { children: [_jsx("div", { className: 'font-medium text-sm', children: participant.name }), _jsx("div", { className: 'text-xs text-gray-500', children: participant.role })] }), _jsx(Badge, { variant: participant.status === 'active'
                                                            ? 'default'
                                                            : participant.status === 'idle'
                                                                ? 'secondary'
                                                                : 'destructive', className: 'text-xs', children: participant.status })] }, participant.id))) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Recent Notes (", session.notes.length, ")"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: 'space-y-3 max-h-96 overflow-y-auto', children: [session.notes
                                                    .slice(-10)
                                                    .reverse()
                                                    .map(note => (_jsxs("div", { className: 'border-l-2 border-gray-200 pl-3 space-y-1', children: [_jsxs("div", { className: 'flex items-center gap-2', children: [_jsx(Badge, { variant: 'outline', className: 'text-xs', children: note.type }), _jsx("span", { className: 'text-xs text-gray-500', children: new Date(note.timestamp).toLocaleTimeString() })] }), _jsx("p", { className: 'text-sm', children: note.content }), _jsxs("p", { className: 'text-xs text-gray-500', children: ["by ", note.author] })] }, note.id))), session.notes.length === 0 && (_jsx("p", { className: 'text-sm text-gray-500 text-center py-4', children: "No notes yet. Start adding observations!" }))] }) })] })] })] }), session.status === 'completed' && (_jsxs(Alert, { children: [_jsx(Clock, { className: 'h-4 w-4' }), _jsxs(AlertDescription, { children: ["Session completed! Total duration: ", formatTime(sessionTimer), ". Don't forget to export your session data for analysis."] })] }))] }));
};
export default UserTestingSession;
