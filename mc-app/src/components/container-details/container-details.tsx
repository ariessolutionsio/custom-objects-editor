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
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { CONTAINER, PERMISSIONS } from '../../constants';

import { getErrorMessage } from '../../helpers';
import ContainerForm from '../container-form';
import {
  useCustomObjectDeleter,
  useCustomObjectFetcher,
  useCustomObjectUpdater,
} from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import messages from './messages';

type Props = {
  onClose: () => void;
};

const ContainerDetails: FC<Props> = ({ onClose }) => {
  const { id } = useParams<{ id: string }>();
  const intl = useIntl();
  const showNotification = useShowNotification();
  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });
  const customObjectUpdater = useCustomObjectUpdater();
  const customObjectDeleter = useCustomObjectDeleter();

  const { customObject, error, refetch, loading } = useCustomObjectFetcher({
    id: id,
  });

  const onSubmit = async (values: any) => {
    const { key, attributes } = values;

    await customObjectUpdater.execute({
      draft: {
        container: CONTAINER,
        key,
        value: JSON.stringify({
          attributes: attributes,
        }),
      },
      onCompleted: () => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.editSuccess),
        });
      },
      onError: (message) => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.error,
          domain: DOMAINS.SIDE,
          text: message, //<FormattedMessage {...messages.editError} values={{ message }} />,
        });
      },
    });
    refetch();
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

  if (!customObject || !customObject.key) {
    return <PageNotFound />;
  }

  const { key, version } = customObject;

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

  return (
    <ContainerForm
      onSubmit={onSubmit}
      initialValues={{
        key: key,
        attributes: customObject.value.attributes as any,
      }}
    >
      {(formProps) => {
        return (
          <CustomFormModalPage
            title={key}
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
    </ContainerForm>
  );
};
ContainerDetails.displayName = 'ContainerDetails';

export default ContainerDetails;
