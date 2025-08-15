/**
 * Enhanced SFDR Classification Result Display Component
 * Shows all the new backend features including audit trails, benchmarks, and citations
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  Eye
} from 'lucide-react';
import type { SFDRClassificationResponse } from '@/types/enhanced-classification';

interface EnhancedClassificationResultProps {
  result: SFDRClassificationResponse;
  showAdvancedFeatures?: boolean;
  onExportAuditTrail?: () => void;
}

export const EnhancedClassificationResult: React.FC<EnhancedClassificationResultProps> = ({
  result,
  showAdvancedFeatures = true,
  onExportAuditTrail
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    reasoning: true,
    indicators: true,
    regulatory: true,
    benchmark: false,
    audit: false,
    risk: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getClassificationColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'article 9':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'article 8':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'article 6':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) {
      return 'text-green-600';
    }
    if (confidence >= 0.6) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  const formatProcessingTime = (time?: number) => {
    if (!time) {
      return 'N/A';
    }
    return time < 1 ? `${(time * 1000).toFixed(0)}ms` : `${time.toFixed(2)}s`;
  };

  return (
    <div className='space-y-6'>
      {/* Main Classification Result */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-3'>
              <Shield className='h-6 w-6 text-blue-600' />
              SFDR Classification Result
            </CardTitle>
            {result.audit_trail && onExportAuditTrail && (
              <Button
                variant='outline'
                size='sm'
                onClick={onExportAuditTrail}
                className='flex items-center gap-2'
              >
                <FileText className='h-4 w-4' />
                Export Audit Trail
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Badge
                className={`px-4 py-2 text-lg font-semibold ${getClassificationColor(result.classification)}`}
              >
                {result.classification}
              </Badge>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>Confidence:</span>
                <span className={`font-semibold ${getConfidenceColor(result.confidence)}`}>
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            {result.processing_time && (
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Clock className='h-4 w-4' />
                {formatProcessingTime(result.processing_time)}
              </div>
            )}
          </div>

          {/* Confidence Progress Bar */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Classification Confidence</span>
              <span>{(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <Progress value={result.confidence * 100} className='h-2' />
          </div>

          {/* Sustainability Score (if available) */}
          {result.sustainability_score !== undefined && (
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Sustainability Score</span>
                <span>{(result.sustainability_score * 100).toFixed(1)}%</span>
              </div>
              <Progress value={result.sustainability_score * 100} className='h-2' />
            </div>
          )}

          {/* Explainability Score (if available) */}
          {result.explainability_score !== undefined && (
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='flex items-center gap-2'>
                  <Eye className='h-4 w-4' />
                  Explainability Score
                </span>
                <span>{(result.explainability_score * 100).toFixed(1)}%</span>
              </div>
              <Progress value={result.explainability_score * 100} className='h-2' />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reasoning Section */}
      <Collapsible
        open={expandedSections.reasoning}
        onOpenChange={() => toggleSection('reasoning')}
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className='cursor-pointer hover:bg-gray-50'>
              <CardTitle className='flex items-center justify-between'>
                <span className='flex items-center gap-2'>
                  <Info className='h-5 w-5' />
                  Classification Reasoning
                </span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${expandedSections.reasoning ? 'rotate-180' : ''}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <p className='text-gray-700 leading-relaxed'>{result.reasoning}</p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {showAdvancedFeatures && (
        <>
          {/* Key Indicators */}
          {result.key_indicators && result.key_indicators.length > 0 && (
            <Collapsible
              open={expandedSections.indicators}
              onOpenChange={() => toggleSection('indicators')}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className='cursor-pointer hover:bg-gray-50'>
                    <CardTitle className='flex items-center justify-between'>
                      <span className='flex items-center gap-2'>
                        <CheckCircle className='h-5 w-5' />
                        Key Indicators Found
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${expandedSections.indicators ? 'rotate-180' : ''}`}
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {result.key_indicators.map((indicator, index) => (
                        <Badge key={index} variant='secondary' className='px-3 py-1'>
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}

          {/* Regulatory Basis */}
          {result.regulatory_basis && result.regulatory_basis.length > 0 && (
            <Collapsible
              open={expandedSections.regulatory}
              onOpenChange={() => toggleSection('regulatory')}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className='cursor-pointer hover:bg-gray-50'>
                    <CardTitle className='flex items-center justify-between'>
                      <span className='flex items-center gap-2'>
                        <FileText className='h-5 w-5' />
                        Regulatory Basis & Citations
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${expandedSections.regulatory ? 'rotate-180' : ''}`}
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <ul className='space-y-2'>
                      {result.regulatory_basis.map((basis, index) => (
                        <li key={index} className='flex items-start gap-3'>
                          <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0' />
                          <span className='text-gray-700'>{basis}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}

          {/* Benchmark Comparison */}
          {result.benchmark_comparison && (
            <Collapsible
              open={expandedSections.benchmark}
              onOpenChange={() => toggleSection('benchmark')}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className='cursor-pointer hover:bg-gray-50'>
                    <CardTitle className='flex items-center justify-between'>
                      <span className='flex items-center gap-2'>
                        <TrendingUp className='h-5 w-5' />
                        Benchmark Comparison
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${expandedSections.benchmark ? 'rotate-180' : ''}`}
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className='space-y-4'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                      <div className='text-center p-3 bg-gray-50 rounded-lg'>
                        <div className='text-sm text-gray-600'>Industry Baseline</div>
                        <div className='text-lg font-semibold'>
                          {(result.benchmark_comparison.industry_baseline * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className='text-center p-3 bg-blue-50 rounded-lg'>
                        <div className='text-sm text-gray-600'>Current Score</div>
                        <div className='text-lg font-semibold text-blue-600'>
                          {(result.benchmark_comparison.current_confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className='text-center p-3 bg-green-50 rounded-lg'>
                        <div className='text-sm text-gray-600'>vs Baseline</div>
                        <div
                          className={`text-lg font-semibold ${result.benchmark_comparison.performance_vs_baseline >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {result.benchmark_comparison.performance_vs_baseline >= 0 ? '+' : ''}
                          {(result.benchmark_comparison.performance_vs_baseline * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className='text-center p-3 bg-purple-50 rounded-lg'>
                        <div className='text-sm text-gray-600'>Percentile Rank</div>
                        <div className='text-lg font-semibold text-purple-600'>
                          {result.benchmark_comparison.percentile_rank.toFixed(0)}th
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}

          {/* Risk Factors */}
          {result.risk_factors && result.risk_factors.length > 0 && (
            <Collapsible open={expandedSections.risk} onOpenChange={() => toggleSection('risk')}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className='cursor-pointer hover:bg-gray-50'>
                    <CardTitle className='flex items-center justify-between'>
                      <span className='flex items-center gap-2'>
                        <AlertTriangle className='h-5 w-5' />
                        Risk Assessment
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${expandedSections.risk ? 'rotate-180' : ''}`}
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <ul className='space-y-2'>
                      {result.risk_factors.map((risk, index) => (
                        <li key={index} className='flex items-start gap-3'>
                          <AlertTriangle className='h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0' />
                          <span className='text-gray-700'>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}

          {/* Audit Trail */}
          {result.audit_trail && (
            <Collapsible open={expandedSections.audit} onOpenChange={() => toggleSection('audit')}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className='cursor-pointer hover:bg-gray-50'>
                    <CardTitle className='flex items-center justify-between'>
                      <span className='flex items-center gap-2'>
                        <FileText className='h-5 w-5' />
                        Audit Trail
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${expandedSections.audit ? 'rotate-180' : ''}`}
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className='space-y-3'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='font-medium'>Classification ID:</span>
                        <br />
                        <code className='text-xs bg-gray-100 px-2 py-1 rounded'>
                          {result.audit_trail.classification_id}
                        </code>
                      </div>
                      <div>
                        <span className='font-medium'>Engine Version:</span>
                        <br />
                        <span className='text-gray-600'>{result.audit_trail.engine_version}</span>
                      </div>
                      <div>
                        <span className='font-medium'>Processing Method:</span>
                        <br />
                        <span className='text-gray-600'>{result.audit_trail.method}</span>
                      </div>
                      <div>
                        <span className='font-medium'>Timestamp:</span>
                        <br />
                        <span className='text-gray-600'>
                          {new Date(result.audit_trail.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {result.audit_trail.article_scores && (
                      <>
                        <Separator />
                        <div>
                          <h4 className='font-medium mb-2'>Article Scoring Breakdown:</h4>
                          <div className='space-y-2'>
                            {Object.entries(result.audit_trail.article_scores).map(
                              ([article, score]) => (
                                <div key={article} className='flex items-center justify-between'>
                                  <span className='capitalize'>{article.replace('_', ' ')}</span>
                                  <div className='flex items-center gap-2 w-32'>
                                    <Progress value={score * 100} className='h-2' />
                                    <span className='text-sm text-gray-600 w-12 text-right'>
                                      {(score * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}
        </>
      )}

      {/* Legacy compatibility - show recommendations if available */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5' />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0' />
                  <span className='text-gray-700'>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
