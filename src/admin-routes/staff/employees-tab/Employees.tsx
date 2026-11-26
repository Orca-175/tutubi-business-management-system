import type { Employee, EmployeeData } from 'shared/interfaces/firestore-collections';

import { useState } from 'react';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import { TableCardButtons } from '../../../components/TableCardButtons';
import { TabledPage } from '../../../components/TabledPage/TabledPage';
import { TabledPageContext } from '../../../context/TabledPageContext';
import { getCollectionConverter } from '../../../firebase/converters/collectionConverter';
import { useTableCardButtons } from '../../../hooks/useTableCardButtons';
import { useTabledPage } from '../../../hooks/useTabledPage';

export function Employees() {
  const [employeesData, setEmployeesData] = useState<EmployeeData[]>([]);

  const tableCardButtonsProps = useTableCardButtons();

  const tabledPageProps = useTabledPage(collections.employees, getCollectionConverter<Employee>(), 'fullName.firstName', setEmployeesData);

  return (
    <TabledPageContext value={{ ...tabledPageProps }}>
      <TabledPage
        collectionString={collections.employees}
        setData={setEmployeesData}
      >
        <>
          <TableCardButtons
            { ...tableCardButtonsProps }
          />

          {/* employees table */}
        </>
      </TabledPage>
    </TabledPageContext>
  );
}

