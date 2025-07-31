'use client';

import { motion } from 'framer-motion';
interface Logo {
  src: string;
  alt: string;
}
interface Logos3Props {
  heading?: string;
  logos: Logo[];
}
export const Logos3 = ({
  heading,
  logos
}: Logos3Props) => {
  return (
    <div>
      <h2>{heading}</h2>
      <div className="logos-grid">
        {logos.map((logo, index) => (
          <img key={index} src={logo.src} alt={logo.alt} />
        ))}
      </div>
    </div>
  );
};