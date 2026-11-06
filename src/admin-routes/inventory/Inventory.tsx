import classNames from 'classnames';
import { useState } from 'react';

import common from '../../styles/common-styles/AdminCommon.module.scss';
import { Products } from './Products';
import { Stock } from './Stock';
import { Suppliers } from './Suppliers';

export function Inventory() {
  const [tab, setTab] = useState('Stock');

  const tabs = ['Stock', 'Products', 'Suppliers'];

  return (
    <div className={common.root}>
      <div className={common.tabButtons}>
        {tabs.map(tabName => (
          <button
            className={classNames(tab == tabName && common.tabButtonActive)}
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

      {tab === 'Stock' ? (
        <Stock />
      ) : tab === 'Products' ? (
        <Products />
      ) : (
        <Suppliers />
      )}
    </div>
  );
}

