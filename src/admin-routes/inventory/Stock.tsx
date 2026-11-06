import type { InventoryEntryData, InventorySummaryData } from 'shared/interfaces/firestore-collections';

import { useRef, useState } from 'react';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { FilterConfig } from '../../interfaces/FilterConfig';

import { TabledPage } from '../../components/TabledPage/TabledPage';
import { TabledPageContext } from '../../context/TabledPageContext';
import { inventoryConverter, inventorySummaryConverter } from '../../firebase/converters/collectionConverters';
import { useTableCardButtons } from '../../hooks/useTableCardButtons';
import { useTabledPage } from '../../hooks/useTabledPage';
import adminCommon from '../../styles/common-styles/AdminCommon.module.scss';

export function Stock() {
  const [inventorySummaryData, setInventorySummaryData] = useState<InventorySummaryData[]>([]);

  const {
    addFormRef,
    isDeleteMode,
    isMoreExpanded,
    setIsDeleteMode,
    setIsMoreExpanded,
  } = useTableCardButtons();

  const tabledPage = useTabledPage(
    collections.inventorySummary,
    inventorySummaryConverter,
    'productName',
    setInventorySummaryData,
  );

  const filterConfig: FilterConfig = {
    normal: [],
    ranged: [],
  };

  return (
    <TabledPageContext value={{ ...tabledPage }}>
      <TabledPage
        collectionString={collections.inventorySummary}
        converter={inventorySummaryConverter}
        data={inventorySummaryData}
        filterConfig={filterConfig}
        setData={setInventorySummaryData}
      >
        <div className={adminCommon.tableContainer}>
          {/* Table */}
        </div>
      </TabledPage>
    </TabledPageContext>
  );
}

// TODO:
function StockTable() {
  
}

