import { CONTAINER } from '../../constants';

export const FIELDS = {
  KEY: 'key',
  LAST_MODIFIED: 'lastModifiedAt',
  CREATED: 'createdAt',
};
export const PAGE_SIZE = 15;
export const DEFAULT_VARIABLES = {
  limit: PAGE_SIZE,
  offset: 0,
  container: CONTAINER,
};
