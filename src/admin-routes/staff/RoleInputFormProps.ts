import type { RoleData } from 'shared/interfaces/firestore-collections';

import type { InputFormProps } from '../../components/InputForms/DataFormProps';

// For page inputs in role forms
export type Pages = {
  docId: string; // docId of page in pages collection
  key: string; // React key
  read: boolean;
  write: boolean;
};

export type RoleInputFormProps = Omit<InputFormProps<RoleData>, 'inputsGroups'>;

