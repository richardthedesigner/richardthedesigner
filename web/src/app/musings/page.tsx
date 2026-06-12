import type {Metadata} from 'next'
import Link from 'next/link'

import {client} from '@/sanity/client'
import {MUSINGS_INDEX_QUERY} from '@/sanity/queries'
import {tagTitle} from '@/lib/tags'
import {formatDate} from '@/lib/date'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Musings',
  description: 'Essays, talks and perspectives by Richard Murphy.',
  alternates: {canonical: '/musings'},
}

export default async function MusingsPage() {
  const musings = await client.fetch(MUSINGS_INDEX_QUERY)

  return (
    <div className="mx-auto w-full max-w-[860px] px-6 py-14 sm:px-8">
      <header className="border-b border-line pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
          Thinking
        </p>
        <h1 className="mt-2 font-display text-[clamp(34px,5vw,56px)] font-medium tracking-[-0.01em]">
          Musings
        </h1>
        <p className="mt-3 max-w-[52ch] text-[15px] text-soft">
          Essays, talks and perspectives. Open-ended and occasional.
        </p>
      </header>

      {musings.length === 0 ? (
        <p className="py-16 font-mono text-sm text-soft">Nothing published yet.</p>
      ) : (
        <ul>
          {musings.map((m) => (
            <li key={m._id} className="border-b border-line">
              <Link
                href={`/musings/${m.slug}`}
                className="group flex flex-col gap-1.5 py-7 transition-[padding] hover:pl-2 focus-visible:pl-2"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-[clamp(22px,2.6vw,30px)] font-medium tracking-[-0.01em] group-hover:text-smalt">
                    {m.title}
                  </h2>
                  {m.publishedAt ? (
                    <time
                      dateTime={m.publishedAt}
                      className="shrink-0 font-mono text-[11.5px] text-soft"
                    >
                      {formatDate(m.publishedAt, {year: 'numeric', month: 'short'})}
                    </time>
                  ) : null}
                </div>
                {m.excerpt ? (
                  <p className="max-w-[58ch] text-[15px] leading-[1.6] text-soft">
                    {m.excerpt}
                  </p>
                ) : null}
                {m.tags?.length ? (
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {m.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line px-2.5 py-[3px] font-mono text-[10.5px] text-soft"
                      >
                        {tagTitle(t)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
