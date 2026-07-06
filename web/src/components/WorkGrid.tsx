'use client'

import {Fragment, useMemo, useState, type CSSProperties} from 'react'
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

// Editorial interstitials: proof points that ride the board as their own
// panels, flipping into place alongside the work. Keyed by the index they
// appear AFTER. Values must stay CV-true.
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

// The board opens as a matrix of blank "off" panels; each one flips down to
// reveal its tile, staggered in DOM (reading) order so the reveal sweeps across
// the grid like a departure board updating. Pure CSS: the flap lives in the
// SSR markup over real content, so no-JS and reduced-motion just show the tile.
const FLAP_BASE_MS = 80
const FLAP_STEP_MS = 42
function flapDelay(order: number): string {
  return `${FLAP_BASE_MS + Math.min(order, 26) * FLAP_STEP_MS}ms`
}

// A blank Solari panel — split at the centre seam — that clatters, then clears
// to reveal the tile behind it. `--flap-delay` staggers the whole panel.
function TileFlap({delay}: {delay: string}) {
  return (
    <span
      aria-hidden="true"
      className="tile-flap"
      style={{'--flap-delay': delay} as CSSProperties}
    >
      <span className="flap-lower" />
      <span className="flap-upper-back" />
      <span className="flap-upper" />
    </span>
  )
}

export function WorkGrid({
  work,
  intro,
}: {
  work: WorkCard[]
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

  // Running panel counter for the flip stagger, in DOM order (work cells and
  // the stat interstitials interleaved), so the sweep never jumps around.
  let order = 0

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

      {/* ---- The board: a uniform matrix of flip panels ---- */}
      <section
        aria-label="Selected work"
        className="work-grid grid grid-cols-1 auto-rows-[168px] sm:grid-cols-2 sm:auto-rows-[188px] lg:grid-cols-3 lg:auto-rows-[196px]"
      >
        {work.map((w, i) => {
          const match = filter === 'all' || (w.tags ?? []).includes(filter)
          const stat = STAT_CELLS[i]
          const cellDelay = flapDelay(order++)
          const statDelay = stat ? flapDelay(order++) : ''
          return (
            <Fragment key={w._id}>
              <WorkCellLink
                work={w}
                dimmed={!match}
                eager={i < 6}
                flapDelay={cellDelay}
                onPreview={() => setPreview(w)}
                onClearPreview={() => setPreview((p) => (p === w ? null : p))}
              />
              {stat ? (
                <p className="cell flap-host relative flex flex-col justify-end overflow-hidden border-r border-b border-line bg-smalt px-3.5 py-3 text-white">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-white/70">
                    In numbers
                  </span>
                  <span className="mt-1 text-[clamp(22px,1.9vw,30px)] font-bold leading-none tracking-[-0.02em]">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 font-mono text-[10px] text-white/85">
                    {stat.label}
                  </span>
                  <TileFlap delay={statDelay} />
                </p>
              ) : null}
            </Fragment>
          )
        })}
        {/* Colophon end-cap: the board's footer panel. */}
        <p
          aria-hidden="true"
          className="cell flap-host relative flex flex-col justify-end gap-0.5 overflow-hidden border-r border-b border-line bg-paper px-3.5 py-3"
        >
          <span className="font-mono text-[10px] text-soft">richardthedesigner.com</span>
          <span className="font-mono text-[10px] text-soft">Edinburgh · making things since 2014</span>
          <TileFlap delay={flapDelay(order++)} />
        </p>
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

function WorkCellLink({
  work,
  dimmed,
  eager,
  flapDelay,
  onPreview,
  onClearPreview,
}: {
  work: WorkCard
  dimmed: boolean
  eager: boolean
  /** Staggered delay for this panel's reveal flip. */
  flapDelay: string
  onPreview: () => void
  onClearPreview: () => void
}) {
  const media = cardMedia(work)

  const shared = {
    href: `/work/${work.slug}`,
    // `inert` removes dimmed cells from tab order + the a11y tree entirely.
    inert: dimmed || undefined,
    onMouseEnter: onPreview,
    onMouseLeave: onClearPreview,
    onFocus: onPreview,
    onBlur: onClearPreview,
  }

  // Image panel: the work behind a legibility scrim.
  if (media) {
    return (
      <Link
        {...shared}
        className={`cell flap-host group relative flex flex-col overflow-hidden border-r border-b border-line bg-smalt-deep p-5 text-white transition-opacity duration-300 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
          dimmed ? 'pointer-events-none opacity-30' : ''
        }`}
      >
        <span aria-hidden="true" className="absolute inset-0">
          <Media
            media={media}
            fill
            priority={eager}
            width={800}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 bg-smalt/45 mix-blend-multiply" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/10" />
        </span>
        <span className="absolute top-4 right-5 z-10 font-mono text-[9.5px] uppercase tracking-[0.06em] text-white/85">
          {kindLabel(work._type)}
        </span>
        <span className="relative z-10 mt-auto text-[15px] font-semibold leading-[1.2] tracking-[-0.015em] sm:text-[16px]">
          {work.title}
        </span>
        {work.subtitle ? (
          <span className="relative z-10 mt-1.5 font-mono text-[10px] text-white/85">
            {work.subtitle}
          </span>
        ) : null}
        <TileFlap delay={flapDelay} />
      </Link>
    )
  }

  // Text panel: cream board tile.
  return (
    <Link
      {...shared}
      className={`cell flap-host group relative flex flex-col overflow-hidden border-r border-b border-line bg-paper px-3.5 py-3 transition-colors duration-300 hover:bg-paper-2 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
        dimmed ? 'pointer-events-none opacity-30' : ''
      }`}
    >
      <span className="absolute top-3 right-3.5 z-10 font-mono text-[9.5px] uppercase tracking-[0.06em] text-soft">
        {kindLabel(work._type)}
      </span>
      <span className="relative z-10 mt-auto text-[15px] font-semibold leading-[1.2] tracking-[-0.012em] sm:text-[16px]">
        {work.title}
      </span>
      {work.subtitle ? (
        <span className="relative z-10 mt-1 font-mono text-[10px] text-soft">
          {work.subtitle}
        </span>
      ) : null}
      <TileFlap delay={flapDelay} />
    </Link>
  )
}
