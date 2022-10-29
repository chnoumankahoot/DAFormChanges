import React, { useState } from 'react';
import { Col, Row, Button, ListGroup } from 'react-bootstrap';
import { CheckBoxInput } from '.';

const FileWithCheck = ({
  id,
  required = false,
  onChange,
  multiple = false,
  disabled = false,
  label = 'Upload File',
  preValue = [],
  defaultChecked = true
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const internalOnChange = async e => {
    const files = e.target.files;
    const fileValues = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const fileData = await fileToDataURL(file);
      fileData.checked = defaultChecked;
      fileValues.push(fileData);
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

  const onCheckedChange = (e, index) => {
    if (!e) return;

    const checked = e.target.checked;
    selectedFiles[index].checked = checked;
    setSelectedFiles([...selectedFiles]);
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
                  <ListGroup className="mb-2">
                    {preValue.map(value => (
                      <ListGroup.Item variant="info">{value}</ListGroup.Item>
                    ))}
                  </ListGroup>
                  <hr />
                </>
              )}
              {selectedFiles.length > 0 && (
                <div className="mb-2">
                  {selectedFiles.map((file, index) => (
                    <div className="d-inline-block p-2 border border-muted rounded py-1 mr-1 mb-1">
                      <Button
                        block
                        key={index}
                        name={`${id}-file`}
                        data-name={file.fileName}
                        data-mimetype={file.mimeType}
                        data-value={file.data}
                        data-desc={file.fileDescription}
                        data-checked={file.checked}
                        className="px-2 text-left"
                        variant="light"
                        onClick={() => removeFile(index)}
                      >
                        <span>{file.fileName}</span>
                        <span className="ml-3 float-right">X</span>
                      </Button>
                      <CheckBoxInput
                        className=" mt-2 mx-1"
                        size="sm"
                        label="Show to client"
                        preValue={file.checked}
                        showLabel={true}
                        onChangeFunction={e => onCheckedChange(e, index)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            'No files uploaded'
          )}
        </div>

        <Button className={'mt-2 ' + (disabled ? 'd-none' : '')} variant="outline-info" onClick={triggerFileClick}>
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

export default FileWithCheck;
