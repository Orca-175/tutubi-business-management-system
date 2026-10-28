import type { Supplier, SupplierData } from 'shared/interfaces/firestore-collections';

import { useEffect, useRef, useState } from 'react';
import { BiPlus } from 'react-icons/bi';

import { ApplyFiltersButton } from '../../components/FilterInputs/ApplyFiltersButton';
import { FilterSelectInput } from '../../components/FilterInputs/FilterInputs';
import { FilterDateRangeInput } from '../../components/FilterInputs/FilterRangeInputs';
import { PaginationButtons } from '../../components/PaginationButtons/PaginationButtons';
import { suppliers } from '../../constants/firebaseCollectionStrings';
import { supplierConverter } from '../../firebase/converters/collectionConverters';
import { getFilterFieldOptions } from '../../firebase/queries/getFilterFieldOptions';
import { getInitialData } from '../../firebase/queries/getInitialData';
import { refreshData } from '../../firebase/queries/refreshData';
import { useFilters } from '../../hooks/useFilters';
import { usePagination } from '../../hooks/usePagination';
import { useRangeFilters } from '../../hooks/useRangeFilters';
import common from '../../styles/common-styles/AdminCommon.module.scss';
import { ModalSuppliersForm } from './ModalSuppliersForm';

export function Suppliers() {
  const [supplierData, setSupplierData] = useState<SupplierData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderByString, setOrderByString] = useState('createdAt');
  const [orderByDirection, setOrderByDirection] = useState<'asc' | 'desc'>('desc');

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
  } = usePagination(setSupplierData, suppliers, supplierConverter, itemsPerPage);

  const {
    applyFilters,
    filterFieldOptions,
    filterFieldValues,
    queryConstraints,
    setFilterFieldOptions,
    setFilterFieldValues,
  } = useFilters();

  const {
    applyRangeFilters,
    filterRangeFieldValues,
    rangeQueryConstraints,
    setFilterRangeFieldValues,
  } = useRangeFilters();

  const supplierFormRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      getInitialData<Supplier>(
        suppliers,
        supplierConverter,
        itemsPerPage,
        orderByString,
        setSupplierData,
        setIsLoading,
        initPagination,
      );

      getFilterFieldOptions(suppliers, setFilterFieldOptions);
    } else {
      refreshData<Supplier>(
        suppliers,
        supplierConverter,
        [...queryConstraints, ...rangeQueryConstraints],
        itemsPerPage,
        orderByString,
        setSupplierData,
        initPagination,
      );
    }
  }, [
    initPagination,
    isLoading,
    orderByString,
    queryConstraints,
    rangeQueryConstraints,
    setFilterFieldOptions,
  ]);

  return (
    <>
      {Object.values(filterFieldOptions).length > 0 &&
        <div className={common.filters}>
          <div className={common.filterInputs}>
            <div className={common.normalInputs}>
              <FilterSelectInput
                field={'businessName'}
                filterFieldValues={filterFieldValues}
                id={'businessName'}
                label={'Business Name'}
                options={filterFieldOptions.businessName}
                setFilterFieldValues={setFilterFieldValues}
              />
              <FilterSelectInput
                field={'ownerName'}
                filterFieldValues={filterFieldValues}
                id={'ownerName'}
                label={'Owner Name'}
                options={filterFieldOptions.ownerName}
                setFilterFieldValues={setFilterFieldValues}
              />
              <FilterSelectInput
                field={'address.city'}
                filterFieldValues={filterFieldValues}
                id={'city'}
                label={'City'}
                options={filterFieldOptions.city}
                setFilterFieldValues={setFilterFieldValues}
              />
              <FilterSelectInput
                field={'address.region'}
                filterFieldValues={filterFieldValues}
                id={'region'}
                label={'Region'}
                options={filterFieldOptions.region}
                setFilterFieldValues={setFilterFieldValues}
              />
            </div>

            <div className={common.rangeInputs}>
              <FilterDateRangeInput
                field={'createdAt'}
                filterRangeFieldValues={filterRangeFieldValues}
                id={'createdAt'}
                label={'Created At'}
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
      }

      <div className={common.card}>
        {isLoading ? (
          'Loading...'
        ) : supplierData.length === 0 ? (
          'Data not found.'
        ) : (
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

