'use client'

import {useEffect, useState} from 'react'

import {useReducedMotion} from '@/hooks/useReducedMotion'

const FLAP_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&×·'

// Split-flap (Solari departure board) text: characters shuffle, then settle
// left to right. SSR, no-JS and reduced-motion all render the final text, so
// the effect is purely an enhancement. An invisible copy of the final text
// holds the layout so the flicker never reflows the cell.
export function FlapText({
  text,
  delay = 0,
  settleMs = 26,
  className = '',
}: {
  text: string
  /** ms before this instance starts settling (staggers a board of them). */
  delay?: number
  /** ms per character settle, left to right. */
  settleMs?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (reduced) {
      // Settle instantly (via rAF so the state write isn't synchronous in
      // the effect), covering a mid-animation switch to reduced motion.
      const settle = requestAnimationFrame(() => setDisplay(text))
      return () => cancelAnimationFrame(settle)
    }
    let raf = 0
    let start: number | null = null
    const scramble = (settled: number) =>
      text.slice(0, settled) +
      [...text.slice(settled)]
        .map((c) => (/\s/.test(c) ? c : FLAP_CHARS[(Math.random() * FLAP_CHARS.length) | 0]))
        .join('')
    const tick = (now: number) => {
      if (start === null) start = now + delay
      const elapsed = now - start
      const settled = elapsed < 0 ? 0 : Math.floor(elapsed / settleMs)
      if (settled >= text.length) {
        setDisplay(text)
        return
      }
      setDisplay(scramble(settled))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, delay, settleMs, reduced])

  return (
    <span className={`relative inline-block ${className}`} aria-label={text}>
      <span className="invisible">{text}</span>
      <span aria-hidden="true" className="absolute inset-0">
        {display}
      </span>
    </span>
  )
}
