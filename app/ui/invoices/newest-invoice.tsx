'use client';

import { formatDateToLocal } from '@/app/lib/utils';
import { lusitana } from '@/app/ui/fonts';
import { newestInvoiceAtom } from '@/stores/invoice';
import { useAtom } from 'jotai';

export default function NewestInvoice() {
  const [invoice] = useAtom(newestInvoiceAtom);

  const { amount, date, status } = invoice;

  if (!invoice.date) {
    return null;
  }

  return (
    <div className="mt-6 flex w-full flex-col md:col-span-4">
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <h2 className={`${lusitana.className} mt-4 text-xl md:text-2xl`}>
          Just created invoice :
        </h2>
        <p>Date of creation: {formatDateToLocal(date)}</p>
        <p>Amount: ${amount}</p>
        <p>Status: {status}</p>
      </div>
    </div>
  );
}
