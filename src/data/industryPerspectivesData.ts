
import { Brain, Building2, GraduationCap, LineChart, ShieldAlert, Coins, FileText, Scale } from 'lucide-react';

export interface IndustryPerspective {
  name: string;
  role: string;
  bio: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  date: Date; // For sorting by newest to oldest
}

export const industryPerspectives: IndustryPerspective[] = [
  {
    name: "Forbes",
    role: "Agentic AI: The Rise of Autonomous Decisions in the Financial Industry (April 2025)",
    bio: "Agentic AI brings a new era of semi-autonomous decision-making to financial services, where compliance officers will evolve from enforcers to strategic advisors managing AI guardrails.",
    icon: <Coins className="h-8 w-8 opacity-90" />,
    color: "text-blue-600",
    link: "https://www.forbes.com/sites/zennonkapron/2025/04/23/agentic-ai-the-rise-of-autonomous-decisions-in-the-financial-industry/",
    date: new Date("2025-04-23")
  },
  {
    name: "FCA",
    role: "Our Strategy 2025 to 2030 (April 2025)",
    bio: "As firms adopt artificial intelligence, we will strengthen our regulatory approach to ensure these technologies deliver good outcomes while maintaining transparency, safety and accountability.",
    icon: <Scale className="h-8 w-8 opacity-90" />,
    color: "text-indigo-600",
    link: "https://www.fca.org.uk/publication/corporate/our-strategy-2025-30.pdf",
    date: new Date("2025-04-15")
  },
  {
    name: "Protiviti",
    role: "Agentic AI: What It Is and Why Boards Should Care (April 2025)",
    bio: "Boards must now consider governance structures that can support and control agentic systems—AI that can take action on its own—ensuring they align with risk appetite and compliance requirements.",
    icon: <ShieldAlert className="h-8 w-8 opacity-90" />,
    color: "text-purple-600",
    link: "https://www.protiviti.com/sites/default/files/2025-04/protiviti_newsletter-bp186-agentic-ai_global.pdf",
    date: new Date("2025-04-10")
  },
  {
    name: "European Central Bank",
    role: "AI can boost productivity – if firms use it right (March 2025)",
    bio: "Financial institutions that implement AI with proper governance frameworks see up to 25% greater productivity gains than those rushing deployment without adequate compliance controls.",
    icon: <Building2 className="h-8 w-8 opacity-90" />,
    color: "text-green-600",
    link: "https://www.ecb.europa.eu/press/blog/date/2025/html/ecb.blog20250328~60c0a587f7.en.html",
    date: new Date("2025-03-28")
  },
  {
    name: "JPMorgan Chase",
    role: "An Open Letter to Third-Party Suppliers (March 2025)",
    bio: "We require our suppliers to implement appropriate compliance checks, audit trails, and explainability mechanisms for any AI systems that touch our data or decision-making processes.",
    icon: <FileText className="h-8 w-8 opacity-90" />,
    color: "text-orange-600",
    link: "https://www.jpmorgan.com/technology/technology-blog/open-letter-to-our-suppliers",
    date: new Date("2025-03-15")
  },
  {
    name: "McKinsey",
    role: "Governance, Risk, and Compliance: A New Lens on Best Practices (March 2025)",
    bio: "The most effective GRC programs now embed AI capabilities while maintaining human oversight through clear accountability frameworks and continuous monitoring of model outputs.",
    icon: <LineChart className="h-8 w-8 opacity-90" />,
    color: "text-blue-500",
    link: "https://www.mckinsey.com/capabilities/risk-and-resilience/our-insights/governance-risk-and-compliance-a-new-lens-on-best-practices",
    date: new Date("2025-03-10")
  },
  {
    name: "UK Government",
    role: "AI Insights - Agentic AI (February 2025)",
    bio: "Regulatory bodies must develop new frameworks for agentic AI systems that balance innovation with appropriate safeguards, focusing on outcomes rather than prescriptive rules.",
    icon: <Brain className="h-8 w-8 opacity-90" />,
    color: "text-red-600",
    link: "https://assets.publishing.service.gov.uk/media/68076cba8c1316be7978e6a8/AI_Insights_-_Agentic_AI.pdf",
    date: new Date("2025-02-20")
  },
  {
    name: "Bank for International Settlements",
    role: "Governance of AI adoption in central banks (February 2025)",
    bio: "Central banks implementing AI require robust governance frameworks with clear lines of accountability, transparent decision-making processes, and comprehensive risk assessment methodologies.",
    icon: <Building2 className="h-8 w-8 opacity-90" />,
    color: "text-teal-600",
    link: "https://www.bis.org/publ/othp90.pdf",
    date: new Date("2025-02-15")
  },
  {
    name: "Wolters Kluwer",
    role: "Navigating Compliance in the Age of AI: Insights from Risk Experts (January 2025)",
    bio: "77% of compliance officers report that implementing AI requires significant updates to internal controls, with enhanced data governance being the most critical compliance challenge.",
    icon: <GraduationCap className="h-8 w-8 opacity-90" />,
    color: "text-violet-600",
    link: "https://www.wolterskluwer.com/en/expert-insights/navigating-compliance-in-the-age-of-ai-insights-from-risk-experts",
    date: new Date("2025-01-25")
  }
];

// Helper function to get sorted perspectives
export const getSortedPerspectives = () => {
  return [...industryPerspectives].sort((a, b) => b.date.getTime() - a.date.getTime());
};
