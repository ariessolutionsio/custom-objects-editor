import React, { FC } from 'react';
import map from 'lodash/map';
import { FormattedMessage } from 'react-intl';
import SelectField from '@commercetools-uikit/select-field';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useFormik } from 'formik';
import { REFERENCE_BY, REFERENCE_TYPES } from '../../constants';
import messages from './messages';
import styles from './nested-attributes.module.css';

const mapOptions = (options: any) =>
  map(options, (option) => ({
    label: option,
    value: option,
  }));

const referenceOptions = mapOptions(REFERENCE_BY);
const typeOptions = mapOptions(REFERENCE_TYPES);

export type TFormValue = { by: string; type: string };

type Formik = ReturnType<typeof useFormik<TFormValue>>;

type Props = {
  name: string;
  value: TFormValue;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
};

const ReferenceAttribute: FC<Props> = ({
  name,
  value,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  return (
    <div className={styles.nested}>
      <Spacings.Stack scale="xs">
        <Spacings.Inline scale="m">
          <SelectField
            name={`${name}.by`}
            title={<FormattedMessage {...messages.referenceByTitle} />}
            options={referenceOptions}
            horizontalConstraint={4}
            isRequired
            value={value.by}
            // errors={errors.by}
            touched={touched.by}
            onChange={handleChange}
            onBlur={handleBlur}
            // renderError={(key, error) => error}
          />
          <SelectField
            name={`${name}.type`}
            title={<FormattedMessage {...messages.referenceTypeTitle} />}
            options={typeOptions}
            horizontalConstraint={5}
            isRequired
            value={value.type}
            // errors={errors.type}
            touched={touched.type}
            onChange={handleChange}
            onBlur={handleBlur}
            // renderError={(key, error) => error}
          />
        </Spacings.Inline>
        <Text.Detail intlMessage={messages.referenceByHint} />
      </Spacings.Stack>
    </div>
  );
};
ReferenceAttribute.displayName = 'ReferenceAttribute';

export default ReferenceAttribute;
