'use client';

import { lusitana } from '@/app/ui/fonts';
import { Card } from '@/app/ui/dashboard/cards';
// import { useInvoiceStore } from '@/app/providers/invoice-store-provider';
import { formatDateToLocal } from '@/app/lib/utils';
import { useEffect } from 'react';
import { useInvoiceContext } from '@/app/context/invoice-ctx';

export default function CustomerInvoice() {
  const { invoice } = useInvoiceContext();
  const { name, amount, date, status } = invoice;
  console.log('invoice', invoice);
  if (!name) return null;

  return (
    <div className="mt-6 flex w-full flex-col md:col-span-4">
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <h2 className={`${lusitana.className} mt-4 text-xl md:text-2xl`}>
          Last Invoice
        </h2>
        <Card title={name} value={amount} type={'invoices'}>
          {/* {customerInvoice && (
            <> */}
          <p>Date: {formatDateToLocal(date)}</p>
          <p>Status: {status}</p>
          {/* </> */}
          {/* )} */}
        </Card>
      </div>
    </div>
  );
}
