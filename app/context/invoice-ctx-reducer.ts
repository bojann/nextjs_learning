import { NewestInvoiceInput } from '@/app/lib/definitions';

export enum INVOICE_ACTION {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  LOADING = 'LOADING',
  CLEAN = 'CLEAN',
}
interface StateT extends NewestInvoiceInput {
  message: string;
  actionStatus: INVOICE_ACTION;
}

export const invoiceReducer = (
  state: StateT,
  action: { type: INVOICE_ACTION; payload: any },
) => {
  switch (action.type) {
    case INVOICE_ACTION.ERROR:
      return {
        ...state,
        message: 'Something went wrong',
        actionStatus: INVOICE_ACTION.ERROR,
      };
    case INVOICE_ACTION.SUCCESS:
      return { ...state, actionStatus: INVOICE_ACTION.SUCCESS, message: '' };
    case INVOICE_ACTION.LOADING:
      return {
        ...state,
        actionStatus: INVOICE_ACTION.LOADING,
        message: '...loading',
      };
    case INVOICE_ACTION.CLEAN:
      return { actionStatus: INVOICE_ACTION.CLEAN, message: '' };
    default:
      throw new Error('Action type not meeting the Invoice reducer');
  }
};
