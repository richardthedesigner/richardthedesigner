// The five story tags. Mirrors studio/schema/shared.ts (one source of truth in
// the CMS; this is the presentation copy + ordering for the frontend filter).
//
// `value` is also the word the filter row shows, so there is no separate
// display map left to drift out of step with the schema.
export const STORY_TAGS = [
  {value: 'operate', title: 'Operate at scale', short: 'Operate'},
  {value: 'design', title: 'Design', short: 'Design'},
  {value: 'build', title: 'Build AI-native', short: 'Build w/ AI'},
  {value: 'transform', title: 'Transform the org', short: 'Transform'},
  {value: 'run', title: 'Run the business', short: 'Run'},
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
