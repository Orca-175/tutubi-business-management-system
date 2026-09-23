import common from '../../styles/common-styles/Common.module.scss';

export function Inventory() {
  return (
    <div className={common.root}>
      <h2>View Inventory</h2>
      <hr />
      <div className={common.card}>
        <div className={common.tableContainer}>
          <table>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
