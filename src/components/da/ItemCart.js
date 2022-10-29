import { uniqueId } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, FormControl, Table } from 'react-bootstrap';
import { PlusCircleFill, Trash } from 'react-bootstrap-icons';
import { DropDownInput } from '../../form-generator/components';

const ItemRow = ({ item, itemOptions, onItemRemove, onItemChange, disabled }) => {
  return (
    <tr>
      <td className="p-0">
        <DropDownInput
          size={'sm'}
          options={itemOptions.map(({ name, sku }) => `${name} (${sku})`)}
          optionValues={itemOptions.map(({ sku }) => sku)}
          value={item.name}
          onChangeFunction={e => e && onItemChange('sku', e.target.value)}
          className="border-0 rounded-0"
          disabled={disabled}
        />
      </td>
      <td className="p-0">
        <FormControl
          placeholder={`quantity...`}
          className="border-0 rounded-0"
          size={'sm'}
          type="number"
          value={item.quantity}
          disabled={disabled}
          onChange={e => onItemChange('quantity', e.target.value ? Number(e.target.value) : undefined)}
        />
      </td>

      {!disabled && (
        <td className="p-0">
          <div className="d-flex my-2 justify-content-center">
            <Trash size={15} className="text-danger hover" onClick={onItemRemove} />
          </div>
        </td>
      )}
    </tr>
  );
};

const ItemsTable = ({
  itemOptions,
  items = [],
  onItemChange,
  onNewItemClick,
  onDeleteItemClick,
  disabled,
  supplierOptions,
  onSupplierChange
}) => {
  return (
    <div className="mt-3 mid">
      <div className="d-flex">
        <div className="flex-grow-1 align-self-center">
          <h6 className="text-dark midFont mb-0">Select Items</h6>
          <h6 className="text-muted tinyFont">Please provide quantities of all the items</h6>
        </div>
        <div className="w-25 py-2">
          <h6 className="text-dark midFont mb-1 ml-1">Select Supplier:</h6>
          <DropDownInput
            size={'sm'}
            options={supplierOptions}
            onChangeFunction={e => e && onSupplierChange(e.target.value)}
          />
        </div>
      </div>
      <Table className="mb-1" bordered responsive>
        <thead>
          <tr className="bg-dark text-white">
            {['Item', 'Quantity'].map(h => (
              <th className="p-2 text-center" key={h}>
                {h}
              </th>
            ))}
            {!disabled && <th></th>}
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <ItemRow
                key={item['id']}
                item={item}
                itemOptions={itemOptions}
                disabled={disabled}
                onItemChange={(field, value) => onItemChange(index, field, value)}
                onItemRemove={() => onDeleteItemClick(index)}
              />
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-2 text-center text-muted">
                <b>No Items Added</b>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {!disabled && (
        <div className="text-right">
          <Button variant="outline-success" size="sm" className="px-2 py-0 mt-1" onClick={onNewItemClick}>
            <PlusCircleFill size={12} />
            <span className="smallFont ml-1">New Item</span>
          </Button>
        </div>
      )}
    </div>
  );
};

const ItemCart = ({ supplierItemOptions = [], items, onItemsChange, onSupplierChange, disabled }) => {
  const [role] = useState(localStorage.getItem('user-role'));
  const [supplierOptions] = useState(Object.keys(supplierItemOptions).sort((a, b) => a.localeCompare(b)));
  const [selectedSupplier, setSelectedSupplier] = useState(supplierOptions[0]);
  const [itemOptions, setItemOptions] = useState(supplierItemOptions[selectedSupplier]);

  const newItem = () => ({
    name: itemOptions[0].name,
    sku: itemOptions[0].sku,
    daNumber: itemOptions[0].daNumber,
    id: uniqueId()
  });

  const [requestState, setRequestState] = useState(items ? items : [newItem()]);

  useEffect(() => {
    setItemOptions(supplierItemOptions[selectedSupplier]);
    setRequestState([newItem()]);
    onSupplierChange(selectedSupplier);
  }, [selectedSupplier]);

  const onNewItemClick = () => {
    setRequestState(items ? [...items, newItem()] : [newItem()]);
  };

  const onDeleteItemClick = index => {
    requestState.splice(index, 1);
    setRequestState([...requestState]);
  };

  const onItemChange = (index, field, value) => {
    requestState[index][field] = value;
    if (field === 'sku') {
      const newItem = itemOptions.find(i => i['sku'] === value);
      requestState[index]['name'] = newItem.name;
      requestState[index]['daNumber'] = newItem.daNumber;
    }
    setRequestState([...requestState]);
  };

  useEffect(() => onItemsChange(requestState), [requestState]);

  return (
    <>
      <ItemsTable
        disabled={disabled}
        itemOptions={itemOptions}
        items={requestState}
        onNewItemClick={onNewItemClick}
        onDeleteItemClick={onDeleteItemClick}
        onItemChange={onItemChange}
        supplierOptions={supplierOptions}
        onSupplierChange={setSelectedSupplier}
        hideRates={role === 'Applicant'}
      />
    </>
  );
};

export default ItemCart;
