'use client';

import { lusitana } from '@/app/ui/fonts';
import { Card } from '@/app/ui/dashboard/cards';
// import { useInvoiceStore } from '@/app/providers/invoice-store-provider';
import { formatDateToLocal } from '@/app/lib/utils';
import { useEffect } from 'react';

export default function CustomerInvoice() {
  // const { getLastInvoice, lastInvoice, customerInvoices, getCustomerInvoice } =
  //   useInvoiceStore((state) => state);
  // const { name, amount, email } = lastInvoice;
  // const { status, date } = customerInvoices[0];

  // useEffect(() => {
  //   getLastInvoice();
  // }, []);

  // useEffect(() => {
  //   getCustomerInvoice(name);
  // }, [name]);

  // return (
  //   <div className="mt-6 flex w-full flex-col md:col-span-4">
  //     <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
  //       <h2 className={`${lusitana.className} mt-4 text-xl md:text-2xl`}>
  //         Last Invoice
  //       </h2>
  //       <Card title={name} value={amount} type={'invoices'}>
  //         <p>Email: {email}</p>
  //         {/* {customerInvoice && (
  //           <> */}
  //         <p>Date: {formatDateToLocal(date)}</p>
  //         <p>Status: {status}</p>
  //         {/* </> */}
  //         {/* )} */}
  //       </Card>
  //     </div>
  //   </div>
  // );

  return null;
}
