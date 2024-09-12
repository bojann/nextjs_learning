'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';

import { type InvoiceStore, createInvoiceStore } from '@/stores/invoice';

export const InvoiceStoreContext = createContext<StoreApi<InvoiceStore> | null>(
  null,
);

export interface InvoiceStoreProviderProps {
  children: ReactNode;
}

export const InvoiceStoreProvider = ({
  children,
}: InvoiceStoreProviderProps) => {
  const storeRef = useRef<StoreApi<InvoiceStore>>();
  if (!storeRef.current) {
    storeRef.current = createInvoiceStore();
  }

  return (
    <InvoiceStoreContext.Provider value={storeRef.current}>
      {children}
    </InvoiceStoreContext.Provider>
  );
};

export const useInvoiceStore = <T,>(
  selector: (store: InvoiceStore) => T,
): T => {
  const invoiceStoreContext = useContext(InvoiceStoreContext);

  if (!invoiceStoreContext) {
    throw new Error(`useInvoiceStore must be use within InvoiceStoreProvider`);
  }

  return useStore(invoiceStoreContext, selector);
};
