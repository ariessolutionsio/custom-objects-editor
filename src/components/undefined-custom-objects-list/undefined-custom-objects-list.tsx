import { useState, useEffect, useCallback } from 'react';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import Spacings from '@commercetools-uikit/spacings';
import DataTable, { TColumn } from '@commercetools-uikit/data-table';
import Text from '@commercetools-uikit/text';
import { Pagination } from '@commercetools-uikit/pagination';
import Constraints from '@commercetools-uikit/constraints';
import Card from '@commercetools-uikit/card';
import { useIntl, FormattedMessage } from 'react-intl';
import { useDataTableSortingState, usePaginationState } from '@commercetools-uikit/hooks';
import {
  InfoMainPage,
} from '@commercetools-frontend/application-components';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { TCustomObject } from '../../types/generated/ctp';
import { useFetchAllCustomObjects } from '../../hooks/use-custom-object-connectors-rest/use-custom-object-connectors-rest';
import CustomObjectDetails from '../custom-object-details';
import CreateCustomObject from '../create-custom-object';
import { COLUMN_KEYS, columnDefinitions } from './column-definitions';
import messages from './messages';
import TextFilter from './text-filter';




const AllCustomObjectsList = () => {
  const tableSorting = useDataTableSortingState({ key: 'lastModifiedAt', order: 'desc' });
  const { page, perPage } = usePaginationState();
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data: customObjectsData, error, loading, fetchData } = useFetchAllCustomObjects();

  const fetchUndefinedCustomObjects = useCallback(()=> {
    fetchData({sort: [{by: tableSorting.value.key, direction: tableSorting.value.order}], where: ['value(attributes is defined)']});
  },[fetchData, tableSorting.value.key, tableSorting.value.order]);


  useEffect(() => {
    fetchUndefinedCustomObjects();
  }, [fetchUndefinedCustomObjects]);



  let results = customObjectsData?.results || [];
  const count = customObjectsData?.count || 0;
  const total = customObjectsData?.total || 0;

  if(searchKeyword){
    results = results.filter((customObject: any) => {
      return customObject.container.includes(searchKeyword) || customObject.key.includes(searchKeyword) || customObject.value.attributes.find((attribute: any) => attribute.name.includes(searchKeyword));
    });
  }

  const itemRenderer = (
    customObject: TCustomObject,
    column: TColumn<TCustomObject>
  ) => {
    const { CONTAINER, KEY, MODIFIED } = COLUMN_KEYS;

    switch (column.key) {
      case CONTAINER:
        return customObject.container;
      case KEY:
        return customObject.key;
      case MODIFIED:
        return intl.formatDate(customObject.lastModifiedAt);
      default:
        return NO_VALUE_FALLBACK;
    }
  };
  
  return(
    <InfoMainPage customTitleRow={
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
        <SecondaryButton
          iconLeft={<PlusBoldIcon />}
          as="a"
          href={`${match.url}/new`}
          label={intl.formatMessage(messages.createCustomObject)}
        />
      </Spacings.Inline>
    }>
      
      {(count && count !== 0) ? (
        <Spacings.Stack scale="l">
          <Spacings.Stack scale="m">
            <Card theme="dark" type="flat">
              <Spacings.Inline scale="m" alignItems="center">
                <Text.Body intlMessage={messages.search} />
                <Constraints.Horizontal max={'scale'}>
                  <TextFilter
                    placeholder={intl.formatMessage(messages.key)}
                    value={searchKeyword}
                    onChange={setSearchKeyword}
                    onSubmit={setSearchKeyword}
                  />
                </Constraints.Horizontal>
              </Spacings.Inline>
            </Card>
          </Spacings.Stack>
          
          <div data-testid="all-custom-objects-list">
            <Spacings.Stack scale="m">
              <DataTable
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
            </Spacings.Stack>
          </div>
        </Spacings.Stack>) :
        (
          <Text.Body
            data-testid="no-results-error"
            intlMessage={messages.errorNoResults}
          />
        )}
      <Switch>
        <SuspendedRoute path={`${match.path}/new`}>
          <CreateCustomObject
            onClose={() => {
              fetchUndefinedCustomObjects();
              push(`${match.url}`);
            }}
          />
        </SuspendedRoute>
        <SuspendedRoute path={`${match.path}/:id`}>
          <CustomObjectDetails
            onClose={() => {
              fetchUndefinedCustomObjects();
              push(`${match.url}`);
            }}
          />
        </SuspendedRoute>
      </Switch>
    </InfoMainPage>
  );
};

AllCustomObjectsList.displayName = 'AllCustomObjectsList';

export default AllCustomObjectsList;