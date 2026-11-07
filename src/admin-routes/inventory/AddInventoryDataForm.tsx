import type { InventoryEntry, Product, Supplier } from 'shared/interfaces/firestore-collections';

import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { type RefObject, useContext, useEffect, useState } from 'react';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { InputsGroupsConfig } from '../../components/InputForms/DataFormProps';
import type { FormMessage } from '../../interfaces/FormMessage';

import { DataForm } from '../../components/InputForms/DataForm';
import { TabledPageContext } from '../../context/TabledPageContext';
import { getCollectionConverter } from '../../firebase/converters/collectionConverter';
import { productConverter, supplierConverter } from '../../firebase/converters/collectionConverters';
import { db } from '../../firebase/firebase';

interface Props {
  formRef: RefObject<HTMLDialogElement>;
}

export function AddInventoryDataForm({
  formRef,
}: Props) {
  const [inventoryEntry, setInventoryEntry] = useState<InventoryEntry>({
    batchNumber: '',
    createdAt: new Date().toISOString(),
    currentQuantity: 0,
    outgoingQuantity: 0,
    productId: '',
    productName: '',
    shelfLife: 0,
    supplier: '',
    supplierId: '',
  });
  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: '' });
  const [inputsGroups, setInputsGroups] = useState<InputsGroupsConfig<InventoryEntry>>([]);

  const { refreshPage } = useContext(TabledPageContext);

  useEffect(() => {
    async function getInputsGroups() {
      const getProductsData = async () => {
        const docs = (await getDocs(
          collection(db, collections.products)
            .withConverter(productConverter),
        )).docs;

        return docs.map(doc => ({ ...doc.data(), docId: doc.id }));
      };

      const getSuppliersData = async () => {
        const docs = (await getDocs(
          collection(db, collections.suppliers)
            .withConverter(supplierConverter),
        )).docs;

        return docs.map(doc => ({ ...doc.data(), docId: doc.id }));
      };

      const productsData = await getProductsData();
      const suppliersData = await getSuppliersData();

      // set inputsGroups
      setInputsGroups([
        [
          {
            field: 'batchNumber',
            label: 'Batch Number',
            type: 'text',
          },
        ],
        [
          {
            field: 'productId',
            label: 'Product',
            options: productsData.map(productData => ({
              label: productData.name,
              value: productData.docId,
            })),
            type: 'select',
          },
          {
            field: 'currentQuantity',
            label: 'Quantity',
            type: 'number',
          },
        ],
        [
          {
            field: 'supplierId',
            label: 'Supplier',
            options: suppliersData.map(supplierData => ({
              label: supplierData.businessName,
              value: supplierData.docId,
            })),
            type: 'select',
          },
        ],
      ]);
    }

    getInputsGroups();
  }, []);

  console.log('inventoryEntry:', inventoryEntry);
  return (
    <DataForm
      data={inventoryEntry}
      formMessage={formMessage}
      formRef={formRef}
      heading={'Add inventory entry'}
      inputsGroups={inputsGroups}
      onSubmit={async () => {
        try {
          for (const [key, value] of Object.entries(inventoryEntry)) {
            if (
              key === 'createdAt' ||
              key === 'outgoingQuantity' ||
              key === 'productName' ||
              key === 'shelfLife' ||
              key === 'supplier'
            ) {
              continue;
            } else if (value === '' || value === '0') {
              throw new Error('Please fill out all fields');
            }
          }

          const productDoc = await getDoc(
            doc(db, collections.products, inventoryEntry.productId)
              .withConverter(getCollectionConverter<Product>()),
          );
          const productData = productDoc.exists && productDoc.data();

          const supplierDoc = await getDoc(
            doc(db, collections.suppliers, inventoryEntry.supplierId)
              .withConverter(getCollectionConverter<Supplier>()),
          );
          const supplierData = supplierDoc.exists && supplierDoc.data();

          await addDoc(
            collection(db, collections.inventory)
              .withConverter(getCollectionConverter<InventoryEntry>()),
            {
              batchNumber: inventoryEntry.batchNumber,
              createdAt: inventoryEntry.createdAt,
              currentQuantity: inventoryEntry.currentQuantity,
              outgoingQuantity: 0,
              productId: productDoc.id,
              productName: productData.name,
              shelfLife: productData.shelfLife,
              supplier: supplierData.businessName,
              supplierId: supplierDoc.id,
            },
          );
          setFormMessage({ message: 'Data added successfully!', type: 'success' });
          refreshPage();
        } catch (error) {
          setFormMessage({ message: error.message, type: 'error' });
        }
      }}
      setData={setInventoryEntry}
    />
  );
}

