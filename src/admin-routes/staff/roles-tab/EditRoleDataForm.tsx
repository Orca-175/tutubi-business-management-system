import type { RoleData } from 'shared/interfaces/firestore-collections';

import { doc, setDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { InputFormProps } from '../../../components/InputForms/DataFormProps';
import type { FormMessage } from '../../../interfaces/FormMessage';
import type { PageInput } from './PageInput';

import { TabledPageContext } from '../../../context/TabledPageContext';
import { db } from '../../../firebase/firebase';
import { getNewRoleData } from '../helpers/getNewRoleData';
import { RoleDataForm } from './RoleDataForm';

type Props = Omit<InputFormProps<null>, 'heading' | 'inputsGroups'> & {
  cleanupDataForDialogs?: () => void;
  initialData: RoleData;
 };

export function EditRoleDataForm({
  cleanupDataForDialogs,
  formRef,
  initialData,
}: Props) {
  const [roleData, setRoleData] = useState<RoleData>(initialData);
  const [pagesInputs, setPagesInputs] = useState<PageInput[]>(
    Object.entries(roleData.pagePermissions).map(([docId, permissions]) => {
      return {
        docId: docId,
        key: docId,
        ...permissions,
      };
    }),
  );
  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: '' });

  const { refreshPage } = useContext(TabledPageContext);

  return (
    <RoleDataForm
      cleanupDataForDialogs={cleanupDataForDialogs}
      formMessage={formMessage}
      formRef={formRef}
      heading={'Edit role'}
      onSubmit={async () => {
        try {
          const newRoleData = await getNewRoleData(structuredClone(roleData), pagesInputs);

          await setDoc(doc(db, collections.roles, roleData.docId), newRoleData);
          setFormMessage({ message: 'Data edited successfully!', type: 'success' });
          refreshPage();
        } catch (error) {
          setFormMessage({ message: error.message, type: 'error' });
        }
      }}
      pages={pagesInputs}
      roleData={roleData}
      setPages={setPagesInputs}
      setRoleData={setRoleData}
    />
  );
}
