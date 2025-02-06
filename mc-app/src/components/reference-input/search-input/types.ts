import { DocumentNode, OperationVariables } from '@apollo/client';
import { TEntity } from '../types';

export interface SearchSingleValueProps<T> {
  referenceBy: 'key' | 'id';
  referenceType: string;
  singleValueQueryDataObject: string;
  byKeyQuery: DocumentNode;
  byIdQuery: DocumentNode;
  localizePath: (value: T, ...args: any[]) => string | undefined;
}

export interface GenericSearchInputProps<T> extends ReferenceInputProps {
  value?: T | null;
  referenceBy: 'key' | 'id';
  referenceType: string;
  singleValueQueryDataObject: string;
}

export interface AsyncSearchInputProps<T, R>
  extends GenericSearchInputProps<T> {
  value?: T | null;
  byIdQuery: DocumentNode;
  byKeyQuery: DocumentNode;
  searchQuery: DocumentNode;
  allQuery?: DocumentNode;
  optionMapper: (data: R) => TEntity[];
  variableBuilder: (text: string) => OperationVariables;
  localizePath: (value: T, ...args: any[]) => string | undefined;
}

export interface ReferenceInputProps {
  name: string;
  value?: any;
  placeholder?: string;
  hasError?: boolean;
  onChange(...args: unknown[]): unknown;
  onBlur(...args: unknown[]): unknown;
  reference?: {
    by?: string;
    type?: string;
  };
}

export interface Result<T> {
  [key: string]: {
    results: T[];
  };
}
