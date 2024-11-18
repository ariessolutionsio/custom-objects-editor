import React, { FC } from 'react';
import get from 'lodash/get';
import upperCase from 'lodash/upperCase';
import { FieldArray, useFormik } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Constraints from '@commercetools-uikit/constraints';
import { customProperties } from '@commercetools-uikit/design-system';
import FieldLabel from '@commercetools-uikit/field-label';
import Grid from '@commercetools-uikit/grid';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import TextInput from '@commercetools-uikit/text-input';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { ErrorMessage } from '@commercetools-uikit/messages';
import Spacings from '@commercetools-uikit/spacings';
import messages from './messages';
import styles from './enum-attributes.module.css';
import nestedStyles from './nested-attributes.module.css';

export type TFormValue = {
  value: string;
  label: any;
};

export type Formik = ReturnType<typeof useFormik<TFormValue>>;

type Props = {
  name: string;
  value: Array<TFormValue>;
  touched: Formik['touched'];
  errors: Formik['errors'];
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
};

const LocalizedEnumAttributes: FC<Props> = ({
  name,
  value,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  const intl = useIntl();
  const { project } = useApplicationContext();
  const { projectLanguages } = useApplicationContext((context) => ({
    projectLanguages: context.project?.languages ?? [],
  }));
  const gridColumns = 2 + projectLanguages.length;

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
                onClick={() =>
                  push({
                    value: '',
                    label:
                      LocalizedTextInput.createLocalizedString(
                        projectLanguages
                      ),
                  })
                }
              />
            </Constraints.Horizontal>
            <Grid
              gridRowGap={customProperties.spacingS}
              gridColumnGap={customProperties.spacingM}
              gridTemplateColumns={`repeat(${gridColumns}, 1fr)`}
              justifyItems="start"
            >
              <FieldLabel
                title={<FormattedMessage {...messages.keyLabel} />}
                hasRequiredIndicator
              />
              {projectLanguages.map((language) => (
                <FieldLabel
                  key={language}
                  title={
                    <FormattedMessage
                      {...messages.labelLocalizedLabel}
                      values={{ language: upperCase(language) }}
                    />
                  }
                  hasRequiredIndicator
                />
              ))}
              <span></span>
              {value.map((val, index) => {
                const valuePath = `${index}.value`;
                const labelPath = (language: string) =>
                  `${index}.label.${language}`;
                const hasValueError =
                  get(touched, valuePath) && get(errors, valuePath);
                const hasLabelError = (language: string) =>
                  get(touched, `${labelPath(language)}`) &&
                  get(errors, `${labelPath(language)}`);
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
                    {projectLanguages.map((language) => (
                      <div className={styles.fullWidth} key={language}>
                        <Spacings.Stack scale="xs">
                          <TextInput
                            data-testid={`option-label-${index}-${language}`}
                            name={`${name}.${labelPath(language)}`}
                            value={value[index].label[language]}
                            hasError={!!hasLabelError(language)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {hasLabelError(language) && (
                            <ErrorMessage
                              data-testid={`option-label-error-${index}-${language}`}
                            >
                              {get(errors, labelPath(language))}
                            </ErrorMessage>
                          )}
                        </Spacings.Stack>
                      </div>
                    ))}
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
LocalizedEnumAttributes.displayName = 'LocalizedEnumAttributes';

export default LocalizedEnumAttributes;
