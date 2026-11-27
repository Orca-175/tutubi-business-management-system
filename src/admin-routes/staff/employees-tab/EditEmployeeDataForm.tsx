import type { Employee, Role, RoleData } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { InputFormProps } from '../../../components/InputForms/DataFormProps';
import type { FormMessage } from '../../../interfaces/FormMessage';

import { TabledPageContext } from '../../../context/TabledPageContext';
import { getCollectionConverter } from '../../../firebase/converters/collectionConverter';
import { db } from '../../../firebase/firebase';
import adminModals from '../../../styles/common-styles/AdminModals.module.scss';

type Props = Omit<InputFormProps<null>, 'heading' | 'inputsGroups'> & {
  cleanupDataForDialogs?: () => void;
  initialData: {
    employeeDocId: string;
    roleDocId: string;
    roleName: string;
  };
 };

export function EditEmployeeDataForm({
  cleanupDataForDialogs,
  formRef,
  initialData,
}: Props) {
  const [roleDocId, setRoleDocId] = useState(initialData.roleDocId);
  const [roleName, setRoleName] = useState(initialData.roleName);

  const [rolesData, setRolesData] = useState<RoleData[]>([]);

  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: '' });

  const { refreshPage } = useContext(TabledPageContext);

  useEffect(() => {
    async function getRolesData() {
      const docSnaps = (await getDocs(query(
        collection(db, collections.roles)
          .withConverter(getCollectionConverter<Role>()),
        orderBy('name', 'desc'),
      ))).docs;

      const data = docSnaps.map(docSnap => ({ ...docSnap.data(), docId: docSnap.id }));

      setRolesData(data);
    }

    getRolesData();
  }, []);

  console.log('roleDocId:', roleDocId);

  return (
    <form
      onSubmit={async event => {
        event.preventDefault();

        try {
          if (roleDocId === '' || roleName === '') {
            throw new Error('Please fill in all missing fields.');
          }

          await updateDoc(
            doc(db, collections.employees, initialData.employeeDocId)
              .withConverter(getCollectionConverter<Partial<Employee>>()),
            {
              greg: 'hello',
              role: {
                docId: roleDocId,
                name: roleName,
              },
            },
          );
          setFormMessage({
            message: 'Employee successfully edited!',
            type: 'success',
          });

          refreshPage();
        } catch (error) {
          setFormMessage({ message: error.message, type: 'error' });
        }
      }}
    >
      <dialog
        className={adminModals.modal}
        onCancel={() => {
          if (cleanupDataForDialogs) {
            cleanupDataForDialogs();
          }
        }}
        ref={formRef}
      >

        <div className={adminModals.content}>
          <div className={adminModals.heading}>
            Edit employee role
          </div>

          <hr />

          <div className={adminModals.inputsSection}>
            <label className={adminModals.input}>
              Role
              <select
                onChange={event => {
                  event.preventDefault();
                  const [roleDocId, roleName] = event.target.value.split(',');

                  setRoleDocId(roleDocId);
                  setRoleName(roleName);
                }}
                value={roleDocId === '' ? '' : `${roleDocId},${roleName}`}
              >
                <option disabled value="">Select</option>
                {rolesData.map(roleData => {
                  return (
                    <option value={`${roleData.docId},${roleData.name}`}>{roleData.name}</option>
                  );
                })}
              </select>
            </label>
          </div>
        </div>

        {formMessage.message !== '' &&
          <div
            className={classNames(
              adminModals.formMessage,
              formMessage.type === 'error' ? (
                adminModals.formMessageError
              ) : formMessage.type === 'success' && (
                adminModals.formMessageSuccess
              ),
            )}
          >
            {formMessage.message}
          </div>
        }

        <div className={adminModals.buttons}>
          <button
            className={adminModals.closeButton}
            onClick={event => {
              event.preventDefault();

              formRef.current.close();
              cleanupDataForDialogs?.();
            }}
          >
            Close
          </button>

          <button
            className={adminModals.confirmButton}
            type="submit"
          >
            Submit
          </button>
        </div>
      </dialog>
    </form>
  );
}

