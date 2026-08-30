'use client'

import {useCallback, useMemo, useState} from 'react'
import Link from 'next/link'

import type {HOME_QUERYResult} from '@/sanity/sanity.types'
import {STORY_TAGS, kindLabel, type StoryTag} from '@/lib/tags'
import {opening} from '@/lib/intro'
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

const FALLBACK_INTRO =
  "I'm Richard Murphy, a product designer and design leader."

export function WorkGrid({
  work,
  intro,
}: {
  work: WorkCard[]
  intro: string | null
}) {
  // Single-select on a plain click; a held modifier combines. An empty set
  // means "everything", so there is no separate `all` state to keep in sync and
  // clearing the last tag lands exactly where `work` does.
  const [filters, setFilters] = useState<ReadonlySet<StoryTag>>(new Set())
  const [preview, setPreview] = useState<WorkCard | null>(null)

  const filtering = filters.size > 0

  // Plain click selects one word, the way a list selection behaves. Combining
  // is deliberate: shift/ctrl/cmd adds to the selection instead of replacing
  // it. (cmd matters on macOS, where ctrl-click is a context menu and never
  // reaches us as a plain click.)
  const select = useCallback((tag: StoryTag, additive: boolean) => {
    setFilters((prev) => {
      if (!additive) {
        // Pressing the sole active word turns it off, so a selection can
        // always be undone without reaching for `work`.
        return prev.size === 1 && prev.has(tag) ? new Set() : new Set([tag])
      }
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }, [])

  const clear = useCallback(() => setFilters(new Set()), [])

  // A piece matches if it carries ANY selected tag: adding words widens the
  // result, matching how the row reads.
  const matches = useCallback(
    (w: WorkCard) =>
      !filtering || (w.tags ?? []).some((t) => filters.has(t as StoryTag)),
    [filters, filtering],
  )

  const visibleCount = useMemo(() => work.filter(matches).length, [work, matches])

  const {lead, rest, truncated} = opening(intro, 2)

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
          {/* Who, first. A visitor arriving cold reads a person before they
              read a control. */}
          <h1 className="mast-enter mt-2 max-w-[18ch] text-[clamp(24px,2.6vw,38px)] font-semibold leading-[1.12] tracking-[-0.022em]">
            {lead || FALLBACK_INTRO}
          </h1>

          {/* Proof, then the hovered piece takes this slot. On md+ the aside is
              h-screen and this block sinks to the bottom via justify-end; in
              normal flow so it can never overlap the headline. */}
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
              <div>
                <p className="max-w-[38ch] text-[15px] leading-[1.55] text-white/90">
                  {rest}
                </p>
                {truncated ? (
                  <p className="mt-4">
                    <Link
                      href="/info"
                      className="font-mono text-[11px] text-white underline underline-offset-4 decoration-white/40 transition-colors hover:decoration-white"
                    >
                      The full story
                    </Link>
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <nav aria-label="Site" className="mt-6 font-mono text-[11px]">
            <Link href="/musings" className="py-1 text-white/90 transition-colors hover:text-white">
              Musings
            </Link>
            <span aria-hidden="true" className="px-1.5 text-white/50">/</span>
            <Link href="/info" className="py-1 text-white/90 transition-colors hover:text-white">
              Info
            </Link>
          </nav>
        </div>
      </aside>

      {/* ---- Work column: control, then grid ---- */}
      <div className="flex min-w-0 flex-col">
        {/* The filter sits with the results it governs, and reads as a label
            now that the reader already knows who "I" is. */}
        <div className="sticky top-0 z-20 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-line bg-paper/95 px-3.5 py-3 backdrop-blur-sm">
          <p
            role="group"
            aria-label="Filter the work by theme. Hold shift or command while choosing to combine themes."
            className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-[13px]"
          >
            {/* The frame stays put and the marked word completes it, so the
                sentence resolves ("How I operate") without `work` appearing
                twice: once as the frame and again as its own option. */}
            <span className="font-mono text-[11px] text-soft">How I</span>
            {/* `work` is the default and the way back to everything, so the
                row carries its own reset and the count stays a count. */}
            <FilterWord active={!filtering} onSelect={() => clear()}>
              work
            </FilterWord>
            {STORY_TAGS.map((t) => (
              <span key={t.value} className="flex items-baseline">
                <span aria-hidden="true" className="text-line">
                  ·
                </span>
                <FilterWord
                  active={filters.has(t.value)}
                  onSelect={(e) =>
                    select(t.value, e.shiftKey || e.ctrlKey || e.metaKey)
                  }
                >
                  {t.value}
                </FilterWord>
              </span>
            ))}
          </p>

          <p
            className="ml-auto font-mono text-[11px] text-soft"
            role="status"
            aria-live="polite"
          >
            <span className="text-ink">{visibleCount}</span> of {work.length}{' '}
            {work.length === 1 ? 'piece' : 'pieces'}
            {/* A modifier is invisible, so say it once, at the only moment it
                becomes useful: one word chosen and a second within reach. */}
            {filters.size === 1 ? (
              <span className="text-soft"> · ⇧-click to add</span>
            ) : null}

          </p>
        </div>

        <section aria-label="Selected work" className="work-grid grid flex-1 grid-cols-1 auto-rows-[minmax(180px,1fr)] sm:grid-cols-2 lg:grid-cols-3">
          {work.map((w, i) => {
            const match = matches(w)
            return (
              <WorkCellLink
                key={w._id}
                work={w}
                dimmed={!match}
                // Only a live filter promotes a cell; with nothing selected the
                // grid stays neutral rather than every cell shouting at once.
                hit={filtering && match}
                enterDelay={Math.min(i, 11) * 45}
                onPreview={() => setPreview(w)}
                onClearPreview={() => setPreview((p) => (p === w ? null : p))}
              />
            )
          })}
        </section>
      </div>
    </div>
  )
}

function FilterWord({
  active,
  onSelect,
  children,
}: {
  active: boolean
  onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={
        active
          ? 'cursor-pointer rounded-md bg-smalt px-2 py-0.5 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-smalt'
          : 'cursor-pointer rounded-md px-2 py-0.5 text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-smalt hover:text-smalt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-smalt'
      }
    >
      {children}
    </button>
  )
}

function WorkCellLink({
  work,
  dimmed,
  hit,
  enterDelay,
  onPreview,
  onClearPreview,
}: {
  work: WorkCard
  dimmed: boolean
  hit: boolean
  enterDelay: number
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
      style={{animationDelay: `${enterDelay}ms`}}
      className={`cell cell-enter group relative flex flex-col overflow-hidden border-r border-b border-line bg-paper px-3.5 py-3 transition-[opacity,background-color,color] duration-300 hover:bg-smalt hover:text-white focus-within:bg-smalt focus-within:text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
        dimmed ? 'cell-dim pointer-events-none' : ''
      } ${hit ? 'cell-hit' : ''}`}
    >
      <span className="cell-kind absolute top-3 right-3.5 z-10 font-mono text-[9.5px] uppercase tracking-[0.06em] text-soft group-hover:text-white/85 group-focus-within:text-white/85">
        {kindLabel(work._type)}
      </span>
      {/* Touch has no hover reveal, so cells carry their imagery directly
          below md; on md+ the preview image lives in the masthead backdrop. */}
      {cardMedia(work) ? (
        <span
          aria-hidden="true"
          className="relative -mx-3.5 mt-4 mb-3 block aspect-[16/9] overflow-hidden md:hidden"
        >
          <Media media={cardMedia(work)} fill width={640} sizes="100vw" />
        </span>
      ) : null}
      <span className="cell-title relative z-10 mt-auto text-[15px] font-semibold leading-[1.12] tracking-[-0.012em]">
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
        <span className="cell-sub relative z-10 mt-1 font-mono text-[10px] text-soft group-hover:text-white/90 group-focus-within:text-white/90">
          {work.subtitle}
        </span>
      ) : null}
    </Link>
  )
}
