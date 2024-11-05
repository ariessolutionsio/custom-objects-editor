import { useQuery } from '@apollo/client';

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { SingleValueProps } from 'react-select';
import { getErrorMessage } from '../../../helpers';
import { TEntity } from '../types';
import { SearchSingleValueProps } from './types';

export const SearchSingleValue = <T extends TEntity>(
  props: SingleValueProps<T> & SearchSingleValueProps<T>
) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  const { data, loading, error } = useQuery<
    Record<string, any>,
    { locale: string }
  >(props.referenceBy === 'key' ? props.byKeyQuery : props.byIdQuery, {
    variables: {
      [props.referenceBy]: props.data[props.referenceBy],
      locale: dataLocale,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    skip: !props.data || !props.data[props.referenceBy],
  });

  if (!props.data || !props.data[props.referenceBy]) {
    return <AsyncSelectInput.SingleValue {...props} />;
  }
  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  if (loading) {
    return (
      <Spacings.Stack alignItems="center">
        <LoadingSpinner />
      </Spacings.Stack>
    );
  }
  if (!data?.[props.referenceType]) {
    return (
      <ContentNotification type="error">
        <Text.Body>Invalid value</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <AsyncSelectInput.SingleValue {...props}>
      {props.localizePath(data[props.referenceType], true)}
    </AsyncSelectInput.SingleValue>
  );
};
