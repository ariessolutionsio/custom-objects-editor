import { useEffect, useState, useCallback } from 'react';
import { actions as sdkActions, useAsyncDispatch } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS, NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
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
  InfoModalPage,
} from '@commercetools-frontend/application-components';
import { TCustomObject } from '../../types/generated/ctp';
import { useContainerContext } from '../../context/container-context';
import { COLUMN_KEYS, columnDefinitions } from './column-definitions';
import messages from './messages';
import TextFilter from './text-filter';





const AllCustomObjectsList = () => {
  const [customObjectsData, setCustomObjectsData] = useState<any>({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const tableSorting = useDataTableSortingState({ key: 'lastModifiedAt', order: 'desc' });
  const { page, perPage } = usePaginationState();
  const intl = useIntl();
  const dispatch = useAsyncDispatch();
  const { hasContainers } = useContainerContext();
  const [customObjectDetails, setScustomObjectDetails ]= useState({});
  const [showDetails, setShowDetails ]= useState(false);


  const fetchAllCustomObjects = useCallback(async () => {
    try {
      const requestOptions: any = {sort: [{by: tableSorting.value.key, direction: tableSorting.value.order}]};
      
      const response: any = await dispatch(
        sdkActions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'customObjects',
          options:requestOptions
        })
      );
      setCustomObjectsData(response);
    } catch (error) {
      console.error('Error fetching custom objects', error);
    }
  }, [dispatch, tableSorting.value]);
  
  useEffect(() => {
    fetchAllCustomObjects();
  }, [fetchAllCustomObjects]);


  const { count, total } = customObjectsData;
  let results = customObjectsData.results || [];
  if(searchKeyword){
    results = results.filter((customObject: TCustomObject) => {
      return customObject.container.includes(searchKeyword) || customObject.key.includes(searchKeyword);
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
      </Spacings.Inline>
    }>
      <Spacings.Stack scale="l">
        {hasContainers && (
          <Card theme="dark" type="flat">
            <Spacings.Inline scale="m" alignItems="center">
              <Text.Body intlMessage={messages.filter} />
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
        )}
        {count > 0 ? (
          <div data-testid="all-custom-objects-list">
            <DataTable
              isCondensed
              columns={columnDefinitions(intl)}
              rows={results}
              itemRenderer={itemRenderer}
              sortedBy={tableSorting.value.key}
              sortDirection={tableSorting.value.order}
              onSortChange={tableSorting.onChange}
              onRowClick={(row) => {
                setScustomObjectDetails(row);
                setShowDetails(true);
              }}
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
      </Spacings.Stack>
      <InfoModalPage
        title="View Custom Object Details"
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          fetchAllCustomObjects();
        }}
        topBarPreviousPathLabel="Back"
      >
        <div contentEditable>{JSON.stringify(customObjectDetails, null, 2)}</div>
        
      </InfoModalPage>
    </InfoMainPage>
  );
};

AllCustomObjectsList.displayName = 'AllCustomObjectsList';

export default AllCustomObjectsList;