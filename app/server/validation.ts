import { z } from 'zod';
export const FormSchema = z.object({
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

export const CreateInvoice = FormSchema.omit({ id: true, date: true });
