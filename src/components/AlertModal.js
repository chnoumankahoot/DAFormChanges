import React from 'react';
import { Modal, Button, Row, Col, ProgressBar } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

const AlertModal = ({
  show,
  onHide,
  onContinueClick,
  onDismissClick,
  alertText,
  dismissButtonText = 'Dismiss',
  dismissButtonVariant = 'secondary',
  continueButtonText = 'Continue',
  continueButtonVariant = 'danger',
  alertIcon,
  showProgress,
  progressText
}) => (
  <Modal show={show} onHide={onHide} centered backdrop="static">
    <Modal.Header>
      <Modal.Title>
        <h6 className="mb-0">Heads Up!</h6>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="overflow-auto">
      <Row>
        <Col className="text-center">
          {alertIcon ? alertIcon() : <ExclamationTriangleFill className="text-danger" size={30} />}
          <h6 className="mt-3"> {alertText} </h6>
        </Col>
      </Row>
      {showProgress && <ProgressBar className="my-2" animated now={100} label={progressText} />}
    </Modal.Body>
    <Modal.Footer>
      <Button
        size="sm"
        disabled={showProgress}
        className="ml-2 px-2"
        variant={dismissButtonVariant}
        onClick={onDismissClick}
      >
        {dismissButtonText}
      </Button>
      <Button
        size="sm"
        disabled={showProgress}
        className="ml-2 px-2"
        variant={continueButtonVariant}
        onClick={onContinueClick}
      >
        {continueButtonText}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default AlertModal;
