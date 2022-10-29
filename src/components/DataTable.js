import moment from 'moment';
import React from 'react';
import { Table } from 'react-bootstrap';

const getText = value => {
  if (!value) return 'N/A';

  if (Array.isArray(value)) return value.length === 0 ? 'N/A' : value.join(', ');

  if (isISOString(value)) return moment(value).format('MMMM Do YYYY');

  if (typeof value === 'string') return value;
  return JSON.stringify(value);
};

function isISOString(dateString) {
  var r = /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/;
  return r.test(dateString);
}

const DataTable = ({ data, ignoreFields = [] }) => {
  return (
    <Table responsive bordered striped>
      <thead>
        <tr className="bg-primary text-white midFont">
          <th className="px-2 py-1">Field</th>
          <th className="px-2 py-1">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(data)
          .filter(k => !ignoreFields.includes(k))
          .map(k => (
            <tr className="smallFont">
              <td className="px-2 py-1">
                <b>{k}</b>
              </td>
              <td className="px-2 py-1">{getText(data[k])}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default DataTable;
