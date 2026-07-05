'use client'

import {memo, useEffect, useState} from 'react'

import {useReducedMotion} from '@/hooks/useReducedMotion'

// Upper + lower case, digits and a couple of board glyphs — the alphabet the
// panels rattle through before landing on the real character.
const FLAP_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&·'

// A single mechanical panel (Solari split-flap). It shows `char`; the top leaf
// is keyed on the character, so whenever the glyph changes React mounts a fresh
// leaf and the fold keyframe replays — the top half dropping into place with
// each flip. Memoised on `char`, so within an animation frame only the panels
// whose glyph actually changed re-render. Reduced motion hides the leaf via CSS.
const Flap = memo(function Flap({char, tone}: {char: string; tone: Tone}) {
  return (
    <span className={`flap ${tone === 'dark' ? 'flap-dark' : ''}`} aria-hidden="true">
      <span className="flap-face">{char}</span>
      <span key={char} className="flap-leaf">
        <span className="flap-leaf-glyph">{char}</span>
      </span>
    </span>
  )
})

type Tone = 'light' | 'dark'

// Split-flap (Solari departure board) line: each character is a mechanical
// panel that flaps through glyphs and settles left-to-right. SSR, no-JS and
// reduced-motion all render the final text immediately — the flap is purely an
// enhancement. Because every panel is a fixed-width monospace cell, whichever
// glyph is showing never changes the line's width, so nothing reflows mid-flip.
export function SplitFlap({
  text,
  delay = 0,
  /** ms per panel before it starts settling — staggers the sweep left to right. */
  stagger = 34,
  /** ms each panel dwells on a glyph before flipping to the next. */
  flipMs = 62,
  /** minimum flips a panel plays before it's allowed to land. */
  minFlips = 6,
  play = true,
  tone = 'light',
  className = '',
}: {
  text: string
  delay?: number
  stagger?: number
  flipMs?: number
  minFlips?: number
  play?: boolean
  tone?: Tone
  className?: string
}) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (reduced || !play) {
      // Settle instantly (via rAF so the write isn't synchronous in the
      // effect), covering a mid-animation switch to reduced motion.
      const id = requestAnimationFrame(() => setDisplay(text))
      return () => cancelAnimationFrame(id)
    }

    const chars = [...text]
    // When each panel is allowed to stop flipping and show its real glyph.
    const settleAt = chars.map((c, i) =>
      /\s/.test(c) ? 0 : delay + minFlips * flipMs + i * stagger,
    )
    const glyphs = chars.slice()
    const last = {value: display}
    let frame = -1
    let start: number | null = null
    let raf = 0

    const tick = (now: number) => {
      if (start === null) start = now
      const t = now - start
      const f = Math.floor(t / flipMs)
      const advance = f !== frame
      frame = f

      let settled = true
      const next = chars
        .map((c, i) => {
          if (/\s/.test(c)) return c
          if (t >= settleAt[i]) return c
          settled = false
          // Only reach for a new glyph on a flip boundary, so the panel reads
          // as discrete flips rather than a per-frame blur.
          if (advance) glyphs[i] = FLAP_CHARS[(Math.random() * FLAP_CHARS.length) | 0]
          return glyphs[i]
        })
        .join('')

      if (settled) {
        setDisplay(text)
        return
      }
      if (next !== last.value) {
        last.value = next
        setDisplay(next)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // `display` is intentionally not a dep: it's read once to seed `last`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay, stagger, flipMs, minFlips, play, reduced])

  return (
    // The wrapper's aria-label is what an ancestor link's accessible name is
    // computed from; every panel below is aria-hidden.
    <span className={`flap-line ${className}`} aria-label={text}>
      {[...display].map((c, i) =>
        /\s/.test(c) ? (
          <span key={i} aria-hidden="true" className="flap-space" />
        ) : (
          <Flap key={i} char={c} tone={tone} />
        ),
      )}
    </span>
  )
}
