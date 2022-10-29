import React, { useEffect } from 'react';
import { getFormattedDate, normalizeId } from '../helpers/utility';

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
  options = [],
  onChangeFunction
}) => {
  let defaultValue = value || preValue;
  if (variant === 'date' && defaultValue) {
    const date = new Date(defaultValue);
    defaultValue = getFormattedDate(date);
  }

  useEffect(() => {
    internalOnChange(null);
  }, []);

  const internalOnChange = e => {
    if (onFormChange) onFormChange(e);

    if (onChange && window[onChange]) {
      window[onChange](e);
    }

    if (onChangeFunction) onChangeFunction(e);
  };

  const inputID = id || normalizeId(title);
  return (
    <>
      <input
        id={inputID}
        type={variant}
        onChange={internalOnChange}
        defaultValue={defaultValue}
        className={'form-control ' + className}
        as={textArea ? 'textarea' : 'input'}
        placeholder={hint}
        required={required}
        onClick={onClick}
        disabled={disabled}
        list={`${inputID}-list`}
      />
      <datalist id={`${inputID}-list`}>
        {options.map(option => (
          <option value={option} />
        ))}
      </datalist>
    </>
  );
};

export default TextInput;
