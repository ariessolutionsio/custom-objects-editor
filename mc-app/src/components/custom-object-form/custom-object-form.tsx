import React, { FC, ReactElement, useState } from 'react';
import { useIntl } from 'react-intl';
import { useFormik, FormikProvider } from 'formik';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { object, string } from 'yup';
import { AttributeValue } from '../../constants';
import messages from './messages';
import { Value } from './constants';
import Form from './form';

type Formik = ReturnType<typeof useFormik>;

export type Items = {
  container: string;
  value: Value;
  attributes: Array<AttributeValue>;
  key: string;
};

type FormProps = {
  formElements: ReactElement;
  values: Formik['values'];
  isDirty: Formik['dirty'];
  isSubmitting: Formik['isSubmitting'];
  submitForm: Formik['handleSubmit'];
  handleReset: Formik['handleReset'];
};

type Props = {
  onSubmit: (items: any) => void;
  initialValues: Items;
  children: (formProps: FormProps) => JSX.Element;
};

const CustomObjectForm: FC<Props> = ({ onSubmit, initialValues, children }) => {
  const intl = useIntl();
  const { languages } = useApplicationContext((context) => ({
    languages: context.project?.languages ?? [],
  }));

  const stringSchema = string().required({
    required: intl.formatMessage(messages.requiredFieldError),
  });
  const baseValidationSchema = {
    container: stringSchema,
    key: stringSchema,
    value: object(),
  };
  const [validationSchema, setValidationSchema] = useState(
    object(baseValidationSchema)
  );

  const updateSchemaValidation = (valueSchema: any) => {
    setValidationSchema(
      object({ ...baseValidationSchema, value: object(valueSchema) })
    );
  };

  function handleSubmit({
    container,
    key,
    value,
  }: {
    container: any;
    key: string;
    value: object;
  }) {
    return onSubmit({
      container: JSON.parse(container).key,
      key: key,
      value: JSON.stringify(value),
    });
  }

  const formik = useFormik<Items>({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
  });

  const formElements = (
    <Form {...formik} updateSchemaValidation={updateSchemaValidation} />
  );

  return (
    <FormikProvider value={formik}>
      {children({
        formElements: formElements,
        values: formik.values,
        isDirty: formik.dirty,
        isSubmitting: formik.isSubmitting,
        submitForm: formik.handleSubmit,
        handleReset: formik.handleReset,
      })}
    </FormikProvider>
  );
};
CustomObjectForm.displayName = 'CustomObjectForm';

export default CustomObjectForm;
