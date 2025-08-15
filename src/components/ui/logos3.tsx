'use client';

import React from 'react';

interface Logo {
  src: string;
  alt: string;
}

interface Logos3Props {
  heading?: string;
  logos: Logo[];
}

export const Logos3: React.FC<Logos3Props> = ({ heading, logos }) => {
  return (
    <div className="py-12 bg-white">
      {heading && (
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          {heading}
        </h2>
      )}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {logos.map((logo, index) => (
            <img
              key={index}
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
