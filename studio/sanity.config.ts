import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'

import {schemaTypes} from './schema/index'
import {structure} from './src/structure'
import {resolve} from './src/presentation/resolve'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'dbfopugh'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// Where Presentation points its iframe. Baked in at build time.
// Defaults to production rather than localhost on purpose: studio/.env is
// gitignored, so a default of localhost would mean any deploy from a machine
// without that file silently ships a Studio previewing a dead port.
// For local work, set SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3000.
const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'https://richardthedesigner.com'

export default defineConfig({
  name: 'default',
  title: 'richardthedesigner.com',

  projectId,
  dataset,

  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve,
      previewUrl: {
        origin: previewOrigin,
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
