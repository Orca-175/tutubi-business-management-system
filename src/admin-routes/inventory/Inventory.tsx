import common from '../../styles/common-styles/AdminCommon.module.scss';

export function Inventory() {
  return (
    <div className={common.root}>
      <h2>View Inventory</h2>
      <hr />
      <div className={common.card}>
        <div className={common.tableContainer}>
          <table className={common.tableAdmin}>
            <thead>
              <tr>
                <th>Field</th>
                <th>Field</th>
                <th>Field</th>
                <th>Field</th>
                <th>Field</th>
                <th>Field</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
              <tr>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
