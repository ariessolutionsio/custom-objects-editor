import { TEntity } from '../../types';

export interface Payment extends TEntity {
  amountPlanned?: {
    centAmount: number;
    currencyCode: string;
  };
  customer?: {
    email: string;
  };
  paymentStatus?: {
    state?: {
      key?: string;
    };
  };
}
