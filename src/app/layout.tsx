import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'firstQuality | Fresh from Local Farms to Your Table',
    template: '%s | firstQuality',
  },
  description:
    'firstQuality is a Kerala-based vegetable sourcing and supply company that works directly with local farmers. We deliver fresh, safe, and quality vegetables to homes, retailers, restaurants and businesses.',
  keywords: [
    'Kerala fresh vegetables',
    'farm to table Kerala',
    'wholesale vegetable supply',
    'fresh cut vegetables',
    'vegetable combo kits',
    'firstQuality',
  ],
  authors: [{ name: 'firstQuality' }],
  openGraph: {
    title: 'firstQuality | Fresh from Local Farms to Your Table',
    description:
      'Sourcing fresh vegetables directly from farmers in Kerala for homes, retailers, and restaurants.',
    url: 'https://firstquality.in',
    siteName: 'firstQuality',
    images: [
      {
        url: '/images/hero-farm-produce.jpg',
        width: 1200,
        height: 630,
        alt: 'firstQuality Fresh Produce',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'firstQuality | Fresh from Local Farms to Your Table',
    description:
      'Direct sourcing of fresh vegetables from Kerala farmers for homes, restaurants & wholesale.',
    images: ['/images/hero-farm-produce.jpg'],
  },
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'firstQuality',
    url: 'https://firstquality.in',
    logo: 'https://firstquality.in/images/logo.svg',
    description:
      'Kerala-based vegetable sourcing and supply company connecting local farmers with households, retailers, and restaurants.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Irinjalakuda, Thrissur',
      addressRegion: 'Kerala',
      addressCountry: 'India',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91 75939 33225',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'ml'],
    },
  };

  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans text-gray-900 bg-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
