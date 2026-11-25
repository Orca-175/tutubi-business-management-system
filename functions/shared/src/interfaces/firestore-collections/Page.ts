import type { FirestoreDocument } from './FirestoreDocument.js';

export interface Page extends FirestoreDocument {
  collections: string[];
  name: string;
}

export interface PageData extends Page {
  docId: string;
}

