import React, { useEffect } from 'react';
import RadioInput from './RadioInput';

const RadioInputGroup = ({
  id: groupID,
  options,
  values,
  title,
  className = '',
  onChange = '',
  value: defaultValue = '',
  dependentElem,
  showDependentOn = '',
  preValue,
  onFormChange,
  size,
  allowNoneChecked = false,
  disabled = false
}) => {
  if (preValue) defaultValue = preValue;
  //called after render only once
  useEffect(() => {
    internalOnChange(false);
  }, []);

  const showHideDependentElement = element => {
    let showElem = false;

    const radios = [...document.getElementsByName(groupID || title)];
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

  const internalOnChange = (checkForm = true) => {
    if (checkForm) onFormChange();
    //run internal functions here
    if (dependentElem) {
      const dependentElement = document.getElementById(dependentElem);
      dependentElement && showHideDependentElement(dependentElement);
    }

    if (onChange && window[onChange]) {
      window[onChange]();
    }
  };

  const getValue = index => {
    if (!values || values.length - 1 < index) return options[index];

    return values[index];
  };

  return (
    <div id={groupID} className={'mb-3 ' + className}>
      {options.map((option, index) => {
        const value = getValue(index);
        return (
          <RadioInput
            key={index}
            groupID={groupID}
            title={option}
            groupName={groupID || title}
            defaultChecked={defaultValue ? defaultValue == value : !allowNoneChecked && index === 0}
            value={value}
            onChange={internalOnChange}
            className="ml-3"
            showLabel
            size={size}
            inline
            disabled={disabled}
          />
        );
      })}
    </div>
  );
};

export default RadioInputGroup;
