'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customer_id: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .lte(10000, {
      message: 'You can not create an invoice for amount higher then $10000',
    })
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  date: z.string(),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customer_id?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { LatestInvoiceRaw } from './definitions';
import { formatCurrency } from './utils';
import { fetchFilteredInvoices, fetchLatestInvoices } from './data';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// export async function createInvoice(prevState: State, formData: FormData) {
//   const validatedFields = CreateInvoice.safeParse({
//     customer_id: formData.get('customer_id'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });
//   //   const { customer_id, amount, status } = CreateInvoice.parse(
//   //     Object.formEntries(formData.entries()),
//   //   );
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create Invoice.',
//     };
//   }

//   const { customer_id, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;
//   const date = new Date().toISOString().split('T')[0];

//   try {
//     await sql`
//         INSERT INTO invoices (customer_id, amount, status, date)
//         VALUES (${customer_id}, ${amountInCents}, ${status}, ${date})
//     `;
//   } catch (error) {
//     console.error('Create Invoice error', error);
//     return {
//       message: 'Database Error: Failed to Create Invoice.',
//     };
//   }

//   revalidatePath('/dashboard/invoices');
//   redirect('/dashboard/invoices');
// }

export async function updateInvoice(id: string, formData: FormData) {
  const { amount, customer_id, status } = UpdateInvoice.parse({
    customer_id: formData.get('customer_id'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customer_id}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Update Invoice error', error);
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  revalidatePath('/dashboard/invoice');
  redirect('/dashboard/invoice');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    console.error('Delete Invoice error', error);
    return {
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
}

export async function getLastInvoice() {
  try {
    const data = await fetchLatestInvoices();

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}
export async function getFilteredCustomerInvoice(
  query: string,
  currPage: number,
) {
  try {
    const filteredInvoices = await fetchFilteredInvoices(query, currPage);

    return filteredInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}
