import { TEntity } from '../../types';

export interface Product extends TEntity {
  productType: {
    key?: string;
  };
  masterData: {
    current: {
      name?: string;
      masterVariant?: {
        sku?: string;
      };
    };
  };
}

export interface ProductProjectionItem extends TEntity {
  productType: {
    key?: string;
  };
  masterVariant?: {
    sku?: string;
  };
}
