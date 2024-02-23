// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

export const entryPointUriPath =
  typeof window === 'undefined'
    ? process.env.ENTRY_POINT_URI_PATH
    : 'custom-objects';

export const PERMISSIONS = entryPointUriPathToPermissionKeys(
  entryPointUriPath,
  ['products', 'orders', 'customers']
);

export const SORT_OPTIONS = { ASC: 'asc', DESC: 'desc' };

export const CONTAINER = 'mc-custom-object-schema';

export const groupNames = {
  products: 'products',
  orders: 'orders',
  customers: 'customers',
};
