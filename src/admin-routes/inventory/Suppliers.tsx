import type { SupplierData } from 'shared/interfaces/firestore-collections';

import { useRef, useState } from 'react';
import { BiPlus } from 'react-icons/bi';

import type { FilterConfig } from '../../interfaces/FilterConfig';

import { TabledPage } from '../../components/TabledPage/TabledPage';
import { suppliers } from '../../constants/firebaseCollectionStrings';
import { supplierConverter } from '../../firebase/converters/collectionConverters';
import common from '../../styles/common-styles/AdminCommon.module.scss';
import { ModalSuppliersForm } from './ModalSuppliersForm';

export function Suppliers() {
  const [supplierData, setSupplierData] = useState<SupplierData[]>([]);
  const [orderByString, setOrderByString] = useState('createdAt');
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('desc');

  const supplierFormRef = useRef(null);

  const filters: FilterConfig = {
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
    <>
      <TabledPage
        collectionString={suppliers}
        converter={supplierConverter}
        data={supplierData}
        filters={filters}
        orderByDirection={orderByDirection}
        orderByString={orderByString}
        setData={setSupplierData}
      >
        <>
          <div className={common.newButtonContainer}>
            <button
              className={common.newButton}
              onClick={() => supplierFormRef.current.showModal()}
            >
              <BiPlus /> New
            </button>
          </div>
          <div className={common.tableContainer}>
            <SuppliersTable
              supplierData={supplierData}
            />
          </div>
        </>
      </TabledPage>

      <ModalSuppliersForm
        supplierFormRef={supplierFormRef}
      />
    </>
  );
}

function SuppliersTable({ supplierData }: {supplierData: SupplierData[] }) {
  return (
    <table className={common.tableAdmin}>
      <thead>
        <tr>
          <th>Business Name</th>
          <th>Owner Name</th>
          <th>Address</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {supplierData.map(supplier => {
          const address = supplier.address;
          const fullAddress = `${address.houseNumber}, ${address.street}, ` +
            `${address.barangay}, ${address.city}, ${address.region}`;

          return (
            <tr>
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

