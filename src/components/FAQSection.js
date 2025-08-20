import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// React import removed - using modern JSX transform
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
const faqs = [
  {
    question: 'What is Synapses?',
    answer:
      "Synapses is the GRC Intelligence Platform — your personalized workspace for navigating regulations, connecting with compliance professionals, and building intelligent tools like GRC agents. It's where the future of compliance is created."
  },
  {
    question: 'Who is Synapses for?',
    answer:
      "Synapses is designed for compliance officers, risk professionals, regulators, RegTech founders, consultants, auditors, researchers, and educators. Whether you're shaping strategy or testing new tools, Synapses brings the ecosystem together."
  },
  {
    question: 'What is a GRC Agent?',
    answer:
      'GRC Agents are smart, task-specific assistants powered by trusted language models. They help automate or accelerate common compliance tasks — like summarizing regulations, checking audit readiness, or interpreting policy gaps.'
  },
  {
    question: 'Can I create my own compliance AI agent?',
    answer:
      'Yes! Synapses lets you build your own custom agent — choose the LLM (like GPT or Claude), set its focus (e.g., AML, GDPR), define how it responds, and get to work. No code or tech background needed.'
  },
  {
    question: 'What can I do with my Synapses dashboard?',
    answer:
      "Your dashboard is fully customizable — display regulatory calendars, daily insights, badge achievements, community questions, and even live agent performance. It's your control center for compliance work and growth."
  },
  {
    question: 'How does Synapses compare to LinkedIn or GitHub?',
    answer:
      "LinkedIn is for connections. GitHub is for developers. Synapses is for compliance professionals who want both — and more. It's the professional platform for building your GRC identity, tools, and impact."
  },
  {
    question: "I'm not technical — can I still use Synapses?",
    answer:
      "Absolutely. Synapses is built for non-technical users. Whether you're asking questions, customizing dashboards, or training agents, we've made it intuitive, secure, and human-friendly."
  },
  {
    question: 'Is Synapses free?',
    answer:
      'Yes — joining as an early user is completely free. In the future, advanced features (like private workspaces or enterprise dashboards) may be part of a premium plan.'
  },
  {
    question: 'Can I invite my team or organization?',
    answer:
      'Yes. Synapses is perfect for teams — coming soon are features like Team Huddles, compliance challenges, and shared dashboards. Invite your team now to build together.'
  },
  {
    question: 'Can I test upcoming RegTech tools on Synapses?',
    answer:
      'Yes! As a Synapses early user, you can be one of the first to test new RegTech tools built by developers and compliance innovators — and give feedback that helps shape the future of the industry.'
  },
  {
    question: 'When is Synapses launching?',
    answer:
      'Synapses is currently in early access. Our MVP is live with a curated group of GRC professionals. Join today to help shape what comes next. Full launch is expected in late 2025.'
  },
  {
    question: 'What if I have more questions?',
    answer:
      "We'd love to help. Reach out to us directly at help@synapses.ai — or ask inside the Synapses community."
  }
];
const FAQSection = () => {
  return _jsx('section', {
    id: 'faq',
    className: 'py-20 bg-gray-50',
    children: _jsxs('div', {
      className: 'container mx-auto px-4 sm:px-6 lg:px-8',
      children: [
        _jsxs('div', {
          className: 'text-center mb-16',
          children: [
            _jsx('h2', {
              className: 'text-3xl md:text-4xl font-display font-bold mb-4',
              children: 'Frequently Asked Questions'
            }),
            _jsx('p', {
              className: 'text-lg text-gray-600 max-w-3xl mx-auto',
              children:
                'Find answers to common questions about Synapses and how it can transform your GRC experience.'
            })
          ]
        }),
        _jsx('div', {
          className: 'max-w-3xl mx-auto',
          children: _jsx(Accordion, {
            type: 'single',
            collapsible: true,
            className: 'mb-12',
            children: faqs.map((faq, index) =>
              _jsxs(
                AccordionItem,
                {
                  value: `item-${index}`,
                  children: [
                    _jsx(AccordionTrigger, {
                      className: 'text-lg font-medium text-left',
                      children: faq.question
                    }),
                    _jsx(AccordionContent, { className: 'text-gray-600', children: faq.answer })
                  ]
                },
                index
              )
            )
          })
        }),
        _jsx('div', {
          className: 'text-center mt-12',
          children: _jsxs('p', {
            className: 'text-gray-500',
            children: [
              'Still have questions?',
              ' ',
              _jsx('a', {
                href: '#contact',
                className: 'text-synapse-primary font-medium hover:underline',
                children: 'Contact our team'
              })
            ]
          })
        })
      ]
    })
  });
};
export default FAQSection;
