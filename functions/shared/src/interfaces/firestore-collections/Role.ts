import type { FirestoreDocument } from './FirestoreDocument.js';

export interface Role extends FirestoreDocument {
  description: string;
  name: string;
  pagePermissions: {
    [pageId: string]: {
      read: boolean;
      write: boolean;
    }
  };
  collectionPermissions: {
    [collectionName: string]: {
      read: boolean;
      write: boolean;
    }
  }
}

export interface RoleData extends Role {
  docId: string;
}

