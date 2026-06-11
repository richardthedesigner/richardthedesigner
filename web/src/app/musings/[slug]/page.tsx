import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {client} from '@/sanity/client'
import {MUSING_QUERY, MUSING_SLUGS_QUERY} from '@/sanity/queries'
import {formatDate} from '@/lib/date'
import {PortableTextBody} from '@/components/PortableTextBody'

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await client.fetch(MUSING_SLUGS_QUERY)
  return slugs.filter((s) => s.slug).map((s) => ({slug: s.slug as string}))
}

type Params = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {slug} = await params
  const musing = await client.fetch(MUSING_QUERY, {slug})
  if (!musing) return {}
  return {
    title: musing.title,
    description: musing.excerpt ?? undefined,
    openGraph: {title: musing.title ?? undefined, type: 'article'},
    alternates: {canonical: `/musings/${slug}`},
  }
}

export default async function MusingPage({params}: Params) {
  const {slug} = await params
  const musing = await client.fetch(MUSING_QUERY, {slug})
  if (!musing) notFound()

  return (
    <article className="bg-cream">
      <div className="canvas-rise mx-auto max-w-[680px] px-8 py-16 sm:py-24">
        <Link
          href="/musings"
          className="font-mono text-xs text-rust-deep hover:text-warm-ink"
        >
          ← Musings
        </Link>

        <header className="mt-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
            Muse
          </p>
          <h1 className="mt-3 font-display text-[clamp(36px,6vw,72px)] font-medium leading-[1.02] tracking-[-0.01em] text-warm-ink">
            {musing.title}
          </h1>
          {musing.publishedAt ? (
            <time
              dateTime={musing.publishedAt}
              className="mt-4 block font-mono text-xs text-soft"
            >
              {formatDate(musing.publishedAt)}
            </time>
          ) : null}
        </header>

        <div className="muse-essay mt-12">
          <PortableTextBody value={musing.body} variant="muse" />
        </div>

        <p className="mt-12 text-center font-mono text-rust-deep">※</p>
      </div>
    </article>
  )
}
