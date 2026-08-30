import Link from 'next/link'

import {sanityFetch} from '@/sanity/live'
import {LocalTime} from '@/components/LocalTime'
import {ObfuscatedEmail} from '@/components/ObfuscatedEmail'

const FOOTER_QUERY = `*[_id == "siteSettings"][0]{contactEmail, locations}`

type FooterSettings = {
  contactEmail?: string | null
  locations?: string[] | null
}

const NAV = [
  {href: '/', label: 'Work'},
  {href: '/musings', label: 'Musings'},
  {href: '/info', label: 'Info'},
]

// Sitewide footer: a compact contact band. The bio lives in the home
// masthead and on /info — repeating it here read as noise, so the footer's
// only jobs are the email CTA, primary nav and a sense of place.
export async function SiteFooter() {
  const s = await sanityFetch({query: FOOTER_QUERY})
    .then((r) => r.data as FooterSettings)
    .catch(() => null)

  return (
    <footer className="bg-smalt px-6 py-12 text-white sm:px-11">
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/90">
            Get in touch
          </p>
          {s?.contactEmail ? (
            <span className="mt-4 inline-block">
              <ObfuscatedEmail
                user={s.contactEmail.split('@')[0]}
                domain={s.contactEmail.split('@')[1] ?? ''}
                className="inline-block border-b-2 border-white/70 pb-1 text-[clamp(22px,3.2vw,38px)] font-semibold tracking-[-0.02em] transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              />
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-5 md:items-end md:text-right">
          <nav aria-label="Site">
            <ul className="flex gap-x-6 font-mono text-[13px]">
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
