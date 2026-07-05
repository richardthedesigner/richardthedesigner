import Link from 'next/link'

// Slim wayfinding bar for pages outside the index (Musings, Info): a route
// back to the grid plus the sibling pages, current one marked.
export function PageNav({current}: {current: 'musings' | 'info'}) {
  const link = (active: boolean) =>
    `py-1 transition-colors ${active ? 'text-ink' : 'text-soft hover:text-ink'}`
  return (
    <nav
      aria-label="Site"
      className="flex items-baseline justify-between border-b border-line px-6 py-3.5 font-mono text-[12px] sm:px-8"
    >
      <Link href="/" className="py-1 text-soft transition-colors hover:text-ink">
        ← Index
      </Link>
      <span className="flex gap-6">
        <Link
          href="/musings"
          aria-current={current === 'musings' ? 'page' : undefined}
          className={link(current === 'musings')}
        >
          Musings
        </Link>
        <Link
          href="/info"
          aria-current={current === 'info' ? 'page' : undefined}
          className={link(current === 'info')}
        >
          Info
        </Link>
      </span>
    </nav>
  )
}
