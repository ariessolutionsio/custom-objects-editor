import { lazy, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import camelCase from 'lodash/camelCase';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import map from 'lodash/map';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import SpacingsStack from '@commercetools-uikit/spacings-stack';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import SelectInput from '@commercetools-uikit/select-input';
import { Link, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import DataTable, { TColumn } from '@commercetools-uikit/data-table';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { Pagination } from '@commercetools-uikit/pagination';
import {
  InfoMainPage,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import { useContainerContext } from '../../context/container-context';
import { TCustomObject, TQuery } from '../../types/generated/ctp';
import { getErrorMessage } from '../../helpers';
import { AttributeValue } from '../../constants';
import { Logo } from '../../images/logo';
import { useCustomObjectsFetcher } from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import { columnDefinitions, COLUMN_KEYS } from './column-definitions';
import messages from './messages';
import styles from './custom-objects-list.module.css';
import TextFilter from './text-filter';
import { renderObject } from './render-object';


const CreateCustomObject = lazy(() => import('../create-custom-object'));
const CustomObjectDetails = lazy(() => import('../custom-object-details'));

const CustomObjectsList = () => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();
  const { hasContainers, containers } = useContainerContext();

  const { environment } = useApplicationContext<{
    logoMustBeVisible?: unknown;
  }>();
  const logoMustBeVisible =
    String(environment.logoMustBeVisible).toLowerCase() === 'true';

  const [key, setKey] = useState('');
  const { page, perPage } = usePaginationState();

  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const [container, setContainer] = useState(
    containers.map((item) => item.key)[0] || ''
  );

  const { customObjectsPaginatedResult, loading, error, refetch } =
    useCustomObjectsFetcher({
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
      container: container,
      where: key && key !== '' ? `key="${key}"` : undefined,
    });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body data-testid="loading-error">
          {getErrorMessage(error)}
        </Text.Body>
      </ContentNotification>
    );
  }
  if (loading) {
    return (
      <Spacings.Stack alignItems="center">
        <LoadingSpinner data-testid="loading-error"></LoadingSpinner>
      </Spacings.Stack>
    );
  }

  if (!customObjectsPaginatedResult || !customObjectsPaginatedResult.results) {
    return <PageNotFound />;
  }

  function getDisplayAttributes(
    attributes: Array<AttributeValue>
  ): Array<string> {
    return attributes.reduce<Array<string>>((display, attribute) => {
      if (attribute.display) {
        return [...display, camelCase(attribute.name)];
      }
      if (attribute.attributes) {
        const nested = getDisplayAttributes(attribute.attributes);
        return [...display, ...nested];
      }
      return [...display];
    }, []);
  }

  function getDisplayValues(
    value: { [key: string]: unknown },
    attributes: Array<string>
  ) {
    return Object.entries(value).reduce((display, [itemKey, itemValue]) => {
      if (includes(attributes, itemKey)) {
        return { ...display, [itemKey]: itemValue };
      }

      if (isPlainObject(itemValue)) {
        const nested: any = getDisplayValues(
          { [itemKey]: itemValue },
          attributes
        );
        if (!isEmpty(nested)) {
          return { ...display, [itemKey]: nested };
        }
      }

      return display;
    }, {});
  }

  const itemRenderer = (
    customObject: TCustomObject,
    column: TColumn<TCustomObject>
  ) => {
    const { CONTAINER, KEY, VALUE, MODIFIED } = COLUMN_KEYS;

    switch (column.key) {
      case CONTAINER:
        return customObject.container;
      case KEY:
        return customObject.key;
      case VALUE: {
        const customObjectContainer = containers.find((item) => {
          return item.key === customObject.container;
        });
        const displayAttributes =
          (customObjectContainer &&
            getDisplayAttributes(
              customObjectContainer.value.attributes as Array<AttributeValue>
            )) ||
          [];

        const value =
          !displayAttributes || isEmpty(displayAttributes)
            ? customObject.value
            : getDisplayValues(customObject.value, displayAttributes);

        return (
          <div className={styles.value} data-testid="custom-object-value">
            {renderObject(isEmpty(value) ? customObject.value : value)}
          </div>
        );
      }
      case MODIFIED:
        return intl.formatDate(customObject.lastModifiedAt);
      default:
        return NO_VALUE_FALLBACK;
    }
  };

  function filterByContainer(event: any) {
    const { value } = event.target;
    setContainer(value);
  }

  const { results, count, total } = customObjectsPaginatedResult;

  const containerOptions = map(containers, ({ key: containerKey }) => ({
    label: containerKey,
    value: containerKey,
  }));

  return (
    <InfoMainPage
      customTitleRow={
        <Spacings.Inline justifyContent="space-between">
          <Spacings.Inline alignItems="baseline">
            <Text.Headline as="h2" data-testid="title">
              {intl.formatMessage(messages.title)}
            </Text.Headline>
            {!!total && (
              <Text.Body tone="secondary" data-testid="subtitle">
                <FormattedMessage
                  values={{ total }}
                  {...messages.titleResults}
                />
              </Text.Body>
            )}
          </Spacings.Inline>

          {hasContainers && (
            <SecondaryButton
              data-testid="create-custom-object"
              iconLeft={<PlusBoldIcon />}
              as="a"
              href={`${match.url}/new`}
              label={intl.formatMessage(messages.createCustomObject)}
            />
          )}
        </Spacings.Inline>
      }
    >
      <SpacingsStack scale="m">
        {hasContainers && (
          <Card theme="dark" type="flat">
            <Spacings.Inline scale="m" alignItems="center">
              <Text.Body intlMessage={messages.filter} />
              <Constraints.Horizontal max={'scale'}>
                <SelectInput
                  data-testid="container-filter"
                  name="container"
                  placeholder={intl.formatMessage(messages.container)}
                  value={container}
                  options={containerOptions}
                  onChange={filterByContainer}
                />
              </Constraints.Horizontal>
              <Constraints.Horizontal max={'scale'}>
                <TextFilter
                  placeholder={intl.formatMessage(messages.key)}
                  value={key}
                  onChange={setKey}
                  onSubmit={setKey}
                />
              </Constraints.Horizontal>
            </Spacings.Inline>
          </Card>
        )}
        {!hasContainers && (
          <Spacings.Inline scale="xs" data-testid="no-containers-error">
            <Text.Body
              data-testid="loading-error"
              intlMessage={messages.errorNoContainers}
            />
            <Link to={`${match.url}/containers/new`}>
              {intl.formatMessage(messages.errorCreateContainerLink)}
            </Link>
          </Spacings.Inline>
        )}
        {count > 0 ? (
          <div data-testid="custom-objects-list">
            <DataTable<NonNullable<TQuery['customObjects']['results']>[0]>
              isCondensed
              columns={columnDefinitions(intl)}
              rows={results}
              itemRenderer={itemRenderer}
              sortedBy={tableSorting.value.key}
              sortDirection={tableSorting.value.order}
              onSortChange={tableSorting.onChange}
              onRowClick={(row) => push(`${match.url}/${row.id}`)}
            />
            <Pagination
              page={page.value}
              onPageChange={page.onChange}
              perPage={perPage.value}
              onPerPageChange={perPage.onChange}
              totalItems={total}
            />
          </div>
        ) : (
          count === 0 && (
            <Text.Body
              data-testid="no-results-error"
              intlMessage={messages.errorNoResults}
            />
          )
        )}
        
      </SpacingsStack>
      <Spacings.Stack scale="m" alignItems="center">
        {logoMustBeVisible && <Logo />}
      </Spacings.Stack>
      <Switch>
        <SuspendedRoute path={`${match.path}/new`}>
          <CreateCustomObject
            onClose={() => {
              refetch();
              push(`${match.url}`);
            }}
          />
        </SuspendedRoute>
        <SuspendedRoute path={`${match.path}/:id`}>
          <CustomObjectDetails
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
CustomObjectsList.displayName = 'CustomObjectsList';

export default CustomObjectsList;
