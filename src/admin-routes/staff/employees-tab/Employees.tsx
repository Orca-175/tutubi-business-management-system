import type { Employee, EmployeeData } from 'shared/interfaces/firestore-collections';

import { useState } from 'react';
import { BiSolidEdit, BiSolidTagX } from 'react-icons/bi';
import { addressToString, fullNameToString } from 'shared/helpers';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { FilterConfig } from '../../../interfaces/FilterConfig';

import { DeleteDataDialog } from '../../../components/DeleteDialog/DeleteDataDialog';
import { TableCardButtons } from '../../../components/TableCardButtons';
import { TabledPage } from '../../../components/TabledPage/TabledPage';
import { TabledPageContext } from '../../../context/TabledPageContext';
import { getCollectionConverter } from '../../../firebase/converters/collectionConverter';
import { useMutableTableData } from '../../../hooks/useMutableTableData';
import { useTableCardButtons } from '../../../hooks/useTableCardButtons';
import { useTabledPage } from '../../../hooks/useTabledPage';
import adminCommon from '../../../styles/common-styles/AdminCommon.module.scss';
import { AddEmployeeDataForm } from './AddEmployeeDataForm';
import { EditEmployeeDataForm } from './EditEmployeeDataForm';

interface EmployeesTableProps {
  employeesData: EmployeeData[];
  isDeleteMode: boolean;
}

export function Employees() {
  const [employeesData, setEmployeesData] = useState<EmployeeData[]>([]);

  const tableCardButtonsProps = useTableCardButtons();

  const tabledPageProps = useTabledPage(collections.employees, getCollectionConverter<Employee>(), 'fullName.firstName', setEmployeesData);

  const filterConfig: FilterConfig = {
    normal: [
      {
        field: 'role.name',
        label: 'Role',
        type: 'select',
      },
    ],
    ranged: [
      {
        field: 'createdAt',
        label: 'Created at',
        type: 'number',
      },
    ],
  };

  return (
    <TabledPageContext value={{ ...tabledPageProps }}>
      <TabledPage
        collectionString={collections.employees}
        filterConfig={filterConfig}
        setData={setEmployeesData}
      >
        <>
          <TableCardButtons
            { ...tableCardButtonsProps }
          />

          <EmployeesTable
            employeesData={employeesData}
            isDeleteMode={tableCardButtonsProps.isDeleteMode}
          />
        </>
      </TabledPage>

      <AddEmployeeDataForm
        formRef={tableCardButtonsProps.addFormRef}
      />
    </TabledPageContext>
  );
}

function EmployeesTable({
  employeesData,
  isDeleteMode,
}: EmployeesTableProps) {
  const {
    cleanupDataForDialogs,
    dataToDelete,
    deleteDataFormRef,
    editDataFormRef,
    originalData,
    setDataToDelete,
    setOriginalData,
  } = useMutableTableData<EmployeeData>();

  return (
    <>
      {employeesData.length === 0 ? (
        <div className={adminCommon.dataNotFoundMessage}>
          Data not found.
        </div>
      ) : (
        <table className={adminCommon.tableAdmin}>
          <thead>
            <tr>
              <th>Created at</th>
              <th>Employee</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
                {isDeleteMode ? (
                  <th className={adminCommon.tableButtonHeading}>Delete</th>
                ) : (
                  <th className={adminCommon.tableButtonHeading}>Edit</th>
                )}
            </tr>
          </thead>
          <tbody>
            {employeesData.map(data => {
              const createdAt = data.createdAt.toDate().toLocaleDateString();

              let fullName = fullNameToString(data.fullName);
              for (const [key, value] of Object.entries(data.fullName)) {
                if (key === 'middleName') {
                  continue;
                }

                if (value === '') {
                  fullName = 'Not set';
                }
              }

              let address = addressToString(data.address);
              for (const value of Object.values(data.address)) {
                if (value === '') {
                  address = 'Not set';
                }
              }

              return (
                <tr>
                  <td>{createdAt}</td>
                  <td>{fullName}</td>
                  <td>{address}</td>
                  <td>{data.email}</td>
                  <td>{data.phone}</td>
                  <td>{data.role.name}</td>
                    {isDeleteMode ? (
                      <td className={adminCommon.tableButtonCell}>
                        <button
                          className={adminCommon.tableButtonDelete}
                          onClick={async event => {
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
                          className={adminCommon.tableButtonNormal}
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
              );
            })}
          </tbody>
        </table>
      )}

      {dataToDelete &&
        <DeleteDataDialog
          cleanupDataForDialogs={cleanupDataForDialogs}
          collectionString={collections.roles}
          docId={dataToDelete.docId}
          formRef={deleteDataFormRef}
          identifier={dataToDelete.email}
        />
      }

      {originalData &&
        <EditEmployeeDataForm
          cleanupDataForDialogs={cleanupDataForDialogs}
          formRef={editDataFormRef}
          initialData={{
            employeeDocId: originalData.docId,
            roleDocId: originalData.role.docId,
            roleName: originalData.role.name,
          }}
        />
      }
    </>
  );
}

