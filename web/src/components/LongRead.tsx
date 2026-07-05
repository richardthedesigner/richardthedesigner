'use client'

import {useEffect, useRef, useState} from 'react'

import type {ReadSection} from '@/lib/portable'
import {Media, type MediaLike} from '@/components/Media'
import {PortableTextBody} from '@/components/PortableTextBody'

export type StageImage = MediaLike & {caption?: string | null}

// Scrollytelling long-read (from the approved bn-article-motion-v2 reference):
// numbered sections on the left, a sticky image stage on the right that
// crossfades as the reader moves between sections. Below md the stage is
// hidden and each section carries its image inline instead. Reduced motion
// collapses the crossfade to an instant swap via the global CSS kill-switch.
export function LongRead({
  sections,
  stage,
}: {
  sections: ReadSection[]
  stage: StageImage[]
}) {
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(Number((e.target as HTMLElement).dataset.step))
          }
        })
      },
      // A narrow horizontal band around the viewport centre decides the
      // active step, so the stage changes when a section crosses the middle.
      {rootMargin: '-45% 0px -45% 0px'},
    )
    steps.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  const imageFor = (i: number): StageImage | null =>
    stage.length ? stage[i % stage.length] : null
  const activeImage = stage.length ? active % stage.length : 0

  return (
    <div ref={rootRef} className="grid grid-cols-1 md:grid-cols-2">
      {/* Steps */}
      <div className="min-w-0 px-6 py-[4vh] sm:px-11">
        {sections.map((s, i) => (
          <section
            key={s.key}
            id={`s-${s.key}`}
            data-step={i}
            className="flex min-h-[62vh] scroll-mt-[20vh] flex-col justify-center py-[7vh]"
          >
            <p aria-hidden="true" className="font-mono text-xs text-smalt">
              {String(i + 1).padStart(2, '0')}
            </p>
            {s.title ? (
              <h2 className="mt-2.5 mb-3.5 max-w-[24ch] text-[clamp(24px,2.4vw,34px)] font-semibold leading-[1.12] tracking-[-0.02em] text-ink">
                {s.title}
              </h2>
            ) : null}
            <PortableTextBody value={s.blocks as never} variant="article" />
            {/* Inline figure for touch/mobile, where the stage is hidden */}
            {imageFor(i) ? (
              <figure
                aria-hidden="true"
                className="relative mt-7 aspect-[4/3] overflow-hidden rounded-md bg-paper-2 md:hidden"
              >
                <Media media={imageFor(i)} fill width={800} sizes="100vw" />
              </figure>
            ) : null}
          </section>
        ))}
      </div>

      {/* Sticky stage */}
      {stage.length ? (
        <div
          aria-hidden="true"
          className="sticky top-0 hidden h-screen overflow-hidden border-l border-line bg-paper-2 md:block"
        >
          {stage.map((m, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${
                activeImage === i ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
              }`}
            >
              <Media media={m} fill width={1400} sizes="50vw" />
              {m.caption ? (
                <span className="absolute bottom-4 left-4 rounded bg-ink/55 px-2.5 py-1.5 font-mono text-[11.5px] text-white backdrop-blur-sm">
                  {m.caption}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
