import React, { lazy, ReactNode } from 'react';
import { Link, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { FormattedMessage, useIntl } from 'react-intl';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import { customProperties } from '@commercetools-uikit/design-system';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import SelectInput from '@commercetools-uikit/select-input';
import Grid from '@commercetools-uikit/grid';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  InfoMainPage,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import { Pagination } from '@commercetools-uikit/pagination';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import { ContentNotification } from '@commercetools-uikit/notifications';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { CONTAINER, SORT_OPTIONS } from '../../constants';
import { getErrorMessage } from '../../helpers';
import { useCustomObjectsFetcher } from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import { FIELDS } from './constants';
import messages from './messages';

const CreateContainer = lazy(() => import('../create-container'));

const ContainerDetails = lazy(() => import('../container-details'));

const sortOptions: Array<{ label: ReactNode; value: string }> = [
  {
    label: <FormattedMessage {...messages.newestFirstLabel} />,
    value: `${FIELDS.CREATED} ${SORT_OPTIONS.DESC}`,
  },
  {
    label: <FormattedMessage {...messages.oldestFirstLabel} />,
    value: `${FIELDS.CREATED} ${SORT_OPTIONS.ASC}`,
  },
  {
    label: <FormattedMessage {...messages.lastModifiedLabel} />,
    value: `${FIELDS.LAST_MODIFIED} ${SORT_OPTIONS.DESC}`,
  },
  {
    label: <FormattedMessage {...messages.alphabeticalAscLabel} />,
    value: `${FIELDS.KEY} ${SORT_OPTIONS.ASC}`,
  },
  {
    label: <FormattedMessage {...messages.alphabeticalDescLabel} />,
    value: `${FIELDS.KEY} ${SORT_OPTIONS.DESC}`,
  },
];

const ContainerList = () => {
  const match = useRouteMatch();
  const { push } = useHistory();
  const intl = useIntl();
  const { page, perPage } = usePaginationState();

  const tableSorting = useDataTableSortingState({
    key: FIELDS.KEY,
    order: 'asc',
  });

  const { customObjectsPaginatedResult, loading, error, refetch } =
    useCustomObjectsFetcher({
      container: CONTAINER,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
    });

  const handleSortChange = (event: any) => {
    const { value } = event.target;
    const sorting = value.split(' ');
    tableSorting.onChange(sorting[0], sorting[1]);
  };

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

  if (!customObjectsPaginatedResult || !customObjectsPaginatedResult.results) {
    return <PageNotFound />;
  }

  const { results, count, total } = customObjectsPaginatedResult;

  return (
    <InfoMainPage
      customTitleRow={
        <Spacings.Inline justifyContent="space-between">
          <Spacings.Inline alignItems="baseline">
            <Text.Headline as="h2">
              {intl.formatMessage(messages.title)}
            </Text.Headline>
            {!!total && (
              <Text.Body tone="secondary" data-testid="total-results">
                <FormattedMessage
                  values={{ total }}
                  {...messages.titleResults}
                />
              </Text.Body>
            )}
          </Spacings.Inline>

          <SecondaryButton
            iconLeft={<PlusBoldIcon />}
            as="a"
            href={`${match.url}/new`}
            label={intl.formatMessage(messages.createContainer)}
          />
        </Spacings.Inline>
      }
    >
      {count && count > 0 ? (
        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="flex-end">
            <Constraints.Horizontal max={6}>
              <SelectInput
                value={tableSorting.value.key + ' ' + tableSorting.value.order}
                onChange={handleSortChange}
                options={sortOptions}
              />
            </Constraints.Horizontal>
          </Spacings.Inline>
          <Grid
            gridGap={customProperties.spacingM}
            gridAutoColumns="1fr"
            gridTemplateColumns={`repeat(auto-fill, minmax(${customProperties.constraint6}, 1fr))`}
          >
            {results &&
              results.map(({ id, key, value }) => {
                return (
                  <Link key={id} to={`${match.url}/${id}`}>
                    <Card theme="dark">
                      <Spacings.Inline>
                        <Text.Body data-testid="container-key" truncate={true}>
                          {key}
                        </Text.Body>
                        <Text.Body>
                          <FormattedMessage
                            data-testid="container-attributes"
                            values={{
                              total: (value.attributes as Array<any>).length,
                            }}
                            {...messages.attributesLabel}
                          />
                        </Text.Body>
                      </Spacings.Inline>
                    </Card>
                  </Link>
                );
              })}
          </Grid>

          <Pagination
            totalItems={count}
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
          />
        </Spacings.Stack>
      ) : (
        count === 0 && (
          <Text.Body
            data-testid="no-results-error"
            intlMessage={messages.errorNoResults}
          />
        )
      )}
      <Switch>
        <SuspendedRoute path={`${match.path}/new`}>
          <CreateContainer
            onClose={() => {
              refetch();
              push(`${match.url}`);
            }}
          />
        </SuspendedRoute>
        <SuspendedRoute path={`${match.path}/:id`}>
          <ContainerDetails
            onClose={() => {
              refetch();
              push(`${match.url}`);
            }}
          />
        </SuspendedRoute>
      </Switch>
    </InfoMainPage>
  );
};
ContainerList.displayName = 'ContainerList';

export default ContainerList;
