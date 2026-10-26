import type { Metadata } from 'next';
import Script from 'next/script';
import { Fraunces, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { NavShell } from '@/components/nav/NavShell';
import { Footer } from '@/components/layout/Footer';
import { FrameBreak } from '@/components/layout/FrameBreak';
import { GuestLogPrompt } from '@/components/layout/GuestLogPrompt';
import { ClosingBand } from '@/components/layout/ClosingBand';
import { SmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { buildSearchIndex } from '@/lib/search';

const displayFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const sansFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Chiradeep - Creative Technologist',
    template: '%s - Chiradeep',
  },
  description:
    'Chiradeep is a multidisciplinary creative technologist working across AI, web development, music, writing, photography, and research.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  applicationName: 'Chiradeep',
  authors: [{ name: 'Chiradeep' }],
  creator: 'Chiradeep',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Chiradeep',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon',
  },
};

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const searchIndex = await buildSearchIndex();

  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`} suppressHydrationWarning>
      <body>
        <Script id="theme" strategy="beforeInteractive">
          {`(function(){function apply(){try{var root=document.documentElement;if(localStorage.getItem('theme')==='light')root.dataset.theme='light';else root.removeAttribute('data-theme');}catch(e){}}apply();window.addEventListener('pageshow',apply);})();`}
        </Script>
        <SmoothScroll />
        <div className="screen-fade-top" aria-hidden="true" />
        <NavShell searchIndex={searchIndex} />
        <div className="relative">
          <main className="min-h-screen">{children}</main>
          <FrameBreak edge="flow" />
          <ClosingBand />
          <FrameBreak edge="flow" />
          <Footer />
          {/* Drawn last so the lines stay visible over the footer's background, and end with it. */}
          <div aria-hidden="true" className="page-rails" />
        </div>
        <GuestLogPrompt />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
