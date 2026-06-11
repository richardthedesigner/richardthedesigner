'use client'

import {useEffect, useRef, useState} from 'react'

import {useReducedMotion} from '@/hooks/useReducedMotion'

export type MetricItem = {
  _key: string
  value: string | null
  label: string | null
  note?: string | null
}

// Proof points. Values are free-form strings ("8,000+", "£50m", "WCAG 2.1 AA"),
// so the count-up animates only the leading numeric portion and leaves any
// prefix/suffix intact. Reduced motion shows the final value with no animation.
export function Metrics({metrics}: {metrics: MetricItem[]}) {
  if (!metrics.length) return null
  return (
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px border-b border-line bg-line">
      {metrics.map((m) => (
        <div key={m._key} className="bg-paper p-6">
          <dd className="text-[clamp(28px,3vw,44px)] font-bold tracking-[-0.02em] text-smalt">
            <CountUp value={m.value ?? ''} />
          </dd>
          <dt className="mt-1 font-mono text-xs text-soft">{m.label}</dt>
          {m.note ? (
            <p className="mt-1 font-mono text-[11px] text-soft/80">{m.note}</p>
          ) : null}
        </div>
      ))}
    </dl>
  )
}

function CountUp({value}: {value: string}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = useState(value)

  // Parse "  8,000+ " -> { pre:"", num:8000, post:"+" }
  const match = value.match(/^(\D*)([\d,.]+)(.*)$/)
  const pre = match?.[1] ?? ''
  const numeric = match ? Number(match[2].replace(/,/g, '')) : NaN
  const post = match?.[3] ?? ''
  const animatable = match != null && Number.isFinite(numeric)

  useEffect(() => {
    // Initial state already renders the full value, which is what we want for
    // SSR / no-JS / reduced-motion. Only enhance with a count-up otherwise.
    if (reduced || !animatable) return
    const el = ref.current
    if (!el) return

    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        const dur = 900
        const start = performance.now()
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / dur)
          const eased = 1 - Math.pow(1 - k, 3)
          const n = Math.round(numeric * eased)
          setDisplay(`${pre}${n.toLocaleString('en-GB')}${post}`)
          if (k < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      {rootMargin: '0px 0px -10% 0px'},
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [reduced, animatable, numeric, pre, post, value])

  return <span ref={ref}>{display}</span>
}
