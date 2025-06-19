import { FormattedDate } from 'react-intl';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import map from 'lodash/map';
import startCase from 'lodash/startCase';
import Text from '@commercetools-uikit/text';
import styles from './custom-objects-list.module.css';

function renderValue(value: any) {
  if (isPlainObject(value)) {
    return (
      <div data-testid="object-value" className={`${styles.nested}`}>
        {renderObject(value)}
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className={styles.nested}>
        {map(value, (val, index) => (
          <div data-testid="list-value" className={styles.listItem} key={index}>
            {renderValue(val)}
          </div>
        ))}
      </div>
    );
  }

  const dateRegex = /\d{4}-\d{2}-\d{2}/;
  if (isString(value) && value.match(dateRegex)) {
    return value.indexOf('T') >= 0 ? (
      <FormattedDate
        value={value}
        year={'numeric'}
        month={'numeric'}
        day={'numeric'}
        hour={'numeric'}
        minute={'numeric'}
        hour12={true}
        timeZoneName={'short'}
      />
    ) : (
      <FormattedDate
        value={value}
        year={'numeric'}
        month={'numeric'}
        day={'numeric'}
      />
    );
  }

  return value.toString();
}

export function renderObject(value: { [key: string]: unknown }) {
  const result = Object.entries(value).map(([key, value]) => {
    return (
      <div key={key} className={styles.item}>
        <Text.Body data-testid="value-title" isBold as="span">
          {startCase(key)}:
        </Text.Body>
        &nbsp;
        {renderValue(value)}
      </div>
    );
  });

  return result;
}
