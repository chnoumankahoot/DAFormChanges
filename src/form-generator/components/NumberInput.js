import React from 'react';
import { FormControl } from 'react-bootstrap';
import { normalizeId } from '../helpers/utility';

const NumberInput = ({
  id,
  title,
  onChange,
  value,
  preValue,
  className = '',
  hint = '',
  required = false,
  onFormChange,
  onClick,
  disabled = false,
  size
}) => {
  return (
    <FormControl
      id={id || normalizeId(title)}
      type="number"
      onChange={e => {
        if (onChange) onChange(e);
        if (onFormChange) onFormChange(e);
      }}
      defaultValue={value || preValue}
      className={className}
      placeholder={hint}
      required={required}
      onClick={onClick}
      disabled={disabled}
      size={size}
    />
  );
};

export default NumberInput;
