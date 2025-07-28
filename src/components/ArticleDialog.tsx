// React import removed as it's not needed in modern React with JSX transform
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { IndustryPerspective } from '@/data/industryPerspectivesData';

interface ArticleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  perspective: IndustryPerspective | null;
}

const ArticleDialog = ({ isOpen, onOpenChange, perspective }: ArticleDialogProps) => {
  if (!perspective) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <div className={`mb-2 ${perspective.color}`}>{perspective.icon}</div>
          <DialogTitle className='text-2xl font-bold'>{perspective.name}</DialogTitle>
          <DialogDescription className='text-lg font-medium text-foreground'>
            {perspective.role}
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-4'>
          <p className='text-gray-700 leading-relaxed'>{perspective.bio}</p>

          {perspective.insights && perspective.insights.length > 0 && (
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4'>
              <h4 className='font-semibold text-gray-800 mb-2'>Key Insights:</h4>
              <ul className='space-y-2 list-disc pl-5'>
                {perspective.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {perspective.quotation && (
            <blockquote className='border-l-4 border-synapse-primary/30 pl-4 italic text-gray-700'>
              "{perspective.quotation}"
              {perspective.attribution && (
                <footer className='mt-1 text-sm text-gray-500 not-italic'>
                  — {perspective.attribution}
                </footer>
              )}
            </blockquote>
          )}
        </div>

        <DialogFooter className='flex items-center justify-between border-t pt-4'>
          <span className='text-sm text-gray-500'>
            Published:{' '}
            {perspective.date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <Button onClick={() => window.open(perspective.link, '_blank')} className='gap-2'>
            Read Full Report <ExternalLink size={16} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDialog;
