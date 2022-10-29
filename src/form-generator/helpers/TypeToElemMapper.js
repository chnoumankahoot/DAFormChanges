import React from 'react';
import {
  TableInput,
  TextInput,
  RadioScore,
  RadioScoreTotal,
  RadioInputGroup,
  CustomHtml,
  NumberInput,
  CheckBoxInput,
  MultiTextInput,
  DropDownInput,
  CheckBoxGroup,
  FileUploader,
  DataListInput
} from '../components';
import BlockSelectInput from '../components/BlockSelectInput';
import FileWithCheck from '../components/FileWithCheck';
import MultiSelectDropDown from '../components/MultiSelectDropDown';

export const mapFieldToElement = field => {
  switch (field.type) {
    case 'table-input': {
      return <TableInput {...field} />;
    }
    case 'text': {
      return <TextInput {...field} />;
    }
    case 'text-area': {
      return <TextInput {...field} textArea={true} />;
    }

    case 'number': {
      return <NumberInput {...field} />;
    }
    case 'multi-text': {
      return <MultiTextInput {...field} />;
    }
    case 'multi-text-area': {
      return <MultiTextInput {...field} textArea={true} />;
    }
    case 'radio': {
      return <RadioInputGroup {...field} />;
    }
    case 'radio-score': {
      return <RadioScore {...field} />;
    }
    case 'radio-score-grand-total': {
      return <RadioScoreTotal {...field} />;
    }
    case 'checkbox': {
      return <CheckBoxInput {...field} />;
    }
    case 'checkbox-group': {
      return <CheckBoxGroup {...field} />;
    }
    case 'custom-html': {
      return <CustomHtml {...field} />;
    }
    case 'dropdown': {
      return <DropDownInput {...field} />;
    }
    case 'file': {
      return <FileUploader {...field} />;
    }
    case 'file-with-check': {
      return <FileWithCheck {...field} />;
    }
    case 'datalist-text': {
      return <DataListInput {...field} />;
    }
    case 'block-select': {
      return <BlockSelectInput {...field} />;
    }
    case 'multiselect-dropdown': {
      return <MultiSelectDropDown {...field} />;
    }
  }
  return '';
};
