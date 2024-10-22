import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import { CloseIcon, SearchIcon } from '@commercetools-uikit/icons';
import TextInput from '@commercetools-uikit/text-input';
import styles from './text-filter.module.css';
import messages from './messages';

export const ENTER = 'Enter';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
};

const TextFilter: FC<Props> = ({ value, onChange, onSubmit, placeholder }) => {
  const intl = useIntl();
  const [filterPerformed, setFilterPerformed] = useState(false);

  function clear() {
    onChange('');
    onSubmit('');
    setFilterPerformed(false);
  }

  function filter() {
    onSubmit(value);
    setFilterPerformed(true);
  }

  function onKeyPress(event: React.KeyboardEvent) {
    if (event.key === ENTER) {
      filter();
    }
  }

  return (
    <div
      data-testid="filter-wrapper"
      className={styles.filterWrapper}
      onKeyPress={onKeyPress}
    >
      <TextInput
        data-testid="filter-input"
        // style="primary"
        name="filter-text"
        placeholder={placeholder}
        value={value}
        isAutofocussed={!!value}
        onChange={(event) => onChange(event.target.value)}
      />

      <div className={styles.iconContainer} data-testid="key-filter">
        {filterPerformed ? (
          <SecondaryIconButton
            data-testid="clear-button"
            //tone="primary"
            type="reset"
            icon={<CloseIcon size="medium" />}
            label={intl.formatMessage(messages.clearButton)}
            onClick={clear}
          />
        ) : (
          <SecondaryIconButton
            data-testid="filter-button"
            // tone="primary"
            icon={<SearchIcon size="medium" />}
            label={intl.formatMessage(messages.filterButton)}
            onClick={filter}
          />
        )}
      </div>
    </div>
  );
};
TextFilter.displayName = 'TextFilter';

export default TextFilter;
