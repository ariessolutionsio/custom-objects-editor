import React, { FC } from 'react';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import map from 'lodash/map';
import { FormattedMessage, useIntl } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Card from '@commercetools-uikit/card';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import SelectField from '@commercetools-uikit/select-field';
import TextField from '@commercetools-uikit/text-field';
import Spacings from '@commercetools-uikit/spacings';
import { useFormik } from 'formik';
import { useContainerContext } from '../../context/container-context';
import { getAttributeValidation, getAttributeValues } from '../../form-utils';
import AttributeField from './attribute-field';
import messages from './messages';
import styles from './form.module.css';
import { Items } from './custom-object-form';

type Formik = ReturnType<typeof useFormik<Items>>;

type Props = {
  initialValues: Items;
  values: Items;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
  setFieldValue: Formik['setFieldValue'];
  updateSchemaValidation: (valueSchema: any) => void;
};

const Form: FC<Props> = ({
  initialValues,
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  setFieldValue,
  updateSchemaValidation,
}) => {
  const intl = useIntl();
  const { containers } = useContainerContext();
  const { currencies, languages } = useApplicationContext((context) => ({
    languages: context.project?.languages ?? [],
    currencies: context.project?.currencies ?? [],
  }));

  const containerOptions = map(containers, (container) => ({
    label: container.key,
    value: JSON.stringify(container),
  }));

  const onAttributesChange = React.useCallback((attributes: any) => {
    if (attributes) {
      const valueSchema = getAttributeValidation(
        attributes,
        languages,
        {
          required: messages.requiredFieldError,
        },
        intl
      );
      updateSchemaValidation(valueSchema);
    }
  }, [intl, languages, updateSchemaValidation]);

  React.useEffect(() => {
    if (values.container) {
      const container = JSON.parse(values.container);
      const attributes = container.value.attributes;
      setFieldValue('attributes', null);
      const value =
        values.container !== initialValues.container
          ? getAttributeValues(attributes, currencies, languages)
          : initialValues.value;
      setFieldValue('value', value);
      setFieldValue('attributes', attributes);
    }
  }, [currencies, initialValues.container, initialValues.value, languages, setFieldValue, values.container]);

  React.useEffect(() => {
    onAttributesChange(values.attributes);
  }, [values.attributes]);

  return (
    <Spacings.Stack scale="m">
      <CollapsiblePanel
        header={
          <CollapsiblePanel.Header>
            <FormattedMessage {...messages.generalInformationTitle} />
          </CollapsiblePanel.Header>
        }
      >
        <Card type="flat" className={styles['field-card']} insetScale="s">
          <SelectField
            name="container"
            title={<FormattedMessage {...messages.containerTitle} />}
            isRequired
            options={containerOptions}
            value={values.container}
            touched={touched.container}
            //errors={errors.container}
            onChange={handleChange}
            onBlur={handleBlur}
            // renderError={(key, error) => error}
          />
        </Card>
        <Card type="flat" className={styles['field-card']} insetScale="s">
          <TextField
            name="key"
            value={values.key || ''}
            title={<FormattedMessage {...messages.keyTitle} />}
            isRequired
            //errors={errors.key}
            touched={touched.key}
            onBlur={handleBlur}
            onChange={handleChange}
            //renderError={(key, error) => error}
          />
        </Card>
      </CollapsiblePanel>
      {values.attributes && (
        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              <FormattedMessage {...messages.customObjectInformationTitle} />
            </CollapsiblePanel.Header>
          }
        >
          {values.attributes.map((attribute, index) => {
            const name = `value.${camelCase(attribute.name)}`;
            return (
              <Card
                key={index}
                type="flat"
                insetScale="s"
                className={styles['field-card']}
              >
                <AttributeField
                  key={index}
                  type={attribute.type}
                  attributes={attribute.attributes}
                  reference={attribute.reference}
                  options={attribute.enum || attribute.lenum}
                  name={name}
                  title={attribute.name}
                  isRequired={attribute.required}
                  isSet={attribute.set}
                  value={get(values, name)}
                  touched={get(touched, name)}
                  errors={get(errors, name)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Card>
            );
          })}
        </CollapsiblePanel>
      )}
    </Spacings.Stack>
  );
};
Form.displayName = 'Form';

export default Form;
