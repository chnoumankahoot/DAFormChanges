import React, { useState } from 'react';
import { Check, Pen, X } from 'react-bootstrap-icons';
import TextInput from '../form-generator/components/TextInput';

const TextWithEdit = ({ text, onSubmit, preFix = '', required, onRequiredInvalidation }) => {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(text);
  const [disabled, setDisabled] = useState(false);

  const onValueSubmit = async () => {
    if (required && !value) {
      onRequiredInvalidation && onRequiredInvalidation();
      return;
    }

    setDisabled(true);
    onSubmit && (await onSubmit(value));
    setDisabled(false);
    setEditMode(false);
  };

  return editMode ? (
    <div className="d-flex align-items-center">
      {preFix}
      <div className="flex-grow-1">
        <TextInput disabled={disabled} value={value} onChange={e => setValue(e.target.value)} />
      </div>
      <div>
        <Check
          className={`ml-2 ${disabled ? 'text-muted' : 'text-success hover-light'}`}
          size={16}
          onClick={() => {
            if (!disabled) onValueSubmit();
          }}
        />
        <X
          className={`ml-2 ${disabled ? 'text-muted' : 'text-danger hover-light'}`}
          size={16}
          onClick={() => {
            if (!disabled) setEditMode(false);
          }}
        />
      </div>
    </div>
  ) : (
    <>
      {preFix}
      {text}
      <Pen
        className={`ml-2 ${disabled ? 'text-muted' : 'text-info hover-light'}`}
        size={12}
        onClick={() => {
          if (!disabled) setEditMode(true);
        }}
      />
    </>
  );
};

export default TextWithEdit;
