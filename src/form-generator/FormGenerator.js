import React, { useState } from 'react';
import { Button, Col, Container, Nav, Row, ProgressBar } from 'react-bootstrap';
import ComponentContext from './context/ComponentContext';
import { mapFieldToElement } from './helpers/TypeToElemMapper';
import { CaretRight } from 'react-bootstrap-icons';
import { fieldToKeyValue } from './helpers/FieldToJsonObj';
import { highlightError, validateInputExtra } from './helpers/utility';
import { normalizeId } from './helpers/utility';
import { ArrowUpRightCircle } from 'react-bootstrap-icons';

const FormGenerator = ({
  prefix = '',
  formJson,
  formValues = {},
  defaultActiveForm = 0,
  formDisabled = false,
  headerIcons
}) => {
  const form = formJson.forms;
  const onFormSubmit = formJson.onFormSubmit;

  const updateRadioScore = (key, value) => {
    initContext.radioScore[key] = value;
    setContext({ ...initContext });
  };

  const initContext = {
    radioScore: {}
  };

  const [context, setContext] = useState(initContext);
  const [activeForm, setActiveForm] = useState(defaultActiveForm);
  const [disableButtons, setDisableButtons] = useState(false);
  const [initialJsonString] = useState(JSON.stringify(formValues));
  const [hasFormChanged, setHasFormChanged] = useState(false);

  const onFormChange = () => {
    setHasFormChanged(initialJsonString !== JSON.stringify(getCompleteFormValue()));
  };

  const getFormHeader = index => {
    return form[index].name.length > 24 ? form[index].name.substring(0, 24) + '...' : form[index].name;
  };

  const createFormSections = () => {
    return (
      <Nav className="mb-5 justify-content-center d-none d-md-flex">
        {form.map((form, index, array) => {
          return (
            <React.Fragment key={index}>
              <Nav.Item
                className={
                  'rounded text-center py-1 px-3 mt-2 btn ' +
                  (index === activeForm ? 'btn-primary  text-white' : 'btn-outline-primary text-dark')
                }
                style={styles.formHeader}
                onClick={() => setActiveForm(index)}
              >
                <p style={styles.headerText} className={'text-left mb-0'}>
                  {getFormHeader(index)}
                </p>
              </Nav.Item>
              {index !== array.length - 1 && (
                <CaretRight className="align-self-center text-primary mt-2" height={24} width={24} />
              )}
            </React.Fragment>
          );
        })}
      </Nav>
    );
  };

  const validateForm = form => {
    //clear previous validation
    document.getElementsByName('validationMsg').forEach(node => {
      node.remove();
    });

    const inputs = [
      ...form.getElementsByTagName('input'),
      ...form.getElementsByTagName('textarea'),
      ...form.getElementsByTagName('select')
    ];

    const formObject = {};
    for (let index = 0; index < inputs.length; index++) {
      const input = inputs[index];

      if (input.type === 'checkbox' || input.type === 'radio') {
        if (input.required && !input.checked) {
          return {
            valid: false,
            field: input
          };
        } else {
          formObject[input.id] = input.checked;
        }
        continue;
      }

      if (input.type === 'file') {
        const buttons = [...document.getElementsByName(`${input.id}-file`)];

        if (input.required && buttons.length === 0) {
          return {
            valid: false,
            field: input
          };
        } else {
          formObject[input.id] = buttons.map(button => ({
            fileName: button.getAttribute('data-name'),
            mimeType: button.getAttribute('data-mimetype'),
            data: button.getAttribute('data-value'),
            checked: button.getAttribute('data-checked') ? button.getAttribute('data-checked') === 'true' : undefined
          }));
        }
        continue;
      }

      if (input.value) {
        const { valid, msg } = validateInputExtra(input);
        if (!valid) {
          return {
            valid,
            field: input,
            msg
          };
        }
      } else {
        if (input.required) {
          return {
            valid: false,
            field: input
          };
        }
      }
      formObject[input.id] = input.value;
    }

    //first check for groups(checkbox & radio)
    const checkboxGroups = [...form.getElementsByClassName('fg-checkbox-group')];
    for (const group of checkboxGroups) {
      const checkedCount = [...group.getElementsByTagName('input')].filter(radio => radio.checked).length;
      if (checkedCount === 0) {
        return {
          valid: false,
          field: group
        };
      }
    }

    //check for blocks
    const blockGroups = [...form.getElementsByClassName('fg-blocks')];
    for (const group of blockGroups) {
      if (group.getAttribute('data-required') === 'true') {
        const checkedCount = [...group.getElementsByClassName('block')].filter(
          block => block.getAttribute('data-selected') === 'true'
        ).length;

        if (checkedCount === 0) {
          return {
            valid: false,
            field: group
          };
        }
      }
    }

    return {
      valid: true,
      form: formObject
    };
  };

  const formObjToSchema = (formJson, formObj) => {
    const finalObj = {};

    formJson.rows.forEach(row => {
      row.columns.forEach(col => {
        const obj = fieldToKeyValue(col.field, formObj);
        if (obj) finalObj[obj.key] = obj.value;
      });
    });

    return finalObj;
  };

  const previousForm = () => {
    if (activeForm > 0) {
      setActiveForm(activeForm - 1);
      document.getElementById('form-container').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextForm = async () => {
    setDisableButtons(true);

    //first validate
    const formElement = document.getElementById('form-' + activeForm + '-' + normalizeId(prefix));
    const validation = validateForm(formElement);
    if (!validation.valid) {
      highlightError(validation.field, validation.msg);
      setDisableButtons(false);
      return;
    }

    //run a onSubmit function,if specified by user for each form
    if (form[activeForm].submit && form[activeForm].submit.onSubmit && window[form[activeForm].submit.onSubmit]) {
      const proceed = await window[form[activeForm].submit.onSubmit](
        formObjToSchema(form[activeForm], validation.form)
      );
      setDisableButtons(false);
      if (!proceed) return;
    }
    setDisableButtons(false);

    if (activeForm < form.length - 1) {
      setActiveForm(activeForm + 1);
      document.getElementById('form-container').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getFormDataWithoutValidation = formElement => {
    const inputs = [...formElement.getElementsByTagName('input'), ...formElement.getElementsByTagName('textarea')];

    const formObject = {};
    for (let index = 0; index < inputs.length; index++) {
      const input = inputs[index];

      if (input.type === 'checkbox' || input.type === 'radio') {
        formObject[input.id] = input.checked;
        continue;
      }

      formObject[input.id] = input.value;
    }

    return formObject;
  };

  const getCompleteFormValue = () => {
    const finalForm = {};

    for (let index = 0; index < form.length; index++) {
      const f = form[index];
      const formElement = document.getElementById('form-' + index + '-' + normalizeId(prefix));
      finalForm[f.name] = formObjToSchema(f, getFormDataWithoutValidation(formElement));
    }

    return finalForm;
  };

  const submitCompleteForm = async () => {
    setDisableButtons(true);
    const finalForm = getCompleteFormValue();

    //run a onSubmit function,if specified by user for each form
    if (onFormSubmit && window[onFormSubmit]) {
      await window[onFormSubmit](finalForm);
      setDisableButtons(false);
    }
  };

  const createBottomRow = () => {
    return (
      <>
        {form.length !== 1 && (
          <Row className="my-2">
            <Col xs={12} md={6}>
              {activeForm !== 0 && (
                <Button
                  size={form[activeForm]['compact'] ? 'sm' : undefined}
                  onClick={previousForm}
                  disabled={formDisabled}
                >
                  Previous
                </Button>
              )}
            </Col>
            <Col xs={12} md={6} className="text-md-right mt-2 mt-md-0">
              {activeForm !== form.length - 1 && (
                <Button
                  size={form[activeForm]['compact'] ? 'sm' : undefined}
                  onClick={nextForm}
                  disabled={formDisabled}
                >
                  Next
                </Button>
              )}
            </Col>
          </Row>
        )}
        {form[activeForm].submit && (
          <Row className={'my-3 ' + (form[activeForm].submit['show'] && !formDisabled ? '' : 'd-none')}>
            <Col xs={12} className={'text-md-right mt-2 mt-md-0'}>
              <Button
                id={normalizeId(form[activeForm]['name'])}
                size={form[activeForm]['compact'] ? 'sm' : undefined}
                onClick={nextForm}
                disabled={disableButtons || formDisabled}
              >
                {form[activeForm].submit['name'] || 'Save'}
              </Button>
            </Col>
          </Row>
        )}
      </>
    );
  };
  const getPreValue = (formValue, field) => {
    if (!formValue) return null;

    return formValue[field.key || field.title || field.id];
  };

  const createRows = (f, formIndex) => {
    return f.rows.map((row, index) => {
      return (
        <Row key={index} id={'row-' + formIndex + '-' + index} className="mb-2">
          {row.columns.map((col, colIndex) => {
            return (
              <Col
                key={colIndex}
                id={col.field.id ? `${col.field.id}-col-container` : 'col-' + activeForm + '-' + index + '-' + colIndex}
                xs={col.xs || col.default}
                md={col.md || col.default}
                lg={col.lg || col.default}
                className={`${col.alignStart ? 'align-self-start' : 'align-self-end'}  ${col.className || 'my-2 '}`}
              >
                <div className="d-flex">
                  <div className="flex-grow-1">
                    {col.field.title && (
                      <h6 className="mid">
                        {col.field.title}
                        {f.markCompulsoryFields && col.field.required ? <span className="text-danger">*</span> : ''}
                        {col.field.folderLink && (
                          <a
                            style={{ fontSize: '14px', textDecoration: 'underline' }}
                            className="ml-2"
                            target="_blank"
                            href={col.field.folderLink}
                          >
                            open folder <ArrowUpRightCircle className="align-text-bottom" />
                          </a>
                        )}
                      </h6>
                    )}
                  </div>
                  {col.field.showLoading && (
                    <ProgressBar label="Loading..." animated now={100} style={{ minWidth: 100 }} />
                  )}
                </div>
                {mapFieldToElement({
                  ...col.field,
                  onFormChange,
                  preValue: col.field.value || getPreValue(formValues[f.name], col.field),
                  disabled: col.field.disabled || formDisabled,
                  size: f['compact'] ? 'sm' : undefined
                })}
              </Col>
            );
          })}
        </Row>
      );
    });
  };

  return (
    <>
      {form.length > 1 && createFormSections()}
      <ComponentContext.Provider value={{ context, updateRadioScore }}>
        <Container fluid id="form-container" className={onFormSubmit ? 'pb-5' : ''}>
          {form.map((f, index) => {
            return (
              <form
                key={index}
                id={'form-' + index + '-' + normalizeId(prefix)}
                className={'mt-2 ' + (activeForm === index ? 'd-block' : 'd-none')}
              >
                {!f.hideFormName && f.name && (
                  <>
                    <h5>
                      {headerIcons && headerIcons[f.name] && headerIcons[f.name]()}
                      {f.name}
                    </h5>
                    <hr className={f['compact'] ? 'mt-1 mb-3' : 'mb-3'} />
                  </>
                )}

                {createRows(f, index)}
              </form>
            );
          })}
          {createBottomRow()}
          {onFormSubmit && (
            <Button
              variant={'success'}
              style={styles.submitButton}
              onClick={submitCompleteForm}
              disabled={disableButtons || !hasFormChanged || formDisabled}
            >
              Save
              <br />
              Changes
            </Button>
          )}
        </Container>
      </ComponentContext.Provider>
    </>
  );
};

const styles = {
  formHeader: {
    width: 140,
    borderColor: '#E0E0E0'
  },
  headerText: {
    fontSize: 12
  },
  submitButton: {
    position: 'fixed',
    bottom: 10,
    right: 0,
    paddingLeft: 20,
    paddingRight: 20
  }
};

export default FormGenerator;
