
import type { Supplier, SupplierData } from 'shared/interfaces/firestore-collections';

import {  useState } from 'react';
import { BiSolidEdit, BiSolidTagX } from 'react-icons/bi';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { InputsGroupsConfig } from '../../components/InputForms/DataFormProps';
import type { FilterConfig } from '../../interfaces/FilterConfig';

import { DeleteDataDialog } from '../../components/DeleteDialog/DeleteDataDialog';
import { AddDataForm } from '../../components/InputForms/AddDataForm';
import { EditDataForm } from '../../components/InputForms/EditDataForm';
import { TableCardButtons } from '../../components/TableCardButtons';
import { TabledPage } from '../../components/TabledPage/TabledPage';
import { TabledPageContext } from '../../context/TabledPageContext';
import { supplierConverter } from '../../firebase/converters/collectionConverters';
import { useMutableTableData } from '../../hooks/useMutableTableData';
import { useTableCardButtons } from '../../hooks/useTableCardButtons';
import { useTabledPage } from '../../hooks/useTabledPage';
import adminCommon from '../../styles/common-styles/AdminCommon.module.scss';

export function Suppliers() {
  const [suppliersData, setSuppliersData] = useState<SupplierData[]>([]);

  const {
    addFormRef,
    isDeleteMode,
    isMoreExpanded,
    setIsDeleteMode,
    setIsMoreExpanded,
  } = useTableCardButtons();

  const tabledPage = useTabledPage(collections.suppliers, supplierConverter, 'businessName', setSuppliersData);

  const inputsGroups: InputsGroupsConfig<Supplier> = [
    [
      {
        field: 'businessName',
        label: 'Business Name',
        type: 'text',
      },
      {
        field: 'ownerName',
        label: 'Owner Name',
        type: 'text',
      },
    ],
    [
      {
        field: 'address.houseNumber',
        label: 'House number',
        type: 'text',
      },
      {
        field: 'address.street',
        label: 'Street',
        type: 'text',
      },
      {
        field: 'address.barangay',
        label: 'Barangay',
        type: 'text',
      },
      {
        field: 'address.city',
        label: 'City',
        type: 'text',
      },
      {
        field: 'address.region',
        label: 'Region',
        type: 'text',
      },
    ],
    [
      {
        field: 'email',
        label: 'Email',
        type: 'text',
      },
      {
        field: 'phone',
        label: 'Phone',
        type: 'text',
      },
    ],
  ];

  const filterConfig: FilterConfig = {
    normal: [
      {
        field: 'businessName',
        label: 'Business Name',
        type: 'select',
      },
      {
        field: 'ownerName',
        label: 'Owner Name',
        type: 'select',
      },
      {
        field: 'address.city',
        label: 'City',
        type: 'select',
      },
      {
        field: 'address.region',
        label: 'Region',
        type: 'select',
      },
    ],
    ranged: [
      {
        field: 'createdAt',
        label: 'Created at',
        type: 'date',
      },
    ],
  };

  return (
    <TabledPageContext value={{ ...tabledPage }}>
      <TabledPage
        collectionString={collections.suppliers}
        filterConfig={filterConfig}
        setData={setSuppliersData}
      >
        <>
          <TableCardButtons
            addFormRef={addFormRef}
            isDeleteMode={isDeleteMode}
            isMoreExpanded={isMoreExpanded}
            setIsDeleteMode={setIsDeleteMode}
            setIsMoreExpanded={setIsMoreExpanded}
          />

          {suppliersData.length === 0 ? (
            <div className={adminCommon.dataNotFoundMessage}>
              Data not found.
            </div>
          ) : (
            <div className={adminCommon.tableContainer}>
              <SuppliersTable
                inputsGroups={inputsGroups}
                isDeleteMode={isDeleteMode}
                supplierData={suppliersData}
              />
            </div>
          )}
        </>
      </TabledPage>

      <AddDataForm<Supplier>
        collectionString={collections.suppliers}
        formRef={addFormRef}
        heading={'Add supplier'}
        initialData={{
          address: {
            barangay: '',
            city: '',
            houseNumber: '',
            region: '',
            street: '',
          },
          businessName: '',
          createdAt: '',
          email: '',
          ownerName: '',
          phone: '',
        }}
        inputsGroups={inputsGroups}
      />
    </TabledPageContext>
  );
}

function SuppliersTable({
  inputsGroups,
  isDeleteMode,
  supplierData,
}: {
  inputsGroups: InputsGroupsConfig<Supplier>;
  isDeleteMode: boolean;
  supplierData: SupplierData[];
}) {
  const {
    cleanupDataForDialogs,
    dataToDelete,
    deleteDataFormRef,
    editDataFormRef,
    originalData,
    setDataToDelete,
    setOriginalData,
  } = useMutableTableData<SupplierData>();

  return (
    <>
      <table className={adminCommon.tableAdmin}>
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Owner Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            {isDeleteMode ? (
              <th className={adminCommon.tableButtonHeading}>Delete</th>
            ) : (
              <th className={adminCommon.tableButtonHeading}>Edit</th>
            )}
          </tr>
        </thead>
        <tbody>
          {supplierData.map(supplier => {
            const address = supplier.address;
            const fullAddress = `${address.houseNumber} ${address.street}, ` +
              `${address.barangay}, ${address.city}, ${address.region}`;

            return (
              <tr
                key={supplier.docId}
              >
                <td>
                  {supplier.businessName}
                </td>
                <td>
                  {supplier.ownerName}
                </td>
                <td>
                  {fullAddress}
                </td>
                <td>
                  {supplier.email}
                </td>
                <td>
                  {supplier.phone}
                </td>
                {isDeleteMode ? (
                  <td className={adminCommon.tableButtonCell}>
                    <button
                      className={adminCommon.tableButtonDelete}
                      onClick={async event => {
                        event.preventDefault();

                        setDataToDelete(supplier);
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

                        setOriginalData(supplier);
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
          collectionString={collections.suppliers}
          docId={dataToDelete.docId}
          formRef={deleteDataFormRef}
          identifier={dataToDelete.businessName}
        />
      }

      {originalData &&
        <EditDataForm<SupplierData>
          cleanupDataForDialogs={cleanupDataForDialogs}
          collectionString={collections.suppliers}
          formRef={editDataFormRef}
          heading={'Edit supplier'}
          initialData={originalData}
          inputsGroups={inputsGroups}
        />
      }
    </>
  );
}

