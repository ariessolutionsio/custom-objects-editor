import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import {
  CustomFormDetailPage,
  CustomFormModalPage,
  FormModalPage,
} from '@commercetools-frontend/application-components';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { PERMISSIONS } from '../../constants';
import CustomObjectForm from '../custom-object-form';

import { useCustomObjectUpdater } from '../../hooks/use-custom-object-connector/use-custom-object-connector';
import messages from './messages';

type Props = {
  onClose: () => void;
};

const CreateCustomObject: FC<Props> = ({ onClose }) => {
  const intl = useIntl();
  const showNotification = useShowNotification();
  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });
  const customObjectUpdater = useCustomObjectUpdater();

  const onSubmit = async (values: any) => {
    await customObjectUpdater.execute({
      draft: values,
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
          text: intl.formatMessage(messages.createSuccess),
        });
      },
    });
  };

  return (
    <CustomObjectForm
      initialValues={{
        container: '',
        key: '',
        value: {},
        attributes: [],
      }}
      onSubmit={onSubmit}
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
    </CustomObjectForm>
  );
};
CreateCustomObject.displayName = 'CreateCustomObject';

export default CreateCustomObject;
