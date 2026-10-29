import type { Product, ProductData } from 'shared/interfaces/firestore-collections';

import { and, collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { BiPlus, BiSolidEdit } from 'react-icons/bi';

import { ApplyFiltersButton } from '../../components/FilterInputs/ApplyFiltersButton';
import { FilterTextInput } from '../../components/FilterInputs/FilterInputs';
import { FilterNumberRangeInput } from '../../components/FilterInputs/FilterRangeInputs';
import { PaginationButtons } from '../../components/PaginationButtons/PaginationButtons';
import { products } from '../../constants/firebaseCollectionStrings';
import { productConverter } from '../../firebase/converters/collectionConverters';
import { db } from '../../firebase/firebase';
import { useFilters } from '../../hooks/useFilters';
import { usePagination } from '../../hooks/usePagination';
import { useRangeFilters } from '../../hooks/useRangeFilters';
import common from '../../styles/common-styles/AdminCommon.module.scss';
import { ModalProductsForm } from './ModalProductsForm';
import { EditProductForm } from './EditProductForm';

export function Products() {
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderByString, setOrderByString] = useState('name');
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 20;

  const {
    currentStartDocId,
    getFilteredPageStack,
    handleNextBtnClick,
    handlePageBtnClick,
    handlePrevBtnClick,
    initPagination,
    nextPageExists,
    pageStack,
    prevPageExists,
  } = usePagination(setProductData, products, productConverter, itemsPerPage);

  const {
    applyFilters,
    filterFieldValues,
    queryConstraints,
    setFilterFieldValues,
  } = useFilters();

  const {
    applyRangeFilters,
    filterRangeFieldValues,
    rangeQueryConstraints,
    setFilterRangeFieldValues,
  } = useRangeFilters();

  const productFormRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    async function getInitialProducts() {
      const docs = (await getDocs(query(
        collection(db, products)
          .withConverter(productConverter),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),
      ))).docs;
      const nextPageExists = docs.length > itemsPerPage;

      if (nextPageExists) {
        docs.pop();
      }

      const data = docs.map(doc => {
        return { docId: doc.id, ...doc.data() };
      });

      initPagination(docs[0], docs.at(-1), nextPageExists);
      setProductData(data);
      setIsLoading(false);
    }

    async function refreshProducts() {
      const docs = (await getDocs(query(
        collection(db, products)
          .withConverter(productConverter),
        and(
          ...queryConstraints,
          ...rangeQueryConstraints,
        ),
        limit(itemsPerPage + 1),
        orderBy(orderByString, orderByDirection),

      ))).docs;
      const nextPageExists = docs.length > itemsPerPage;

      if (nextPageExists) {
        docs.pop();
      }

      const data = docs.map(doc => {
        return { docId: doc.id, ...doc.data() };
      });

      initPagination(docs[0], docs.at(-1), nextPageExists);
      setProductData(data);
    }

    if (isLoading) {
      getInitialProducts();
    } else {
      refreshProducts();
    }
  }, [
    initPagination,
    isLoading,
    orderByDirection,
    orderByString,
    queryConstraints,
    rangeQueryConstraints,
  ]);

  return(
    <>
      {/* filterFieldOptions is unset. Remember this if you plan to add select inputs here */}
      <div className={common.filters}>
        <div className={common.filterInputs}>
          <div className={common.normalInputs}>
            <FilterTextInput
              field="name"
              filterFieldValues={filterFieldValues}
              id="name"
              label="Product Name"
              setFilterFieldValues={setFilterFieldValues}
            />
          </div>
          <div className={common.rangeInputs}>
            <FilterNumberRangeInput
              field="price"
              filterRangeFieldValues={filterRangeFieldValues}
              id="price"
              label="Price"
              setFilterRangeFieldValues={setFilterRangeFieldValues}
            />
            <FilterNumberRangeInput
              field="shelfLife"
              filterRangeFieldValues={filterRangeFieldValues}
              id="shelfLife"
              label="Shelf life"
              setFilterRangeFieldValues={setFilterRangeFieldValues}
            />
          </div>
        </div>

        <div className={common.filterButtonContainer}>
          <ApplyFiltersButton
            onClick={() => {
              applyFilters();
              applyRangeFilters();
            }}
          />
        </div>
      </div>

      <div className={common.card}>
        {isLoading ? (
          'Loading...'
        ) : productData.length === 0 ? (
          'Data not found.'
        ) : (
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
        )}
      </div>

      <PaginationButtons
        currentStartDocId={currentStartDocId}
        getFilteredPageStack={getFilteredPageStack}
        handleNextBtnClick={handleNextBtnClick}
        handlePageBtnClick={handlePageBtnClick}
        handlePrevBtnClick={handlePrevBtnClick}
        nextPageExists={nextPageExists}
        orderByDirection={orderByDirection}
        orderByString={orderByString}
        pageStack={pageStack}
        prevPageExists={prevPageExists}
      />

      <ModalProductsForm
        productFormRef={productFormRef}
      />
    </>
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

