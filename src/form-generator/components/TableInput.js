import React, { useState } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { mapFieldToElement } from '../helpers/TypeToElemMapper';
import { DashCircleFill, PlusCircleFill } from 'react-bootstrap-icons';
import { normalizeId } from '../helpers/utility';

const getInitialRowCount = (required, initialRowCount, preValue) => {
  if (preValue) return preValue.length;

  return required && initialRowCount < 1 ? 1 : initialRowCount;
};

const TableInput = ({
  id,
  title,
  tableFields: fields = [],
  initialRowCount = 0,
  className = '',
  preValue,
  onFormChange,
  size,
  disabled = false,
  required = false,
  fixedRowCount = false
}) => {
  const [rowCount, setRowCount] = useState(getInitialRowCount(required, initialRowCount, preValue));

  const tableId = id;

  const removeRow = () => {
    if (rowCount > 0) {
      setRowCount(rowCount - 1);
    }
  };
  const addRow = () => {
    setRowCount(rowCount + 1);
  };

  const roundedHeader = index => {
    let className = '';
    if (index === 0) {
      className += ' rounded-left';
    }

    if (index === fields.length) {
      className += ' rounded-right';
    }
    return className;
  };

  const createTableRows = rowCount => {
    let tempRows = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      tempRows.push(createSingleRow(rowIndex));
    }

    return tempRows;
  };

  const createSingleRow = rowIndex => {
    return (
      <tr key={rowIndex}>
        {fields.map((field, index) => (
          <td key={index} className={`${roundedHeader(index)}  ${size === 'sm' ? 'p-1' : ''}`}>
            {mapFieldToElement({
              ...field,
              id: normalizeId(tableId + '-' + field.title + '-' + rowIndex),
              preValue: preValue && preValue[rowIndex] ? preValue[rowIndex][index] : null,
              onFormChange,
              size,
              disabled
            })}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <>
      <Table id={tableId} bordered className={'rounded ' + className} responsive>
        {/* mapping header */}
        <thead>
          <tr className={`bg-primary text-white`}>
            {fields.map((field, index) => (
              <th key={index} className={` text-center  ${size === 'sm' ? 'p-1' : ''} mid`}>
                {field.title}
              </th>
            ))}
          </tr>
        </thead>
        {/* mapping inputs */}
        {rowCount > 0 && <tbody>{createTableRows(rowCount)}</tbody>}
        {rowCount === 0 && (
          <tfoot>
            <tr>
              <td className={` mid text-center  ${size === 'sm' ? 'p-1' : ''}`} colSpan={fields.length}>
                Nothing to show
              </td>
            </tr>
          </tfoot>
        )}
      </Table>
      {!disabled && !fixedRowCount && (
        <Row className="text-right">
          <Col xs={12}>
            <Button
              size={size}
              variant="outline-success"
              onClick={() => {
                addRow();
              }}
            >
              <PlusCircleFill className="align-text-top" /> Add a row
            </Button>{' '}
            {rowCount > (required ? 1 : 0) && (
              <Button
                size={size}
                className="ml-md-3 mt-0"
                variant="outline-danger"
                onClick={() => {
                  removeRow();
                }}
              >
                <DashCircleFill className="align-text-top" /> Delete a row
              </Button>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};

export default TableInput;
