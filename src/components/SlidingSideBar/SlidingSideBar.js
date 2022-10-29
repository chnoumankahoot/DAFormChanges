import React from 'react';
import { Button } from 'react-bootstrap';
import { ArrowLeft, X } from 'react-bootstrap-icons';

const SlidingSideBar = ({ children, visible = false, title = '', showCloseButton = true, onClose, fullScreen }) => {
  const Header = () => {
    return (
      <div className=" sticky-top bg-white p-2">
        <div className="d-flex">
          <h5 className="flex-grow-1">{title}</h5>
          {showCloseButton && (
            <Button size="sm" className="close_button" onClick={onClose} variant="danger">
              Close <X size={20} className="align-text-top" />
            </Button>
          )}
        </div>
        <hr className="mt-2 mb-0" />
      </div>
    );
  };

  return (
    <div className={`bar-container ${visible ? 'bar-visible' : 'bar-collapsed'}`}>
      <div className={`bar-content${fullScreen ? '-fullscreen' : ''}`}>
        {(title || showCloseButton) && <Header />}
        <div id="bar-body">{children}</div>
      </div>
    </div>
  );
};

export default SlidingSideBar;
