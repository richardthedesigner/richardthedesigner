import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {client} from '@/sanity/client'
import {urlForImage} from '@/sanity/image'
import {WORK_QUERY, WORK_ORDER_QUERY, WORK_SLUGS_QUERY} from '@/sanity/queries'
import {kindLabel} from '@/lib/tags'
import {fallbackFor, fallbackGalleryFor} from '@/lib/fallbackImages'
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

  // Hero media: real Sanity asset wins, themed placeholder otherwise.
  const fb = fallbackFor(slug)
  const heroMedia =
    work.heroMedia ??
    (fb ? {kind: 'image' as const, alt: fb.alt, externalUrl: fb.url} : null)

  // Deterministic layout variant per slug so pages differ but stay stable.
  const variant = (['panorama', 'split', 'poster'] as const)[
    Math.abs([...slug].reduce((a, c) => a * 31 + c.charCodeAt(0), 0)) % 3
  ]

  // Gallery: real images win; otherwise themed placeholders keep the page visual.
  const gallery = work.gallery?.length
    ? work.gallery
    : fallbackGalleryFor(slug).map((g, i) => ({
        _key: `fb-${i}`,
        kind: 'image' as const,
        alt: g.alt,
        caption: null,
        externalUrl: g.url,
      }))
  const metrics = (work.metrics ?? []).map((m) => ({
    _key: m._key,
    value: m.value,
    label: m.label,
    note: m.note,
  }))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <article className="grid grid-cols-1 md:grid-cols-[minmax(280px,30%)_1fr]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: work.title,
            description: lede ?? undefined,
            url: `${siteUrl}/work/${slug}`,
            creator: {'@id': `${siteUrl}/#richard`},
            about: work.sector ?? undefined,
            dateCreated: work.year ? String(work.year) : undefined,
            keywords: work.tags?.join(', ') || undefined,
          }),
        }}
      />
      <ArticleRail
        index={idx >= 0 ? idx : 0}
        title={work.title ?? 'Untitled'}
        subtitle={railSubtitle}
        tags={work.tags}
        prev={prev}
        next={next}
      />

      <div className="canvas-rise min-w-0">
        {/* Hero — three deterministic layout variants */}
        {variant === 'panorama' ? (
          <header className="relative h-[56vh] max-h-[640px] min-h-[380px] overflow-hidden bg-smalt-deep">
            {heroMedia ? (
              <div className="hero-zoom absolute inset-0 opacity-50">
                <Media media={heroMedia} fill width={1600} priority sizes="70vw" />
              </div>
            ) : null}
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
        ) : variant === 'split' ? (
          <header className="grid border-b border-line sm:grid-cols-2">
            <div className="flex flex-col justify-end px-6 py-10 sm:px-11 sm:py-14">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-soft">
                {kindLabel(work._type)}
              </p>
              <h2 className="mt-3 max-w-[14ch] text-[clamp(32px,3.8vw,54px)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
                {work.title}
              </h2>
              {lede ? (
                <p className="mt-4 max-w-[44ch] text-[clamp(15px,1.3vw,18px)] leading-[1.55] text-soft">
                  {lede}
                </p>
              ) : null}
            </div>
            <div className="relative min-h-[320px] overflow-hidden bg-paper-2 sm:min-h-[440px]">
              {heroMedia ? (
                <div className="hero-zoom absolute inset-0">
                  <Media media={heroMedia} fill width={1200} priority sizes="50vw" />
                </div>
              ) : null}
            </div>
          </header>
        ) : (
          <header className="bg-smalt-deep px-6 py-14 text-white sm:px-11 sm:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
              {kindLabel(work._type)}
            </p>
            <h2 className="mt-4 max-w-[12ch] text-[clamp(44px,7vw,96px)] font-semibold leading-[0.95] tracking-[-0.035em]">
              {work.title}
            </h2>
            {lede ? (
              <p className="mt-6 max-w-[52ch] text-[clamp(16px,1.6vw,21px)] leading-[1.5] text-white/85">
                {lede}
              </p>
            ) : null}
          </header>
        )}

        {/* Fact sheet */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-line px-6 py-7 sm:grid-cols-4 sm:px-11">
          {[
            ['Client', work.client],
            ['Role', work.role],
            ['Timeframe', work.timeframe ?? (work.year ? String(work.year) : null)],
            ['Sector', work.sector],
          ]
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-soft">
                  {k}
                </dt>
                <dd className="mt-1.5 text-[14.5px] font-medium leading-snug text-ink">
                  {v}
                </dd>
              </div>
            ))}
        </dl>

        {/* Poster variant gets its image as a full-width band below the facts */}
        {variant === 'poster' && heroMedia ? (
          <div className="relative aspect-[21/9] min-h-[260px] overflow-hidden border-b border-line bg-paper-2">
            <Media media={heroMedia} fill width={1800} priority sizes="100vw" />
          </div>
        ) : null}

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

        {/* Gallery (real images, or themed placeholders until artefacts land) */}
        {gallery.length ? (
          <section
            aria-label="Gallery"
            className="grid grid-cols-1 gap-3.5 px-6 pb-14 sm:grid-cols-2 sm:px-11 [&>*:nth-child(3n)]:sm:col-span-2"
          >
            {gallery.map((g) => (
              <Reveal as="figure" key={g._key} className="overflow-hidden rounded-md bg-paper-2">
                <Media media={g} width={1200} sizes="(max-width: 640px) 100vw, 60vw" />
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
