import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { TextInput } from '.';
import { normalizeId } from '../helpers/utility';
import CheckBoxInput from './CheckBoxInput';

const CheckBoxGroup = ({
  id,
  groupName,
  options = [],
  className = '',
  defaultValues = [],
  onChange,
  onChangeFunction,
  title = '',
  disabled = false,
  preValue,
  boxWidth = 6,
  required = false,
  dependentElem,
  showDependentOn = '',
  size,
  searchable
}) => {
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOptionCount, setSelectedOptionCount] = useState(defaultValues.length);

  if (preValue) defaultValues = preValue;
  const groupId = groupName || id;

  //called after render only once
  useEffect(() => {
    internalOnChange();
  }, []);

  const showHideDependentElement = element => {
    let showElem = false;

    const radios = [...document.getElementsByName(groupId)];
    for (let index = 0; index < radios.length; index++) {
      const radio = radios[index];
      if (radio.checked && radio.value === showDependentOn) {
        showElem = true;
        break;
      }
    }

    if (showElem) {
      element.classList.remove('d-none');
      element.required = true;
    } else {
      element.classList.add('d-none');
      element.required = null;
    }
  };

  const internalOnChange = e => {
    //run internal functions here
    if (dependentElem) {
      const dependentElement = document.getElementById(dependentElem);
      dependentElement && showHideDependentElement(dependentElement);
    }

    onChange && window[onChange] && window[onChange](e);
    onChangeFunction && onChangeFunction(e);

    const selectedCount = [...document.getElementsByName(groupName)].filter(
      input => input.type === 'checkbox' && input.checked
    ).length;
    setSelectedOptionCount(selectedCount);
  };

  useEffect(() => {
    if (!query) {
      return setFilteredOptions([]);
    }

    setFilteredOptions(
      options.filter(o => o.option.toLowerCase().includes(query.trim().toLowerCase())).map(o => o['option'])
    );
  }, [query]);

  return (
    <>
      {searchable && (
        <Row className="mb-2">
          <Col xs={12} className="px-5">
            <TextInput size={size} hint="Search options here" onChange={e => setQuery(e.target.value)} />
          </Col>
          <Col className="text-right text-muted small px-5">
            <i>{selectedOptionCount === options.length ? 'All' : selectedOptionCount} options selected</i>
          </Col>
          {filteredOptions.length === 0 && (
            <Col xs={12}>
              <h6 className="text-center text-muted p-4 small">
                {!query ? 'Nothing to show. Type in the search box to view options.' : 'No matching options found!'}
              </h6>
            </Col>
          )}
        </Row>
      )}
      <Row className={'mb-2 ' + (required ? 'fg-checkbox-group' : '')} id={normalizeId(groupId)}>
        {options.map((option, index) => {
          const { option: label, value } = option;
          return (
            <Col key={index} xs={12} md={boxWidth} hidden={searchable && !filteredOptions.includes(label)}>
              <CheckBoxInput
                showLabel
                id={normalizeId(groupId + '-' + value)}
                key={index}
                label={label}
                groupName={groupId}
                defaultChecked={defaultValues.includes(value)}
                value={value}
                onChangeFunction={internalOnChange}
                className="ml-3"
                disabled={disabled}
                size={size}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default CheckBoxGroup;
