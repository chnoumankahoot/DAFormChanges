import { normalizeId } from './utility';

export const fieldToKeyValue = (field, formObj) => {
  switch (field.type) {
    case 'table-input': {
      return getTableData(field, formObj);
    }
    case 'text': {
      return getInputData(field, formObj);
    }
    case 'datalist-text': {
      return getInputData(field, formObj);
    }
    case 'text-area': {
      return getInputData(field, formObj);
    }
    case 'number': {
      return getInputData(field, formObj);
    }
    case 'multi-text': {
      return getMultiInputData(field, formObj);
    }
    case 'multi-text-area': {
      return getMultiInputData(field, formObj, 'textarea');
    }
    case 'radio': {
      return getRadioGroupData(field, formObj);
    }
    case 'checkbox-group': {
      return getCheckBoxGroupData(field, formObj);
    }
    case 'radio-score': {
      return getRadioScoreData(field, formObj);
    }
    case 'checkbox': {
      return getCheckBoxData(field, formObj);
    }
    case 'dropdown': {
      return getInputData(field, formObj);
    }
    case 'file': {
      return getFileData(field, formObj);
    }
    case 'file-with-check': {
      return getFileWithCheckedData(field, formObj);
    }
    case 'block-select': {
      return getBlockData(field, formObj);
    }
    case 'multiselect-dropdown': {
      return getMultiSelectDropDownData(field, formObj);
    }
  }
  return null;
};

const getTableData = (table, formObj) => {
  const tableName = table.title || table.id;
  const tableId = table.id || normalizeId(table.title);

  var tbodyRowCount = document.getElementById(tableId).tBodies[0]
    ? document.getElementById(tableId).tBodies[0].rows.length
    : 0;
  const tableRows = [];

  for (let rowIndex = 0; rowIndex < tbodyRowCount; rowIndex++) {
    const row = [];
    table.tableFields.forEach(field => {
      row.push(formObj[normalizeId(tableId + '-' + field.title + '-' + rowIndex)]);
    });
    tableRows.push(row);
  }
  return {
    key: tableName,
    value: tableRows
  };
};

const getInputData = (field, formObj) => {
  const inputName = field.title || field.id;
  const inputId = field.id || normalizeId(field.title);

  return {
    key: field.key || inputName,
    value: field.variant === 'date' && formObj[inputId] ? getDateWithTimezone(formObj[inputId]) : formObj[inputId]
  };
};

const getFileData = (field, formObj) => {
  const inputName = field.title || field.id;
  const inputId = field.id || normalizeId(field.title);

  const files = formObj[inputId];

  return {
    key: field.key || inputName,
    value: files
  };
};

const getMultiInputData = (field, formObj, tagName = 'input') => {
  const inputName = field.title || field.id;
  const inputContainerId = field.id || normalizeId(field.title);

  const inputCount = document.getElementById(inputContainerId).getElementsByTagName(tagName).length;

  const inputRows = [];

  for (let rowIndex = 0; rowIndex < inputCount; rowIndex++) {
    const row = formObj[inputContainerId + '-' + rowIndex];
    inputRows.push(row);
  }

  return {
    key: field.key || inputName,
    value: inputRows
  };
};

const getRadioGroupData = field => {
  const inputName = field.title || field.id;
  const inputID = field.id || field.title;
  const radioGroup = [...document.getElementsByName(inputID)];
  const checkedRadio = radioGroup.filter(radio => radio.checked)[0];

  return {
    key: field.key || inputName,
    value: checkedRadio ? checkedRadio.value : null
  };
};

const getCheckBoxGroupData = field => {
  const inputName = field.title || field.id;
  const inputID = field.id || field.title;
  const radioGroup = [...document.getElementsByName(inputID)];
  const checkedRadio = radioGroup.filter(radio => radio.checked).map(radio => radio.value);

  return {
    key: field.key || inputName,
    value: checkedRadio
  };
};

const getRadioScoreData = (field, formObj) => {
  const inputName = field.title || field.id;
  const value = {};

  field.scoreFields.forEach(scoreField => {
    const radioGroup = [...document.getElementsByName(scoreField)];
    const checkedRadio = radioGroup.filter(radio => radio.checked)[0].value;
    value[scoreField] = parseInt(checkedRadio);
  });

  return {
    key: field.key || inputName,
    value
  };
};

const getCheckBoxData = (field, formObj) => {
  const inputName = field.title || field.id;
  const inputId = field.id || normalizeId(field.title);

  return {
    key: field.key || inputName,
    value: formObj[inputId]
  };
};

const getBlockData = (field, formObj) => {
  const inputName = field.title || field.id;
  const inputId = field.id || normalizeId(field.title);

  const selectedValues = [...document.getElementById(`${inputId}-blocks`).getElementsByClassName('block')]
    .filter(block => block.getAttribute('data-selected') === 'true')
    .map(block => block.getAttribute('data-value'));

  return {
    key: field.key || inputName,
    value: field.multiple ? selectedValues : selectedValues.length > 0 ? selectedValues[0] : ''
  };
};

const getFileWithCheckedData = (field, formObj) => {
  const inputName = field.title || field.id;
  const inputId = field.id || normalizeId(field.title);

  const files = formObj[inputId];

  return {
    key: field.key || inputName,
    value: files
  };
};

const getMultiSelectDropDownData = field => {
  const inputName = field.title || field.id;
  const inputId = field.id;
  const values = document.getElementById(inputId).getAttribute('data-selections');

  return {
    key: field.key || inputName,
    value: values ? values.split(',') : []
  };
};

const getDateWithTimezone = dateString => {
  return new Date(dateString.split('-').join('/')).toISOString();
};
