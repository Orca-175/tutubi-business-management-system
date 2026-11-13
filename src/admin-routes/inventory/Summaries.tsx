import type { InventorySummary, InventorySummaryData } from 'shared/interfaces/firestore-collections';

import { type Dispatch, type SetStateAction, useState } from 'react';
import { BiChevronRight } from 'react-icons/bi';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { FilterConfig } from '../../interfaces/FilterConfig';

import { TabledPage } from '../../components/TabledPage/TabledPage';
import { TabledPageContext } from '../../context/TabledPageContext';
import { getCollectionConverter } from '../../firebase/converters/collectionConverter';
import { useTabledPage } from '../../hooks/useTabledPage'; 
import adminCommon from '../../styles/common-styles/AdminCommon.module.scss';

interface Props {
  setProductName: Dispatch<SetStateAction<string>>;
  setTab: Dispatch<SetStateAction<'All Stock' | 'Summaries'>>;
}

interface SummariesTableProps {
  inventorySummariesData: InventorySummaryData[],
  setProductName: Dispatch<SetStateAction<string>>;
  setTab: Dispatch<SetStateAction<'All Stock' | 'Summaries'>>;
}

export function Summaries(props: Props) {
  const [inventorySummariesData, setInventorySummariesData] = useState<InventorySummaryData[]>([]);

  const tabledPageProps = useTabledPage(
    collections.inventorySummaries,
    getCollectionConverter<InventorySummary>(),
    'productName',
    setInventorySummariesData,
  );

  const filterConfig: FilterConfig = {
    normal: [
      {
        field: 'productName',
        label: 'Product name',
        type: 'text',
      },
    ],
    ranged: [
      {
        field: 'totalCurrentQuantity',
        label: 'Total current quantity',
        type: 'number',
      },
      {
        field: 'totalOutgoingQuantity',
        label: 'Total outgoing quantity',
        type: 'number',
      },
    ],
  };

  return (
    <TabledPageContext value={{ ...tabledPageProps }}>
      <TabledPage
        collectionString={collections.inventorySummaries}
        filterConfig={filterConfig}
        setData={setInventorySummariesData}
      >
        {inventorySummariesData.length === 0 ? (
          <div className={adminCommon.dataNotFoundMessage}>
            Data not found.
          </div>
        ) : (
          <div className={adminCommon.tableContainer}>
            <SummariesTable
              {...props}
              inventorySummariesData={inventorySummariesData}
            />
          </div>
        )}
      </TabledPage>
    </TabledPageContext>
  );
}

function SummariesTable({
  inventorySummariesData,
  setProductName,
  setTab,
}: SummariesTableProps) {
  return (
    <table className={adminCommon.tableAdmin}>
      <thead>
        <tr>
          <th>Product name</th>
          <th>Total current quantity</th>
          <th>Total outgoing quantity</th>
          <th className={adminCommon.tableButtonHeading}>More</th>
        </tr>
      </thead>
      <tbody>
        {inventorySummariesData.map(data => {
          return (
            <tr key={data.docId}>
              <td>{data.productName}</td>
              <td>{data.totalCurrentQuantity}</td>
              <td>{data.totalOutgoingQuantity}</td>
              <td className={adminCommon.tableButtonCell}>
                <button
                  className={adminCommon.tableButtonNormal}
                  onClick={() => {
                    setProductName(data.productName);
                    setTab('All Stock');
                  }}
                >
                  <BiChevronRight />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

