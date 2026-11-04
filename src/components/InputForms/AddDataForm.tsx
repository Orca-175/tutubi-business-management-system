import { addDoc, collection } from 'firebase/firestore';
import { useContext, useState } from 'react';

import type { FormMessage } from '../../interfaces/FormMessage';
import type { InputFormProps } from './DataFormProps';

import { TabledPageContext } from '../../context/TabledPageContext';
import { db } from '../../firebase/firebase';
import { DataForm } from './DataForm';

interface Props<T> extends InputFormProps<T> {
  collectionString: string;
  initialData: T;
}

export function AddDataForm<T>(props: Props<T>) {
  const { collectionString, initialData } = props;

  const [data, setData] = useState<T>(initialData);
  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: '' });

  const { refreshPage } = useContext(TabledPageContext);

  return (
    <DataForm
      { ...props }
      data={data}
      formMessage={formMessage}
      onSubmit={async () => {
        try {
          for (const [key, value] of Object.entries(data)) {
            if (key === 'createdAt') {
              continue;
            } else if (value === '' || value === '0') {
              throw new Error('Please fill out all fields');
            }
          }

          await addDoc(collection(db, collectionString), {
            ...data,
            createdAt: new Date().toISOString(),
          });
          setFormMessage({ message: 'Data added successfully!', type: 'success' });
          refreshPage();
        } catch (error) {
          setFormMessage({ message: error.message, type: 'error' });
        }
      }}
      setData={setData}
    />
  );
}

