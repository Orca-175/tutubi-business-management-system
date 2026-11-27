import type { Role, RoleData } from 'shared/interfaces/firestore-collections';

import { useState } from 'react';
import { BiChevronDown, BiChevronUp, BiSolidEdit, BiSolidTagX } from 'react-icons/bi';
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
import { handleExpandTable } from '../../../utils/helpers/handleExpandTable';
import { capitalize } from '../../../utils/strings';
import { AddRoleDataForm } from './AddRoleDataForm';
import { EditRoleDataForm } from './EditRoleDataForm';

interface RolesTableProps {
  isDeleteMode: boolean;
  rolesData: RoleData[];
}

export function Roles() {
  const [rolesData, setRolesData] = useState<RoleData[]>([]);

  const tableCardButtonsProps = useTableCardButtons();
 
  const tabledPageProps = useTabledPage(
    collections.roles,
    getCollectionConverter<Role>(),
    'name',
    setRolesData,
  );

  const filterConfig: FilterConfig = {
    normal: [{
      field: 'name',
      label: 'Role',
      type: 'select',
    }],
  };

  return (
    <TabledPageContext value={{ ...tabledPageProps }}>
      <TabledPage
        collectionString={collections.roles}
        filterConfig={filterConfig}
        setData={setRolesData}
      >
        <>
          <TableCardButtons
            { ...tableCardButtonsProps }
          />

          <div className={adminCommon.tableContainer}>
            <RolesTable
              isDeleteMode={tableCardButtonsProps.isDeleteMode}
              rolesData={rolesData}
            />
          </div>
        </>
      </TabledPage>

      <AddRoleDataForm
        formRef={tableCardButtonsProps.addFormRef}
      />
    </TabledPageContext>
  );
}

function RolesTable({
  isDeleteMode,
  rolesData,
}: RolesTableProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  const {
    cleanupDataForDialogs,
    dataToDelete,
    deleteDataFormRef,
    editDataFormRef,
    originalData,
    setDataToDelete,
    setOriginalData,
  } = useMutableTableData<RoleData>();

  return (
    <>
      {rolesData.length === 0 ? (
        <div className={adminCommon.dataNotFoundMessage}>
          Data not found.
        </div>
      ) : (
        <table className={adminCommon.tableAdmin}>
          <thead>
            <tr>
              <th>Role</th>
              <th>Description</th>
              <th>More</th>
              {isDeleteMode ? (
                <th className={adminCommon.tableButtonHeading}>Delete</th>
              ) : (
                <th className={adminCommon.tableButtonHeading}>Edit</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rolesData.map(data => {
              return (
                <>
                  <tr key={data.docId}>
                    <td>{data.name}</td>
                    <td>{data.description}</td>
                    <td className={adminCommon.tableButtonCell}>
                      <button
                        className={adminCommon.tableButtonNormal}
                        onClick={() => handleExpandTable(
                          setExpanded,
                          expanded,
                          data.docId,
                        )}
                      >
                        {expanded.includes(data.docId) ? (
                          <BiChevronUp />
                        ) : (
                          <BiChevronDown />
                        )}
                      </button>
                    </td>
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

                  {/* Role info subtable */}
                  {expanded.includes(data.docId) &&
                    <tr key={data.docId + 'roleInfo'}>
                      <td colSpan={4}>
                        <div className={adminCommon.subtableContainer}>
                          <table>
                            <thead>
                              <tr>
                                <th>Page</th>
                                <th>Read</th>
                                <th>Write</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(data.pagePermissions).map(([pageName, permissions]) => {
                                const read = capitalize(String(permissions.read));
                                const write = capitalize(String(permissions.write));

                                return (
                                  <tr>
                                    <td>{capitalize(pageName)}</td>
                                    <td>{read}</td>
                                    <td>{write}</td>
                                  </tr>
                                );
                              })}
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
      )}

      {dataToDelete &&
        <DeleteDataDialog
          cleanupDataForDialogs={cleanupDataForDialogs}
          collectionString={collections.roles}
          docId={dataToDelete.docId}
          formRef={deleteDataFormRef}
          identifier={dataToDelete.name}
        />
      }

      {originalData &&
        <EditRoleDataForm
          cleanupDataForDialogs={cleanupDataForDialogs}
          formRef={editDataFormRef}
          initialData={originalData}
        />
      }
    </>
  );

}

