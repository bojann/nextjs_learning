import AppRouter from 'next/dist/client/components/app-router';
import { publicProcedure, router } from './trpc';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from '../lib/definitions';
import { formatCurrency } from '../lib/utils';
import { CreateInvoice } from './validation';
import { redirect } from 'next/navigation';

export const appRouter = router({
  fetchRevenue: publicProcedure.query(async () => {
    try {
      // Artificially delay a response for demo purposes.
      // Don't do this in production :)

      console.log('Fetching revenue data...');
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const data = await sql<Revenue>`SELECT * FROM revenue`;

      console.log('Data fetch completed after 3 seconds.');

      return data.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch revenue data.');
    }
  }),
  fetchLatestInvoices: publicProcedure.query(async () => {
    try {
      const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

      const latestInvoices = data.rows.map((invoice) => ({
        ...invoice,
        amount: formatCurrency(invoice.amount),
      }));

      return latestInvoices;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch the latest invoices.');
    }
  }),
  fetchCardData: publicProcedure.query(async () => {
    try {
      // You can probably combine these into a single SQL query
      // However, we are intentionally splitting them to demonstrate
      // how to initialize multiple queries in parallel with JS.
      const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
      const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
      const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

      const data = await Promise.all([
        invoiceCountPromise,
        customerCountPromise,
        invoiceStatusPromise,
      ]);

      const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
      const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
      const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
      const totalPendingInvoices = formatCurrency(
        data[2].rows[0].pending ?? '0',
      );

      return {
        numberOfCustomers,
        numberOfInvoices,
        totalPaidInvoices,
        totalPendingInvoices,
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch card data.');
    }
  }),
  fetchFilteredInvoices: publicProcedure
    .input(z.object({ query: z.string(), currentPage: z.number() }))
    .mutation(async (opts) => {
      const { query, currentPage } = opts.input;
      const ITEMS_PER_PAGE = 6;

      const offset = (currentPage - 1) * ITEMS_PER_PAGE;

      try {
        const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

        return invoices.rows;
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices.');
      }
    }),
  fetchInvoicesPages: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async (opts) => {
      const { query } = opts.input;
      const ITEMS_PER_PAGE = 6;

      try {
        const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

        const totalPages = Math.ceil(
          Number(count.rows[0].count) / ITEMS_PER_PAGE,
        );
        return totalPages;
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of invoices.');
      }
    }),
  fetchInvoiceById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      try {
        const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${opts.input.id};
    `;

        const invoice = data.rows.map((invoice) => ({
          ...invoice,
          // Convert amount from cents to dollars
          amount: invoice.amount / 100,
        }));

        return invoice[0];
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoice.');
      }
    }),
  fetchCustomers: publicProcedure.query(async () => {
    try {
      const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

      const customers = data.rows;
      return customers;
    } catch (err) {
      console.error('Database Error:', err);
      throw new Error('Failed to fetch all customers.');
    }
  }),
  fetchFilteredCustomers: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async (opts) => {
      const { query } = opts.input;

      try {
        const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

        const customers = data.rows.map((customer) => ({
          ...customer,
          total_pending: formatCurrency(customer.total_pending),
          total_paid: formatCurrency(customer.total_paid),
        }));

        return customers;
      } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer table.');
      }
    }),
  getUser: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async (opts) => {
      try {
        const user =
          await sql`SELECT * FROM users WHERE email=${opts.input.email}`;
        return user.rows[0] as User;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
      }
    }),
  createInvoice: publicProcedure
    .input(
      z.object({
        customer_id: z.string(),
        amount: z.string(),
        status: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const validatedFields = CreateInvoice.safeParse({
        customer_id: opts.input.customer_id,
        amount: opts.input.amount,
        status: opts.input.status,
      });

      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Invoice.',
        };
      }

      const { customer_id, amount, status } = validatedFields.data;
      const amountInCents = amount * 100;
      const date = new Date().toISOString().split('T')[0];

      try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customer_id}, ${amountInCents}, ${status}, ${date})
        `;
      } catch (error) {
        console.error('Create Invoice error', error);
        return {
          message: 'Database Error: Failed to Create Invoice.',
        };
      }

      revalidatePath('/dashboard/invoices');
      redirect('/dashboard/invoices');
    }),
});

export type AppRouter = typeof appRouter;
