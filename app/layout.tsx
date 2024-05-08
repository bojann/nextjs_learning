import { inter } from '@/app/ui/fonts';

import Provider from '@/app/_trpc/provider';
import { Metadata } from 'next';

import '@/app/ui/global.css';
import InvoiceContextProvider from '@/app/context/invoice-ctx';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Provider>
          <InvoiceContextProvider>{children}</InvoiceContextProvider>
        </Provider>
      </body>
    </html>
  );
}
