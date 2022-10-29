import React, { useEffect, useState } from 'react';
import { Col, Row, Button, ListGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const FileUploader = ({
  id,
  title,
  className = '',
  required = false,
  onChange,
  multiple = false,
  disabled = false,
  label = 'Upload File',
  preValue = [],
  fileColumnMd = 6,
  size
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (disabled) {
      setSelectedFiles([]);
    }
  }, [disabled]);

  const internalOnChange = async e => {
    const files = e.target.files;
    const fileValues = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      fileValues.push(await fileToDataURL(file));
    }

    setSelectedFiles(multiple ? [...selectedFiles, ...fileValues] : [...fileValues]);

    if (onChange) onChange(e);
  };

  const removeFile = index => {
    selectedFiles.splice(index, 1);
    setSelectedFiles([...selectedFiles]);
  };

  const triggerFileClick = () => {
    document.getElementById(id).click();
  };

  const count = selectedFiles.length + (preValue ? preValue.length : 0);

  return (
    <Row className="mb-4">
      <Col>
        <div>
          {count > 0 ? (
            <>
              {preValue && preValue.length > 0 && (
                <>
                  <Row className="mb-2">
                    {preValue.map((f, index) => (
                      <Col key={f.url} xs={12} md={fileColumnMd}>
                        <Alert variant="info" className="p-1 mid mb-1">
                          <a
                            style={{ fontSize: '14px', textDecoration: 'underline', overflowWrap: 'breakWord' }}
                            className="ml-2"
                            target="_blank"
                            href={f.url}
                          >
                            {f.fileName}
                          </a>
                        </Alert>
                      </Col>
                    ))}
                  </Row>
                  <hr />
                </>
              )}
              {selectedFiles.length > 0 && (
                <div className="mb-2">
                  {selectedFiles.map((file, index) => (
                    <Button
                      key={index}
                      name={`${id}-file`}
                      data-name={file.fileName}
                      data-mimetype={file.mimeType}
                      data-value={file.data}
                      className="px-2 py-1 mr-1 mb-1"
                      variant="primary"
                      onClick={() => removeFile(index)}
                      size={size}
                    >
                      {file.fileName} <span className="ml-2"> x</span>
                    </Button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <h6 style={{ fontSize: 14 }} className="text-muted">
              No files uploaded
            </h6>
          )}
        </div>

        <Button
          size={size}
          className={'mt-2 ' + (disabled ? 'd-none' : '')}
          variant="outline-info"
          onClick={triggerFileClick}
        >
          {label}
        </Button>
        <input required={required} id={id} type="file" onChange={internalOnChange} hidden multiple={multiple} />
      </Col>
    </Row>
  );
};

function fileToDataURL(file) {
  var reader = new FileReader();
  return new Promise(function(resolve, reject) {
    reader.onload = function(e) {
      const data = e.target.result.split(',');
      const obj = {
        fileName: file.name,
        mimeType: data[0].match(/:(\w.+);/)[1],
        data: data[1]
      };
      resolve(obj);
    };
    reader.readAsDataURL(file);
  });
}

export default FileUploader;
