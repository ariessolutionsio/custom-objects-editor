import { TEntity } from '../../types';

export interface CustomerGroup extends TEntity {
  id: string;
  name: string;
  key: string;
}
