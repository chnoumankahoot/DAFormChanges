import React from 'react';
import { FormControl } from 'react-bootstrap';
import { normalizeId } from '../helpers/utility';

const RadioInput = ({
  id,
  title,
  groupName = '',
  defaultChecked,
  onChange,
  value,
  showLabel = false,
  className = '',
  label = '',
  groupID = '',
  size,
  disabled
}) => {
  const inputId = id || normalizeId(`${groupID || groupName}-${value || title}`);
  return (
    <div className={'d-inline-flex ' + className}>
      <FormControl
        id={inputId}
        type="radio"
        name={groupName}
        style={size === 'sm' ? styles.radiosm : styles.radio}
        defaultChecked={defaultChecked}
        onChange={onChange}
        value={value}
        size={size}
        disabled={disabled}
      />
      {showLabel && (
        <label style={size === 'sm' ? { fontSize: 14 } : undefined} htmlFor={inputId} className="ml-2 my-auto">
          {label || title}
        </label>
      )}
    </div>
  );
};

const styles = {
  radio: {
    height: 22,
    width: 22,
    margin: 'auto'
  },
  radiosm: {
    height: 17,
    width: 17,
    margin: 'auto'
  }
};

export default RadioInput;
