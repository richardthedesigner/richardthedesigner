import Link from 'next/link'

const NAV = [
  {href: '/', label: 'Work'},
  {href: '/musings', label: 'Musings'},
  {href: '/info', label: 'Info'},
]

type Props = {
  title?: string | null
}

export function SiteHeader({title}: Props) {
  return (
    <header className="sticky top-0 z-[90] flex items-center gap-6 border-b border-line bg-paper/90 px-5 py-2.5 backdrop-blur-md">
      <Link
        href="/"
        className="text-[15px] font-bold tracking-[-0.01em] text-ink"
      >
        {title || 'Richard Murphy'}
      </Link>
      <nav aria-label="Primary" className="ml-auto">
        <ul className="flex gap-5 font-mono text-xs text-soft">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="transition-colors hover:text-smalt">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
