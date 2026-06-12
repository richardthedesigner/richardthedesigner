import Link from 'next/link'

import {client} from '@/sanity/client'
import {LocalTime} from '@/components/LocalTime'

const FOOTER_QUERY = `*[_id == "siteSettings"][0]{intro, contactEmail, locations}`

type FooterSettings = {
  intro?: string | null
  contactEmail?: string | null
  locations?: string[] | null
}

const NAV = [
  {href: '/', label: 'Work'},
  {href: '/musings', label: 'Musings'},
  {href: '/info', label: 'Info'},
]

// Sitewide footer: the about text and contact live here (no global header).
export async function SiteFooter() {
  const s = await client.fetch<FooterSettings>(FOOTER_QUERY)

  return (
    <footer className="bg-smalt px-6 py-14 text-white sm:px-11">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/90">
            About
          </p>
          {s?.intro ? (
            <p className="mt-4 max-w-[58ch] text-[15.5px] leading-[1.65] text-white/90">
              {s.intro}
            </p>
          ) : null}
          {s?.contactEmail ? (
            <a
              href={`mailto:${s.contactEmail}`}
              className="mt-9 inline-block border-b-2 border-white/70 pb-1 text-[clamp(22px,3.2vw,38px)] font-semibold tracking-[-0.02em] transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {s.contactEmail}
            </a>
          ) : null}
        </div>

        <div className="flex flex-col justify-between gap-8 md:items-end md:text-right">
          <nav aria-label="Site">
            <ul className="space-y-1.5 font-mono text-[13px]">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-white/90 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="font-mono text-[11px] text-white/90">
            <LocalTime label={s?.locations?.[0] ?? 'Edinburgh, UK'} />
          </p>
        </div>
      </div>
    </footer>
  )
}
