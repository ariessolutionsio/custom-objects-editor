import { TEntity } from '../../types';

export interface CartDiscount extends TEntity {
  id: string;
  name: string;
  key: string;
  value: {
    type: string;
  };
  isActive: boolean;
}
