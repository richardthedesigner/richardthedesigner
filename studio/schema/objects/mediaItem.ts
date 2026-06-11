import {defineType, defineField} from 'sanity'

// A single image or mp4. The B+N grid leans on motion, so video is first-class.
export const mediaItem = defineType({
  name: 'mediaItem',
  title: 'Media item',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {list: ['image', 'video'], layout: 'radio'},
      initialValue: 'image',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.kind !== 'image',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video file (mp4)',
      type: 'file',
      options: {accept: 'video/mp4'},
      hidden: ({parent}) => parent?.kind !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (optional, if hosted elsewhere)',
      type: 'url',
      hidden: ({parent}) => parent?.kind !== 'video',
    }),
    defineField({
      name: 'poster',
      title: 'Poster image (video still)',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.kind !== 'video',
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
  ],
  preview: {
    select: {title: 'alt', media: 'image', kind: 'kind'},
    prepare: ({title, media, kind}) => ({
      title: title || '(no alt text)',
      subtitle: kind === 'video' ? 'Video' : 'Image',
      media,
    }),
  },
})
