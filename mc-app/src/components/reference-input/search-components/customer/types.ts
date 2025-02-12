import { TEntity } from '../../types';

export interface Customer extends TEntity {
  email?: string;
  firstName?: string;
  lastName?: string;
  id: string;
  key?: string;
}
