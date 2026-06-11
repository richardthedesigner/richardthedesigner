// The five story tags. Mirrors studio/schema/shared.ts (one source of truth in
// the CMS; this is the presentation copy + ordering for the frontend filter).
export const STORY_TAGS = [
  {value: 'operate', title: 'Operate at scale', short: 'Operate'},
  {value: 'build', title: 'Build AI-native', short: 'Build w/ AI'},
  {value: 'systems', title: 'Design the system', short: 'Systems'},
  {value: 'transform', title: 'Transform the org', short: 'Transform'},
  {value: 'craft', title: 'Keep craft visible', short: 'Craft'},
] as const

export type StoryTag = (typeof STORY_TAGS)[number]['value']

export function tagTitle(value: string): string {
  return STORY_TAGS.find((t) => t.value === value)?.title ?? value
}

// Human label for a work document type.
export function kindLabel(type: string): string {
  switch (type) {
    case 'caseStudy':
      return 'Case study'
    case 'project':
      return 'Project'
    case 'musing':
      return 'Musing'
    default:
      return 'Work'
  }
}

// Two-digit index label used throughout the grid + article rails.
export function num(i: number): string {
  return String(i + 1).padStart(2, '0')
}
