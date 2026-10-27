import type { Metadata } from 'next';
import Script from 'next/script';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { NavShell } from '@/components/nav/NavShell';
import { Footer } from '@/components/layout/Footer';
import { FrameBreak } from '@/components/layout/FrameBreak';
import { GuestLogPrompt } from '@/components/layout/GuestLogPrompt';
import { ClosingBand } from '@/components/layout/ClosingBand';
import { SmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { DeferredAnalytics } from '@/components/providers/DeferredAnalytics';
import { WebMcpTools } from '@/components/providers/WebMcpTools';
import { publishedCatalog } from '@/lib/feeds/catalog';
import { buildSearchIndex } from '@/lib/search';
import { feedAlternateTypes, siteDescription } from '@/lib/seo';

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

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  title: {
    default: 'Chiradeep - Creative Technologist',
    template: '%s - Chiradeep',
  },
  description: siteDescription,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  applicationName: 'Chiradeep',
  authors: [{ name: 'Chiradeep' }],
  creator: 'Chiradeep',
  robots: { index: true, follow: true },
  alternates: { types: feedAlternateTypes },
  openGraph: {
    type: 'website',
    siteName: 'Chiradeep',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
  },
  // PNG from app/icon.tsx for Google Search; SVG kept for modern browsers.
  icons: {
    icon: [
      { url: '/icon', type: 'image/png', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon',
  },
  // Selects the Is Agentic report lens; does not change the score.
  other: {
    'is-agentic-site-type': 'content',
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const [searchIndex, catalog] = await Promise.all([buildSearchIndex(), publishedCatalog()]);
  const webmcpProjects = catalog
    .filter((entry) => entry.kind === 'project')
    .map((entry) => ({ title: entry.title, summary: entry.summary, path: entry.path }));

  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`} suppressHydrationWarning>
      <body>
        <Script id="theme" strategy="beforeInteractive">
          {`(function(){function apply(){try{var root=document.documentElement;if(localStorage.getItem('theme')==='light')root.dataset.theme='light';else root.removeAttribute('data-theme');}catch(e){}}apply();window.addEventListener('pageshow',apply);})();`}
        </Script>
        <SmoothScroll />
        <WebMcpTools projects={webmcpProjects} />
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
        <DeferredAnalytics />
      </body>
    </html>
  );
}
