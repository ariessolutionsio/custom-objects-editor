import React, { FC } from 'react';
import get from 'lodash/get';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Constraints from '@commercetools-uikit/constraints';
import { customProperties } from '@commercetools-uikit/design-system';
import { ErrorMessage } from '@commercetools-uikit/messages';
import FieldLabel from '@commercetools-uikit/field-label';
import Grid from '@commercetools-uikit/grid';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import TextInput from '@commercetools-uikit/text-input';
import Spacings from '@commercetools-uikit/spacings';
import messages from './messages';
import nestedStyles from './nested-attributes.module.css';
import styles from './enum-attributes.module.css';
import { TFormValue, Formik } from './localized-enum-attributes';

type Props = {
  name: string;
  value: Array<TFormValue>;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
};

const EnumAttributes: FC<Props> = ({
  name,
  value,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  const intl = useIntl();
  return (
    <div className={nestedStyles.nested}>
      <FieldArray
        name={name}
        render={({ push, remove }) => (
          <Spacings.Stack scale="s">
            <FieldLabel
              title={<FormattedMessage {...messages.enumOptionsTitle} />}
            />
            <Constraints.Horizontal max="scale">
              <SecondaryButton
                data-testid="add-enum-option"
                iconLeft={<PlusBoldIcon />}
                label={intl.formatMessage(messages.addLabel)}
                onClick={() => push({ value: '', label: '' })}
              />
            </Constraints.Horizontal>
            <Grid
              gridRowGap={customProperties.spacingS}
              gridColumnGap={customProperties.spacingM}
              gridTemplateColumns="repeat(3, 1fr)"
              justifyItems="start"
            >
              <FieldLabel
                title={<FormattedMessage {...messages.keyLabel} />}
                hasRequiredIndicator
              />
              <FieldLabel
                title={<FormattedMessage {...messages.labelLabel} />}
                hasRequiredIndicator
              />
              <span></span>
              {value.map((val, index) => {
                const valuePath = `${index}.value`;
                const labelPath = `${index}.label`;
                const hasValueError =
                  get(touched, valuePath) && get(errors, valuePath);
                const hasLabelError =
                  get(touched, labelPath) && get(errors, labelPath);
                return (
                  <React.Fragment key={index}>
                    <div className={styles.fullWidth}>
                      <Spacings.Stack scale="xs">
                        <TextInput
                          data-testid={`option-value-${index}`}
                          name={`${name}.${valuePath}`}
                          value={value[index].value}
                          hasError={!!hasValueError}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {hasValueError && (
                          <ErrorMessage
                            data-testid={`option-value-error-${index}`}
                          >
                            {get(errors, valuePath)}
                          </ErrorMessage>
                        )}
                      </Spacings.Stack>
                    </div>
                    <div className={styles.fullWidth}>
                      <Spacings.Stack scale="xs">
                        <TextInput
                          data-testid={`option-label-${index}`}
                          name={`${name}.${labelPath}`}
                          value={value[index].label}
                          hasError={!!hasLabelError}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {hasLabelError && (
                          <ErrorMessage
                            data-testid={`option-label-error-${index}`}
                          >
                            {get(errors, labelPath)}
                          </ErrorMessage>
                        )}
                      </Spacings.Stack>
                    </div>
                    <SecondaryIconButton
                      data-testid={`remove-enum-option-${index}`}
                      icon={<BinLinearIcon />}
                      label={intl.formatMessage(messages.removeLabel)}
                      isDisabled={index === 0 && value.length === 1}
                      onClick={() => remove(index)}
                    />
                  </React.Fragment>
                );
              })}
            </Grid>
          </Spacings.Stack>
        )}
      />
    </div>
  );
};
EnumAttributes.displayName = 'EnumAttributes';

export default EnumAttributes;
