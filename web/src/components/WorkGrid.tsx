'use client'

import {useCallback, useMemo, useState} from 'react'
import Link from 'next/link'

import {stegaClean, type StegaBranded} from 'next-sanity'

import type {HOME_QUERYResult} from '@/sanity/sanity.types'
import {STORY_TAGS, kindLabel, type StoryTag} from '@/lib/tags'
import {fallbackFor} from '@/lib/fallbackImages'
import {Media, type MediaLike} from '@/components/Media'

function cardMedia(work: WorkCard): MediaLike | null {
  // A heroMedia object saved without an actual asset shouldn't suppress the
  // fallback (it would render nothing).
  if (work.heroMedia?.image || work.heroMedia?.videoUrl) return work.heroMedia
  const fb = fallbackFor(work.slug)
  return fb ? {kind: 'image', alt: fb.alt, externalUrl: fb.url} : null
}

// StegaBranded because in draft mode every editable string arrives carrying an
// invisible pointer back to its field. That is what makes click-to-edit work,
// so the strings are passed through to the DOM intact and only cleaned where
// they are compared rather than rendered.
// `summary` is projected by HOME_QUERY but typegen hasn't been re-run yet.
type WorkCard = StegaBranded<NonNullable<HOME_QUERYResult['ordered']>[number]> & {
  summary?: string | null
}

// The headline is both the identity and the control, so it cannot come from a
// plain CMS string: each verb is a button and the prose between them is
// structure. Typed against StoryTag, so adding or renaming a tag fails the
// build here rather than silently dropping a clause.
const CLAUSE: Record<StoryTag, string> = {
  operate: ' platforms, ',
  design: ' systems, ',
  build: ' on my own time, ',
  transform: ' how companies work, and ',
  run: ' the odd business.',
}

const PROOF = [
  "Six years across QikServe and Access Group's hospitality platforms, where self-service ordering grew to 8,000+ locations in 42 countries.",
  'Before that, and since: cinemas, retail interiors, furniture, shops of my own.',
]

export function WorkGrid({work}: {work: WorkCard[]}) {
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
  // stegaClean before comparing: an encoded tag never equals a plain one, so
  // without this the filter matches nothing at all in draft mode.
  const matches = useCallback(
    (w: WorkCard) =>
      !filtering ||
      stegaClean(w.tags ?? []).some((t) => filters.has(t as StoryTag)),
    [filters, filtering],
  )

  const visibleCount = useMemo(() => work.filter(matches).length, [work, matches])

  return (
    <div className="grid flex-1 grid-cols-1 md:grid-cols-[min(42vw,760px)_1fr]">
      {/* ---- Panel (smalt) ---- */}
      <aside className="relative flex flex-col justify-end overflow-hidden bg-smalt p-8 text-white sm:p-10 md:sticky md:top-0 md:h-screen">
        {/* Blue-washed backdrop: the hovered work's image floods the panel */}
        {preview && cardMedia(preview) ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 animate-[fade-in_0.35s_ease] opacity-50 mix-blend-multiply"
          >
            <Media media={cardMedia(preview)} fill width={900} sizes="42vw" />
          </div>
        ) : null}

        <div className="relative z-10">
          <p className="sr-only">
            The verbs below filter the work. Hold shift or command while
            choosing to combine them.
          </p>

          <h1 className={`mast-enter mast-sentence ${filtering ? 'is-filtered' : ''}`}>
            I&rsquo;m Richard Murphy, a designer of{' '}
            <SentenceWord active={!filtering} reset onSelect={() => clear()}>
              various things
            </SentenceWord>
            . I{' '}
            {STORY_TAGS.map((t) => (
              <span key={t.value}>
                <SentenceWord
                  active={filters.has(t.value)}
                  onSelect={(e) =>
                    select(t.value, e.shiftKey || e.ctrlKey || e.metaKey)
                  }
                >
                  {t.value}
                </SentenceWord>
                {CLAUSE[t.value]}
              </span>
            ))}
          </h1>

          {/* The count is not drawn, but it still has to be announced. */}
          <p className="sr-only" role="status" aria-live="polite">
            {visibleCount} of {work.length}{' '}
            {work.length === 1 ? 'piece' : 'pieces'} shown
          </p>

          {/* Proof, until a card is hovered and takes the slot. */}
          <div
            className="mast-enter mt-8 max-w-[50ch] text-[16.5px] leading-[1.54] text-white/90"
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
              PROOF.map((line) => (
                <p key={line} className="[&+p]:mt-[11px]">
                  {line}
                </p>
              ))
            )}
          </div>

          <nav
            aria-label="Site"
            className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-medium"
          >
            {/* The reference carries three links, but two of them pointed at
                the same page: there is one About surface, and /info is it. */}
            {[
              {href: '/info', label: 'The full story'},
              {href: '/musings', label: 'Musings'},
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="border-b border-white/60 pb-[3px] text-white transition-colors hover:border-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* ---- Work ---- */}
      <section aria-label="Selected work" className="work-grid grid grid-cols-1 auto-rows-[minmax(180px,1fr)] sm:grid-cols-2 lg:grid-cols-3">
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
  )
}

function SentenceWord({
  active,
  reset = false,
  onSelect,
  children,
}: {
  active: boolean
  reset?: boolean
  onSelect: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      // The pill marks a chosen verb only. The reset keeps its dotted rule in
      // every state, as in the reference: with nothing filtered the sentence
      // simply reads whole, rather than announcing a default.
      className={`${active && !reset ? 'is-on' : ''} ${reset ? 'is-reset' : ''}`}
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
