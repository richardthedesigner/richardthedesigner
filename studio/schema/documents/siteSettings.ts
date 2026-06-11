import {defineType, defineField} from 'sanity'

// Singleton. Home grid order, ticker strings, contact and intro.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Richard Murphy',
    }),
    defineField({
      name: 'intro',
      title: 'Info / about intro',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'gridOrder',
      title: 'Home grid order',
      description: 'Drag to set the order work appears in the home index. References case studies and projects.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'caseStudy'}, {type: 'project'}]}],
    }),
    defineField({
      name: 'tickerItems',
      title: 'Footer ticker items',
      type: 'array',
      of: [{type: 'string'}],
      initialValue: [
        'Richard Murphy',
        'Product Design & Platform Strategy',
        'richardthedesigner.com',
      ],
    }),
    defineField({name: 'contactEmail', title: 'Contact email', type: 'string'}),
    defineField({
      name: 'locations',
      title: 'Locations (for ticker / contact)',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', type: 'string'},
            {name: 'url', type: 'url'},
          ],
        },
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
