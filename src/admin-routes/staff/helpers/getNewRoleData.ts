import type { Page, Role, RoleData } from 'shared/interfaces/firestore-collections';

import { doc, getDoc } from 'firebase/firestore';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { Pages } from '../RoleInputFormProps';

import { getCollectionConverter } from '../../../firebase/converters/collectionConverter';
import { db } from '../../../firebase/firebase';

export async function getNewRoleData(
  roleData: Role | RoleData,
  pages: Pages[],
) {
  const newRoleData = roleData;

  for (const page of pages) {
    if (page.docId === '') {
      continue;
    }

    newRoleData.pagePermissions[page.docId] = {
      read: page.read,
      write: page.write,
    };
  }

  const newPagePermissions = newRoleData.pagePermissions;
  for (const [pageId, permissions] of Object.entries(newPagePermissions)) {
    const pageDoc = await getDoc(
      doc(db, `${collections.pages}/${pageId}`)
        .withConverter(getCollectionConverter<Page>(),
    ));
    const pageData = pageDoc.data();

    pageData.collections.map(collection => {
      newRoleData.collectionPermissions[collection] = permissions;
    });
  }

  if ('docId' in roleData) {
    delete roleData.docId;
  }

  return newRoleData;
}
