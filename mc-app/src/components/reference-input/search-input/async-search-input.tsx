import { useLazyQuery, useQuery } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import { SearchIcon } from '@commercetools-uikit/icons';
import { useCallback, useEffect, useState } from 'react';
import { SingleValueProps } from 'react-select';
import { TEntity } from '../types';
import { AsyncSelectOption } from './search-option';
import { SearchSingleValue } from './search-single-value';
import { AsyncSearchInputProps, Result } from './types';

const AsyncSearchInput = <T extends TEntity, R extends Result<T>>({
  name,
  value,
  placeholder,
  hasError,
  referenceBy,
  referenceType,
  singleValueQueryDataObject,
  byIdQuery,
  byKeyQuery,
  searchQuery,
  allQuery,
  onChange,
  onBlur,
  optionMapper,
  variableBuilder,
  localizePath,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & AsyncSearchInputProps<T, R>) => {
  const [defaultOptions, setDefaultOptions] = useState<TEntity[]>([]);
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  const { refetch } = useQuery<R, any>(searchQuery, {
    skip: true,
    variables: {
      limit: 20,
      offset: 0,
      locale: dataLocale,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  const [getAll] = useLazyQuery<R, any>(allQuery ?? searchQuery, {
    variables: {
      locale: dataLocale,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    fetchPolicy: 'cache-first'
  });

  const loadOptions = (text: string) => {
    console.log('text', text);

    return refetch(variableBuilder(text)).then((response) =>
      optionMapper(response.data).map((option) => ({
        ...option,
        disabled: !option[referenceBy],
      }))
    );
  };

  const loadDefaultOptions = useCallback(async () => {
    const res = await getAll().then((response) => {
      if (response.data) {
        return optionMapper(response.data).map((option) => ({
          ...option,
          disabled: !option[referenceBy],
        }));
      }
      return [];
    });
    setDefaultOptions(res);
  }, [allQuery]);

  useEffect(() => {
    if (allQuery) {
      loadDefaultOptions();
    }
  }, [allQuery, loadDefaultOptions]);
  return (
    <AsyncSelectInput
      {...props}
      isOptionDisabled={(option: any) => !!option.disabled}
      name={`${name}.${referenceBy}`}
      value={value}
      placeholder={placeholder}
      isClearable
      isSearchable
      cacheOptions={20}
      loadOptions={loadOptions}
      defaultOptions={defaultOptions}
      components={{
        SingleValue: (props: SingleValueProps<any>) => (
          <SearchSingleValue<T>
            {...props}
            referenceBy={referenceBy}
            singleValueQueryDataObject={singleValueQueryDataObject}
            referenceType={referenceType}
            byIdQuery={byIdQuery}
            byKeyQuery={byKeyQuery}
            localizePath={localizePath}
          />
        ),
        Option: AsyncSelectOption,
        DropdownIndicator: () => <SearchIcon color="primary" />,
      }}
      hasError={hasError}
      onBlur={(event) => {
        onBlur({
          ...event,
          target: {
            ...event.target,
            value: (event.target.value as TEntity)?.[referenceBy],
          },
        });
      }}
      onChange={(event) => {
        onChange({
          ...event,
          target: {
            ...event.target,
            value: (event.target.value as TEntity)?.[referenceBy],
          },
        });
      }}
    />
  );
};
AsyncSearchInput.displayName = 'AsyncSearchInput';

export default AsyncSearchInput;
