import Link from 'next/link'

import {tagTitle, num} from '@/lib/tags'

type NavItem = {slug: string | null; title: string | null} | null

export function ArticleRail({
  index,
  title,
  subtitle,
  tags,
  prev,
  next,
}: {
  index: number
  title: string
  subtitle?: string | null
  tags?: string[] | null
  prev: NavItem
  next: NavItem
}) {
  return (
    <aside className="flex flex-col bg-smalt p-7 text-white md:sticky md:top-[49px] md:h-[calc(100vh-49px)]">
      <Link
        href="/"
        className="self-start border-b border-white/40 font-mono text-xs text-white hover:border-white"
      >
        ← Index
      </Link>

      <div
        aria-hidden="true"
        className="mt-9 font-mono text-[58px] leading-[0.9] text-white/70"
      >
        {num(index)}
      </div>
      <h1 className="mt-2.5 text-[clamp(26px,2.5vw,38px)] font-semibold leading-[1.04] tracking-[-0.025em]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 font-mono text-xs text-white/90">{subtitle}</p>
      ) : null}

      {tags?.length ? (
        <ul className="mt-3.5 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/45 px-2.5 py-[3px] font-mono text-[11px]"
            >
              {tagTitle(t)}
            </li>
          ))}
        </ul>
      ) : null}

      <nav
        aria-label="Work navigation"
        className="mt-auto flex justify-between border-t border-smalt-line pt-4 font-mono text-xs"
      >
        {prev?.slug ? (
          <Link href={`/work/${prev.slug}`} className="text-white/90 hover:text-white">
            ← {prev.title}
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {next?.slug ? (
          <Link href={`/work/${next.slug}`} className="text-white/90 hover:text-white">
            {next.title} →
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </nav>
    </aside>
  )
}
