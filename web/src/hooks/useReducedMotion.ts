'use client'

import {useEffect, useState} from 'react'

// Tracks the user's prefers-reduced-motion setting, reactively.
// Defaults to `true` (reduced) until measured, so we never autoplay motion
// before we know the user's preference.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}
