'use client'

import {Fragment, useEffect, useMemo, useRef, useState} from 'react'
import Link from 'next/link'

import type {HOME_QUERYResult} from '@/sanity/sanity.types'
import {STORY_TAGS, kindLabel} from '@/lib/tags'
import {fallbackFor} from '@/lib/fallbackImages'
import {SplitFlap} from '@/components/SplitFlap'
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
// panels, flapping into place alongside the work. Keyed by the index they
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

// The load choreography. `idle` = settled, no flap (repeat visits within a
// session); `grand` = the once-per-session opening sweep; `quiet` = the brisk
// re-flap when the filter changes.
type Mode = 'idle' | 'grand' | 'quiet'

// Grand sweep: panels rise (cell-enter), then a beat later their titles start
// flapping, cascading left-to-right and down the board.
function flapDelay(mode: Mode, i: number): number {
  if (mode === 'grand') return 300 + Math.min(i, 22) * 55
  if (mode === 'quiet') return Math.min(i, 22) * 12
  return 0
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
  const [mode, setMode] = useState<Mode>('idle')
  const mounted = useRef(false)

  // First paint after mount: run the grand opening once per session; on repeat
  // visits the board is simply present, settled, no theatre.
  useEffect(() => {
    let grand = true
    try {
      grand = !sessionStorage.getItem('board-intro')
      if (grand) sessionStorage.setItem('board-intro', '1')
    } catch {
      // Private mode / storage disabled: just play it.
    }
    // Deliberate: the opening sweep can only be decided client-side (it reads
    // sessionStorage and must not run during SSR), so we settle the mode once
    // after mount rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(grand ? 'grand' : 'idle')
  }, [])

  // Re-flap (briskly) whenever the filter changes — but not on the first render.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    setMode('quiet')
  }, [filter])

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

      {/* ---- The board: a uniform matrix of split-flap panels ---- */}
      <section
        aria-label="Selected work"
        className="work-grid grid grid-cols-1 auto-rows-[168px] sm:grid-cols-2 sm:auto-rows-[188px] lg:grid-cols-3 lg:auto-rows-[196px]"
      >
        {work.map((w, i) => {
          const match = filter === 'all' || (w.tags ?? []).includes(filter)
          const stat = STAT_CELLS[i]
          return (
            <Fragment key={w._id}>
              <WorkCellLink
                work={w}
                dimmed={!match}
                eager={i < 6}
                enterDelay={Math.min(i, 11) * 45}
                flapKey={`${mode}-${filter}`}
                flapPlay={mode !== 'idle'}
                flapDelay={flapDelay(mode, i)}
                onPreview={() => setPreview(w)}
                onClearPreview={() => setPreview((p) => (p === w ? null : p))}
              />
              {stat ? (
                <p className="cell cell-enter flex flex-col justify-end border-r border-b border-line bg-smalt px-3.5 py-3 text-white">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-white/70">
                    In numbers
                  </span>
                  <span className="mt-1 text-[clamp(22px,1.9vw,30px)] font-bold leading-none tracking-[-0.02em]">
                    <SplitFlap
                      key={`${mode}-${filter}`}
                      text={stat.value}
                      tone="dark"
                      play={mode !== 'idle'}
                      delay={flapDelay(mode, i)}
                    />
                  </span>
                  <span className="mt-1.5 font-mono text-[10px] text-white/85">
                    {stat.label}
                  </span>
                </p>
              ) : null}
            </Fragment>
          )
        })}
        {/* Colophon end-cap: the board's footer panel. */}
        <p
          aria-hidden="true"
          className="cell cell-enter flex flex-col justify-end gap-0.5 border-r border-b border-line bg-paper px-3.5 py-3"
        >
          <span className="font-mono text-[10px] text-soft">richardthedesigner.com</span>
          <span className="font-mono text-[10px] text-soft">Edinburgh · making things since 2014</span>
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
  enterDelay,
  flapKey,
  flapPlay,
  flapDelay,
  onPreview,
  onClearPreview,
}: {
  work: WorkCard
  dimmed: boolean
  eager: boolean
  enterDelay: number
  /** Remounts (and so replays) the title flap when the mode or filter changes. */
  flapKey: string
  flapPlay: boolean
  flapDelay: number
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
    style: {animationDelay: `${enterDelay}ms`},
  }

  const title = work.title ? (
    <SplitFlap
      key={flapKey}
      text={work.title}
      tone={media ? 'dark' : 'light'}
      play={flapPlay}
      delay={flapDelay}
    />
  ) : null

  // Image panel: the work rides behind the flapped title, dimmed so the
  // characters stay legible.
  if (media) {
    return (
      <Link
        {...shared}
        className={`cell cell-enter group relative flex flex-col overflow-hidden border-r border-b border-line bg-smalt-deep p-5 text-white transition-opacity duration-300 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
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
          {title}
        </span>
        {work.subtitle ? (
          <span className="relative z-10 mt-1.5 font-mono text-[10px] text-white/85">
            {work.subtitle}
          </span>
        ) : null}
      </Link>
    )
  }

  // Text panel: cream board tile, ink characters.
  return (
    <Link
      {...shared}
      className={`cell cell-enter group relative flex flex-col overflow-hidden border-r border-b border-line bg-paper px-3.5 py-3 transition-colors duration-300 hover:bg-paper-2 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
        dimmed ? 'pointer-events-none opacity-30' : ''
      }`}
    >
      <span className="absolute top-3 right-3.5 z-10 font-mono text-[9.5px] uppercase tracking-[0.06em] text-soft">
        {kindLabel(work._type)}
      </span>
      <span className="relative z-10 mt-auto text-[15px] font-semibold leading-[1.2] tracking-[-0.012em] sm:text-[16px]">
        {title}
      </span>
      {work.subtitle ? (
        <span className="relative z-10 mt-1 font-mono text-[10px] text-soft">
          {work.subtitle}
        </span>
      ) : null}
    </Link>
  )
}
