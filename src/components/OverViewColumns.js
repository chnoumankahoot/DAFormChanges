import moment from 'moment';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

const OverViewColumns = ({
  data = {},
  numRows = [],
  emailRows = [],
  priceFields = [],
  dateFields = [],
  dateTimeFields = [],
  fieldsToShow = [],
  md = 4,
  mt = 1,
  className = '',
  fontSize = 'mid'
}) => {
  const getValue = row => {
    if (emailRows.includes(row)) {
      return (
        <a onClick={e => e.stopPropagation()} className="text-secondary" href={`mailto:${data[row]}`}>
          {data[row]}
        </a>
      );
    }

    if (numRows.includes(row)) {
      return (
        <a onClick={e => e.stopPropagation()} className="text-secondary" href={`tel:${data[row]}`}>
          {data[row]}
        </a>
      );
    }
    if (dateFields.includes(row)) {
      return moment(data[row]).format('MMMM Do, YYYY');
    }
    if (dateTimeFields.includes(row)) {
      return moment(data[row]).format('MMMM Do, YYYY hh:mm a');
    }

    if (priceFields.includes(row)) {
      return `$${data[row]}`;
    }
    return Array.isArray(data[row]) ? data[row].join(', ') : data[row];
  };

  return (
    <Row className={className}>
      {fieldsToShow.map(row => (
        <Col xs={12} md={md} className={`mt-${mt}`}>
          <p className={`mb-0  text-muted ${fontSize}`}>
            <span className="text-dark">
              {row.replace('that you are available to work', 'available').replace(' Contact', '')}:{' '}
            </span>
            {data[row] ? getValue(row) : 'N/A'}
          </p>
        </Col>
      ))}
    </Row>
  );
};

export default OverViewColumns;
