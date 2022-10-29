import React, { useEffect, useState } from 'react';
import { CheckBoxInput, TextInput } from '../form-generator/components';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { getFormattedDate } from '../form-generator/helpers/utility';

const DateRangePicker = ({
  label,
  id,
  onDateChange,
  defaultDisabled = false,
  defaultDates,
  allowDisabling = false
}) => {
  const [disabled, setDisabled] = useState(defaultDisabled);
  const [startDate, setStartDate] = useState(defaultDates ? defaultDates.startDate : null);
  const [endDate, setEndDate] = useState(defaultDates ? defaultDates.endDate : null);

  useEffect(() => {
    onDateChange && onDateChange(disabled ? null : { startDate, endDate });
  }, [startDate, endDate, disabled]);

  const onCheckChange = e => {
    if (!e) return;
    const checked = e.target.checked;
    setDisabled(!checked);

    if (!checked) {
      setStartDate();
      setEndDate();
      clearValues();
    }
  };

  const clearValues = () => {
    [...document.getElementById('drp-container').children]
      .filter(e => e.tagName === 'input' && e.type === 'date')
      .forEach(e => e.value === '');
  };

  const setValues = (startDate, endDate) => {
    const strtElem = document.getElementById('drp-start');
    if (strtElem) strtElem.value = getFormattedDate(startDate);

    const endElem = document.getElementById('drp-end');
    if (endElem) endElem.value = getFormattedDate(endDate);
  };

  const onStartChange = e => {
    const startTemp = !e.target.value ? undefined : new Date(e.target.value).toISOString();
    setStartDate(startTemp);
  };

  const onEndChange = e => {
    const endTemp = !e.target.value ? undefined : new Date(e.target.value).toISOString();
    setEndDate(endTemp);
  };

  const setDates = range => {
    let startDateTemp = '';
    let endDateTemp = '';

    let curr = new Date(); // get current date
    let first = '';
    let last = '';

    switch (range) {
      case 'Last week':
        first = curr.getDate() - curr.getDay() - 7; // First day is the day of the month - the day of the week
        last = first + 6; // last day is the first day + 6
        startDateTemp = new Date(curr.setDate(first));
        endDateTemp = new Date(curr.setDate(last));
        break;
      case 'This month':
        startDateTemp = new Date(curr.getFullYear(), curr.getMonth(), 1);
        endDateTemp = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
        break;
      case 'This week':
        first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        last = first + 6; // last day is the first day + 6
        startDateTemp = new Date(curr.setDate(first));
        endDateTemp = new Date(curr.setDate(last));
        break;
      case 'Last month':
        startDateTemp = new Date(curr.getFullYear(), curr.getMonth() - 1, 1);
        endDateTemp = new Date(curr.getFullYear(), curr.getMonth(), 0);
        break;
    }

    setStartDate(startDateTemp.toISOString());
    setEndDate(endDateTemp.toISOString());
    setValues(startDateTemp, endDateTemp);
  };

  return (
    <>
      {allowDisabling && (
        <>
          <CheckBoxInput
            showLabel
            className="ml-3"
            title={label}
            boldLabel={true}
            defaultChecked={!defaultDisabled}
            onChangeFunction={onCheckChange}
          />

          <hr className="mt-1 mb-2" />
        </>
      )}
      <Row>
        <Col xs={4}>
          <ListGroup>
            {['Last week', 'This week', 'Last month', 'This month'].map(k => {
              return (
                <ListGroup.Item className="p-2 midFont" action onClick={() => setDates(k)} disabled={disabled}>
                  {k}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>
        <Col xs={8} className="align-self-center">
          <Row id="drp-container">
            <Col xs={12}>
              <h6>Start Date</h6>
              <TextInput
                preValue={startDate}
                id="drp-start"
                disabled={disabled}
                max={endDate}
                variant="date"
                size={'sm'}
                onChange={onStartChange}
              />
            </Col>
            <Col xs={12} className="mt-2">
              <h6>End Date</h6>
              <TextInput
                size={'sm'}
                preValue={endDate}
                id="drp-end"
                disabled={disabled}
                min={startDate}
                variant="date"
                onChange={onEndChange}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default DateRangePicker;
