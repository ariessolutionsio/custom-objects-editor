import { TEntity } from '../../types';

export interface Category extends TEntity {
  name: string;
  nameAllLocales: { [key: string]: string };
  ancestors?: {
    nameAllLocales: { [key: string]: string };
    id: string;
    name: string;
  }[];
  stagedProductCount?: number;
}

export interface CategoryResults {
  categories: { results: Category[] };
}
