import type {StructureResolver} from 'sanity/structure'
import {CogIcon, DocumentTextIcon, DocumentIcon, EditIcon} from '@sanity/icons'

// siteSettings is a singleton: locked to a fixed document id and excluded from
// the generic document-type lists so it can never be duplicated.
const SINGLETONS = ['siteSettings']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings'),
        ),

      S.divider(),

      S.documentTypeListItem('caseStudy').title('Case studies').icon(DocumentTextIcon),
      S.documentTypeListItem('project').title('Projects').icon(DocumentIcon),
      S.documentTypeListItem('musing').title('Musings').icon(EditIcon),

      S.divider(),

      // Any future document types, with singletons filtered out.
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.includes(item.getId() as string) &&
          !['caseStudy', 'project', 'musing'].includes(item.getId() as string),
      ),
    ])
