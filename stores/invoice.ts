import { getFilteredCustomerInvoice, getLastInvoice } from '@/app/lib/actions';
import {
  Invoice,
  InvoicesTable,
  LatestInvoice,
  NewestInvoiceInput,
  NewestInvoiceOutput,
} from '@/app/lib/definitions';

type State = {
  lastInvoice: LatestInvoice;
  customerInvoices: InvoicesTable[];
  newestInvoice: NewestInvoiceOutput;
};

// type Action = {
//   getLastInvoice: () => void;
//   getCustomerInvoice: (query: string, CurrPage?: number) => void;
//   createNewInvoice: (invoice: NewestInvoiceInput) => void;
// };

// export type InvoiceStore = State & Action;
export const defaultInitState: State = {
  lastInvoice: {
    amount: '',
    id: '',
    name: '',
    image_url: '',
    email: '',
  },
  customerInvoices: [
    {
      id: '',
      customer_id: '',
      name: '',
      email: '',
      image_url: '',
      date: '',
      amount: 0,
      status: 'pending',
    },
  ],
  newestInvoice: {
    customer_id: '',
    amount: '0',
    date: '',
    status: 'pending',
  },
};
