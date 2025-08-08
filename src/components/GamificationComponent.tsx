import { Award, Trophy, Medal, Star, Gift, Flag, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GamificationComponent = () => {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>Gamification Elements</h3>
        <p className='text-sm text-gray-500'>
          Enhance your GRC experience with these engagement features designed to make compliance
          more interactive and rewarding.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-white rounded-lg border p-4 hover:shadow-md transition-shadow'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center'>
              <Trophy className='h-5 w-5 text-amber-600' />
            </div>
            <div>
              <h4 className='font-medium'>Achievement System</h4>
              <p className='text-sm text-gray-500'>Earn badges for compliance milestones</p>
            </div>
          </div>
          <div className='flex flex-wrap gap-2 mt-3'>
            <div className='px-2 py-1 bg-blue-50 rounded-full text-xs flex items-center gap-1'>
              <Award className='h-3 w-3' />
              <span>GDPR Master</span>
            </div>
            <div className='px-2 py-1 bg-purple-50 rounded-full text-xs flex items-center gap-1'>
              <Medal className='h-3 w-3' />
              <span>AML Expert</span>
            </div>
            <div className='px-2 py-1 bg-green-50 rounded-full text-xs flex items-center gap-1'>
              <Star className='h-3 w-3' />
              <span>Risk Pioneer</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border p-4 hover:shadow-md transition-shadow'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
              <Target className='h-5 w-5 text-blue-600' />
            </div>
            <div>
              <h4 className='font-medium'>Challenges</h4>
              <p className='text-sm text-gray-500'>Test your knowledge with interactive quizzes</p>
            </div>
          </div>
          <div className='mt-2 space-y-2'>
            <div className='flex justify-between items-center text-sm'>
              <span>GDPR Challenge</span>
              <span className='text-green-600'>8/10 correct</span>
            </div>
            <div className='h-1.5 w-full bg-gray-100 rounded-full overflow-hidden'>
              <div className='h-full bg-green-500 rounded-full' style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border p-4 hover:shadow-md transition-shadow'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
              <Flag className='h-5 w-5 text-purple-600' />
            </div>
            <div>
              <h4 className='font-medium'>Leaderboards</h4>
              <p className='text-sm text-gray-500'>Compete with peers in your organization</p>
            </div>
          </div>
          <div className='mt-3 space-y-2 text-sm'>
            <div className='flex justify-between items-center py-1 border-b'>
              <span className='flex items-center gap-2'>
                <span className='font-medium'>1.</span> Sarah Johnson
              </span>
              <span>560 pts</span>
            </div>
            <div className='flex justify-between items-center py-1 border-b'>
              <span className='flex items-center gap-2'>
                <span className='font-medium'>2.</span> Mark Williams
              </span>
              <span>480 pts</span>
            </div>
            <div className='flex justify-between items-center py-1 border-b bg-blue-50'>
              <span className='flex items-center gap-2'>
                <span className='font-medium'>3.</span> You
              </span>
              <span>425 pts</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border p-4 hover:shadow-md transition-shadow'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
              <Zap className='h-5 w-5 text-green-600' />
            </div>
            <div>
              <h4 className='font-medium'>Create Your Own Challenge</h4>
              <p className='text-sm text-gray-500'>Design custom quizzes for your team</p>
            </div>
          </div>
          <div className='mt-3'>
            <div className='bg-gray-50 border border-dashed rounded-md p-3 text-center'>
              <p className='text-sm'>Create compliance challenges with our intuitive builder</p>
              <Button 
                variant='success' 
                size='sm' 
                className='mt-2 text-xs'
                aria-label='Create new compliance challenge'
              >
                Create Challenge
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100'>
        <div className='flex items-center gap-3 mb-3'>
          <Gift className='h-5 w-5 text-purple-600' />
          <h4 className='font-medium'>Rewards Program</h4>
        </div>
        <p className='text-sm mb-3'>
          Earn points through engagement and redeem them for professional development opportunities,
          access to premium content, and more.
        </p>
        <div className='flex justify-between items-center'>
          <div>
            <span className='text-sm font-medium'>Your Points:</span>
            <span className='ml-2 text-sm bg-purple-100 px-2 py-0.5 rounded-full'>425 pts</span>
          </div>
          <Button 
            variant='secondary' 
            size='sm' 
            className='text-xs'
            aria-label='View available rewards and redemption options'
          >
            View Rewards
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GamificationComponent;
