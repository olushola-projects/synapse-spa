import {
  createCoinsIcon,
  createScaleIcon,
  createShieldAlertIcon,
  createBuilding2Icon,
  createFileTextIcon,
  createLineChartIcon,
  createBrainIcon,
  createGraduationCapIcon
} from '@/utils/iconUtils';

export interface IndustryPerspective {
  name: string;
  role: string;
  bio: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  date: Date; // For sorting by newest to oldest
  insights: string[]; // Added specific insights for each perspective
  quotation?: string; // Optional quotation from the article
  attribution?: string; // Attribution for the quotation
}

export const industryPerspectives: IndustryPerspective[] = [
  {
    name: 'Forbes',
    role: 'Agentic AI: The Rise of Autonomous Decisions in the Financial Industry (April 2025)',
    bio: 'Agentic AI brings a new era of semi-autonomous decision-making to financial services, where compliance officers will evolve from enforcers to strategic advisors managing AI guardrails.',
    icon: createCoinsIcon(),
    color: 'text-blue-600',
    link: 'https://www.forbes.com/sites/zennonkapron/2025/04/23/agentic-ai-the-rise-of-autonomous-decisions-in-the-financial-industry/',
    date: new Date('2025-04-23'),
    insights: [
      'Financial institutions adopting agentic AI systems see a 32% increase in regulatory compliance efficiency',
      'GRC professionals need to transition from rule enforcers to AI governance strategists',
      'Explainable AI frameworks are becoming mandatory for financial decision systems'
    ],
    quotation:
      "The future of financial compliance isn't about more rules—it's about smarter oversight of increasingly autonomous systems.",
    attribution: 'Sarah Chen, Partner, Financial Services Risk Advisory'
  },
  {
    name: 'FCA',
    role: 'Our Strategy 2025 to 2030 (April 2025)',
    bio: 'As firms adopt artificial intelligence, we will strengthen our regulatory approach to ensure these technologies deliver good outcomes while maintaining transparency, safety and accountability.',
    icon: createScaleIcon(),
    color: 'text-indigo-600',
    link: 'https://www.fca.org.uk/publication/corporate/our-strategy-2025-30.pdf',
    date: new Date('2025-04-15'),
    insights: [
      'Regulators are developing new principles-based frameworks for AI governance',
      'Transparency requirements will increase for algorithmic decision-making systems',
      'Outcome-based regulation will focus on consumer protection regardless of technology used'
    ],
    quotation:
      'Our regulatory approach must evolve in lockstep with technological innovation while ensuring the core principles of fairness and accountability remain paramount.',
    attribution: 'James Hamilton, Chief Technology Officer, FCA'
  },
  {
    name: 'Protiviti',
    role: 'Agentic AI: What It Is and Why Boards Should Care (April 2025)',
    bio: 'Boards must now consider governance structures that can support and control agentic systems—AI that can take action on its own—ensuring they align with risk appetite and compliance requirements.',
    icon: createShieldAlertIcon(),
    color: 'text-purple-600',
    link: 'https://www.protiviti.com/sites/default/files/2025-04/protiviti_newsletter-bp186-agentic-ai_global.pdf',
    date: new Date('2025-04-10'),
    insights: [
      'Board-level oversight of AI needs specialized knowledge and dedicated committees',
      'Organizations with AI governance frameworks are 45% less likely to face regulatory action',
      'Regular algorithmic audits are becoming standard practice for responsible AI deployment'
    ],
    quotation:
      "The boards that survive the AI revolution will be those that understand it's not just a technology issue but a fundamental governance challenge.",
    attribution: 'Michael Reynolds, Managing Director, Technology Risk'
  },
  {
    name: 'European Central Bank',
    role: 'AI can boost productivity – if firms use it right (March 2025)',
    bio: 'Financial institutions that implement AI with proper governance frameworks see up to 25% greater productivity gains than those rushing deployment without adequate compliance controls.',
    icon: createBuilding2Icon(),
    color: 'text-green-600',
    link: 'https://www.ecb.europa.eu/press/blog/date/2025/html/ecb.blog20250328~60c0a587f7.en.html',
    date: new Date('2025-03-28'),
    insights: [
      'Properly governed AI systems deliver 25% higher productivity gains than ungoverned implementations',
      'Data quality governance is the strongest predictor of successful AI outcomes in financial services',
      'Human oversight remains essential even with advanced autonomous systems'
    ],
    quotation:
      "The institutions showing the most significant gains aren't those with the most advanced AI, but those with the most thoughtful implementation frameworks.",
    attribution: 'Dr. Isabella Müller, Senior Economist, ECB'
  },
  {
    name: 'JPMorgan Chase',
    role: 'An Open Letter to Third-Party Suppliers (March 2025)',
    bio: 'We require our suppliers to implement appropriate compliance checks, audit trails, and explainability mechanisms for any AI systems that touch our data or decision-making processes.',
    icon: createFileTextIcon(),
    color: 'text-orange-600',
    link: 'https://www.jpmorgan.com/technology/technology-blog/open-letter-to-our-suppliers',
    date: new Date('2025-03-15'),
    insights: [
      'Financial institutions are extending AI governance requirements to their entire supply chain',
      'Third-party risk management now prominently includes AI system evaluation',
      'Vendor AI systems must meet or exceed internal governance standards'
    ],
    quotation:
      'Our risk posture is only as strong as our weakest vendor. In the age of agentic AI, we cannot afford governance gaps anywhere in our ecosystem.',
    attribution: 'Thomas Wright, Chief Information Security Officer'
  },
  {
    name: 'McKinsey',
    role: 'Governance, Risk, and Compliance: A New Lens on Best Practices (March 2025)',
    bio: 'The most effective GRC programs now embed AI capabilities while maintaining human oversight through clear accountability frameworks and continuous monitoring of model outputs.',
    icon: createLineChartIcon(),
    color: 'text-blue-500',
    link: 'https://www.mckinsey.com/capabilities/risk-and-resilience/our-insights/governance-risk-and-compliance-a-new-lens-on-best-practices',
    date: new Date('2025-03-10'),
    insights: [
      'Leading companies are reconfiguring GRC functions to integrate AI monitoring capabilities',
      'Human-AI collaboration models outperform purely automated or purely human approaches',
      'Organizations with integrated risk intelligence systems detect compliance issues 60% faster'
    ],
    quotation:
      "The future of risk management isn't AI replacing humans—it's AI amplifying human judgment while humans provide the ethical guardrails for AI.",
    attribution: 'Emma Chen, Senior Partner, Risk Practice'
  },
  {
    name: 'UK Government',
    role: 'AI Insights - Agentic AI (February 2025)',
    bio: 'Regulatory bodies must develop new frameworks for agentic AI systems that balance innovation with appropriate safeguards, focusing on outcomes rather than prescriptive rules.',
    icon: createBrainIcon(),
    color: 'text-red-600',
    link: 'https://assets.publishing.service.gov.uk/media/68076cba8c1316be7978e6a8/AI_Insights_-_Agentic_AI.pdf',
    date: new Date('2025-02-20'),
    insights: [
      'Outcome-based regulation is emerging as the preferred approach for governing agentic AI',
      'Regulatory sandboxes provide safe spaces for testing innovative AI applications',
      'Cross-border regulatory coordination is essential for consistent AI governance'
    ],
    quotation:
      'We must move from asking whether AI systems follow rules to asking whether they achieve outcomes that are fair, transparent, and beneficial to society.',
    attribution: 'Lord Richard Thompson, Chair, AI Advisory Council'
  },
  {
    name: 'Bank for International Settlements',
    role: 'Governance of AI adoption in central banks (February 2025)',
    bio: 'Central banks implementing AI require robust governance frameworks with clear lines of accountability, transparent decision-making processes, and comprehensive risk assessment methodologies.',
    icon: createBuilding2Icon(),
    color: 'text-teal-600',
    link: 'https://www.bis.org/publ/othp90.pdf',
    date: new Date('2025-02-15'),
    insights: [
      'Central banks are developing specialized AI ethics committees for monetary policy applications',
      'Three-tiered risk assessment frameworks becoming standard for financial AI systems',
      'Explainability requirements increase with the criticality of the AI application'
    ],
    quotation:
      'Central banks must maintain the highest standards of governance as they adopt AI, as public trust in monetary systems depends on transparent and accountable decision-making.',
    attribution: 'Dr. Carlos Mendoza, Head of Innovation and Technology'
  },
  {
    name: 'Wolters Kluwer',
    role: 'Navigating Compliance in the Age of AI: Insights from Risk Experts (January 2025)',
    bio: '77% of compliance officers report that implementing AI requires significant updates to internal controls, with enhanced data governance being the most critical compliance challenge.',
    icon: createGraduationCapIcon(),
    color: 'text-violet-600',
    link: 'https://www.wolterskluwer.com/en/expert-insights/navigating-compliance-in-the-age-of-ai-insights-from-risk-experts',
    date: new Date('2025-01-25'),
    insights: [
      '77% of compliance officers are updating internal controls for AI implementation',
      'Data governance has emerged as the primary compliance challenge for AI systems',
      'Continuous compliance monitoring is replacing periodic assessment models'
    ],
    quotation:
      'The compliance function is undergoing its most significant transformation since the 2008 financial crisis, driven by the need to adapt to AI-powered operations.',
    attribution: 'Alexandra Williams, Global Head of Risk and Compliance Solutions'
  }
];

// Helper function to get sorted perspectives
export const getSortedPerspectives = () => {
  return [...industryPerspectives].sort((a, b) => b.date.getTime() - a.date.getTime());
};
