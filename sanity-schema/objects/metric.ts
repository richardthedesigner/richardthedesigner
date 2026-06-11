import {defineType, defineField} from 'sanity'

// A single proof point, e.g. value "8,000+" label "locations".
export const metric = defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'e.g. "8,000+", "42", "£50m", "$1bn"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. "locations", "countries", "handled in year one"',
      validation: (r) => r.required(),
    }),
    defineField({name: 'note', title: 'Note (optional)', type: 'string'}),
  ],
  preview: {
    select: {value: 'value', label: 'label'},
    prepare: ({value, label}) => ({title: `${value} ${label}`}),
  },
})
