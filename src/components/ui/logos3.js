'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Logos3 = ({ heading, logos }) => {
    return (_jsxs("div", { className: 'py-12 bg-white', children: [heading && _jsx("h2", { className: 'text-center text-3xl font-bold text-gray-900 mb-8', children: heading }), _jsx("div", { className: 'mx-auto max-w-7xl px-6 lg:px-8', children: _jsx("div", { className: 'mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5', children: logos.map((logo, index) => (_jsx("img", { className: 'col-span-2 max-h-12 w-full object-contain lg:col-span-1', src: logo.src, alt: logo.alt, loading: 'lazy' }, index))) }) })] }));
};
