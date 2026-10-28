import classNames from 'classnames';
import { useState } from 'react';

import common from '../../styles/common-styles/AdminCommon.module.scss';
import { Products } from './Products';
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
        // TODO: Show Stock component
        <div>This is the Stock tab</div>
      ) : tab === 'Products' ? (
        <Products />
      ) : (
        <Suppliers />
      )}
    </div>
  );
}

