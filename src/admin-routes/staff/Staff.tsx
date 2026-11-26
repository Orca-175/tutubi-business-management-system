import classNames from 'classnames';
import { useState } from 'react';

import adminCommon from '../../styles/common-styles/AdminCommon.module.scss';
import { Employees } from './employees-tab/Employees';
import { Roles } from './roles-tab/Roles';

export function Staff() {
  const [tab, setTab] = useState('Roles');

  const tabs = ['Roles', 'Employees'];

  return (
    <div className={adminCommon.root}>
      <div className={adminCommon.tabButtons}>
        {tabs.map(tabName => (
          <button
            className={classNames(tab == tabName && adminCommon.tabButtonActive)}
            key={tabName}
            onClick={() => {
              setTab(tabName);
            }}
          >
            {tabName}
          </button>
        ))}
      </div>

      <hr />

      {tab === 'Roles' ? (
        <Roles />
      ) : (
        <Employees />
      )}
    </div>
  );
}

