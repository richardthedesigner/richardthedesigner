'use client'

import {useEffect, useRef} from 'react'

// Adds `.in` when the element scrolls into view, driving the CSS reveal
// transition. Under prefers-reduced-motion the CSS shows it immediately, so the
// observer is a progressive enhancement only.
export function Reveal({
  as: Tag = 'div',
  className = '',
  children,
}: {
  as?: 'div' | 'section' | 'figure' | 'aside'
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      {rootMargin: '0px 0px -12% 0px'},
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    // @ts-expect-error dynamic tag is one of a known safe set
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}
