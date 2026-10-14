import classNames from 'classnames';
import { useState } from 'react';

import common from '../../styles/common-styles/AdminCommon.module.scss';
import { GeneralLedger } from './GeneralLedger';
import { LedgerTabContext } from './LedgerTabContext';
import { Purchases } from './Purchases';
import { Sales } from './Sales';

export function Ledger() {
  const [tab, setTab] = useState('General Ledger');

  // Used as the startAt cursor when going to a sale/purchase from a ledger entry and vice versa
  const [tabCursor, setTabCursor] = useState('');

  return (
    <LedgerTabContext value={{ setTab, setTabCursor, tabCursor }}>
      <div className={common.root}>
        <div className={common.tabButtons}>
          <button
            className={classNames(tab == 'General Ledger' && common.tabButtonActive)}
            onClick={() => {
              setTab('General Ledger');
              setTabCursor('');
            }}
          >
            General Ledger
          </button>
          <button
            className={classNames(tab == 'Sales' && common.tabButtonActive)}
            onClick={() => {
              setTab('Sales');
              setTabCursor('');
            }}
          >
            Sales
          </button>
          <button
            className={classNames(tab == 'Purchases' && common.tabButtonActive)}
            onClick={() => {
              setTab('Purchases');
              setTabCursor('');
            }}
          >
            Purchases
          </button>
        </div>
        <hr />

        {tab === 'General Ledger' ? (
          <GeneralLedger />
        ) : tab === 'Sales' ? (
          <Sales />
        ) : (
          <Purchases />
        )}
      </div>
    </LedgerTabContext>
  );
}
