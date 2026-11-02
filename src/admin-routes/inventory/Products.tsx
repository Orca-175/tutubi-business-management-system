import type { Product, ProductData } from 'shared/interfaces/firestore-collections';

import { useRef, useState } from 'react';
import { BiSolidEdit, BiSolidTagX } from 'react-icons/bi';

import type { InputsGroupsConfig } from '../../components/InputForms/DataFormProps';
import type { FilterConfig } from '../../interfaces/FilterConfig';

import { DeleteDataDialog } from '../../components/DeleteDialog/DeleteDataDialog';
import { AddDataForm } from '../../components/InputForms/AddDataForm';
import { EditDataForm } from '../../components/InputForms/EditDataForm';
import { TableCardButtons } from '../../components/TableCardButtons';
import { TabledPage } from '../../components/TabledPage/TabledPage';
import { products } from '../../constants/firebaseCollectionStrings';
import { productConverter } from '../../firebase/converters/collectionConverters';
import { useMutableTableData } from '../../hooks/useMutableTableData';
import common from '../../styles/common-styles/AdminCommon.module.scss';

export function Products() {
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [orderByString, setOrderByString] = useState('name');
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('asc');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isMoreExpanded, setIsMoreExpanded] = useState(false);

  const addFormRef = useRef<HTMLDialogElement>(null);

  const inputsGroups: InputsGroupsConfig<Product> = [
    [
      {
        field: 'name',
        label: 'Product name',
        type: 'text',
      },
      {
        field: 'price',
        label: 'Price',
        type: 'number',
      },
      {
        field: 'shelfLife',
        label: 'Shelf life',
        type: 'number',
      },
    ],
  ];

  const filters: FilterConfig = {
    normal: [
      {
        field: 'name',
        label: 'Product name',
        type: 'text',
      },
    ],
    ranged: [
      {
        field: 'price',
        label: 'Price',
        type: 'number',
      },
      {
        field: 'shelfLife',
        label: 'Shelf life',
        type: 'number',
      },
    ],
  };

  return(
    <>
      <TabledPage
        collectionString={products}
        converter={productConverter}
        data={productData}
        filterConfig={filters}
        orderByDirection={orderByDirection}
        orderByString={orderByString}
        setData={setProductData}
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
            <ProductsTable
              inputsGroups={inputsGroups}
              isDeleteMode={isDeleteMode}
              productData={productData}
            />
          </div>
        </>
      </TabledPage>

      <AddDataForm<Product>
        collectionString={products}
        formRef={addFormRef}
        heading={'Add product'}
        initialData={{
          createdAt: '',
          name: '',
          price: 0,
          shelfLife: 0,
        }}
        inputsGroups={inputsGroups}
      />
    </>
  );
}

function ProductsTable({
  inputsGroups,
  isDeleteMode,
  productData,
}: {
  inputsGroups: InputsGroupsConfig<Product>;
  isDeleteMode: boolean;
  productData: ProductData[];
}) {
  const {
    cleanupDataForDialogs,
    dataToDelete,
    deleteDataFormRef,
    editDataFormRef,
    originalData,
    setDataToDelete,
    setOriginalData,
  } = useMutableTableData<ProductData>();

  return(
    <>
      <table className={common.tableAdmin}>
        <thead>
          <tr>
            <th>Product name</th>
            <th>Price</th>
            <th>Shelf life</th>
            {isDeleteMode ? (
              <th className={common.tableButtonHeading}>Delete</th>
            ) : (
              <th className={common.tableButtonHeading}>Edit</th>
            )}
          </tr>
        </thead>
        <tbody>
          {productData.map(product => {
            return (
              <tr key={product.docId}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.shelfLife}</td>
                {isDeleteMode ? (
                  <td className={common.tableButtonCell}>
                    <button
                      className={common.tableButtonDelete}
                      onClick={event => {
                        event.preventDefault();

                        setDataToDelete(product);
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

                        setOriginalData(product);
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
          collectionString={products}
          docId={dataToDelete.docId}
          formRef={deleteDataFormRef}
          identifier={dataToDelete.name}
        />
      }

      {originalData &&
        <EditDataForm<ProductData>
          cleanupDataForDialogs={cleanupDataForDialogs}
          collectionString={products}
          formRef={editDataFormRef}
          heading={'Edit product'}
          initialData={originalData}
          inputsGroups={inputsGroups}
        />
      }
    </>
  );
}

