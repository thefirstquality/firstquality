import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const isDarkBg = variant === 'light'; // Light text on dark bg

  return (
    <Link href="/" className={`inline-flex items-center gap-2 group ${className}`}>
      {/* Farm Sprout Icon */}
      <svg
        className="w-8 h-8 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 28C10 21 16 16 23 15M23 15C19 9 11 8 9 13C7 18 10 24 16 26"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 15C27 11 25 5 20 6C15 7 15 12 18 15"
          fill="#22c55e"
          fillOpacity="0.8"
        />
        <circle cx="10" cy="28" r="2" fill="#15803d" />
      </svg>

      {/* Typography */}
      <div className="flex items-center tracking-tight font-sans">
        <span
          className={`text-2xl font-bold transition-colors ${
            isDarkBg ? 'text-white' : 'text-[#0d3a22]'
          }`}
        >
          first
        </span>
        <span className="text-2xl font-extrabold text-[#16a34a]">
          Quality
        </span>
      </div>
    </Link>
  );
}

export default Logo;
