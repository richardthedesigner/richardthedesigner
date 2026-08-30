import {defineType, defineField} from 'sanity'

// Optional overrides. Everything here falls back to derived values in the
// frontend, so an empty object changes nothing: this exists so a title or
// description can be tuned for search without a code change.
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      description: 'Overrides the page title. Falls back to the document title.',
      type: 'string',
      validation: (r) => r.max(60).warning('Titles over 60 characters get truncated in search results.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      description:
        'Overrides the description. Falls back to the standfirst, description or excerpt.',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(155).warning('Descriptions over 155 characters get truncated in search results.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      description:
        'Overrides the share image. Falls back to the hero image, then to the placeholder set.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      description:
        'Serves noindex, nofollow. The page stays publicly reachable by URL.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
