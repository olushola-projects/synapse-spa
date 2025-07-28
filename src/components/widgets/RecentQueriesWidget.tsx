import { Widget } from '../dashboard/WidgetGrid';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentQueriesWidgetProps {
  onRemove?: () => void;
}

// Sample recent queries data
const recentQueries = [
  {
    id: 1,
    query: 'What is the penalty under AMLD6 for non-compliance?',
    timestamp: 'Today, 10:23 AM',
    feedback: 'positive'
  },
  {
    id: 2,
    query: 'Explain the key changes in the 6th EU Anti-Money Laundering Directive',
    timestamp: 'Yesterday, 2:15 PM',
    feedback: 'negative'
  },
  {
    id: 3,
    query: 'What are the reporting requirements for suspicious transactions under UK regulations?',
    timestamp: '14 Apr, 4:30 PM',
    feedback: null
  }
];

const RecentQueriesWidget = ({ onRemove }: RecentQueriesWidgetProps) => {
  const navigate = useNavigate();

  const handleAskDara = () => {
    navigate('/ask-dara');
  };

  const getFeedbackIcon = (feedback: string | null) => {
    if (feedback === 'positive') {
      return <ThumbsUp className='w-4 h-4 text-green-500' />;
    } else if (feedback === 'negative') {
      return <ThumbsDown className='w-4 h-4 text-red-500' />;
    }
    return null;
  };

  return (
    <Widget title='Recent Queries' onRemove={onRemove}>
      <div className='space-y-4'>
        {recentQueries.length > 0 ? (
          <div className='space-y-3'>
            {recentQueries.map(query => (
              <div
                key={query.id}
                className='p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'
              >
                <div className='flex items-center justify-between mb-1'>
                  <div className='flex items-center'>
                    <MessageSquare className='w-4 h-4 text-blue-500 mr-2' />
                    <span className='text-sm font-medium'>Query #{query.id}</span>
                  </div>
                  {getFeedbackIcon(query.feedback)}
                </div>
                <p className='text-sm mb-2 line-clamp-2'>{query.query}</p>
                <div className='flex items-center text-xs text-gray-500'>
                  <Clock className='w-3 h-3 mr-1' />
                  {query.timestamp}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8'>
            <p className='text-gray-500 mb-4'>You haven't asked any questions yet</p>
          </div>
        )}

        <div className='pt-4 text-center'>
          <Button onClick={handleAskDara} className='w-full'>
            <MessageSquare className='w-4 h-4 mr-2' />
            Ask Dara
          </Button>
        </div>
      </div>
    </Widget>
  );
};

export default RecentQueriesWidget;
