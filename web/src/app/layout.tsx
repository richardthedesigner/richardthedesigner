import type {Metadata} from 'next'
import {Fraunces, IBM_Plex_Sans, IBM_Plex_Mono} from 'next/font/google'

import {client} from '@/sanity/client'
import {LAYOUT_QUERY} from '@/sanity/queries'
import {SITE_URL, jsonLd} from '@/lib/site'
import {SiteFooter} from '@/components/SiteFooter'
import {Ticker} from '@/components/Ticker'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-sans',
  display: 'swap',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

const DEFAULT_TICKER = [
  'Richard Murphy',
  'Product Design & Platform Strategy',
  'richardthedesigner.com',
]

export const revalidate = 60

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Richard Murphy — Product Design & Platform Strategy',
    template: '%s — Richard Murphy',
  },
  description:
    'Richard Murphy is a product designer and design leader in Edinburgh. Six years leading design for hospitality platforms used in 8,000+ locations across 42 countries; now leading alliances at TBSCG, a trustee of Euan’s Guide, and building AI-native products.',
  openGraph: {
    type: 'website',
    siteName: 'Richard Murphy',
    locale: 'en_GB',
  },
  twitter: {card: 'summary_large_image'},
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // The shell must never 500 because the CMS blinked; everything it needs has
  // a static fallback.
  const settings = await client.fetch(LAYOUT_QUERY).catch(() => null)
  const tickerItems =
    settings?.tickerItems && settings.tickerItems.length
      ? settings.tickerItems
      : DEFAULT_TICKER

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  '@id': `${SITE_URL}/#richard`,
                  name: 'Richard Murphy',
                  alternateName: 'Richard the Designer',
                  jobTitle: 'Product Designer & Design Leader',
                  description:
                    'Product designer and design leader. Formerly Head of Product Design at QikServe and Hospitality UX Lead at Access Group; now Alliances Lead at TBSCG, a trustee of the disabled access charity Euan’s Guide, and founder of Orson, an AI-native venture.',
                  // Deliberately no email here: structured data is a pure
                  // harvesting surface. Contact lives behind the JS-assembled
                  // link in the footer.
                  address: {'@type': 'PostalAddress', addressLocality: 'Edinburgh', addressCountry: 'GB'},
                  url: SITE_URL,
                  sameAs: ['https://github.com/richardthedesigner'],
                },
                {
                  '@type': 'WebSite',
                  url: SITE_URL,
                  name: 'Richard Murphy — Product Design & Platform Strategy',
                  publisher: {'@id': `${SITE_URL}/#richard`},
                },
              ],
            }),
          }}
        />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter />
        <Ticker items={tickerItems} />
      </body>
    </html>
  )
}
