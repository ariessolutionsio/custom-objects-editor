import { useEffect, useState } from 'react';
import {
  InfoModalPage,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import Grid from '@commercetools-uikit/grid';
import { customProperties } from '@commercetools-uikit/design-system';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { FormattedMessage, useIntl } from 'react-intl';
import Constraints from '@commercetools-uikit/constraints';
import SelectInput from '@commercetools-uikit/select-input';
import map from 'lodash/map';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { EditIcon } from '@commercetools-uikit/icons';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  useCustomObjectsFetcher,
  useCustomObjectFetcher,
} from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import messages from '../container-list/messages';
import customObjectsMessages from '../custom-objects-list/messages';
import { useContainerContext } from '../../context/container-context';
import TextFilter from '../custom-objects-list/text-filter';
import { renderObject } from '../custom-objects-list/render-object';

export const CustomObjectsModal = ({
  isOpen,
  close,
  handleSelect,
  objectId,
}: {
  isOpen: boolean;
  close: () => void;
  handleSelect: (value: string) => void;
  objectId?: string;
}) => {
  const { hasContainers, containers } = useContainerContext();
  const intl = useIntl();
  const match = useRouteMatch();
  const { replace } = useHistory();

  const { page, perPage } = usePaginationState();
  const [container, setContainer] = useState(
    containers.map((item) => item.key)[0] || ''
  );
  const [key, setKey] = useState('');
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  // FETCH FOR SINGLE OBJECT (IF objectId provided)
  const {
    customObject,
    loading: singleLoading,
    error: singleError,
    refetch: refetchSingleObject,
  } = useCustomObjectFetcher({
    id: objectId,
  });

  useEffect(() => {
    if (objectId) {
      refetchSingleObject();
    }
  }, [objectId, refetchSingleObject]);

  // FETCH FOR LIST (if no objectId)
  const { customObjectsPaginatedResult, loading } = useCustomObjectsFetcher({
    limit: perPage.value,
    offset: (page.value - 1) * perPage.value,
    sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    container: container,
    where: key && key !== '' ? `key="${key}"` : undefined,
  });

  const containerOptions = map(containers, ({ key: containerKey }) => ({
    label: containerKey,
    value: containerKey,
  }));

  function filterByContainer(event: any) {
    const { value } = event.target;
    setContainer(value);
  }

  const handleSelection = (value: string) => {
    handleSelect(value);
  };

  const renderSingleObject = () => {
    if (singleLoading) return <LoadingSpinner />;
    if (singleError || !customObject) return <PageNotFound />;

    return (
      <div>
        {renderObject(customObject)}
        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="flex-end">
            <SecondaryButton
              data-testid="edit-custom-object"
              iconLeft={<EditIcon />}
              as="a"
              onClick={() => {
                const baseUrl = match.url.split('/').slice(0, -1).join('/');
                const newUrl = `${baseUrl}/${customObject.id}`;

                replace(newUrl);
              }}
              label="Edit Custom Object"
            />
          </Spacings.Inline>
        </Spacings.Stack>
      </div>
    );
  };

  const renderList = () => {
    if (
      !loading &&
      !hasContainers &&
      (!customObjectsPaginatedResult || !customObjectsPaginatedResult.results)
    ) {
      return <PageNotFound />;
    }

    if (loading) return <LoadingSpinner />;

    return (
      <Spacings.Stack scale="l">
        <Card theme="dark" type="flat">
          <Spacings.Inline scale="m" alignItems="center">
            <Text.Body intlMessage={customObjectsMessages.filter} />
            <Constraints.Horizontal max={'scale'}>
              <SelectInput
                data-testid="container-filter"
                name="container"
                placeholder={intl.formatMessage(
                  customObjectsMessages.container
                )}
                value={container}
                options={containerOptions}
                onChange={filterByContainer}
              />
            </Constraints.Horizontal>
            <Constraints.Horizontal max={'scale'}>
              <TextFilter
                placeholder={intl.formatMessage(customObjectsMessages.key)}
                value={key}
                onChange={setKey}
                onSubmit={setKey}
              />
            </Constraints.Horizontal>
          </Spacings.Inline>
        </Card>
        <Grid
          gridGap={customProperties.spacingM}
          gridAutoColumns="1fr"
          gridTemplateColumns={`repeat(auto-fill, minmax(${customProperties.constraint6}, 1fr))`}
        >
          {customObjectsPaginatedResult?.results &&
            customObjectsPaginatedResult?.results.map(({ id, key, value }) => {
              return (
                <Card key={id} theme="dark" onClick={() => handleSelection(id)}>
                  <Spacings.Inline>
                    <Text.Body data-testid="container-key" truncate={true}>
                      {key}
                    </Text.Body>
                    <Text.Body>
                      <FormattedMessage
                        data-testid="container-attributes"
                        values={{
                          total: (value.attributes as Array<any>)?.length,
                        }}
                        {...messages.attributesLabel}
                      />
                    </Text.Body>
                  </Spacings.Inline>
                </Card>
              );
            })}
        </Grid>
      </Spacings.Stack>
    );
  };

  return (
    <InfoModalPage
      title={objectId ? String(customObject?.key) : 'Select Custom Object'}
      subtitle={
        objectId
          ? 'Custom Object Detail'
          : `Results: ${customObjectsPaginatedResult?.total ?? 0}`
      }
      isOpen={isOpen}
      onClose={close}
    >
      {objectId ? renderSingleObject() : renderList()}
    </InfoModalPage>
  );
};
