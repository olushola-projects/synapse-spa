
import React from 'react';
import { motion } from 'framer-motion';
import { RotatingQuotes } from './RotatingQuotes';

// Define the quotes data
const perspectiveQuotes = [
  {
    text: "AI is changing the compliance landscape faster than we imagined possible.",
    author: "Jane Smith",
    company: "Global Banking Association",
    link: "https://example.com/article1"
  },
  {
    text: "The future of GRC lies in intelligent automation and human oversight working together.",
    author: "Michael Johnson",
    company: "Regulatory Technology Council",
    link: "https://example.com/article2"
  },
  {
    text: "Synapses is bridging critical gaps between technology and regulatory expertise.",
    author: "Sarah Williams",
    company: "Financial Services Review",
    link: "https://example.com/article3"
  },
  {
    text: "We're seeing unprecedented collaboration between compliance professionals and AI systems.",
    author: "Robert Chen",
    company: "Institute for Regulatory Innovation",
    link: "https://example.com/article4"
  }
];

const IndustryPerspectiveSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold mb-12"
          >
            Perspectives Powering the Future of GRC
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <RotatingQuotes quotes={perspectiveQuotes} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IndustryPerspectiveSection;
