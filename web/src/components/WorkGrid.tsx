'use client'

import {useMemo, useState} from 'react'
import Link from 'next/link'

import type {HOME_QUERYResult} from '@/sanity/sanity.types'
import {STORY_TAGS, kindLabel} from '@/lib/tags'
import {fallbackFor} from '@/lib/fallbackImages'
import {Media, type MediaLike} from '@/components/Media'

function cardMedia(work: WorkCard): MediaLike | null {
  if (work.heroMedia) return work.heroMedia
  const fb = fallbackFor(work.slug)
  return fb ? {kind: 'image', alt: fb.alt, externalUrl: fb.url} : null
}

// `summary` is projected by HOME_QUERY but typegen hasn't been re-run yet.
type WorkCard = NonNullable<HOME_QUERYResult['ordered']>[number] & {
  summary?: string | null
}

type Filter = 'all' | (typeof STORY_TAGS)[number]['value']

// Verb forms so the masthead sentence stays grammatical:
// "How I work / operate / build / design / transform / craft."
const SENTENCE_WORDS: Record<(typeof STORY_TAGS)[number]['value'], string> = {
  operate: 'operate',
  build: 'build',
  systems: 'design',
  transform: 'transform',
  craft: 'craft',
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

        <h1 className="mt-8 text-[clamp(22px,2.3vw,34px)] font-semibold leading-[1.18] tracking-[-0.02em]">
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
        </h1>

        {/* Preview / intro blurb (text only; the image lives in the backdrop) */}
        <div className="relative mt-6 flex-1">
          {preview ? (
            <div className="absolute inset-x-0 bottom-0 animate-[fade-up_0.3s_ease]">
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
            <p className="absolute bottom-0 max-w-[34ch] text-sm text-white/90">
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
            <Link href="/musings" className="py-1 text-white/80 transition-colors hover:text-white">
              Musings
            </Link>
            <span aria-hidden="true" className="px-1.5 text-white/50">/</span>
            <Link href="/info" className="py-1 text-white/80 transition-colors hover:text-white">
              Info
            </Link>
          </nav>
        </div>
        </div>
      </aside>

      {/* ---- Grid ---- */}
      <section aria-label="Selected work" className="work-grid grid grid-cols-1 auto-rows-[minmax(180px,1fr)] sm:grid-cols-2 lg:grid-cols-3">
        {work.map((w) => {
          const match = filter === 'all' || (w.tags ?? []).includes(filter)
          return (
            <WorkCellLink
              key={w._id}
              work={w}
              dimmed={!match}
              onPreview={() => setPreview(w)}
              onClearPreview={() => setPreview((p) => (p === w ? null : p))}
            />
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
          ? 'inline-block rounded-md bg-white px-2.5 py-1 text-smalt'
          : 'inline-block cursor-pointer whitespace-nowrap border-b-2 border-white/30 py-1 text-white transition-colors hover:border-white'
      }
    >
      {children}
    </button>
  )
}

function WorkCellLink({
  work,
  dimmed,
  onPreview,
  onClearPreview,
}: {
  work: WorkCard
  dimmed: boolean
  onPreview: () => void
  onClearPreview: () => void
}) {
  return (
    <Link
      href={`/work/${work.slug}`}
      // `inert` removes dimmed cells from tab order + the a11y tree entirely.
      inert={dimmed || undefined}
      onMouseEnter={onPreview}
      onMouseLeave={onClearPreview}
      onFocus={onPreview}
      onBlur={onClearPreview}
      className={`cell group relative flex flex-col overflow-hidden border-r border-b border-line bg-paper px-3.5 py-3 transition-[opacity,background-color,color] duration-300 hover:bg-smalt hover:text-white focus-within:bg-smalt focus-within:text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
        dimmed ? 'pointer-events-none opacity-30' : ''
      }`}
    >
      <span className="absolute top-3 right-3.5 z-10 font-mono text-[9.5px] uppercase tracking-[0.06em] text-soft group-hover:text-white/85 group-focus-within:text-white/85">
        {kindLabel(work._type)}
      </span>
      <span className="relative z-10 mt-auto text-[15px] font-semibold leading-[1.12] tracking-[-0.012em]">
        {work.title}
      </span>
      {work.summary ? (
        <span className="relative z-10 mt-0 max-h-0 max-w-[38ch] overflow-hidden text-[12.5px] leading-[1.45] text-white/90 opacity-0 transition-[opacity,max-height,margin-top] duration-300 group-hover:mt-2 group-hover:max-h-28 group-hover:opacity-100 group-focus-within:mt-2 group-focus-within:max-h-28 group-focus-within:opacity-100">
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
