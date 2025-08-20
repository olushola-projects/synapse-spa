import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Widget } from '../dashboard/WidgetGrid';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
const RecentQueriesWidget = ({ onRemove }) => {
  const navigate = useNavigate();
  const handleAskDara = () => {
    navigate('/ask-dara');
  };
  const getFeedbackIcon = feedback => {
    if (feedback === 'positive') {
      return _jsx(ThumbsUp, { className: 'w-4 h-4 text-green-500' });
    } else if (feedback === 'negative') {
      return _jsx(ThumbsDown, { className: 'w-4 h-4 text-red-500' });
    }
    return null;
  };
  return _jsx(Widget, {
    title: 'Recent Queries',
    onRemove: onRemove,
    children: _jsxs('div', {
      className: 'space-y-4',
      children: [
        recentQueries.length > 0
          ? _jsx('div', {
              className: 'space-y-3',
              children: recentQueries.map(query =>
                _jsxs(
                  'div',
                  {
                    className:
                      'p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer',
                    children: [
                      _jsxs('div', {
                        className: 'flex items-center justify-between mb-1',
                        children: [
                          _jsxs('div', {
                            className: 'flex items-center',
                            children: [
                              _jsx(MessageSquare, { className: 'w-4 h-4 text-blue-500 mr-2' }),
                              _jsxs('span', {
                                className: 'text-sm font-medium',
                                children: ['Query #', query.id]
                              })
                            ]
                          }),
                          getFeedbackIcon(query.feedback)
                        ]
                      }),
                      _jsx('p', { className: 'text-sm mb-2 line-clamp-2', children: query.query }),
                      _jsxs('div', {
                        className: 'flex items-center text-xs text-gray-500',
                        children: [_jsx(Clock, { className: 'w-3 h-3 mr-1' }), query.timestamp]
                      })
                    ]
                  },
                  query.id
                )
              )
            })
          : _jsx('div', {
              className: 'text-center py-8',
              children: _jsx('p', {
                className: 'text-gray-500 mb-4',
                children: "You haven't asked any questions yet"
              })
            }),
        _jsx('div', {
          className: 'pt-4 text-center',
          children: _jsxs(Button, {
            onClick: handleAskDara,
            className: 'w-full',
            children: [_jsx(MessageSquare, { className: 'w-4 h-4 mr-2' }), 'Ask Dara']
          })
        })
      ]
    })
  });
};
export default RecentQueriesWidget;
