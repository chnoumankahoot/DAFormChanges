import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { DashCircleFill, PlusCircleFill } from 'react-bootstrap-icons';
import { TextInput } from '.';
import { normalizeId } from '../helpers/utility';

const MultiTextInput = ({ preValue, initialRowCount = 1, mutable = true, ...rest }) => {
  const [rowCount, setRowCount] = useState(preValue ? preValue.length : initialRowCount);

  const removeRow = () => {
    if (rowCount > 1) {
      setRowCount(rowCount - 1);
    }
  };
  const addRow = () => {
    setRowCount(rowCount + 1);
  };

  const createRows = () => {
    let tempRows = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      tempRows.push(createSingleRow(rowIndex));
    }

    return tempRows;
  };

  const createSingleRow = rowIndex => {
    return (
      <TextInput
        key={rowIndex}
        {...rest}
        className="mt-2"
        id={(rest.id || normalizeId(rest.title)) + '-' + rowIndex}
        preValue={preValue ? preValue[rowIndex] : null}
      />
    );
  };

  return (
    <>
      <div id={rest.id || normalizeId(rest.title)}>{createRows()}</div>
      {mutable && (
        <Row className="float-md-right mt-2">
          <Col xs={12}>
            <Button
              variant="outline-success"
              onClick={() => {
                addRow();
              }}
              size="sm"
            >
              <PlusCircleFill className="align-text-top" /> Add a row
            </Button>{' '}
            {rowCount > 1 && (
              <Button
                className="ml-md-3 mt-0"
                variant="outline-danger"
                onClick={() => {
                  removeRow();
                }}
                size="sm"
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

export default MultiTextInput;
