// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';
import { TCustomObject } from './types/generated/ctp';

export const entryPointUriPath =
  typeof window === 'undefined'
    ? process.env.ENTRY_POINT_URI_PATH
    : window.app.entryPointUriPath ?? 'custom-objs';

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


export const TYPES = {
  String: 'String',
  LocalizedString: 'LocalizedString',
  Number: 'Number',
  Boolean: 'Boolean',
  Money: 'Money',
  Date: 'Date',
  Time: 'Time',
  DateTime: 'DateTime',
  Enum: 'Enum',
  LocalizedEnum: 'LocalizedEnum',
  Object: 'Object',
  Reference: 'Reference',
};

export enum TYPES_ENUM {
  String = 'String',
  LocalizedString = 'LocalizedString',
  Number = 'Number',
  Boolean = 'Boolean',
  Money = 'Money',
  Date = 'Date',
  Time = 'Time',
  DateTime = 'DateTime',
  Enum = 'Enum',
  LocalizedEnum = 'LocalizedEnum',
  Object = 'Object',
  Reference = 'Reference',
}

export const REFERENCE_BY = {
  Key: 'key',
  Id: 'id',
};

export enum REFERENCE_TYPES_ENUM {
  Cart = 'cart',
  CartDiscount = 'cart-discount',
  Category = 'category',
  Channel = 'channel',
  Customer = 'customer',
  CustomerGroup = 'customer-group',
  DiscountCode = 'discount-code',
  KeyValueDocument = 'key-value-document',
  Payment = 'payment',
  Product = 'product',
  ProductDiscount = 'product-discount',
  ProductPrice = 'product-price',
  ProductType = 'product-type',
  Order = 'order',
  OrderEdit = 'order-edit',
  ShippingMethod = 'shipping-method',
  ShoppingList = 'shopping-list',
  State = 'state',
  Store = 'store',
  TaxCategory = 'tax-category',
  Type = 'type',
  Zone = 'zone',
}

export const REFERENCE_TYPES = {
  Cart: 'cart',
  CartDiscount: 'cart-discount',
  Category: 'category',
  Channel: 'channel',
  Customer: 'customer',
  CustomerGroup: 'customer-group',
  DiscountCode: 'discount-code',
  KeyValueDocument: 'key-value-document',
  Payment: 'payment',
  Product: 'product',
  ProductDiscount: 'product-discount',
  ProductPrice: 'product-price',
  ProductType: 'product-type',
  Order: 'order',
  OrderEdit: 'order-edit',
  ShippingMethod: 'shipping-method',
  ShoppingList: 'shopping-list',
  State: 'state',
  Store: 'store',
  TaxCategory: 'tax-category',
  Type: 'type',
  Zone: 'zone',
};

export const ATTRIBUTES = {
  Name: 'name',
  Type: 'type',
  Required: 'required',
  Set: 'set',
  Display: 'display',
  Attributes: 'attributes',
  Reference: 'reference',
  Enum: 'enum',
  LocalizedEnum: 'lenum',
};

export type LocalizedEnum = {
  value: string;
  label: { [key: string]: string };
};

export type Enum = {
  value: string;
  label: string;
};

export type Reference = { by: string; type: REFERENCE_TYPES_ENUM };

export type AttributeValue = {
  name: string;
  type: TYPES_ENUM;
  set?: boolean;
  required?: boolean;
  attributes?: Array<any>;
  reference?: Reference;
  display?: boolean;
  lenum?: Array<LocalizedEnum>;
  enum?: Array<Enum>;
};

export type Value = {
  attributes: Array<AttributeValue>;
};

export type ContainerValue = {
  key: string;
} & Value;

export type ValueObject = {
  value: Value;
} & Pick<TCustomObject, 'container' | 'id' | 'key'>;

export const emptyAttribute: AttributeValue = {
  name: '',
  type: TYPES_ENUM.Boolean,
  set: false,
  required: false,
};