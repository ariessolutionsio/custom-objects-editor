import { CONTAINER } from '../../constants';

export const DATE_TIME_FORMAT = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
  timeZoneName: 'short',
};
export const DATE_FORMAT = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

export const PAGE_SIZE = 20;
export const DEFAULT_VARIABLES = {
  limit: PAGE_SIZE,
  offset: 0,
  container: CONTAINER,
};
