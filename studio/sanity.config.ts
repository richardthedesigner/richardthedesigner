import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {schemaTypes} from './schema/index'
import {structure} from './src/structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'dbfopugh'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'richardthedesigner.com',

  projectId,
  dataset,

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
