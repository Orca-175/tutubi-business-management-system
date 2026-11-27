import type { Employee } from 'shared/interfaces/firestore-collections';

import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { InputFormProps } from '../../../components/InputForms/DataFormProps';
import type { FormMessage } from '../../../interfaces/FormMessage';

import { defaultAdminPassword } from '../../../constants/defaultAdminPassword';
import { TabledPageContext } from '../../../context/TabledPageContext';
import { createAdminUserWithEmailAndPassword } from '../../../firebase/callable-functions/createAdminUserWithEmailAndPassword';
import { db } from '../../../firebase/firebase';
import { EmployeeDataForm } from './EmployeeDataForm';

type Props = Omit<InputFormProps<null>, 'heading' | 'inputsGroups'>;

export function AddEmployeeDataForm({
  formRef,
}: Props) {
  const [employeeData, setEmployeeData] = useState<Employee>({
    address: {
      barangay: '',
      city: '',
      houseNumber: '',
      region: '',
      street: '',
    },
    createdAt: Timestamp.now(),
    email: '',
    fullName: {
      firstName: '',
      lastName: '',
      middleName: '',
    },
    phone: '',
    role: {
      docId: '',
      name: '',
    },
  });

  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: '' });

  const { refreshPage } = useContext(TabledPageContext);

  return (
    <EmployeeDataForm
      employeeData={employeeData}
      formMessage={formMessage}
      formRef={formRef}
      heading="Add employee"
      onSubmit={async () => {
        const missingFieldsError = new Error('Please fill in all missing fields.');

        try {
          for (const value of Object.values(employeeData.role)) {
            if (value === '') {
              throw missingFieldsError;
            }
          }
          if (employeeData.email === '') {
            throw missingFieldsError;
          }

          const employeeUid = await createAdminUserWithEmailAndPassword(
            employeeData.email,
            defaultAdminPassword,
          );
          await setDoc(doc(db, collections.employees, employeeUid), {
            ...employeeData,
            createdAt: Timestamp.now(),
          });
          setFormMessage({
            message: 'Employee successfully created!',
            type: 'success',
          });

          refreshPage();
        } catch (error) {
          setFormMessage({ message: error.message, type: 'error'});
        }
      }}
      setEmployeeData={setEmployeeData}
    />
  );
}

