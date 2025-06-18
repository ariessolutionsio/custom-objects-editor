import { useState } from 'react';
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
import { useCustomObjectsFetcher } from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import messages from '../container-list/messages';
import customObjectsMessages from '../custom-objects-list/messages';
import { useContainerContext } from '../../context/container-context';
import TextFilter from '../custom-objects-list/text-filter';

export const CustomObjectsModal = ({
  isOpen,
  close,
  handleSelect,
}: {
  isOpen: boolean;
  close: () => void;
  handleSelect: (value: string) => void;
}) => {
  const { hasContainers, containers } = useContainerContext();
  const intl = useIntl();

  const { page, perPage } = usePaginationState();
  const [container, setContainer] = useState(
    containers.map((item) => item.key)[0] || ''
  );
  const [key, setKey] = useState('');
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const { customObjectsPaginatedResult, loading, error, refetch } =
    useCustomObjectsFetcher({
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

  const modalContent = () => {
    if (
      !loading &&
      !hasContainers &&
      (!customObjectsPaginatedResult || !customObjectsPaginatedResult.results)
    ) {
      return <PageNotFound />;
    }

    if (loading) {
      return <LoadingSpinner />;
    }

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
      title="Select Custom Object"
      subtitle={`Results: ${customObjectsPaginatedResult?.total ?? 0}`}
      isOpen={isOpen}
      onClose={close}
    >
      {modalContent()}
    </InfoModalPage>
  );
};
