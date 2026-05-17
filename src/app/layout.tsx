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
    default: 'Pictalk',
    template: '%s | Pictalk',
  },
  description: 'AAC Communication App for Children',
  applicationName: 'Pictalk',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pictalk',
  },
  formatDetection: {
    telephone: false,
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
        {/* Inline script: apply theme + accessibility classes before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
var t=localStorage.getItem('pictalk-theme');
if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}
else if(t==='light'){document.documentElement.classList.add('light')}
if(localStorage.getItem('pictalk-high-contrast')==='true'){document.documentElement.classList.add('high-contrast')}
else if(localStorage.getItem('pictalk-high-contrast')==='false'){document.documentElement.classList.add('normal-contrast')}
if(localStorage.getItem('pictalk-reduce-motion')==='true'){document.documentElement.classList.add('reduce-motion')}
var ts=localStorage.getItem('pictalk-text-size');if(ts){document.documentElement.style.fontSize=(parseFloat(ts)*100)+'%'}
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
