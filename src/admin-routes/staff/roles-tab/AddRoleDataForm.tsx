import type { Role } from 'shared/interfaces/firestore-collections';

import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { InputFormProps } from '../../../components/InputForms/DataFormProps';
import type { FormMessage } from '../../../interfaces/FormMessage';
import type { PageInput } from './PageInput';

import { TabledPageContext } from '../../../context/TabledPageContext';
import { db } from '../../../firebase/firebase';
import { getNewRoleData } from '../helpers/getNewRoleData';
import { RoleDataForm } from './RoleDataForm';

type Props = Omit<InputFormProps<null>, 'heading' | 'inputsGroups'>;

export function AddRoleDataForm({
  formRef,
}: Props) {
  const [roleData, setRoleData] = useState<Role>({
    collectionPermissions: {},
    createdAt: Timestamp.now(),
    description: '',
    name: '',
    pagePermissions: {},
  });
  const [pageInputs, setPageInputs] = useState<PageInput[]>([
    { docId: '', key: crypto.randomUUID(), read: false, write: false },
  ]);
  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: '' });

  const { refreshPage } = useContext(TabledPageContext);

  return (
    <RoleDataForm
      formMessage={formMessage}
      formRef={formRef}
      heading="Add role"
      onSubmit={async () => {
        try {
          const newRoleData = await getNewRoleData(structuredClone(roleData), pageInputs);

          // TODO: Form validation. Fail when empty fields

          await addDoc(collection(db, collections.roles), newRoleData);
          setFormMessage({ message: 'Data successfully added!', type: 'success' });
          refreshPage();
        } catch (error) {
          setFormMessage({ message: error.message, type: 'error' });
        }
      }}
      pages={pageInputs}
      roleData={roleData}
      setPages={setPageInputs}
      setRoleData={setRoleData}
    />
  );
}

