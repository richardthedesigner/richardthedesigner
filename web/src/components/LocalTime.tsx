'use client'

import {useEffect, useState} from 'react'

function now() {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  }).format(new Date())
}

/** Small "Edinburgh — 09:14" stamp. Renders empty on the server to avoid
 *  hydration mismatch, then ticks once a minute. */
export function LocalTime({label}: {label: string}) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setTime(now())
    const t = setTimeout(tick, 0)
    const id = setInterval(tick, 60_000)
    return () => {
      clearTimeout(t)
      clearInterval(id)
    }
  }, [])

  return (
    <span suppressHydrationWarning>
      {label}
      {time ? ` — ${time}` : ''}
    </span>
  )
}
