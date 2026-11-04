import type { Supplier, SupplierData } from 'shared/interfaces/firestore-collections';

import { useRef, useState } from 'react';
import { BiSolidEdit, BiSolidTagX } from 'react-icons/bi';

import type { InputsGroupsConfig } from '../../components/InputForms/DataFormProps';
import type { FilterConfig } from '../../interfaces/FilterConfig';

import { DeleteDataDialog } from '../../components/DeleteDialog/DeleteDataDialog';
import { AddDataForm } from '../../components/InputForms/AddDataForm';
import { EditDataForm } from '../../components/InputForms/EditDataForm';
import { TableCardButtons } from '../../components/TableCardButtons';
import { TabledPage } from '../../components/TabledPage/TabledPage';
import { suppliers } from '../../constants/firebaseCollectionStrings';
import { TabledPageContext } from '../../context/TabledPageContext';
import { supplierConverter } from '../../firebase/converters/collectionConverters';
import { useMutableTableData } from '../../hooks/useMutableTableData';
import { useTabledPage } from '../../hooks/useTabledPage';
import common from '../../styles/common-styles/AdminCommon.module.scss';

export function Suppliers() {
  const [suppliersData, setSuppliersData] = useState<SupplierData[]>([]);

  const addFormRef = useRef<HTMLDialogElement>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isMoreExpanded, setIsMoreExpanded] = useState(false);

  const tabledPage = useTabledPage(suppliers, supplierConverter, 'businessName', setSuppliersData);

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
        collectionString={suppliers}
        converter={supplierConverter}
        data={suppliersData}
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

          <div className={common.tableContainer}>
            <SuppliersTable
              inputsGroups={inputsGroups}
              isDeleteMode={isDeleteMode}
              supplierData={suppliersData}
            />
          </div>
        </>
      </TabledPage>

      <AddDataForm<Supplier>
        collectionString={suppliers}
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
      <table className={common.tableAdmin}>
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Owner Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            {isDeleteMode ? (
              <th className={common.tableButtonHeading}>Delete</th>
            ) : (
              <th className={common.tableButtonHeading}>Edit</th>
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
                  <td className={common.tableButtonCell}>
                    <button
                      className={common.tableButtonDelete}
                      onClick={async event => {
                        event.preventDefault();

                        setDataToDelete(supplier);
                      }}
                    >
                      <BiSolidTagX />
                    </button>
                  </td>
                ) : (
                  <td className={common.tableButtonCell}>
                    <button
                      className={common.tableButtonNormal}
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
          collectionString={suppliers}
          docId={dataToDelete.docId}
          formRef={deleteDataFormRef}
          identifier={dataToDelete.businessName}
        />
      }

      {originalData &&
        <EditDataForm<SupplierData>
          cleanupDataForDialogs={cleanupDataForDialogs}
          collectionString={suppliers}
          formRef={editDataFormRef}
          heading={'Edit supplier'}
          initialData={originalData}
          inputsGroups={inputsGroups}
        />
      }
    </>
  );
}

