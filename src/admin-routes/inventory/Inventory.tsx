import classNames from 'classnames';
import { useState } from 'react';

import common from '../../styles/common-styles/AdminCommon.module.scss';
import { Products } from './Products';

export function Inventory() {
  const [tab, setTab] = useState('Stock');

  return (
    <div className={common.root}>
      <div className={common.tabButtons}>
        <button
          className={classNames(tab == 'Stock' && common.tabButtonActive)}
          onClick={() => {
            setTab('Stock');
          }}
        >
          Stock
        </button>
        <button
          className={classNames(tab == 'Products' && common.tabButtonActive)}
          onClick={() => {
            setTab('Products');
          }}
        >
          Products
        </button>
      </div>

      <hr />

      {tab === 'Stock' ? (
        // TODO: Show Stock component
        <div>This is the Stock tab</div>
      ) : (
        <Products />
      )}
    </div>
  );
}

