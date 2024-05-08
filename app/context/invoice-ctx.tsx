'use client';

import { NewestInvoiceInput } from '@/app/lib/definitions';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type InvoiceContextProps = {
  children: ReactNode;
};

export type InvoiceContextT = {
  invoice: NewestInvoiceInput;
  setInvoice: Dispatch<SetStateAction<NewestInvoiceInput>>;
} | null;

export const initialState = {
  customer_id: '',
  name: '',
  amount: '',
  date: '',
  status: 'pending',
} as NewestInvoiceInput;

export const InvoiceContext = createContext<InvoiceContextT>(null);

export default function InvoiceContextProvider({
  children,
}: InvoiceContextProps) {
  const [invoice, setInvoice] = useState(initialState);

  return (
    <InvoiceContext.Provider value={{ invoice, setInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoiceContext() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error(
      'useInvoiceContext must be used within InvoiceContextProvider',
    );
  }

  return context;
}
