import type { Employee, EmployeeData, Role, RoleData } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { FormMessage } from '../../../interfaces/FormMessage';
import type { StaffInputFormProps } from '../StaffInputFormProps';

import { getCollectionConverter } from '../../../firebase/converters/collectionConverter';
import { db } from '../../../firebase/firebase';
import adminModals from '../../../styles/common-styles/AdminModals.module.scss';

interface Props extends StaffInputFormProps {
  cleanupDataForDialogs?: () => void;
  employeeData: Employee | EmployeeData;
  formMessage: FormMessage;
  onSubmit: () => void;
  setEmployeeData: Dispatch<SetStateAction<Employee>>;
}

export function EmployeeDataForm({
  cleanupDataForDialogs,
  employeeData,
  formMessage,
  formRef,
  heading,
  onSubmit,
  setEmployeeData,
}: Props) {
  const [rolesData, setRolesData] = useState<RoleData[]>([]);

  const handleChange = <K extends keyof Employee>(field: K, value: Employee[K]) => (
    setEmployeeData(prev => {
      const newEmployeeData = structuredClone(prev);
      newEmployeeData[field] = value;

      return newEmployeeData;
    })
  );

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

  return (
    <form
      onSubmit={async event => {
        event.preventDefault();

        onSubmit();
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
            {heading}
          </div>

          <hr />

          <div className={adminModals.inputsSection}>
            <label className={adminModals.input}>
              Email
              <input
                onChange={event => handleChange('email', event.target.value)}
                type="text"
                value={employeeData.email}
              />
            </label>
          </div>

          <hr />

          <div className={adminModals.inputsSection}>
            <label className={adminModals.input}>
              Role
              <select
                onChange={event => {
                  const [roleId, roleName] = event.target.value.split(',');
                  const newEmployeeData = structuredClone(employeeData);

                  newEmployeeData.role.docId = roleId;
                  newEmployeeData.role.name = roleName;

                  setEmployeeData(newEmployeeData);
                }}
                value={employeeData.role.docId === '' ? (
                  ''
                ) : (
                  `${employeeData.role.docId},${employeeData.role.name}`
                )}
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

