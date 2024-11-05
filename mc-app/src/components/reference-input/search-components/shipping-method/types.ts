import { TEntity } from '../../types';

export interface ShippingMethod extends TEntity {
  zoneRates: {
    zone: {
      id: string;
      name: string;
    };
  }[];
}
