
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface Quote {
  text: string;
  author: string;
  company: string;
  link: string;
}

interface RotatingQuotesProps {
  quotes: Quote[];
  interval?: number;
}

export const RotatingQuotes: React.FC<RotatingQuotesProps> = ({ quotes, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (quotes.length <= 1) return;
    
    const rotationInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, interval);
    
    return () => clearInterval(rotationInterval);
  }, [quotes.length, interval]);
  
  return (
    <div className="relative h-[80px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center justify-center absolute inset-0"
        >
          <p className="text-xl md:text-2xl font-medium text-gray-800 mb-2 text-center">
            "{quotes[currentIndex].text}"
          </p>
          <a 
            href={quotes[currentIndex].link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-synapse-primary transition-colors"
          >
            <span>{quotes[currentIndex].author}, {quotes[currentIndex].company}</span>
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-2">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-synapse-primary' : 'bg-gray-300'
            }`}
            aria-label={`Show quote ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RotatingQuotes;
