import React, { useEffect, useState } from 'react';
import { Card, Container, Button, Alert } from 'react-bootstrap';
import FormGenerator from '../../form-generator/FormGenerator';
import { formJson } from './form';
import { toast } from 'react-toastify';
import { makeApiRequests } from '../../helpers/api';
import ItemCart from './ItemCart';
import { setAttribute } from '../../form-generator/helpers/utility';

const CreateDA = ({ appChoices }) => {
  const [items, setItems] = useState();
  const [supplierItemOptions] = useState(appChoices['products']);
  const [expenseCodeOptions] = useState(appChoices['expenseCodes'].map(e => e.description));
  const [expenseCodeValues] = useState(appChoices['expenseCodes'].map(e => e.code));
  const [employeeOptions] = useState(appChoices['requestedBy'] || []);

  const [selectedSupplier, setSelectedSupplier] = useState();
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [createdDocument, setCreatedDocument] = useState(null);
  const [form, setForm] = useState();

  useEffect(() => {
    setAttribute(formJson, 'expenseCode', 'options', expenseCodeOptions);
    setAttribute(formJson, 'expenseCode', 'optionValues', expenseCodeValues);
    setAttribute(formJson, 'requestedBy', 'options', employeeOptions);

    setForm({ ...formJson });
  }, []);

  const onDAFormSubmit = async form => {
    const itemDataMissing = items.length === 0 || items.some(({ quantity }) => !quantity || quantity <= 0);

    if (itemDataMissing) {
      return toast.error(`Please provide valid quantities of all the items!`);
    }

    setButtonsDisabled(true);
    toast.info('Please wait while the PDF is being printed...');

    const { response, error } = await makeApiRequests({
      requestType: 'processRecord',
      requestBody: {
        formData: {
          ...form,
          Items: items.map(({ name, sku, quantity, daNumber }) => ({
            name,
            sku,
            quantity,
            daNumber
          })),
          Supplier: selectedSupplier
        }
      }
    });

    setButtonsDisabled(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast(`Record created successfully!`, {
      type: 'success'
    });

    setCreatedDocument(response['url']);
    setTimeout(() => {
      const element = document.getElementById('documentCreated');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  window['onDAFormSubmit'] = onDAFormSubmit;

  return (
    <Container fluid className="py-4 px-2 px-md-5">
      {form && (
        <Card className="mx-md-4 fade-in">
          <Card.Body className="px-md-5">
            <FormGenerator formJson={formJson} />
            <div className="mx-3">
              <ItemCart
                onSupplierChange={setSelectedSupplier}
                supplierItemOptions={supplierItemOptions}
                items={items}
                onItemsChange={setItems}
              />
              <hr />
              <div className="text-right mt-5">
                <Button
                  disabled={buttonsDisabled}
                  variant="info"
                  onClick={() => document.getElementById('add-da').click()}
                >
                  {createdDocument ? 'Print Again' : 'Print'}
                </Button>
              </div>

              {createdDocument && (
                <Alert id="documentCreated" variant="success" className="mt-4 mb-3">
                  <p>Document created successfully! You may quickly access the file here.</p>
                  <div>
                    <a target="_blank" href={createdDocument}>
                      <Button className="mt-1" variant="success">
                        Open File
                      </Button>
                    </a>
                    <Button onClick={() => window.location.reload()} className="mt-1 ml-2" variant="dark">
                      Create Another
                    </Button>
                  </div>
                </Alert>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default CreateDA;
