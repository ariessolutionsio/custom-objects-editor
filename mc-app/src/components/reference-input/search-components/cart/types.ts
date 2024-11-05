import { TEntity } from '../../types';

export interface Cart extends TEntity {
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

export interface CartResults {
  categories: { results: Cart[] };
}
