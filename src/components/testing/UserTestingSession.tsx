import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Users,
  Clock,
  MessageSquare
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface TestingTask {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  expectedOutcome: string;
  timeLimit?: number; // in minutes
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface SessionParticipant {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  status: 'active' | 'idle' | 'disconnected';
}

interface SessionNote {
  id: string;
  timestamp: string;
  author: string;
  content: string;
  type: 'observation' | 'issue' | 'suggestion' | 'question';
  taskId?: string;
}

interface TestingSession {
  id: string;
  name: string;
  description: string;
  startTime?: string;
  endTime?: string;
  status: 'preparing' | 'active' | 'paused' | 'completed';
  currentTaskIndex: number;
  participants: SessionParticipant[];
  tasks: TestingTask[];
  notes: SessionNote[];
  recordings: {
    screen: boolean;
    audio: boolean;
    webcam: boolean;
  };
}

/**
 * User testing session manager
 * Facilitates live user testing sessions with task management,
 * real-time collaboration, and comprehensive data collection
 */
const UserTestingSession: React.FC = () => {
  const [session, setSession] = useState<TestingSession | null>(null);
  const [currentUser] = useState<string>('Test Moderator');
  const [newNote, setNewNote] = useState<string>('');
  const [noteType, setNoteType] = useState<'observation' | 'issue' | 'suggestion' | 'question'>(
    'observation'
  );
  const [sessionTimer, setSessionTimer] = useState<number>(0);
  const [taskTimer, setTaskTimer] = useState<number>(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const taskTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize default testing session
  useEffect(() => {
    const defaultSession: TestingSession = {
      id: `session-${Date.now()}`,
      name: 'Synapses Landing Page UAT Session',
      description:
        'User acceptance testing for the Synapses landing page focusing on user experience, navigation, and SFDR tool functionality',
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
    } else {
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

    const note: SessionNote = {
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
  const toggleRecording = (type: 'screen' | 'audio' | 'webcam') => {
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
  const formatTime = (seconds: number): string => {
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
        notesByType: session.notes.reduce(
          (acc, note) => {
            acc[note.type] = (acc[note.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        )
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
    return <div className='flex items-center justify-center h-64'>Loading session...</div>;
  }

  const currentTask = session.tasks[session.currentTaskIndex];
  const progress = ((session.currentTaskIndex + 1) / session.tasks.length) * 100;

  return (
    <div className='max-w-7xl mx-auto p-6 space-y-6'>
      {/* Session Header */}
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>{session.name}</h1>
          <p className='text-gray-600 mt-1'>{session.description}</p>
          <div className='flex items-center gap-4 mt-2'>
            <Badge
              variant={
                session.status === 'active'
                  ? 'default'
                  : session.status === 'paused'
                    ? 'secondary'
                    : session.status === 'completed'
                      ? 'outline'
                      : 'destructive'
              }
            >
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Badge>
            <span className='text-sm text-gray-500'>Session Time: {formatTime(sessionTimer)}</span>
            <span className='text-sm text-gray-500'>Task Time: {formatTime(taskTimer)}</span>
          </div>
        </div>

        <div className='flex gap-2'>
          {session.status === 'preparing' && (
            <Button onClick={startSession}>
              <Play className='h-4 w-4 mr-2' />
              Start Session
            </Button>
          )}
          {session.status === 'active' && (
            <>
              <Button onClick={pauseSession} variant='outline'>
                <Pause className='h-4 w-4 mr-2' />
                Pause
              </Button>
              <Button onClick={endSession} variant='destructive'>
                <Square className='h-4 w-4 mr-2' />
                End Session
              </Button>
            </>
          )}
          {session.status === 'paused' && (
            <>
              <Button onClick={startSession}>
                <Play className='h-4 w-4 mr-2' />
                Resume
              </Button>
              <Button onClick={endSession} variant='destructive'>
                <Square className='h-4 w-4 mr-2' />
                End Session
              </Button>
            </>
          )}
          <Button onClick={exportSession} variant='outline'>
            Export Data
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className='p-4'>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Task Progress</span>
              <span>
                {session.currentTaskIndex + 1} of {session.tasks.length}
              </span>
            </div>
            <Progress value={progress} className='w-full' />
          </div>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Camera className='h-5 w-5' />
            Recording Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4'>
            <Button
              variant={session.recordings.screen ? 'default' : 'outline'}
              onClick={() => toggleRecording('screen')}
              size='sm'
            >
              <Camera className='h-4 w-4 mr-2' />
              Screen {session.recordings.screen ? 'ON' : 'OFF'}
            </Button>
            <Button
              variant={session.recordings.audio ? 'default' : 'outline'}
              onClick={() => toggleRecording('audio')}
              size='sm'
            >
              {session.recordings.audio ? (
                <Mic className='h-4 w-4 mr-2' />
              ) : (
                <MicOff className='h-4 w-4 mr-2' />
              )}
              Audio {session.recordings.audio ? 'ON' : 'OFF'}
            </Button>
            <Button
              variant={session.recordings.webcam ? 'default' : 'outline'}
              onClick={() => toggleRecording('webcam')}
              size='sm'
            >
              {session.recordings.webcam ? (
                <Camera className='h-4 w-4 mr-2' />
              ) : (
                <CameraOff className='h-4 w-4 mr-2' />
              )}
              Webcam {session.recordings.webcam ? 'ON' : 'OFF'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Current Task */}
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    Task {session.currentTaskIndex + 1}: {currentTask?.title}
                    <Badge
                      variant={
                        currentTask?.priority === 'high'
                          ? 'destructive'
                          : currentTask?.priority === 'medium'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {currentTask?.priority}
                    </Badge>
                  </CardTitle>
                  <p className='text-gray-600 mt-1'>{currentTask?.description}</p>
                </div>
                {currentTask?.timeLimit && (
                  <div className='text-right'>
                    <div className='text-sm text-gray-500'>Time Limit</div>
                    <div className='text-lg font-bold'>{currentTask.timeLimit} min</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium mb-2'>Instructions:</h4>
                  <ol className='list-decimal list-inside space-y-1 text-sm text-gray-600'>
                    {currentTask?.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className='font-medium mb-1'>Expected Outcome:</h4>
                  <p className='text-sm text-gray-600'>{currentTask?.expectedOutcome}</p>
                </div>

                <div className='flex gap-2 pt-4'>
                  <Button
                    onClick={previousTask}
                    disabled={session.currentTaskIndex === 0}
                    variant='outline'
                  >
                    Previous Task
                  </Button>
                  <Button
                    onClick={nextTask}
                    disabled={session.currentTaskIndex >= session.tasks.length - 1}
                  >
                    Next Task
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Note */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MessageSquare className='h-5 w-5' />
                Add Observation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex gap-2'>
                  <select
                    value={noteType}
                    onChange={e => setNoteType(e.target.value as any)}
                    className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='observation'>Observation</option>
                    <option value='issue'>Issue</option>
                    <option value='suggestion'>Suggestion</option>
                    <option value='question'>Question</option>
                  </select>
                </div>
                <Textarea
                  placeholder='Add your observation, note any issues, or record user feedback...'
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className='min-h-[100px]'
                />
                <Button onClick={addNote} disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                Participants ({session.participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {session.participants.map(participant => (
                  <div key={participant.id} className='flex items-center justify-between'>
                    <div>
                      <div className='font-medium text-sm'>{participant.name}</div>
                      <div className='text-xs text-gray-500'>{participant.role}</div>
                    </div>
                    <Badge
                      variant={
                        participant.status === 'active'
                          ? 'default'
                          : participant.status === 'idle'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className='text-xs'
                    >
                      {participant.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notes ({session.notes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3 max-h-96 overflow-y-auto'>
                {session.notes
                  .slice(-10)
                  .reverse()
                  .map(note => (
                    <div key={note.id} className='border-l-2 border-gray-200 pl-3 space-y-1'>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline' className='text-xs'>
                          {note.type}
                        </Badge>
                        <span className='text-xs text-gray-500'>
                          {new Date(note.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className='text-sm'>{note.content}</p>
                      <p className='text-xs text-gray-500'>by {note.author}</p>
                    </div>
                  ))}
                {session.notes.length === 0 && (
                  <p className='text-sm text-gray-500 text-center py-4'>
                    No notes yet. Start adding observations!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Session Status Alert */}
      {session.status === 'completed' && (
        <Alert>
          <Clock className='h-4 w-4' />
          <AlertDescription>
            Session completed! Total duration: {formatTime(sessionTimer)}. Don't forget to export
            your session data for analysis.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UserTestingSession;
