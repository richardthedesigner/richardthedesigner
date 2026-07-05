// Schema registry. Import this into sanity.config.ts:
//   import {schemaTypes} from './schema'
//   ... schema: {types: schemaTypes}

import {caseStudy} from './documents/caseStudy'
import {project} from './documents/project'
import {musing} from './documents/musing'
import {siteSettings} from './documents/siteSettings'
import {clientVignette} from './documents/clientVignette'
import {advisoryRole} from './documents/advisoryRole'

import {mediaItem} from './objects/mediaItem'
import {metric} from './objects/metric'
import {contentBody} from './objects/contentBody'

export const schemaTypes = [
  // documents
  caseStudy,
  project,
  musing,
  siteSettings,
  clientVignette,
  advisoryRole,
  // objects
  mediaItem,
  metric,
  contentBody,
]
