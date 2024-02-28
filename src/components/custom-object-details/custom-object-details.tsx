import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import {
  CustomFormDetailPage,
  CustomFormModalPage,
  FormModalPage,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import {
  NOTIFICATION_KINDS_SIDE,
  DOMAINS,
} from '@commercetools-frontend/constants';
import Text from '@commercetools-uikit/text';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Spacings from '@commercetools-uikit/spacings';
import { reduce, isPlainObject, get } from 'lodash';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { PERMISSIONS, AttributeValue } from '../../constants';
import { TCustomObject } from '../../types/generated/ctp';
import { getErrorMessage } from '../../helpers';
import CustomObjectForm, {
  Items,
} from '../custom-object-form/custom-object-form';
import { getAttributeValues } from '../../form-utils';
import { useContainerContext } from '../../context/container-context';
import { Value } from '../custom-object-form/constants';
import {
  useCustomObjectDeleter,
  useCustomObjectFetcher,
  useCustomObjectUpdater,
} from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import messages from './messages';

type Props = {
  onClose: () => void;
};

const getValueForAttributes = (value: any, empty: any): any => {
  return reduce(
    empty,
    (result, val, key) => ({
      ...result,
      [key]: isPlainObject(val)
        ? getValueForAttributes(get(value, key), val)
        : get(value, key) || val,
    }),
    {}
  );
};

const initializeCustomObjectValues = (
  customObject: TCustomObject,
  containers: Array<TCustomObject>,
  currencies: Array<string>,
  languages: Array<string>
): Items => {
  const container = containers.find((item) => {
    return item.key === customObject.container;
  });

  const attributes: Array<AttributeValue> =
    (container?.value.attributes as Array<AttributeValue>) || [];
  // combining empty attribute values with saved values in case schema changed
  const value = getValueForAttributes(
    customObject.value as Value,
    getAttributeValues(attributes, currencies, languages)
  );

  return {
    key: customObject.key,
    container: JSON.stringify(container),
    value: value,
    attributes,
  };
};

const CustomObjectDetails: FC<Props> = ({ onClose }) => {
  const { id } = useParams<{ id: string }>();
  const intl = useIntl();
  const showNotification = useShowNotification();
  const { containers } = useContainerContext();
  const { currencies, languages } = useApplicationContext((context) => ({
    languages: context.project?.languages ?? [],
    currencies: context.project?.currencies ?? [],
  }));
  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });

  const customObjectDeleter = useCustomObjectDeleter();
  const customObjectUpdater = useCustomObjectUpdater();

  const { customObject, error, refetch, loading } = useCustomObjectFetcher({
    id: id,
  });

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

  if (!customObject || !customObject.key) {
    return <PageNotFound />;
  }

  const { key, version } = customObject || {};

  const handleDelete = async () => {
    if (id && version) {
      await customObjectDeleter.execute({
        id: id,
        version: version,
        onCompleted() {
          showNotification({
            kind: NOTIFICATION_KINDS_SIDE.success,
            domain: DOMAINS.SIDE,
            text: intl.formatMessage(messages.deleteSuccess),
          });
          onClose();
        },
        onError() {
          showNotification({
            kind: NOTIFICATION_KINDS_SIDE.error,
            domain: DOMAINS.SIDE,
            text: intl.formatMessage(messages.deleteError),
          });
        },
      });
    }
  };

  const initial = initializeCustomObjectValues(
    customObject,
    containers,
    currencies,
    languages
  );

  const onSubmit = async (values: any) => {
    await customObjectUpdater.execute({
      draft: { ...values },
      onCompleted() {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editSuccess),
        });
      },
      onError(message) {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.error,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editError),
        });
      },
    });
    refetch();
  };

  return (
    <CustomObjectForm initialValues={initial} onSubmit={onSubmit}>
      {(formProps) => {
        return (
          <CustomFormModalPage
            title={key || ''}
            onClose={onClose}
            isOpen
            formControls={
              <>
                <CustomFormDetailPage.FormSecondaryButton
                  label={FormModalPage.Intl.revert}
                  isDisabled={!formProps.isDirty}
                  onClick={formProps.handleReset}
                />
                <CustomFormDetailPage.FormPrimaryButton
                  isDisabled={
                    formProps.isSubmitting || !formProps.isDirty || !canManage
                  }
                  onClick={() => formProps.submitForm()}
                  label={FormModalPage.Intl.save}
                />
                <CustomFormModalPage.FormDeleteButton
                  onClick={() => handleDelete()}
                />
              </>
            }
          >
            {formProps.formElements}
          </CustomFormModalPage>
        );
      }}
    </CustomObjectForm>
  );
};
CustomObjectDetails.displayName = 'ContainerDetails';

export default CustomObjectDetails;
