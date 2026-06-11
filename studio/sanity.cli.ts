import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'dbfopugh'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: 'richardthedesigner',
  deployment: {
    appId: 'pygcf1lxcxv9hmt3pn7693wm',
  },
  typegen: {
    enabled: true,
    // Scan the web app's GROQ queries (and the studio's own .ts) and write the
    // generated types into the web app so the frontend is fully typed.
    path: '../web/src/**/*.{ts,tsx}',
    generates: '../web/src/sanity/sanity.types.ts',
  },
})
