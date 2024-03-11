import { TColumn } from '@commercetools-uikit/data-table';
import { IntlShape } from 'react-intl';
import messages from './messages';

export const COLUMN_KEYS = {
  CONTAINER: 'container',
  KEY: 'key',
  MODIFIED: 'lastModifiedAt',
};

export const columnDefinitions = (intl: IntlShape): Array<TColumn> => [
  {
    key: COLUMN_KEYS.CONTAINER,
    isSortable: true,
    label: intl.formatMessage(messages.containerColumn),
  },
  {
    key: COLUMN_KEYS.KEY,
    isSortable: true,
    label: intl.formatMessage(messages.keyColumn),
  },
  {
    key: COLUMN_KEYS.MODIFIED,
    isSortable: true,
    label: intl.formatMessage(messages.lastModifiedAtColumn),
  },
];
