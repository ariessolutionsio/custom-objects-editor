import React, { FC } from 'react';
import get from 'lodash/get';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray, useFormik } from 'formik';
import Constraints from '@commercetools-uikit/constraints';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import FieldLabel from '@commercetools-uikit/field-label';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import AttributeGroup from './attribute-group';
import messages from './messages';
import styles from './nested-attributes.module.css';
import { TFormValue as Reference } from './reference-attribute';

type TFormValue = {
  name?: string;
  type?: string;
  required?: boolean;
  set?: boolean;
  attributes?: Array<any>;
  reference?: Reference;
};

type Formik = ReturnType<typeof useFormik<TFormValue>>;

type Props = {
  object: string;
  isDisplayed?: boolean;
  name: string;
  value: Array<TFormValue>;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
};

const ObjectAttributes: FC<Props> = ({
  object,
  isDisplayed,
  name,
  value,
  touched,
  errors,
  handleBlur,
  handleChange,
}) => {
  const intl = useIntl();
  return (
    <div className={styles.nested}>
      <FieldArray
        name={name}
        render={({ push, remove }) => (
          <Spacings.Stack>
            <FieldLabel
              title={
                <FormattedMessage
                  {...messages.objectAttributesTitle}
                  values={{ name: object }}
                />
              }
            />
            <Constraints.Horizontal max="scale">
              <SecondaryButton
                data-testid="add-attribute"
                label={intl.formatMessage(messages.addAttributeButton)}
                iconLeft={<PlusBoldIcon />}
                onClick={() =>
                  push({
                    name: '',
                    type: '',
                    set: false,
                    required: false,
                  })
                }
              />
            </Constraints.Horizontal>
            {value.map((objectValue: any, objectIndex) => (
              <AttributeGroup
                data-testid={`attribute-${objectIndex}`}
                key={objectIndex}
                name={`${name}.${objectIndex}`}
                value={objectValue}
                touched={get(touched, objectIndex, {})}
                errors={get(errors, objectIndex, {})}
                handleBlur={handleBlur}
                handleChange={handleChange}
                remove={() => remove(objectIndex)}
                removeDisabled={objectIndex === 0 && value.length === 1}
                isDisplayed={isDisplayed}
              />
            ))}
          </Spacings.Stack>
        )}
      />
    </div>
  );
};
ObjectAttributes.displayName = 'ObjectAttributes';

export default ObjectAttributes;
