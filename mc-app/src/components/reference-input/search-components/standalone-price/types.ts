import { TEntity } from '../../types';

export interface StandalonePrice extends TEntity {
  sku: string;
  customerGroup?: {
    key: string;
  };
  channel?: {
    key: string;
  };
  value: {
    centAmount: number;
    currencyCode: string;
  };
  validFrom: string;
  validUntil: string;
}
