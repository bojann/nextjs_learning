'use client';

import { formatDateToLocal } from '@/app/lib/utils';
import { useInvoiceStore } from '@/app/providers/invoice-store-provider';
import { lusitana } from '@/app/ui/fonts';

export default function NewestInvoice() {
  const invoice = useInvoiceStore((state) => state.newestInvoice);
  const { amount, date, status } = invoice;
  console.log('invoice', invoice);

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
