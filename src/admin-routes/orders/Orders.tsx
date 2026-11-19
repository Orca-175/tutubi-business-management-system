import type { Order, OrderData } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { useState } from 'react';
import { BiChevronDown, BiChevronUp, BiSolidEdit, BiSolidTagX } from 'react-icons/bi';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { FilterConfig } from '../../interfaces/FilterConfig';

import { DeleteDataDialog } from '../../components/DeleteDialog/DeleteDataDialog';
import { EditDataForm } from '../../components/InputForms/EditDataForm';
import { TableCardButtons } from '../../components/TableCardButtons';
import { TabledPage } from '../../components/TabledPage/TabledPage';
import { TabledPageContext } from '../../context/TabledPageContext';
import { getCollectionConverter } from '../../firebase/converters/collectionConverter';
import { useMutableTableData } from '../../hooks/useMutableTableData';
import { useTableCardButtons } from '../../hooks/useTableCardButtons';
import { useTabledPage } from '../../hooks/useTabledPage';
import adminCommon from '../../styles/common-styles/AdminCommon.module.scss';
import { addressToString } from '../../utils/helpers/addressToString';
import { fullNameToString } from '../../utils/helpers/fullNameToString';
import { capitalize } from '../../utils/strings';

interface OrdersTableProps {
  isDeleteMode: boolean;
  ordersData: OrderData[];
}

export function Orders() {
  const [ordersData, setOrdersData] = useState<OrderData[]>([]);

  const {
    isDeleteMode,
    isMoreExpanded,
    setIsDeleteMode,
    setIsMoreExpanded,
  } = useTableCardButtons();

  const tabledPageProps = useTabledPage(
    collections.orders,
    getCollectionConverter<Order>(),
    'createdAt',
    setOrdersData,
  );

  const filterConfig: FilterConfig = {
    normal: [
      {
        field: 'customerName',
        label: 'Customer name',
        type: 'text',
      },
      {
        field: 'product',
        label: 'Customer name',
        type: 'text',
      },
      {
        field: 'status',
        label: 'Order status',
        type: 'select',
      },
    ],
    ranged: [
      {
        field: 'createdAt',
        label: 'Created at',
        type: 'date',
      },
      {
        field: 'quantity',
        label: 'Quantity',
        type: 'number',
      },
    ],
  };

  return (
    <div className={adminCommon.root}>
      <h2>Orders</h2>

      <hr />

      <TabledPageContext value={{ ...tabledPageProps }}>
        <TabledPage
          collectionString={collections.orders}
          filterConfig={filterConfig}
          setData={setOrdersData}
        >
          <>
            <TableCardButtons
              isDeleteMode={isDeleteMode}
              isMoreExpanded={isMoreExpanded}
              setIsDeleteMode={setIsDeleteMode}
              setIsMoreExpanded={setIsMoreExpanded}
            />

            {ordersData.length === 0 ? (
              <div className={adminCommon.dataNotFoundMessage}>
                Data not found.
              </div>
            ) : (
              <OrdersTable
                isDeleteMode={isDeleteMode}
                ordersData={ordersData}
              />
            )}
          </>
        </TabledPage>
      </TabledPageContext>

    </div>
  );
}

function OrdersTable({
  isDeleteMode,
  ordersData,
}: OrdersTableProps) {
  const {
    cleanupDataForDialogs,
    dataToDelete,
    deleteDataFormRef,
    editDataFormRef,
    originalData,
    setDataToDelete,
    setOriginalData,
  } = useMutableTableData<OrderData>();

  const [expanded, setExpanded] = useState<string[]>([]);

  return (
    <>
      <table className={adminCommon.tableAdmin}>
        <thead>
          <tr>
            <th>Created at</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Batch number</th>
            <th>Address</th>
            <th>Status</th>
            <th className={adminCommon.tableButtonHeading}>More</th>
            {isDeleteMode ? (
              <th className={adminCommon.tableButtonHeading}>Delete</th>
            ) : (
              <th className={adminCommon.tableButtonHeading}>Edit</th>
            )}
          </tr>
        </thead>
        <tbody>
          {ordersData.map(data => {
            const createdAt = data.createdAt.toDate().toLocaleDateString();
            const isToBeDelivered = capitalize(String(data.reservationInfo?.isToBeDelivered));
            const reserveUntil = data.reservationInfo?.reservedUntil.toDate().toLocaleDateString();

            return (
              <>
                {/* Main table */}
                <tr key={data.docId}>
                  <td>{createdAt}</td>
                  <td>{fullNameToString(data.customerName)}</td>
                  <td>{data.productName}</td>
                  <td>{data.quantity}</td>
                  <td>{data.batchNumber}</td>
                  <td>{addressToString(data.customerAddress)}</td>
                  <td>{data.status}</td>
                  <td className={adminCommon.tableButtonCell}>
                    {data.isReservation &&
                      <button
                        className={adminCommon.tableButtonNormal}
                        onClick={() => {
                          if (expanded.includes(data.docId)) {
                            setExpanded(expanded.toSpliced(expanded.findIndex(id => id === data.docId), 1));
                          } else {
                            const tempExpanded = [...expanded];
                            tempExpanded.push(data.docId);
                            setExpanded(tempExpanded);
                          }
                        }}
                      >
                        {expanded.includes(data.docId) ? (
                          <BiChevronUp />
                        ) : (
                          <BiChevronDown />
                        )}
                      </button>
                    }
                  </td>
                  {isDeleteMode ? (
                    <td className={adminCommon.tableButtonCell}>
                      <button
                        className={adminCommon.tableButtonDelete}
                        onClick={event => {
                          event.preventDefault();

                          setDataToDelete(data);
                        }}
                      >
                        <BiSolidTagX />
                      </button>
                    </td>
                  ) : (
                    <td className={adminCommon.tableButtonCell}>
                      <button
                        className={classNames(
                          data.status === 'Cancelled' || data.status === 'Received' ? (
                            adminCommon.tableButtonDisabled
                          ) : (
                            adminCommon.tableButtonNormal
                          ),
                        )}
                        disabled={data.status === 'Cancelled' || data.status === 'Received'}
                        onClick={event => {
                          event.preventDefault();

                          setOriginalData(data);
                        }}
                      >
                        <BiSolidEdit />
                      </button>
                    </td>
                  )}
                </tr>

                {/* Subtable (reservation info) */}
                {data.isReservation && expanded.includes(data.docId) &&
                  <tr>
                    <td colSpan={9}>
                      <div className={adminCommon.subtableContainer}>
                        <table>
                          <thead>
                            <tr>
                              <th>To be delivered</th>
                              <th>Reserve until</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{isToBeDelivered}</td>
                              <td>{reserveUntil}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                }
              </>
            );
          })}
        </tbody>
      </table>

      {dataToDelete &&
        <DeleteDataDialog
          cleanupDataForDialogs={cleanupDataForDialogs}
          collectionString={collections.orders}
          docId={dataToDelete.docId}
          formRef={deleteDataFormRef}
          identifier={`${fullNameToString(dataToDelete.customerName)}'s order`}
        />
      }

      {originalData &&
        <EditDataForm<OrderData>
          cleanupDataForDialogs={cleanupDataForDialogs}
          collectionString={collections.orders}
          formRef={editDataFormRef}
          heading={'Set order status'}
          initialData={originalData}
          inputsGroups={[
            [{
              field: 'status',
              label: 'Status',
              optionDefault: {
                label: originalData.isReservation ? 'Reserved' : 'New',
                value: originalData.isReservation ? 'Reserved' : 'New',
              },
              options: [
                {
                  label: 'Confirmed',
                  value: 'Confirmed',
                },
                {
                  label: 'Out for delivery',
                  value: 'Out for delivery',
                },
              ],
              type: 'select',
            }],
          ]}
        />
      }
    </>
  );
}

