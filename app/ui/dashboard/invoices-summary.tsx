'use client';
import { useInvoiceStore } from '@/app/providers/invoice-store-provider';
import { lusitana } from '@/app/ui/fonts';

export default function InvoiceSummary() {
  const customerInvoices = useInvoiceStore((state) => state.customerInvoices);
  const customerName = customerInvoices[0].name;
  const numOfInvoices = customerInvoices.length;
  const numOfPendingInvoices = customerInvoices.filter(
    (invoice) => invoice.status === 'pending',
  ).length;

  return (
    <div className="mt-6 flex w-full flex-col md:col-span-4">
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <h2 className={`${lusitana.className} mt-4 text-xl md:text-2xl`}>
          Invoice Summary for {customerName}:
        </h2>
        <p>Number of latests invoices: {numOfInvoices}</p>
        <p>Number of Pending invoices: {numOfPendingInvoices}</p>
        <p>Number of Paid invoices: {numOfInvoices - numOfPendingInvoices}</p>
      </div>
    </div>
  );
}
