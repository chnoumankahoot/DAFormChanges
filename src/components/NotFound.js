import React from 'react';
import { Col, Row } from 'react-bootstrap';

const NotFound = ({ text = 'Page not found' }) => {
  return (
    <Row className="h-75">
      <Col xs={12} className="text-center align-self-center">
        <h4 className="text-secondary">{text}</h4>
      </Col>
    </Row>
  );
};

export default NotFound;
