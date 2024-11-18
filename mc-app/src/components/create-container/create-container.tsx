import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  CustomFormDetailPage,
  CustomFormModalPage,
  FormModalPage,
} from '@commercetools-frontend/application-components';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { CONTAINER, PERMISSIONS, emptyAttribute } from '../../constants';
import ContainerForm from '../container-form';
import { useCustomObjectUpdater } from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import messages from './messages';

type Props = {
  onClose: () => void;
};

const CreateContainer: FC<Props> = ({ onClose }) => {
  const intl = useIntl();
  const showNotification = useShowNotification();
  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });

  const customObjectUpdater = useCustomObjectUpdater();

  const onSubmit = async (values: any) => {
    const { key, attributes } = values;

    await customObjectUpdater.execute({
      draft: {
        container: CONTAINER,
        key,
        value: JSON.stringify({ attributes }),
      },
      onCompleted: () => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.success,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.createSuccess),
        });
        onClose();
      },
      onError: (message) => {
        showNotification({
          kind: NOTIFICATION_KINDS_SIDE.error,
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.createError),
        });
      },
    });
  };

  return (
    <ContainerForm
      onSubmit={onSubmit}
      initialValues={{
        key: '',
        attributes: [emptyAttribute],
      }}
    >
      {(formProps) => {
        return (
          <CustomFormModalPage
            title={intl.formatMessage(messages.title)}
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
CreateContainer.displayName = 'CreateContainer';

export default CreateContainer;
