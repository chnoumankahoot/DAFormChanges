import React, { useEffect } from 'react';

const DropDownInput = ({
  id,
  options = [],
  optionValues,
  title,
  className = '',
  onChange = '',
  value: defaultValue = '',
  preValue,
  onFormChange,
  disabled = false,
  onChangeFunction,
  size,
  dependentElems = [],
  showDependentOn = ''
}) => {
  if (preValue) defaultValue = preValue;
  //called after render only once
  useEffect(() => {
    internalOnChange(null, false);
  }, []);

  const showHideDependentElement = element => {
    const elementContainer = document.getElementById(`${element.id}-col-container`);
    if (document.getElementById(id).value === showDependentOn) {
      elementContainer.classList.remove('d-none');
      element.required = true;
    } else {
      elementContainer.classList.add('d-none');
      element.required = null;
      element.value = '';
    }
  };

  const internalOnChange = (e, checkForm = true) => {
    if (checkForm && onFormChange) onFormChange(e);

    //run internal functions here
    if (dependentElems.length > 0) {
      dependentElems
        .map(dependentElem => document.getElementById(dependentElem))
        .forEach(dependentElement => {
          dependentElement && showHideDependentElement(dependentElement);
        });
    }

    if (onChange && window[onChange]) {
      window[onChange](e);
    }

    if (onChangeFunction) onChangeFunction(e);
  };

  return (
    <select
      disabled={disabled}
      defaultValue={defaultValue}
      className={`form-control ${size === 'sm' ? 'form-control-sm' : ''} ${className}`}
      id={id}
      onChange={internalOnChange}
    >
      {options.map((option, index) => {
        return (
          <option key={index} value={optionValues ? optionValues[index] : option}>
            {option}
          </option>
        );
      })}
    </select>
  );
};

export default DropDownInput;
