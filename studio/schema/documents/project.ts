import {defineType, defineField} from 'sanity'
import {storyTags, publishingStatus} from '../shared'

// Lighter than a case study. Ventures, experiments, advisory, visual pieces.
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description (elevator pitch)',
      type: 'text',
      rows: 3,
    }),
    defineField({name: 'client', type: 'string'}),
    defineField({name: 'year', title: 'Year (for sorting)', type: 'number'}),
    defineField({
      name: 'tags',
      title: 'Story tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {list: storyTags},
    }),
    defineField({name: 'heroMedia', title: 'Hero media', type: 'mediaItem'}),
    defineField({name: 'body', type: 'contentBody'}),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'mediaItem'}],
    }),
    defineField({
      name: 'featured',
      title: 'Featured on home grid',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'order', title: 'Manual order (low = first)', type: 'number'}),
    defineField({
      name: 'publishingStatus',
      title: 'Publishing status (internal)',
      type: 'string',
      options: {list: publishingStatus, layout: 'radio'},
      initialValue: 'sketch',
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
