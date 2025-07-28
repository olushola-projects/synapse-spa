import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Shield, TrendingUp, FileCheck, ArrowRight, Zap, CheckCircle2, Globe } from 'lucide-react';

/**
 * NexusAgentSection component - Showcases the SFDR Navigator on the landing page
 * Provides an overview and call-to-action to try the SFDR compliance validation tool
 */
const NexusAgentSection = () => {
  const features = [{
    icon: <Shield className='w-5 h-5 text-blue-600' />,
    title: 'SFDR Compliance',
    description: 'Real-time validation against EU regulations'
  }, {
    icon: <FileCheck className='w-5 h-5 text-green-600' />,
    title: 'Article Classification',
    description: 'Automated Article 6, 8, and 9 categorization'
  }, {
    icon: <TrendingUp className='w-5 h-5 text-purple-600' />,
    title: 'PAI Analysis',
    description: 'Principal Adverse Impact indicator checking'
  }, {
    icon: <Zap className='w-5 h-5 text-yellow-600' />,
    title: 'Instant Results',
    description: 'Get validation results in under 2 seconds'
  }];
  const stats = [{
    label: 'Accuracy',
    value: '99.2%'
  }, {
    label: 'Processing Time',
    value: '<2s'
  }, {
    label: 'Regulatory Coverage',
    value: 'EU+UK'
  }];
  return;
};
export default NexusAgentSection;