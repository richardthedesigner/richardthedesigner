import type {Metadata} from 'next'
import {Fraunces, IBM_Plex_Sans, IBM_Plex_Mono} from 'next/font/google'

import {client} from '@/sanity/client'
import {LAYOUT_QUERY} from '@/sanity/queries'
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
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
    'Product design and platform strategy. Platforms operated at global scale, systems built to be AI-native.',
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
  const settings = await client.fetch(LAYOUT_QUERY)
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
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  '@id': `${SITE_URL}/#richard`,
                  name: 'Richard Murphy',
                  jobTitle: 'Product Designer & Design Leader',
                  description:
                    'Product design and platform strategy. Formerly Head of Product Design at QikServe and Access Group; founder of Orson, an AI-native venture.',
                  email: settings?.contactEmail
                    ? `mailto:${settings.contactEmail}`
                    : undefined,
                  address: {'@type': 'PostalAddress', addressLocality: 'Edinburgh', addressCountry: 'GB'},
                  url: SITE_URL,
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
