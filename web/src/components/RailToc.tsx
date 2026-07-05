'use client'

import {useEffect, useState} from 'react'

// Section list for the sticky article rail, with scroll-spy. Targets the
// LongRead step elements by id; highlights whichever crosses the viewport
// centre band.
export function RailToc({
  sections,
}: {
  sections: {key: string; title: string | null}[]
}) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(`s-${s.key}`))
      .filter((el): el is HTMLElement => el !== null)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      {rootMargin: '-45% 0px -45% 0px'},
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sections])

  return (
    <nav aria-label="Sections" className="mt-8 hidden min-h-0 overflow-y-auto md:block">
      <ol className="flex flex-col gap-[7px]">
        {sections.map((s, i) => {
          const isActive = active === `s-${s.key}`
          return (
            <li key={s.key}>
              <a
                href={`#s-${s.key}`}
                aria-current={isActive ? 'true' : undefined}
                className={`flex items-baseline gap-2.5 font-mono text-[11px] transition-colors ${
                  isActive ? 'text-white' : 'text-white/55 hover:text-white/85'
                }`}
              >
                <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="truncate">{s.title}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
