import { ExternalLink, MapPin, Calendar, Building, Users, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Startup {
  id: string;
  name: string;
  logo: string;
  country: string;
  founded: string;
  description: string;
  website?: string;
  company_stage: string;
  implementation_complexity: string;
  solution_integrity: string;
  use_cases: string[];
  regulations: string[];
  technologies: string[];
  industry: string[];
  investors: string[];
  funding_stage: string;
  geography: string;
}

interface StartupCardProps {
  startup: Startup;
  viewMode: 'grid' | 'list' | 'table';
  className?: string;
  onToggleSaved?: () => void;
  onToggleInterested?: () => void;
  isSaved?: boolean;
  isInterested?: boolean;
}

const BadgeColors = {
  use_cases: 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100',
  regulations: 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100',
  technologies: 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100',
  industries: 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100',
  investors: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
  funding_stage: 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
};

export function StartupCard({
  startup,
  viewMode,
  className,
  onToggleSaved,
  onToggleInterested,
  isSaved = false,
  isInterested = false
}: StartupCardProps) {
  const {
    name,
    // logo, // Removed - not used in current implementation
    country,
    founded,
    description,
    website,
    use_cases,
    regulations,
    technologies,
    investors,
    funding_stage
  } = startup;

  const handleLearnMore = () => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  if (viewMode === 'list') {
    return (
      <Card
        className={cn(
          'hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white',
          className
        )}
      >
        <CardContent className='p-6'>
          <div className='flex gap-6'>
            {/* Logo */}
            <div className='shrink-0'>
              <div className='w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200'>
                <Building className='h-8 w-8 text-gray-600' />
              </div>
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between mb-3'>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>{name}</h3>
                  <div className='flex items-center gap-4 text-sm text-gray-600'>
                    <div className='flex items-center gap-1'>
                      <MapPin className='h-4 w-4 text-gray-400' />
                      {country}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4 text-gray-400' />
                      Founded {founded}
                    </div>
                    <Badge
                      className={
                        startup.company_stage === 'Mature Leader'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : BadgeColors.funding_stage
                      }
                    >
                      {startup.company_stage === 'Mature Leader' ? 'Leader' : funding_stage}
                    </Badge>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {onToggleSaved && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={onToggleSaved}
                      className={cn('h-8 w-8 p-0', isSaved ? 'text-red-600' : 'text-gray-400')}
                    >
                      <Heart className='h-4 w-4' fill={isSaved ? 'currentColor' : 'none'} />
                    </Button>
                  )}
                  {onToggleInterested && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={onToggleInterested}
                      className={cn(
                        'h-8 w-8 p-0',
                        isInterested ? 'text-yellow-600' : 'text-gray-400'
                      )}
                    >
                      <Star className='h-4 w-4' fill={isInterested ? 'currentColor' : 'none'} />
                    </Button>
                  )}
                  {website && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleLearnMore}
                      className='border-gray-300 text-gray-700 hover:bg-gray-50'
                    >
                      <ExternalLink className='h-4 w-4 mr-2' />
                      Learn More
                    </Button>
                  )}
                </div>
              </div>

              <p className='text-gray-600 mb-4 line-clamp-2 leading-relaxed'>{description}</p>

              {/* Tags */}
              <div className='space-y-3'>
                {use_cases.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    <span className='text-xs font-medium text-muted-foreground min-w-20'>
                      Use Cases:
                    </span>
                    {use_cases.slice(0, 3).map(useCase => (
                      <Badge key={useCase} variant='secondary' className={BadgeColors.use_cases}>
                        {useCase}
                      </Badge>
                    ))}
                    {use_cases.length > 3 && (
                      <Badge variant='outline'>+{use_cases.length - 3} more</Badge>
                    )}
                  </div>
                )}

                <div className='flex flex-wrap items-center gap-4'>
                  {technologies.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      <span className='text-xs font-medium text-muted-foreground min-w-20'>
                        Tech:
                      </span>
                      {technologies.slice(0, 2).map(tech => (
                        <Badge key={tech} variant='secondary' className={BadgeColors.technologies}>
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {investors.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      <span className='text-xs font-medium text-muted-foreground'>
                        <Users className='h-3 w-3 inline mr-1' />
                      </span>
                      {investors.slice(0, 2).map(investor => (
                        <Badge key={investor} variant='secondary' className={BadgeColors.investors}>
                          {investor}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-fit',
        className
      )}
    >
      <CardHeader className='pb-4'>
        <div className='flex items-start justify-between mb-3'>
          <div className='w-12 h-12 bg-muted rounded-lg flex items-center justify-center'>
            <Building className='h-6 w-6 text-muted-foreground' />
          </div>
          <Badge className={BadgeColors.funding_stage}>{funding_stage}</Badge>
        </div>

        <CardTitle className='text-lg font-semibold text-foreground line-clamp-1'>{name}</CardTitle>

        <div className='flex items-center gap-3 text-sm text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <MapPin className='h-3 w-3' />
            {country}
          </div>
          <div className='flex items-center gap-1'>
            <Calendar className='h-3 w-3' />
            {founded}
          </div>
        </div>

        <CardDescription className='line-clamp-3 text-sm leading-relaxed'>
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className='pt-0'>
        {/* Use Cases */}
        {use_cases.length > 0 && (
          <div className='mb-4'>
            <h4 className='text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide'>
              Use Cases
            </h4>
            <div className='flex flex-wrap gap-1'>
              {use_cases.slice(0, 2).map(useCase => (
                <Badge
                  key={useCase}
                  variant='secondary'
                  className={cn(BadgeColors.use_cases, 'text-xs')}
                >
                  {useCase}
                </Badge>
              ))}
              {use_cases.length > 2 && (
                <Badge variant='outline' className='text-xs'>
                  +{use_cases.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className='mb-4'>
            <h4 className='text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide'>
              AI Technologies
            </h4>
            <div className='flex flex-wrap gap-1'>
              {technologies.slice(0, 2).map(tech => (
                <Badge
                  key={tech}
                  variant='secondary'
                  className={cn(BadgeColors.technologies, 'text-xs')}
                >
                  {tech}
                </Badge>
              ))}
              {technologies.length > 2 && (
                <Badge variant='outline' className='text-xs'>
                  +{technologies.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Regulations */}
        {regulations.length > 0 && (
          <div className='mb-4'>
            <h4 className='text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide'>
              Regulations
            </h4>
            <div className='flex flex-wrap gap-1'>
              {regulations.slice(0, 3).map(regulation => (
                <Badge
                  key={regulation}
                  variant='secondary'
                  className={cn(BadgeColors.regulations, 'text-xs')}
                >
                  {regulation}
                </Badge>
              ))}
              {regulations.length > 3 && (
                <Badge variant='outline' className='text-xs'>
                  +{regulations.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Investors */}
        {investors.length > 0 && (
          <div className='mb-6'>
            <h4 className='text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1'>
              <Users className='h-3 w-3' />
              Backed By
            </h4>
            <div className='flex flex-wrap gap-1'>
              {investors.slice(0, 2).map(investor => (
                <Badge
                  key={investor}
                  variant='secondary'
                  className={cn(BadgeColors.investors, 'text-xs')}
                >
                  {investor}
                </Badge>
              ))}
              {investors.length > 2 && (
                <Badge variant='outline' className='text-xs'>
                  +{investors.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex items-center gap-2'>
          {onToggleSaved && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onToggleSaved}
              className={cn(
                'flex-1 h-9',
                isSaved
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-gray-400 hover:bg-gray-50'
              )}
            >
              <Heart className='h-4 w-4 mr-2' fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          )}
          {onToggleInterested && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onToggleInterested}
              className={cn(
                'flex-1 h-9',
                isInterested
                  ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                  : 'text-gray-400 hover:bg-gray-50'
              )}
            >
              <Star className='h-4 w-4 mr-2' fill={isInterested ? 'currentColor' : 'none'} />
              {isInterested ? 'Interested' : 'Interest'}
            </Button>
          )}
        </div>

        {website && (
          <Button variant='outline' className='w-full group mt-2' onClick={handleLearnMore}>
            Learn More
            <ExternalLink className='h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform' />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
