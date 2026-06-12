'use client'

import {useMemo, useState} from 'react'
import Link from 'next/link'

import type {HOME_QUERYResult} from '@/sanity/sanity.types'
import {STORY_TAGS, kindLabel, num} from '@/lib/tags'
import {fallbackFor} from '@/lib/fallbackImages'
import {Media, type MediaLike} from '@/components/Media'

function cardMedia(work: WorkCard): MediaLike | null {
  if (work.heroMedia) return work.heroMedia
  const fb = fallbackFor(work.slug)
  return fb ? {kind: 'image', alt: fb.alt, externalUrl: fb.url} : null
}

type WorkCard = NonNullable<HOME_QUERYResult['ordered']>[number]

type Filter = 'all' | (typeof STORY_TAGS)[number]['value']

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
      <aside className="flex flex-col overflow-hidden bg-smalt p-7 text-white md:sticky md:top-[49px] md:h-[calc(100vh-49px)]">
        <p className="font-mono text-xs tracking-[0.05em] text-white/90">
          Richard Murphy — Product Design &amp; Platform Strategy
        </p>

        <h1 className="mt-8 text-[clamp(22px,2.3vw,34px)] font-semibold leading-[1.18] tracking-[-0.02em]">
          <span className="text-white/90">Show me how I </span>
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
                {t.short.toLowerCase()}
              </FilterWord>
            </span>
          ))}
          <span className="text-white/90">.</span>
        </h1>

        {/* Preview / intro blurb */}
        <div className="relative mt-6 flex-1">
          {preview && cardMedia(preview) ? (
            <div className="absolute inset-x-0 bottom-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                <Media
                  media={cardMedia(preview)}
                  fill
                  width={700}
                  sizes="(max-width: 768px) 100vw, 36vw"
                />
              </div>
              <div className="mt-3">
                <div className="text-lg font-semibold">{preview.title}</div>
                {preview.subtitle ? (
                  <div className="font-mono text-[11.5px] text-white/85">
                    {preview.subtitle}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="absolute bottom-0 max-w-[34ch] text-sm text-white/90">
              {intro ||
                'Platforms operated at global scale. Systems built to be AI-native. Years of making the thing, by hand.'}
            </p>
          )}
        </div>

        <p
          className="mt-4 font-mono text-[11px] text-white/90"
          role="status"
          aria-live="polite"
        >
          <span className="text-white">{visibleCount}</span> of {work.length}{' '}
          {work.length === 1 ? 'piece' : 'pieces'}
        </p>
      </aside>

      {/* ---- Grid ---- */}
      <section aria-label="Selected work" className="grid grid-cols-1 auto-rows-[minmax(180px,1fr)] sm:grid-cols-2 lg:grid-cols-3">
        {work.map((w, i) => {
          const match = filter === 'all' || (w.tags ?? []).includes(filter)
          return (
            <WorkCellLink
              key={w._id}
              work={w}
              index={i}
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
  index,
  dimmed,
  onPreview,
  onClearPreview,
}: {
  work: WorkCard
  index: number
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
      className={`cell group relative flex flex-col overflow-hidden border-r border-b border-line bg-paper px-3.5 py-3 transition-[opacity,color] hover:text-white focus-within:text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
        dimmed ? 'pointer-events-none opacity-30' : 'opacity-100'
      }`}
    >
      {cardMedia(work) ? (
        <div className="cell-media pointer-events-none absolute inset-0">
          <Media
            media={cardMedia(work)}
            fill
            width={600}
            sizes="(max-width: 1024px) 50vw, 33vw"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-smalt opacity-0 mix-blend-multiply transition-opacity duration-200 group-hover:opacity-[0.78] group-focus-within:opacity-[0.78]"
          />
        </div>
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-smalt opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
        />
      )}

      <span className="relative z-10 font-mono text-[10.5px] text-soft group-hover:text-white/85 group-focus-within:text-white/85">
        {num(index)}
      </span>
      <span className="absolute top-3 right-3.5 z-10 font-mono text-[9.5px] uppercase tracking-[0.06em] text-soft group-hover:text-white/85 group-focus-within:text-white/85">
        {kindLabel(work._type)}
      </span>
      <span className="relative z-10 mt-auto text-[15px] font-semibold leading-[1.12] tracking-[-0.012em]">
        {work.title}
      </span>
      {work.subtitle ? (
        <span className="relative z-10 mt-1 font-mono text-[10px] text-soft group-hover:text-white/90 group-focus-within:text-white/90">
          {work.subtitle}
        </span>
      ) : null}
    </Link>
  )
}
