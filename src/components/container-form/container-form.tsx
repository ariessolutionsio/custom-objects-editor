import React, { FC, ReactElement } from 'react';
import { useFormik, FormikProvider } from 'formik';
import { useIntl } from 'react-intl';
import reduce from 'lodash/reduce';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { array, bool, lazy, object, string } from 'yup';
import { ContainerValue, TYPES } from '../../constants';
import messages from './messages';
import Form from './form';

type Formik = ReturnType<typeof useFormik>;

type FormProps = {
  formElements: ReactElement;
  values: Formik['values'];
  isDirty: Formik['dirty'];
  isSubmitting: Formik['isSubmitting'];
  submitForm: Formik['handleSubmit'];
  handleReset: Formik['handleReset'];
};

type Props = {
  initialValues: ContainerValue;
  onSubmit: (values: any) => void;
  children: (formProps: FormProps) => JSX.Element;
};

const ContainerForm: FC<Props> = ({ onSubmit, initialValues, children }) => {
  const intl = useIntl();
  const { projectLanguages } = useApplicationContext((context) => ({
    projectLanguages: context.project?.languages ?? [],
  }));

  const requiredFieldMessage = intl.formatMessage(messages.requiredFieldError);
  const requiredFieldError = {
    required: requiredFieldMessage,
  };
  const stringSchema = string().required(requiredFieldError);
  const attributeSchema: any = {
    name: stringSchema,
    type: stringSchema,
    set: bool(),
    required: bool(),
    display: bool(),
    attributes: array(lazy(() => object(attributeSchema))),
    reference: object()
      .when('type', {
        is: (val: any) => val === TYPES.Reference,
        then: (schema) => object({
          by: stringSchema,
          type: stringSchema,
        })
      }),
    enum: array().when('type', {
      is: (val: any) => val === TYPES.Enum,
      then: (schema) => array(
        object({
          value: string().required(requiredFieldMessage),
          label: string().required(requiredFieldMessage),
        })
      ),
    }),
    lenum: array().when('type', {
      is: (val: any) => val === TYPES.LocalizedEnum,
      then: (schema) => array(
        object({
          value: string().required(requiredFieldMessage),
          label: object(
            reduce(
              projectLanguages,
              (name, lang) => ({
                ...name,
                [lang]: string().required(requiredFieldMessage),
              }),
              {}
            )
          ),
        })
      ),
    }),
  };
  const validationSchema = object({
    key: stringSchema,
    attributes: array(object(attributeSchema)),
  });

  const formik = useFormik<ContainerValue>({
    initialValues: initialValues,
    onSubmit: onSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
  });

  const formElements = <Form {...formik} />;

  return (
    <FormikProvider value={formik}>
      {children({
        formElements,
        values: formik.values,
        isDirty: formik.dirty,
        isSubmitting: formik.isSubmitting,
        submitForm: formik.handleSubmit,
        handleReset: formik.handleReset,
      })}
    </FormikProvider>
  );
};
ContainerForm.displayName = 'ContainerForm';

export default ContainerForm;
