import { ExternalLink, MapPin, Calendar, Building, Users } from 'lucide-react';
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
  viewMode: 'grid' | 'list';
  className?: string;
}

const BadgeColors = {
  use_cases: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
  regulations: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
  technologies: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200',
  industries: 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200',
  investors: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-200',
  funding_stage: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200',
};

export function StartupCard({ startup, viewMode, className }: StartupCardProps) {
  const {
    name,
    logo,
    country,
    founded,
    description,
    website,
    use_cases,
    regulations,
    technologies,
    investors,
    funding_stage,
  } = startup;

  const handleLearnMore = () => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className={cn("hover:shadow-md transition-all duration-200", className)}>
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Logo */}
            <div className="shrink-0">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Building className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {country}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Founded {founded}
                    </div>
                    <Badge className={BadgeColors.funding_stage}>
                      {funding_stage}
                    </Badge>
                  </div>
                </div>
                {website && (
                  <Button variant="outline" size="sm" onClick={handleLearnMore}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                )}
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>

              {/* Tags */}
              <div className="space-y-3">
                {use_cases.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-medium text-muted-foreground min-w-20">Use Cases:</span>
                    {use_cases.slice(0, 3).map(useCase => (
                      <Badge key={useCase} variant="secondary" className={BadgeColors.use_cases}>
                        {useCase}
                      </Badge>
                    ))}
                    {use_cases.length > 3 && (
                      <Badge variant="outline">+{use_cases.length - 3} more</Badge>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs font-medium text-muted-foreground min-w-20">Tech:</span>
                      {technologies.slice(0, 2).map(tech => (
                        <Badge key={tech} variant="secondary" className={BadgeColors.technologies}>
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {investors.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        <Users className="h-3 w-3 inline mr-1" />
                      </span>
                      {investors.slice(0, 2).map(investor => (
                        <Badge key={investor} variant="secondary" className={BadgeColors.investors}>
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
    <Card className={cn(
      "hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-fit",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-muted-foreground" />
          </div>
          <Badge className={BadgeColors.funding_stage}>
            {funding_stage}
          </Badge>
        </div>

        <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
          {name}
        </CardTitle>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {country}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {founded}
          </div>
        </div>

        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Use Cases */}
        {use_cases.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Use Cases
            </h4>
            <div className="flex flex-wrap gap-1">
              {use_cases.slice(0, 2).map(useCase => (
                <Badge key={useCase} variant="secondary" className={cn(BadgeColors.use_cases, "text-xs")}>
                  {useCase}
                </Badge>
              ))}
              {use_cases.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{use_cases.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              AI Technologies
            </h4>
            <div className="flex flex-wrap gap-1">
              {technologies.slice(0, 2).map(tech => (
                <Badge key={tech} variant="secondary" className={cn(BadgeColors.technologies, "text-xs")}>
                  {tech}
                </Badge>
              ))}
              {technologies.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{technologies.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Regulations */}
        {regulations.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Regulations
            </h4>
            <div className="flex flex-wrap gap-1">
              {regulations.slice(0, 3).map(regulation => (
                <Badge key={regulation} variant="secondary" className={cn(BadgeColors.regulations, "text-xs")}>
                  {regulation}
                </Badge>
              ))}
              {regulations.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{regulations.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Investors */}
        {investors.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
              <Users className="h-3 w-3" />
              Backed By
            </h4>
            <div className="flex flex-wrap gap-1">
              {investors.slice(0, 2).map(investor => (
                <Badge key={investor} variant="secondary" className={cn(BadgeColors.investors, "text-xs")}>
                  {investor}
                </Badge>
              ))}
              {investors.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{investors.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Learn More Button */}
        {website && (
          <Button 
            variant="outline" 
            className="w-full group" 
            onClick={handleLearnMore}
          >
            Learn More
            <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}