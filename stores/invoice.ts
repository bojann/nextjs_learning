import { getFilteredCustomerInvoice, getLastInvoice } from '@/app/lib/actions';
import {
  Invoice,
  InvoicesTable,
  LatestInvoice,
  NewestInvoiceInput,
  NewestInvoiceOutput,
} from '@/app/lib/definitions';
import { createStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type State = {
  lastInvoice: LatestInvoice;
  customerInvoices: InvoicesTable[];
  newestInvoice: NewestInvoiceOutput;
};

type Action = {
  getLastInvoice: () => void;
  getCustomerInvoice: (query: string, CurrPage?: number) => void;
  createNewInvoice: (invoice: NewestInvoiceInput) => void;
};

export type InvoiceStore = State & Action;

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
    amount: 0,
    date: '',
    status: 'pending',
  },
};

export const createInvoiceStore = (initState: State = defaultInitState) => {
  return createStore<InvoiceStore>()(
    devtools(
      persist<InvoiceStore>(
        (set, get, api) => ({
          ...initState,
          getLastInvoice: async () => {
            const lastInvoice = await getLastInvoice();
            set((state) => ({ lastInvoice: lastInvoice }));
          },
          getCustomerInvoice: async (query, CurrPage = 1) => {
            const customerInvoices = await getFilteredCustomerInvoice(
              query,
              CurrPage,
            );
            set((state) => ({ customerInvoices: customerInvoices }));
          },
          createNewInvoice: (invoice) =>
            set((state) => ({
              newestInvoice: {
                ...state.newestInvoice,
                ...invoice,
                date: new Date().toISOString().split('T')[0],
              },
            })),
        }),
        {
          name: 'Invoice',
        },
      ),
    ),
  );
};
