
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ThumbsUp, ThumbsDown, MessageCircle, BookOpen, AlertCircle, Send, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

// Sample team members for the modal
const teamMembers = [
  {
    name: "Dara Zhang",
    role: "Lead AI Expert",
    avatar: "https://i.pravatar.cc/150?u=dara",
    bio: "Dara leads our AI team with 10+ years of experience in regulatory technology and compliance AI."
  },
  {
    name: "Alex Thompson",
    role: "AML Subject Matter Expert",
    avatar: "https://i.pravatar.cc/150?u=alex",
    bio: "Former compliance officer with 15 years of experience in global financial institutions, specializing in AML regulations."
  },
  {
    name: "Sarah Patel",
    role: "Regulatory Reporting Specialist",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    bio: "8 years of experience in regulatory reporting across multiple jurisdictions, focusing on EU and UK frameworks."
  },
  {
    name: "Michael Chen",
    role: "Legal & Compliance Advisor",
    avatar: "https://i.pravatar.cc/150?u=michael",
    bio: "Corporate lawyer with expertise in translating complex regulations into actionable compliance guidance."
  }
];

// Sample response for the AMLD6 query
const sampleResponse = {
  query: "What is the Penalty under AMLD6 and criminal liability extension?",
  answer: `The 6th Anti-Money Laundering Directive (AMLD6) significantly expanded penalties and criminal liability in several key ways:

1. **Increased Maximum Imprisonment**: AMLD6 establishes a minimum maximum term of imprisonment of at least 4 years for money laundering offenses, up from the previous requirements.

2. **Extended Criminal Liability**: Perhaps most significantly, AMLD6 extends criminal liability to legal persons (companies and organizations) in addition to natural persons (individuals). Companies can now be held criminally liable for money laundering offenses committed for their benefit by individuals in leadership positions or due to lack of supervision.

3. **Expanded Predicate Offenses**: The directive defined 22 specific predicate offenses that constitute money laundering activities, including new additions like cybercrime, environmental crime, and tax crimes.

4. **Additional Sanctions**: Beyond imprisonment, sanctions may include:
   - Exclusion from public benefits or aid
   - Temporary or permanent ban from commercial activities
   - Placement under judicial supervision
   - Judicial winding-up orders
   - Temporary or permanent closure of establishments
   - Fines that can reach up to €5 million or 10% of total annual turnover

**Regulatory Reference**: Articles 6, 7, 8, and 10 of Directive (EU) 2018/1673 of the European Parliament and of the Council of 23 October 2018 on combating money laundering by criminal law.`,
  sources: [
    "Directive (EU) 2018/1673 of the European Parliament and of the Council of 23 October 2018",
    "European Banking Authority Guidelines on AMLD6 Implementation, 2020",
    "European Commission Report on AMLD6 National Implementations, 2021"
  ],
  timestamp: new Date().toISOString(),
  examples: [
    {
      title: "Corporate Liability Example",
      description: "A bank's senior management knowingly approves transactions despite red flags for money laundering. Under AMLD6, both the executives and the bank itself could face criminal liability."
    },
    {
      title: "Cross-Border Application",
      description: "A German company with operations in France fails to implement adequate AML controls. Money laundering occurs through its French subsidiary. The company could face prosecution in both jurisdictions."
    },
    {
      title: "Aiding and Abetting Case",
      description: "A financial advisor provides guidance on how to structure transactions to avoid detection. Under AMLD6, they could be criminally liable even if they didn't directly handle illicit funds."
    }
  ]
};

const AskDara = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (!query.trim()) {
      toast({
        title: "Empty query",
        description: "Please enter your question",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would call your API
    // For now, we'll just simulate a response
    setIsSubmitted(true);
  };

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type);
    
    if (type === "negative") {
      setIsFeedbackDialogOpen(true);
    } else {
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback helps us improve our responses.",
      });
    }
  };

  const submitFeedbackComment = () => {
    // In a real implementation, this would submit to your API
    toast({
      title: "Feedback submitted",
      description: "Thank you for helping us improve!",
    });
    setIsFeedbackDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Ask Dara</h1>
            <p className="text-gray-500 mt-1">
              Get expert answers to your GRC questions
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsTeamDialogOpen(true)}>
            <Info className="w-4 h-4 mr-2" />
            About Dara
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ask Your Question</CardTitle>
            <CardDescription>
              Ask anything about regulatory compliance, AML, risk management, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Example: What are the key changes in AMLD6 compared to AMLD5?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="mb-4"
              disabled={isSubmitted}
            />
            {!isSubmitted && (
              <div className="flex justify-end">
                <Button onClick={handleSubmit}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Question
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {isSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
              <CardDescription>
                Answered by Dara AI with expert oversight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-medium text-gray-800">
                    {sampleResponse.query}
                  </p>
                </div>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-line">
                    {sampleResponse.answer}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <h3 className="flex items-center text-blue-800 font-medium mb-2">
                  <BookOpen className="w-4 h-4 mr-2" /> Examples
                </h3>
                <div className="space-y-3">
                  {sampleResponse.examples.map((example, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-blue-100">
                      <h4 className="font-medium text-blue-900 mb-1">
                        {example.title}
                      </h4>
                      <p className="text-sm text-gray-700">{example.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Sources</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  {sampleResponse.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>

              <Separator className="my-6" />

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800 mb-1">
                    Disclaimer
                  </h3>
                  <p className="text-xs text-amber-700">
                    This information is provided for general guidance only and should not be relied
                    upon as legal advice. The application of regulations may vary based on specific
                    circumstances. Always consult with a qualified legal professional for advice on
                    your particular situation.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="flex gap-2">
                <Button
                  variant={feedback === "positive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFeedback("positive")}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful
                </Button>
                <Button
                  variant={feedback === "negative" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFeedback("negative")}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Not Helpful
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setIsSubmitted(false);
                  setFeedback(null);
                }}
              >
                Ask Another Question
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Team Dialog */}
        <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Meet Dara & The Team</DialogTitle>
              <DialogDescription>
                Dara is powered by AI with oversight from regulatory experts
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={teamMembers[0].avatar} alt={teamMembers[0].name} />
                  <AvatarFallback>{teamMembers[0].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{teamMembers[0].name}</h3>
                  <p className="text-blue-600 text-sm mb-2">{teamMembers[0].role}</p>
                  <p className="text-gray-600">{teamMembers[0].bio}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teamMembers.slice(1).map((member, index) => (
                  <div key={index} className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-blue-600 text-sm mb-1">{member.role}</p>
                    <p className="text-xs text-gray-600">{member.bio}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">How Dara Works</h3>
                <p className="text-sm text-gray-700">
                  Dara combines advanced AI with human expert oversight to provide accurate, up-to-date regulatory guidance.
                  All answers are reviewed for accuracy and include source citations and relevant disclaimers.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setIsTeamDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Feedback Dialog */}
        <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>What could be improved?</DialogTitle>
              <DialogDescription>
                Your feedback helps us improve Dara's responses. What was missing or incorrect?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Please tell us what was incorrect or missing from the response..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitFeedbackComment}>Submit Feedback</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AskDara;
