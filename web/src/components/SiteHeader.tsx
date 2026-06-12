import Link from 'next/link'

import {LocalTime} from '@/components/LocalTime'

const NAV = [
  {href: '/', label: 'Work'},
  {href: '/musings', label: 'Musings'},
  {href: '/info', label: 'Info'},
]

type Props = {
  title?: string | null
  contactEmail?: string | null
}

export function SiteHeader({title, contactEmail}: Props) {
  return (
    <header className="sticky top-0 z-[90] flex items-center gap-5 border-b border-line bg-paper/90 px-5 py-2.5 backdrop-blur-md">
      <Link
        href="/"
        className="text-[15px] font-bold tracking-[-0.01em] text-ink"
      >
        {title || 'Richard Murphy'}
      </Link>
      <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.08em] text-soft lg:inline">
        Product Design &amp; Platform Strategy
      </span>

      <span className="ml-auto hidden font-mono text-[10.5px] text-soft sm:inline">
        <LocalTime label="Edinburgh" />
      </span>

      <nav aria-label="Primary">
        <ul className="flex items-center gap-5 font-mono text-xs text-soft">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="inline-block py-2 transition-colors hover:text-smalt">
                {item.label}
              </Link>
            </li>
          ))}
          {contactEmail ? (
            <li>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-block rounded-md bg-ink px-3 py-1.5 text-paper transition-colors hover:bg-smalt"
              >
                Get in touch
              </a>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  )
}
