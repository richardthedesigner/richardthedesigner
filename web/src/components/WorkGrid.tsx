'use client'

import {Fragment, useMemo, useState} from 'react'
import Link from 'next/link'

import type {HOME_QUERYResult} from '@/sanity/sanity.types'
import {STORY_TAGS, kindLabel} from '@/lib/tags'
import {fallbackFor} from '@/lib/fallbackImages'
import {Media, type MediaLike} from '@/components/Media'

function cardMedia(work: WorkCard): MediaLike | null {
  // A heroMedia object saved without an actual asset shouldn't suppress the
  // fallback (it would render nothing).
  if (work.heroMedia?.image || work.heroMedia?.videoUrl) return work.heroMedia
  const fb = fallbackFor(work.slug)
  return fb ? {kind: 'image', alt: fb.alt, externalUrl: fb.url} : null
}

// `summary` is projected by HOME_QUERY but typegen hasn't been re-run yet.
type WorkCard = NonNullable<HOME_QUERYResult['ordered']>[number] & {
  summary?: string | null
}

type Filter = 'all' | (typeof STORY_TAGS)[number]['value']

// Mosaic variants. Curated (gridOrder) items cycle through the large
// image-faced treatments; everything else stays a compact text cell.
type CellVariant = 'feature' | 'tall' | 'wide' | 'text'

const FEATURE_PATTERN: CellVariant[] = ['feature', 'tall', 'wide', 'feature', 'wide', 'tall']

// Cap the image-faced cells regardless of how many items gridOrder holds:
// a mosaic where everything is big is uniform all over again.
const MAX_FACES = 6

function variantFor(i: number, featuredCount: number): CellVariant {
  if (i >= featuredCount || i >= MAX_FACES) return 'text'
  return FEATURE_PATTERN[i % FEATURE_PATTERN.length]
}

// Editorial interstitials: proof points breaking the grid rhythm.
// Keyed by the index they appear AFTER. Values must stay CV-true.
const STAT_CELLS: Record<number, {value: string; label: string}> = {
  4: {value: '800 → 8,000+', label: 'venues during my tenure'},
  11: {value: '$1bn+', label: 'processed annually across the platform'},
}

// Verb forms so the masthead sentence stays grammatical:
// "How I work / operate / build / design / transform / craft."
const SENTENCE_WORDS: Record<(typeof STORY_TAGS)[number]['value'], string> = {
  operate: 'operate',
  build: 'build',
  systems: 'design',
  transform: 'transform',
  craft: 'craft',
  play: 'play',
}

export function WorkGrid({
  work,
  featuredCount,
  intro,
}: {
  work: WorkCard[]
  featuredCount: number
  intro: string | null
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const [preview, setPreview] = useState<WorkCard | null>(null)

  const visibleCount = useMemo(
    () =>
      work.filter((w) => filter === 'all' || (w.tags ?? []).includes(filter))
        .length,
    [work, filter],
  )

  return (
    <div className="grid flex-1 grid-cols-1 md:grid-cols-[minmax(320px,36%)_1fr]">
      {/* ---- Masthead (smalt) ---- */}
      <aside className="relative flex flex-col overflow-hidden bg-smalt p-7 text-white md:sticky md:top-0 md:h-screen">
        {/* Blue-washed backdrop: the hovered work's image floods the masthead */}
        {preview && cardMedia(preview) ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 animate-[fade-in_0.35s_ease] opacity-50 mix-blend-multiply"
          >
            <Media media={cardMedia(preview)} fill width={900} sizes="36vw" />
          </div>
        ) : null}

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <p className="font-mono text-xs tracking-[0.05em] text-white/90">
          Richard Murphy — Product Design &amp; Platform Strategy
        </p>

        <h1 className="sr-only">Work — Richard Murphy, product designer</h1>
        <p
          role="group"
          aria-label="Filter the work by theme"
          className="mast-enter mt-8 text-[clamp(22px,2.3vw,34px)] font-semibold leading-[1.18] tracking-[-0.02em]"
        >
          <span className="text-white/90">How I </span>
          <FilterWord
            active={filter === 'all'}
            onSelect={() => setFilter('all')}
          >
            work
          </FilterWord>
          {STORY_TAGS.map((t) => (
            <span key={t.value}>
              <span aria-hidden="true" className="px-0.5 text-white/70">
                {' / '}
              </span>
              <FilterWord
                active={filter === t.value}
                onSelect={() => setFilter(t.value)}
              >
                {SENTENCE_WORDS[t.value]}
              </FilterWord>
            </span>
          ))}
          <span className="text-white/90">.</span>
        </p>

        {/* Preview / intro blurb (text only; the image lives in the backdrop).
            On md+ the aside is h-screen and this block sinks to the bottom via
            justify-end; in normal flow (not absolute) so it can never overlap
            the headline, whatever the viewport height. */}
        <div
          className="mast-enter mt-6 md:flex md:min-h-0 md:flex-1 md:flex-col md:justify-end"
          style={{animationDelay: '0.14s'}}
        >
          {preview ? (
            <div className="animate-[fade-up_0.3s_ease]">
              <p className="font-mono text-[11px] text-white/85">
                {kindLabel(preview._type)}
                {preview.subtitle ? ` · ${preview.subtitle}` : ''}
              </p>
              <div className="mt-1.5 text-[clamp(20px,1.8vw,28px)] font-semibold leading-[1.1] tracking-[-0.02em]">
                {preview.title}
              </div>
              {preview.summary ? (
                <p className="mt-2.5 max-w-[36ch] text-sm leading-[1.5] text-white/90">
                  {preview.summary}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="max-w-[34ch] text-sm text-white/90">
              {intro ||
                'Platforms operated at global scale. Systems built to be AI-native. Years of making the thing, by hand.'}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p
            className="font-mono text-[11px] text-white/90"
            role="status"
            aria-live="polite"
          >
            <span className="text-white">{visibleCount}</span> of {work.length}{' '}
            {work.length === 1 ? 'piece' : 'pieces'}
          </p>
          <nav aria-label="Site" className="font-mono text-[11px]">
            <Link href="/musings" className="py-1 text-white/90 transition-colors hover:text-white">
              Musings
            </Link>
            <span aria-hidden="true" className="px-1.5 text-white/50">/</span>
            <Link href="/info" className="py-1 text-white/90 transition-colors hover:text-white">
              Info
            </Link>
          </nav>
        </div>
        </div>
      </aside>

      {/* ---- Grid ---- */}
      <section aria-label="Selected work" className="work-grid grid grid-flow-dense grid-cols-1 auto-rows-[minmax(180px,1fr)] sm:grid-cols-2 lg:grid-cols-3">
        {work.map((w, i) => {
          const match = filter === 'all' || (w.tags ?? []).includes(filter)
          const stat = STAT_CELLS[i]
          return (
            <Fragment key={w._id}>
              <WorkCellLink
                work={w}
                variant={variantFor(i, featuredCount)}
                dimmed={!match}
                eager={i < 3}
                enterDelay={Math.min(i, 11) * 45}
                onPreview={() => setPreview(w)}
                onClearPreview={() => setPreview((p) => (p === w ? null : p))}
              />
              {stat ? (
                <p className="cell cell-enter flex flex-col justify-end border-r border-b border-line bg-smalt px-3.5 py-3 text-white">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-white/70">
                    In numbers
                  </span>
                  <span className="mt-1 text-[clamp(24px,2vw,32px)] font-bold leading-none tracking-[-0.02em]">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 font-mono text-[10px] text-white/85">
                    {stat.label}
                  </span>
                </p>
              ) : null}
            </Fragment>
          )
        })}
      </section>
    </div>
  )
}

function FilterWord({
  active,
  onSelect,
  children,
}: {
  active: boolean
  onSelect: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={
        active
          ? 'inline-block rounded-md bg-white px-2.5 py-1 text-smalt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
          : 'inline-block cursor-pointer whitespace-nowrap border-b-2 border-white/30 py-1 text-white transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
      }
    >
      {children}
    </button>
  )
}

const SPAN_CLASS: Record<CellVariant, string> = {
  feature: 'min-h-[300px] sm:col-span-2 lg:col-span-2 lg:row-span-2',
  tall: 'min-h-[300px] lg:row-span-2',
  wide: 'min-h-[240px] sm:col-span-2',
  text: '',
}

function WorkCellLink({
  work,
  variant,
  dimmed,
  eager,
  enterDelay,
  onPreview,
  onClearPreview,
}: {
  work: WorkCard
  variant: CellVariant
  dimmed: boolean
  eager: boolean
  enterDelay: number
  onPreview: () => void
  onClearPreview: () => void
}) {
  const media = cardMedia(work)
  const face = variant !== 'text' && media

  const shared = {
    href: `/work/${work.slug}`,
    // `inert` removes dimmed cells from tab order + the a11y tree entirely.
    inert: dimmed || undefined,
    onMouseEnter: onPreview,
    onMouseLeave: onClearPreview,
    onFocus: onPreview,
    onBlur: onClearPreview,
    style: {animationDelay: `${enterDelay}ms`},
  }

  // Image-faced mosaic cell: the work is visible without a hover.
  if (face) {
    return (
      <Link
        {...shared}
        className={`cell cell-enter group relative flex flex-col overflow-hidden border-r border-b border-line bg-smalt-deep p-5 text-white transition-opacity duration-300 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
          SPAN_CLASS[variant]
        } ${dimmed ? 'pointer-events-none opacity-30' : ''}`}
      >
        <span aria-hidden="true" className="absolute inset-0">
          <Media
            media={media}
            fill
            priority={eager}
            width={variant === 'feature' ? 1200 : 800}
            sizes={variant === 'feature' ? '(max-width: 1024px) 100vw, 44vw' : '(max-width: 1024px) 100vw, 22vw'}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-smalt/40 mix-blend-multiply" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
        </span>
        <span className="absolute top-4 right-5 z-10 font-mono text-[9.5px] uppercase tracking-[0.06em] text-white/85">
          {kindLabel(work._type)}
        </span>
        <span
          className={`relative z-10 mt-auto font-semibold leading-[1.1] tracking-[-0.015em] ${
            variant === 'feature' ? 'text-[clamp(20px,1.9vw,28px)]' : 'text-[17px]'
          }`}
        >
          {work.title}
        </span>
        {variant === 'feature' && work.summary ? (
          <span
            aria-hidden="true"
            className="relative z-10 mt-2 max-w-[46ch] text-[13px] leading-[1.5] text-white/90"
          >
            {work.summary}
          </span>
        ) : null}
        {work.subtitle ? (
          <span className="relative z-10 mt-1.5 font-mono text-[10px] text-white/85">
            {work.subtitle}
          </span>
        ) : null}
      </Link>
    )
  }

  return (
    <Link
      {...shared}
      className={`cell cell-enter group relative flex flex-col overflow-hidden border-r border-b border-line bg-paper px-3.5 py-3 transition-[opacity,background-color,color] duration-300 hover:bg-smalt hover:text-white focus-within:bg-smalt focus-within:text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
        dimmed ? 'pointer-events-none opacity-30' : ''
      }`}
    >
      <span className="absolute top-3 right-3.5 z-10 font-mono text-[9.5px] uppercase tracking-[0.06em] text-soft group-hover:text-white/85 group-focus-within:text-white/85">
        {kindLabel(work._type)}
      </span>
      {/* Touch has no hover reveal, so cells carry their imagery directly
          below md; on md+ the preview image lives in the masthead backdrop. */}
      {media ? (
        <span
          aria-hidden="true"
          className="relative -mx-3.5 mt-4 mb-3 block aspect-[16/9] overflow-hidden md:hidden"
        >
          <Media media={media} fill width={640} sizes="100vw" />
        </span>
      ) : null}
      <span className="relative z-10 mt-auto text-[15px] font-semibold leading-[1.12] tracking-[-0.012em]">
        {work.title}
      </span>
      {work.summary ? (
        // Hover/focus enhancement only; hidden from the tree so the link's
        // accessible name stays "kind, title, subtitle" (full standfirst lives
        // on the detail page).
        <span aria-hidden="true" className="relative z-10 mt-0 max-h-0 max-w-[38ch] overflow-hidden text-[12.5px] leading-[1.45] text-white/90 opacity-0 transition-[opacity,max-height,margin-top] duration-300 group-hover:mt-2 group-hover:max-h-28 group-hover:opacity-100 group-focus-within:mt-2 group-focus-within:max-h-28 group-focus-within:opacity-100">
          {work.summary}
        </span>
      ) : null}
      {work.subtitle ? (
        <span className="relative z-10 mt-1 font-mono text-[10px] text-soft group-hover:text-white/90 group-focus-within:text-white/90">
          {work.subtitle}
        </span>
      ) : null}
    </Link>
  )
}
