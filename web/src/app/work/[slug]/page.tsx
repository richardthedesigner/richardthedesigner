import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {client} from '@/sanity/client'
import {urlForImage} from '@/sanity/image'
import {WORK_QUERY, WORK_ORDER_QUERY, WORK_SLUGS_QUERY} from '@/sanity/queries'
import {kindLabel} from '@/lib/tags'
import {fallbackFor} from '@/lib/fallbackImages'
import {ArticleRail} from '@/components/ArticleRail'
import {Media} from '@/components/Media'
import {Metrics} from '@/components/Metrics'
import {PortableTextBody} from '@/components/PortableTextBody'
import {Reveal} from '@/components/Reveal'

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await client.fetch(WORK_SLUGS_QUERY)
  return slugs.filter((s) => s.slug).map((s) => ({slug: s.slug as string}))
}

type Params = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {slug} = await params
  const work = await client.fetch(WORK_QUERY, {slug})
  if (!work) return {}

  const description =
    work.standfirst ?? work.description ?? `${kindLabel(work._type)} by Richard Murphy.`
  const ogSource = work.heroMedia?.image ?? work.heroMedia?.poster
  const ogImage = ogSource
    ? urlForImage(ogSource).width(1200).height(630).fit('crop').url()
    : fallbackFor(slug)?.url

  return {
    title: work.title,
    description,
    openGraph: {
      title: work.title ?? undefined,
      description: description ?? undefined,
      type: 'article',
      images: ogImage ? [{url: ogImage, width: 1200, height: 630}] : undefined,
    },
    alternates: {canonical: `/work/${slug}`},
  }
}

export default async function WorkPage({params}: Params) {
  const {slug} = await params
  const [work, order] = await Promise.all([
    client.fetch(WORK_QUERY, {slug}),
    client.fetch(WORK_ORDER_QUERY),
  ])

  if (!work) notFound()

  const list = [...(order?.ordered ?? []), ...(order?.extra ?? [])]
  const idx = list.findIndex((w) => w.slug === slug)
  const prev = idx > 0 ? list[idx - 1] : null
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null

  const lede = work.standfirst ?? work.description ?? null
  const railSubtitle = work.sector ?? work.client ?? work.role ?? null
  const metrics = (work.metrics ?? []).map((m) => ({
    _key: m._key,
    value: m.value,
    label: m.label,
    note: m.note,
  }))

  return (
    <article className="grid grid-cols-1 md:grid-cols-[minmax(280px,30%)_1fr]">
      <ArticleRail
        index={idx >= 0 ? idx : 0}
        title={work.title ?? 'Untitled'}
        subtitle={railSubtitle}
        tags={work.tags}
        prev={prev}
        next={next}
      />

      <div className="canvas-rise min-w-0">
        {/* Hero */}
        <header className="relative h-[56vh] max-h-[640px] min-h-[380px] overflow-hidden bg-smalt-deep">
          {(() => {
            const fb = fallbackFor(slug)
            const heroMedia =
              work.heroMedia ??
              (fb ? {kind: 'image' as const, alt: fb.alt, externalUrl: fb.url} : null)
            return heroMedia ? (
              <div className="hero-zoom absolute inset-0 opacity-50">
                <Media media={heroMedia} fill width={1600} priority sizes="70vw" />
              </div>
            ) : null
          })()}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-smalt/55 to-[#0a1446]/80"
          />
          <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-9 text-white sm:px-11">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/80">
              {kindLabel(work._type)}
            </p>
            <h2 className="mt-2.5 max-w-[16ch] text-[clamp(34px,4.4vw,60px)] font-semibold leading-none tracking-[-0.03em]">
              {work.title}
            </h2>
            {lede ? (
              <p className="mt-4 max-w-[60ch] text-[clamp(16px,1.5vw,20px)] leading-[1.5] text-white/90">
                {lede}
              </p>
            ) : null}
          </div>
        </header>

        {/* Proof points */}
        {metrics.length ? (
          <Reveal>
            <Metrics metrics={metrics} />
          </Reveal>
        ) : null}

        {/* Narrative */}
        {work.body?.length ? (
          <div className="px-6 py-12 sm:px-11">
            <div className="mx-auto max-w-[760px]">
              <PortableTextBody value={work.body} variant="article" />
            </div>
          </div>
        ) : null}

        {/* Gallery */}
        {work.gallery?.length ? (
          <section
            aria-label="Gallery"
            className="grid grid-cols-1 gap-3.5 px-6 pb-14 sm:grid-cols-2 sm:px-11"
          >
            {work.gallery.map((g) => (
              <Reveal as="figure" key={g._key} className="overflow-hidden rounded-md bg-paper-2">
                <Media media={g} width={1000} sizes="(max-width: 640px) 100vw, 50vw" />
                {g.caption ? (
                  <figcaption className="mt-2 px-1 font-mono text-[11.5px] text-soft">
                    {g.caption}
                  </figcaption>
                ) : null}
              </Reveal>
            ))}
          </section>
        ) : null}
      </div>
    </article>
  )
}
