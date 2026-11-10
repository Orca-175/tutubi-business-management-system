import type { Product, ProductData } from 'shared/interfaces/firestore-collections';

import { useRef, useState } from 'react';
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
import { productConverter } from '../../firebase/converters/collectionConverters';
import { useMutableTableData } from '../../hooks/useMutableTableData';
import { useTabledPage } from '../../hooks/useTabledPage';
import common from '../../styles/common-styles/AdminCommon.module.scss';

export function Products() {
  const [productsData, setProductsData] = useState<ProductData[]>([]);

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isMoreExpanded, setIsMoreExpanded] = useState(false);

  const tabledPage = useTabledPage(collections.products, productConverter, 'name', setProductsData);

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

  const filterConfig: FilterConfig = {
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
    <TabledPageContext value={{ ...tabledPage }}>
      <TabledPage
        collectionString={collections.products}
        converter={productConverter}
        data={productsData}
        filterConfig={filterConfig}
        setData={setProductsData}
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
              productData={productsData}
            />
          </div>
        </>
      </TabledPage>

      <AddDataForm<Product>
        collectionString={collections.products}
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
    </TabledPageContext>
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
          collectionString={collections.products}
          docId={dataToDelete.docId}
          formRef={deleteDataFormRef}
          identifier={dataToDelete.name}
        />
      }

      {originalData &&
        <EditDataForm<ProductData>
          cleanupDataForDialogs={cleanupDataForDialogs}
          collectionString={collections.products}
          formRef={editDataFormRef}
          heading={'Edit product'}
          initialData={originalData}
          inputsGroups={inputsGroups}
        />
      }
    </>
  );
}

