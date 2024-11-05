import { TEntity } from '../../types';

export interface State extends TEntity {
  description?: string;
  roles?: string[];
  type?: string;
}
