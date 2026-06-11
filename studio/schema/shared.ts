// Shared option lists used across schema types.

// The five story tags. These drive the home-page grid filter AND act as the
// capability taxonomy. One list, one source of truth.
export const storyTags = [
  {title: 'Operate at scale', value: 'operate'},
  {title: 'Build AI-native', value: 'build'},
  {title: 'Design the system', value: 'systems'},
  {title: 'Transform the org', value: 'transform'},
  {title: 'Keep craft visible', value: 'craft'},
]

// Internal workflow state. Not public. Lets the CMS work as a knowledge base
// first: you can see at a glance which pieces are ready to publish.
export const publishingStatus = [
  {title: 'Drafted', value: 'drafted'},
  {title: 'Framed', value: 'framed'},
  {title: 'Sketch', value: 'sketch'},
  {title: 'Name only', value: 'name-only'},
]
