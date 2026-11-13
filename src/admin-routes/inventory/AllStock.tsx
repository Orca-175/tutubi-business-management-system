import type { InventoryEntry, InventoryEntryData } from 'shared/interfaces/firestore-collections';

import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { BiSolidEdit, BiSolidTagX } from 'react-icons/bi';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { InputsGroupsConfig } from '../../components/InputForms/DataFormProps';
import type { FilterConfig } from '../../interfaces/FilterConfig';

import { DeleteDataDialog } from '../../components/DeleteDialog/DeleteDataDialog';
import { EditDataForm } from '../../components/InputForms/EditDataForm';
import { TableCardButtons } from '../../components/TableCardButtons';
import { TabledPage } from '../../components/TabledPage/TabledPage';
import { TabledPageContext } from '../../context/TabledPageContext';
import { getCollectionConverter } from '../../firebase/converters/collectionConverter';
import { productConverter, supplierConverter } from '../../firebase/converters/collectionConverters';
import { db } from '../../firebase/firebase';
import { useMutableTableData } from '../../hooks/useMutableTableData';
import { useTableCardButtons } from '../../hooks/useTableCardButtons';
import { useTabledPage } from '../../hooks/useTabledPage';
import adminCommon from '../../styles/common-styles/AdminCommon.module.scss';
import { AddInventoryDataForm } from './AddInventoryDataForm';

interface AllStockTableProps {
  inputsGroups: InputsGroupsConfig<InventoryEntry>;
  inventoryEntriesData: InventoryEntryData[];
  isDeleteMode: boolean;
}

interface Props {
  productNameToFilter?: string; // productName to filter by on mount
}

export function AllStock({ productNameToFilter }: Props) {
  const [inventoryEntriesData, setInventoryEntriesData] = useState<InventoryEntryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialFilterApplied, setIsInitialFilterApplied] = useState(false);

  const [inputsGroups, setInputsGroups] = useState<InputsGroupsConfig<InventoryEntry>>([]);

  const tableCardButtonsProps = useTableCardButtons();

  const tabledPageProps = useTabledPage(
    collections.inventory,
    getCollectionConverter<InventoryEntry>(),
    'createdAt',
    setInventoryEntriesData,
  );

  const filterConfig: FilterConfig = {
    normal: [
      {
        field: 'batchNumber',
        label: 'Batch number',
        type: 'text',
      },
      {
        field: 'productName',
        label: 'Product name',
        type: 'text',
      },
    ],
    ranged: [
      {
        field: 'currentQuantity',
        label: 'Current quantity',
        type: 'number',
      },
      {
        field: 'outgoingQuantity',
        label: 'Outgoing quantity',
        type: 'number',
      },
      {
        field: 'shelfLife',
        label: 'Shelf life',
        type: 'number',
      },
    ],
  };

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

  useEffect(() => {
    async function setInitialFilter() {
      tabledPageProps.filters.setFilterFieldValues({ productName: productNameToFilter });
      setIsLoading(false);
    }

    async function applyInitialFilter() {
      tabledPageProps.filters.applyFilters();
      setIsInitialFilterApplied(true);
    }

    if (isLoading && productNameToFilter) {
      setInitialFilter();
    } else {
      if (!isInitialFilterApplied) {
        applyInitialFilter();
      }
    }
  }, [isInitialFilterApplied, isLoading, productNameToFilter, tabledPageProps]);

  return (
    <TabledPageContext value={{ ...tabledPageProps }}>
      <TabledPage
        collectionString={collections.inventory}
        filterConfig={filterConfig}
        setData={setInventoryEntriesData}
      >
        <>
          <TableCardButtons
            { ...tableCardButtonsProps }
          />

          {inventoryEntriesData.length === 0 ? (
            <div className={adminCommon.dataNotFoundMessage}>
              Data not found.
            </div>
          ) : (
            <div className={adminCommon.tableContainer}>
              <AllStockTable
                inputsGroups={inputsGroups}
                inventoryEntriesData={inventoryEntriesData}
                isDeleteMode={tableCardButtonsProps.isDeleteMode}
              />
            </div>
          )}
        </>
      </TabledPage>

      <AddInventoryDataForm
        formRef={tableCardButtonsProps.addFormRef}
        inputsGroups={inputsGroups}
      />
    </TabledPageContext>
  );
}

function AllStockTable({
  inputsGroups,
  inventoryEntriesData,
  isDeleteMode,
}: AllStockTableProps) {
  const {
    cleanupDataForDialogs,
    dataToDelete,
    deleteDataFormRef,
    editDataFormRef,
    originalData,
    setDataToDelete,
    setOriginalData,
  } = useMutableTableData<InventoryEntryData>();

  return (
    <>
      <table className={adminCommon.tableAdmin}>
        <thead>
          <tr>
            <th>Batch number</th>
            <th>Product name</th>
            <th>Current quantity</th>
            <th>Outgoing quantity</th>
            {isDeleteMode ? (
              <th className={adminCommon.tableButtonHeading}>Delete</th>
            ) : (
              <th className={adminCommon.tableButtonHeading}>Edit</th>
            )}
          </tr>
        </thead>
        <tbody>
          {inventoryEntriesData.map(data => {
            return (
              <tr key={data.docId}>
                <td>{data.batchNumber}</td>
                <td>{data.productName}</td>
                <td>{data.currentQuantity}</td>
                <td>{data.outgoingQuantity}</td>
                {isDeleteMode ? (
                  <td className={adminCommon.tableButtonCell}>
                    <button
                      className={adminCommon.tableButtonDelete}
                      onClick={async event => {
                        event.preventDefault();

                        setDataToDelete(data);
                      }}
                    >
                      <BiSolidTagX />
                    </button>
                  </td>
                ) : (
                  <td className={adminCommon.tableButtonCell}>
                    <button
                      className={adminCommon.tableButtonNormal}
                      onClick={event => {
                        event.preventDefault();

                        setOriginalData(data);
                      }}
                    >
                      <BiSolidEdit />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {dataToDelete &&
        <DeleteDataDialog
          cleanupDataForDialogs={cleanupDataForDialogs}
          collectionString={collections.inventory}
          docId={dataToDelete.docId}
          formRef={deleteDataFormRef}
          identifier={`${dataToDelete.batchNumber} - ${dataToDelete.productName}`}
        />
      }

      {originalData &&
        <EditDataForm<InventoryEntry>
          cleanupDataForDialogs={cleanupDataForDialogs}
          collectionString={collections.inventory}
          formRef={editDataFormRef}
          heading={'Edit inventory entry'}
          initialData={originalData}
          inputsGroups={inputsGroups}
        />
      }
    </>
  );
}

