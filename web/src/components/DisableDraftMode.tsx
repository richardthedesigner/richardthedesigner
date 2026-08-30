'use client'

import {useIsPresentationTool} from 'next-sanity/hooks'

// Inside the Presentation iframe the Studio already owns the draft-mode
// control, so a second one would be noise. This only appears when draft mode
// was opened outside Presentation, where it is the only way back.
export function DisableDraftMode() {
  const isPresentation = useIsPresentationTool()
  if (isPresentation !== false) return null

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 left-4 z-50 rounded-md bg-ink px-3 py-2 font-mono text-[11px] text-white shadow-lg transition-colors hover:bg-smalt"
    >
      Disable draft mode
    </a>
  )
}
