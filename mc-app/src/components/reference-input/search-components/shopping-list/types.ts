import { TEntity } from '../../types';

export interface ShoppingList extends TEntity {
  slug?: string;
  customer?: {
    email?: string;
    id: string;
  };
}
