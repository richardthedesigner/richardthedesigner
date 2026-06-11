import {defineType, defineField} from 'sanity'
import {storyTags} from '../shared'

// Essays, talks, perspectives. Open-ended and minimal.
export const musing = defineType({
  name: 'musing',
  title: 'Musing',
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
      name: 'publishedAt',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tags',
      title: 'Story tags (optional)',
      type: 'array',
      of: [{type: 'string'}],
      options: {list: storyTags},
    }),
    defineField({name: 'body', type: 'contentBody'}),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {title: 'Date, newest', name: 'dateDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt'},
    prepare: ({title, date}) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('en-GB') : 'No date',
    }),
  },
})
