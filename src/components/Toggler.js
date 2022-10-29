import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { makeApiRequests } from '../helpers/api';
import CircularProgressBar from './circular-progress';

const Toggler = ({ fieldName, value, options, onFieldUpdate, id, variant = 'primary' }) => {
  const [toggling, setToggling] = useState(false);

  const toggleContract = async newValue => {
    if (newValue === value) return;

    setToggling(true);

    const formData = { ID: id, [fieldName]: newValue };

    const { response, error } = await makeApiRequests({
      requestType: 'processContract',
      requestBody: { formData }
    });
    if (error) {
      toast(error, {
        type: 'error'
      });
      setToggling(false);
      return;
    }

    toast(`${fieldName} updated successfully!`, {
      type: 'success'
    });

    onFieldUpdate && onFieldUpdate(fieldName, newValue);
    setToggling(false);
  };

  return (
    <>
      <Dropdown onClick={e => e.stopPropagation()} className="mb-1 mb-md-0 d-inline-block mr-1">
        <Dropdown.Toggle
          className="p-1"
          variant={variant}
          disabled={toggling}
          style={{ border: 0, fontSize: 12 }}
          size="sm"
        >
          {value ? value : 'Unassigned'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {options.map((s, index) => (
            <Dropdown.Item active={s === value} onClick={() => toggleContract(s)}>
              {s}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {toggling && <CircularProgressBar />}
    </>
  );
};

export default Toggler;
