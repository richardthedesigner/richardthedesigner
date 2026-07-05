import {defineType, defineField} from 'sanity'

// Board, governance, mentoring and consultancy roles. Rendered as a list on
// the Info page; no slug because these are credentials, not stories — if a
// role earns a full narrative it should become a caseStudy or project.
export const advisoryRole = defineType({
  name: 'advisoryRole',
  title: 'Advisory role',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Role (e.g. "Board Member (Trustee)")',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'organisation',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'timeframe',
      title: 'Timeframe (e.g. "2026–")',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'url',
      title: 'Organisation URL',
      type: 'url',
      validation: (r) => r.uri({scheme: ['https', 'http']}),
    }),
    defineField({name: 'order', title: 'Manual order (low = first)', type: 'number'}),
  ],
  orderings: [
    {title: 'Manual order', name: 'manual', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'organisation', subtitle: 'title'},
  },
})
