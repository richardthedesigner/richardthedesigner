import {defineType, defineField} from 'sanity'

// Short, restricted customer proof point. No slug on purpose: vignettes are
// strip items (Info page / credibility rows), never detail pages. Keep copy
// pattern-level — name the brand only where it is already public (e.g. the
// CV), and never attach unreleased project detail or client-specific metrics.
export const clientVignette = defineType({
  name: 'clientVignette',
  title: 'Client vignette',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Brand / client name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'sector', title: 'Sector', type: 'string'}),
    defineField({
      name: 'work',
      title: 'Work (short, e.g. "Kiosk · Online ordering")',
      type: 'string',
    }),
    defineField({
      name: 'oneLiner',
      title: 'One-liner (pattern-level, confidentiality-safe)',
      type: 'text',
      rows: 2,
    }),
    defineField({name: 'order', title: 'Manual order (low = first)', type: 'number'}),
  ],
  orderings: [
    {title: 'Manual order', name: 'manual', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'sector'},
  },
})
