import { TEntity } from '../../types';

export interface Order extends TEntity {
  orderNumber: string;
  customerEmail?: string;
  billingAddress: {
    country: string;
    city: string;
    state?: string;
    streetName?: string;
  };
  totalPrice?: {
    centAmount: number;
    currencyCode: string;
  };
}

export interface OrderResults {
  categories: { results: Order[] };
}
