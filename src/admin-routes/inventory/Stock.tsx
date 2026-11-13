import classNames from 'classnames';
import { useState } from 'react';

import adminCommon from '../../styles/common-styles/AdminCommon.module.scss';
import { AllStock } from './AllStock';
import { Summaries } from './Summaries';

export function Stock () {
  const [tab, setTab] = useState<'All Stock' | 'Summaries'>('Summaries');
  const [productName, setProductName] = useState();

  const tabs: ('All Stock' | 'Summaries')[] = ['Summaries', 'All Stock'];

  return (
    <>
      <div className={classNames(
        adminCommon.innerTabButtons,
        adminCommon.tabButtons,
      )}>
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

      {tab === 'Summaries' ? (
        <Summaries
          setProductName={setProductName}
          setTab={setTab}
        />
      ) : (
        <AllStock
          productName={productName}
        />
      )}
    </>
  );
}

