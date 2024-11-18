import { TEntity } from '../../types';

export interface ProductDiscount extends TEntity {
  id: string;
  name: string;
  key: string;
  value: {
    type: string;
  };
  isActive: boolean;
}
