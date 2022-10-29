const headerRow = title => {
  return [
    {
      columns: [
        {
          default: 12,
          xs: 12,
          className: 'align-self-center',
          field: {
            type: 'custom-html',
            html: `<h3 class="mb-0"><b>${title}</b></h3><hr class="d-md-none"/>`
          }
        }
      ]
    },
    {
      columns: [
        {
          default: 12,
          field: {
            type: 'custom-html',
            html: '<hr class="my-3"/>'
          }
        }
      ]
    }
  ];
};

/**
  Lot Set (Yes/No)
   */

const fieldRows = (createMode, fromPipeline = false) => [
  {
    columns: [
      {
        default: 6,
        xs: 12,
        field: {
          id: 'requestedBy',
          title: 'Requested By',
          type: 'datalist-text',
          required: false
        }
      },
      {
        default: 6,
        xs: 12,
        field: {
          id: 'expenseCode',
          title: 'Expense Code',
          type: 'dropdown',
          options: [],
          required: true
        }
      }
    ]
  },
  {
    columns: [
      {
        default: 6,
        xs: 12,
        field: {
          id: 'deliveryDate',
          title: 'Required Delivery Date',
          type: 'text',
          variant: 'date',
          required: true
        }
      },
      {
        default: 6,
        xs: 12,
        field: {
          id: 'recipientName',
          title: 'Recipient Name',
          type: 'text',
          required: true
        }
      }
    ]
  },
  {
    columns: [
      {
        default: 6,
        xs: 12,
        field: {
          id: 'phone',
          title: 'Phone #',
          type: 'text',
          variant: 'phone',
          required: true
        }
      },
      {
        default: 6,
        xs: 12,
        field: {
          id: 'email',
          title: 'Email',
          type: 'text',
          variant: 'email',
          required: false
        }
      }
    ]
  },
  {
    columns: [
      {
        default: 6,
        xs: 12,
        field: {
          id: 'address',
          title: 'Address',
          type: 'text',
          required: true
        }
      },
      {
        default: 6,
        xs: 12,
        field: {
          id: 'purpose',
          title: 'Purpose',
          type: 'text',
          required: false
        }
      }
    ]
  },
  {
    columns: [
      {
        default: 12,
        xs: 12,
        field: {
          id: 'notes',
          title: 'Notes',
          type: 'text-area',
          required: false
        }
      }
    ]
  }
];

export const formJson = {
  forms: [
    {
      name: 'add-da',
      hideFormName: true,
      markCompulsoryFields: true,
      compact: true,
      submit: {
        name: 'Submit',
        show: false,
        onSubmit: 'onDAFormSubmit'
      },
      rows: [...headerRow('New Entry'), ...fieldRows(true)]
    }
  ]
};
