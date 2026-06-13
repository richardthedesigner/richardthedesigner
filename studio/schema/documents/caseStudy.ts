import {defineType, defineField} from 'sanity'
import {storyTags, publishingStatus} from '../shared'

// The flagship narrative type. Problem, role, strategy, process, outcome, evidence.
export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Meta & display'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'standfirst',
      title: 'Standfirst (one-line elevator pitch)',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: (r) => r.max(240),
    }),
    defineField({name: 'client', type: 'string', group: 'content'}),
    defineField({name: 'role', title: 'Your role', type: 'string', group: 'content'}),
    defineField({name: 'sector', type: 'string', group: 'content'}),
    defineField({
      name: 'timeframe',
      title: 'Timeframe (display, e.g. "2021–2024")',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'year',
      title: 'Year (for sorting)',
      type: 'number',
      group: 'meta',
    }),
    defineField({
      name: 'tags',
      title: 'Story tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {list: storyTags},
      group: 'meta',
    }),
    defineField({
      name: 'heroMedia',
      title: 'Hero media',
      type: 'mediaItem',
      group: 'content',
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics / proof points',
      type: 'array',
      of: [{type: 'metric'}],
      group: 'content',
    }),
    defineField({name: 'body', type: 'contentBody', group: 'content'}),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'mediaItem'}],
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on home grid',
      type: 'boolean',
      initialValue: false,
      group: 'meta',
    }),
    defineField({
      name: 'order',
      title: 'Manual order (low = first)',
      type: 'number',
      group: 'meta',
    }),
    defineField({
      name: 'publishingStatus',
      title: 'Publishing status (internal)',
      type: 'string',
      options: {list: publishingStatus, layout: 'radio'},
      initialValue: 'sketch',
      group: 'meta',
    }),
    defineField({
      name: 'shape',
      title: 'Article shape (drives page layout)',
      description:
        'Long read = panorama hero + full sections. Brief = split header. Prototype = poster header, gallery-forward. Unset = layout chosen automatically.',
      type: 'string',
      options: {
        list: [
          {title: 'Long read', value: 'long-read'},
          {title: 'Brief', value: 'brief'},
          {title: 'Prototype', value: 'prototype'},
        ],
        layout: 'radio',
      },
      group: 'meta',
    }),
  ],
  orderings: [
    {title: 'Manual order', name: 'manual', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Year, newest', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'client', status: 'publishingStatus', media: 'heroMedia.image'},
    prepare: ({title, subtitle, status, media}) => ({
      title,
      subtitle: [subtitle, status].filter(Boolean).join(' · '),
      media,
    }),
  },
})
