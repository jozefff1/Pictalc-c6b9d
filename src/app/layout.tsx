import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Snakke — AAC Communication App',
    template: '%s | Snakke',
  },
  description:
    'Snakke is a free AAC (Augmentative and Alternative Communication) app. Helps children, adults, and anyone with speech or communication challenges express themselves through pictograms and text-to-speech. Used by therapists, teachers, parents, and researchers.',
  applicationName: 'Snakke',
  keywords: [
    'AAC',
    'augmentative and alternative communication',
    'communication app',
    'autism',
    'speech therapy',
    'pictograms',
    'ARASAAC',
    'non-verbal',
    'speech impairment',
    'text to speech',
    'assistive technology',
    'PWA',
    'offline',
    'free',
  ],
  authors: [{ name: 'Digital Ark AS' }],
  creator: 'Digital Ark AS',
  publisher: 'Digital Ark AS',
  manifest: '/manifest.json',
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'https://snakke.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Snakke',
    title: 'Snakke — AAC Communication App',
    description:
      'Free AAC app for anyone with speech or communication challenges. Icon-based sentences, text-to-speech, offline support, and research tools for therapists and educators.',
    url: '/',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snakke — AAC Communication App',
    description:
      'Free AAC app — pictograms, text-to-speech, offline, and research tools for therapists and educators.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Snakke',
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data — SoftwareApplication schema for AI search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Snakke',
              operatingSystem: 'Web, iOS, Android (PWA)',
              applicationCategory: 'HealthApplication',
              applicationSubCategory: 'Augmentative and Alternative Communication',
              description:
                'Snakke is a free, open-source AAC (Augmentative and Alternative Communication) Progressive Web App. It helps children, adults, and anyone with speech or communication challenges — including autism, cerebral palsy, apraxia, Down syndrome — express themselves through ARASAAC pictograms and text-to-speech synthesis. Used by speech-language therapists, teachers, parents, guardians, and researchers.',
              url: process.env.NEXTAUTH_URL ?? 'https://snakke.app',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              featureList: [
                '89+ ARASAAC pictograms across 6 categories',
                'Icon-based sentence builder with text-to-speech',
                'English and Norwegian language support',
                'Custom icon upload',
                'Offline-first Progressive Web App',
                'Communication session logging',
                'Research data export (anonymised CSV)',
                'Consent-based pairing system for therapists and guardians',
                'Dark mode, high contrast, reduce motion, adjustable text size',
              ],
              audience: {
                '@type': 'Audience',
                audienceType:
                  'Children and adults with communication challenges, speech-language therapists, special education teachers, parents, guardians, and AAC researchers',
              },
              inLanguage: ['en', 'no'],
              accessibilityFeature: [
                'highContrast',
                'largePrint',
                'reduceMotion',
                'textToSpeech',
                'alternativeText',
              ],
              accessibilityHazard: 'none',
              isAccessibleForFree: true,
            }),
          }}
        />
        {/* Inline script: apply theme + accessibility classes before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
var t=localStorage.getItem('snakke-theme');
if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}
else if(t==='light'){document.documentElement.classList.add('light')}
if(localStorage.getItem('snakke-high-contrast')==='true'){document.documentElement.classList.add('high-contrast')}
else if(localStorage.getItem('snakke-high-contrast')==='false'){document.documentElement.classList.add('normal-contrast')}
if(localStorage.getItem('snakke-reduce-motion')==='true'){document.documentElement.classList.add('reduce-motion')}
var ts=localStorage.getItem('snakke-text-size');if(ts){document.documentElement.style.fontSize=(parseFloat(ts)*100)+'%'}
}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
