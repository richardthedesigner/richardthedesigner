// Shared option lists used across schema types.

// The five story tags. These drive the home-page filter AND act as the
// capability taxonomy. One list, one source of truth.
//
// The value is the word the page shows, deliberately: the earlier list used
// `systems` for a control labelled "design" and `play` for one labelled
// "craft", and tags drifted onto the wrong pieces because the editor and the
// page were not naming the same thing.
export const storyTags = [
  {title: 'Operate at scale', value: 'operate'},
  {title: 'Design', value: 'design'},
  {title: 'Build AI-native', value: 'build'},
  {title: 'Transform the org', value: 'transform'},
  {title: 'Run the business', value: 'run'},
]

// Internal workflow state. Not public. Lets the CMS work as a knowledge base
// first: you can see at a glance which pieces are ready to publish.
export const publishingStatus = [
  {title: 'Drafted', value: 'drafted'},
  {title: 'Framed', value: 'framed'},
  {title: 'Sketch', value: 'sketch'},
  {title: 'Name only', value: 'name-only'},
]
