import type { ProductData } from 'shared/interfaces/firestore-collections';

import { useEffect, useRef, useState } from 'react';
import { BiPlus, BiSolidEdit } from 'react-icons/bi';

import type { FilterConfig } from '../../interfaces/FilterConfig';

import { TabledPage } from '../../components/TabledPage/TabledPage';
import { products } from '../../constants/firebaseCollectionStrings';
import { productConverter } from '../../firebase/converters/collectionConverters';
import common from '../../styles/common-styles/AdminCommon.module.scss';
import { EditProductForm } from './EditProductForm';

export function Products() {
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [orderByString, setOrderByString] = useState('name');
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('asc');

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
    <TabledPage
      collectionString={products}
      converter={productConverter}
      data={productData}
      filters={filters}
      orderByDirection={orderByDirection}
      orderByString={orderByString}
      setData={setProductData}
    >
      <>
        <div className={common.newButtonContainer}>
          <button
            className={common.newButton}
            onClick={() => productFormRef.current.showModal()}
          >
            <BiPlus /> New
          </button>
        </div>

        <div className={common.tableContainer}>
          <ProductsTable
            productData={productData}
          />
        </div>
      </>
    </TabledPage>
  );
}

function ProductsTable({
  productData,
}: {
  productData: ProductData[]
}) {
  const [originalProduct, setOriginalProduct] = useState<ProductData>();

  const editProductFormRef = useRef<HTMLDialogElement>(null);

  // Show modal edit form when originalProduct changes after being set when the
  // user clicks the edit button of a product
  useEffect(() => {
    if (originalProduct) {
      editProductFormRef.current.showModal();
    }
  }, [originalProduct]);

  return(
    <>
      <table className={common.tableAdmin}>
        <thead>
          <tr>
            <th>Product name</th>
            <th>Price</th>
            <th>Shelf life</th>
            <th className={common.tableButtonHeading}>Edit</th>
          </tr>
        </thead>
        <tbody>
          {productData.map(product => {
            return (
              <tr key={product.docId}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.shelfLife}</td>
                <td className={common.tableButtonCell}>
                  <button
                    onClick={event => {
                      event.preventDefault();

                      setOriginalProduct(product);
                    }}
                  >
                    <BiSolidEdit />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {originalProduct &&
        <EditProductForm
          editProductFormRef={editProductFormRef}
          key={originalProduct.docId}
          originalProduct={originalProduct}
        />
      }
    </>
  );
}

