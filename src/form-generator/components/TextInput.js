import React from 'react';
import { FormControl } from 'react-bootstrap';
import { normalizeId, getFormattedDate } from '../helpers/utility';

const TextInput = ({
  id,
  title,
  onChange,
  onFormChange,
  value,
  preValue,
  className = '',
  textArea = false,
  hint = '',
  required = false,
  variant = 'text',
  onClick,
  disabled = false,
  onKeyPress,
  size,
  min,
  max,
  row = 2
}) => {
  let defaultValue = value || preValue;
  if (variant === 'date') {
    if (defaultValue) {
      const date = new Date(defaultValue);
      defaultValue = getFormattedDate(date);
    }

    if (min) {
      const date = new Date(min);
      min = getFormattedDate(date);
    }

    if (max) {
      const date = new Date(max);
      max = getFormattedDate(date);
    }
  }
  return (
    <FormControl
      id={id || normalizeId(title)}
      type={variant}
      onChange={e => {
        if (onChange) onChange(e);
        if (onFormChange) onFormChange(e);
      }}
      defaultValue={defaultValue}
      className={className}
      as={textArea ? 'textarea' : 'input'}
      placeholder={hint}
      required={required}
      onClick={onClick}
      disabled={disabled}
      onKeyPress={onKeyPress}
      size={size}
      min={min}
      max={max}
      rows={row}
    ></FormControl>
  );
};

export default TextInput;
