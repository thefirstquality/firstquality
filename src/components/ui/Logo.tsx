import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const isDarkBg = variant === 'light';
  const logoSrc = isDarkBg ? '/images/logo-clean-white.png' : '/images/logo-clean.png';

  return (
    <Link href="/" className={`inline-flex items-center group ${className}`}>
      <Image
        src={logoSrc}
        alt="firstQuality"
        width={160}
        height={49}
        priority
        className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </Link>
  );
}

export default Logo;
