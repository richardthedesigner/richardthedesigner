// The home page shows only the opening of `siteSettings.intro`: identity, then
// the one proof point. The rest is About-page material and stays whole on
// /info, so the copy lives in the CMS once and is trimmed at the point of use
// rather than duplicated into a second field.

const SENTENCE_END = /(?<=[.!?])\s+/

export function sentences(text: string | null): string[] {
  if (!text?.trim()) return []
  return text.trim().split(SENTENCE_END)
}

export type Opening = {
  /** The identity sentence, promoted to the headline. */
  lead: string
  /** What follows it on the home page: the proof, in supporting type. */
  rest: string
  /** Whether anything was held back, and so whether to offer the full story. */
  truncated: boolean
}

export function opening(text: string | null, keep = 2): Opening {
  const parts = sentences(text)
  return {
    lead: parts[0] ?? '',
    rest: parts.slice(1, keep).join(' '),
    truncated: parts.length > keep,
  }
}
