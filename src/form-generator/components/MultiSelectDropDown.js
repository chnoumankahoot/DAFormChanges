import { Button, Col, Modal, Row } from 'react-bootstrap';
import React, { useState } from 'react';
import { normalizeId } from '../helpers/utility';

const MultiSelectDropDown = ({
  id,
  options = [],
  title,
  onChange = '',
  onChangeFunction,
  value: defaultValue = '',
  preValue,
  disabled = false,
  className = '',
  size
}) => {
  if (preValue) defaultValue = preValue;

  const [selections, setSelections] = useState(defaultValue ? options.filter(o => defaultValue.includes(o.value)) : []);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSelection = e => {
    const checked = e.target.checked;
    const value = e.target.value;
    const option = e.target.getAttribute('data-option');
    const index = selections.findIndex(selection => selection.value === value);

    let newSelections;
    if (checked) {
      if (index === -1) {
        newSelections = [...selections, { option, value }];

        setSelections(newSelections);
      }
    } else {
      if (index !== -1) selections.splice(index, 1);
      newSelections = [...selections];
      setSelections(newSelections);
    }

    if (onChangeFunction && newSelections) onChangeFunction(newSelections);
  };

  const SelectionModal = () => {
    return (
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 15 }}>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {options.map((option, index) => {
              const { option: label, value } = option;
              const inputId = id + '-' + normalizeId(label);
              return (
                <Col key={index} xs={12}>
                  <div className={'form-check'}>
                    <input
                      id={inputId}
                      className="form-check-input"
                      type="checkbox"
                      style={styles.checkbox}
                      checked={selections.findIndex(selection => selection.value === value) !== -1}
                      onChange={handleSelection}
                      value={value}
                      data-option={label}
                      disabled={disabled}
                    />

                    <label htmlFor={inputId} className="ml-2 form-check-label my-1">
                      {label}
                    </label>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="primary" onClick={handleClose}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const getSelections = () => {
    if (selections.length < 2) {
      return selections[0].option;
    }

    return `${selections[0].option} and ${selections.length - 1} others`;
  };

  return (
    <>
      {SelectionModal()}
      <div
        id={id}
        className={`form-control ${className}`}
        onClick={() => {
          setShowModal(true);
        }}
        data-selections={selections.map(selection => selection.value).join(',')}
      >
        {selections.length === 0 ? 'Select...' : getSelections()}
      </div>
    </>
  );
};

const styles = {
  checkbox: {
    height: 22,
    width: 22
  }
};

export default MultiSelectDropDown;
