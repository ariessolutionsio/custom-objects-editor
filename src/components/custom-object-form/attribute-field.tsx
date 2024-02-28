import { FC } from 'react';
import get from 'lodash/get';
import { useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import { TYPES } from '../../constants';
import { getValueByType } from '../../helpers';
import AttributeLabel from './attribute-label';
import AttributeInput from './attribute-input';
import messages from './messages';
import styles from './attribute-field.module.css';

type Props = {
  type: any;
  title: string;
  isRequired?: boolean;
  isSet?: boolean;
  isNestedSet?: boolean;
  name: string;
  value?: any;
  touched?: any;
  errors?: any;
  onChange(...args: unknown[]): unknown;
  onBlur(...args: unknown[]): unknown;
  attributes?: any[];
  reference?: any;
  options?: any[];
};

const AttributeField: FC<Props> = ({
  type,
  title,
  isRequired,
  isSet,
  isNestedSet,
  name,
  value,
  touched,
  errors,
  onChange,
  onBlur,
  attributes,
  reference,
  options,
}) => {
  const intl = useIntl();
  const { currencies, languages, dataLocale } = useApplicationContext(
    (context) => ({
      languages: context.project?.languages ?? [],
      currencies: context.project?.currencies ?? [],
      dataLocale: context.dataLocale ?? '',
    })
  );
  const emptyValue = getValueByType(
    type,
    attributes,
    reference,
    currencies,
    languages
  );
  const selectOptions =
    type === TYPES.LocalizedEnum
      ? options?.map((option) => {
        return {
          value: option.value,
          label: option.label[dataLocale],
        };
      })
      : options;

  return (
    <>
      {isSet ? (
        <FieldArray
          name={name}
          render={({ push, remove }) => (
            <Spacings.Stack scale="s">
              <AttributeLabel
                data-testid="set-attribute-label"
                type={type}
                title={title}
                isRequired={isRequired}
                reference={reference}
              />
              <Constraints.Horizontal max="scale">
                <SecondaryButton
                  data-testid="add-attribute"
                  iconLeft={<PlusBoldIcon />}
                  label={intl.formatMessage(messages.addLabel)}
                  onClick={() => push(emptyValue)}
                />
              </Constraints.Horizontal>
              {value.map((val: any, index: number) => (
                <Card
                  key={index}
                  theme={isNestedSet ? 'light' : 'dark'}
                  type="flat"
                >
                  <Spacings.Inline alignItems="center">
                    <div className={styles.fullWidth}>
                      <AttributeInput
                        data-testid={`set-attribute-input-${index}`}
                        type={type}
                        title={title}
                        name={`${name}.${index}`}
                        value={val}
                        touched={get(touched, index)}
                        errors={get(errors, index)}
                        onChange={onChange}
                        onBlur={onBlur}
                        isRequired={isRequired}
                        isSet={isSet}
                        isNestedSet={isNestedSet}
                        attributes={attributes}
                        reference={reference}
                        options={selectOptions}
                      />
                    </div>
                    <SecondaryIconButton
                      data-testid={`remove-attribute-${index}`}
                      icon={<BinLinearIcon />}
                      label={intl.formatMessage(messages.removeLabel)}
                      isDisabled={index === 0 && value.length === 1}
                      onClick={() => remove(index)}
                    />
                  </Spacings.Inline>
                </Card>
              ))}
            </Spacings.Stack>
          )}
        />
      ) : (
        <Spacings.Stack scale="xs">
          <AttributeLabel
            data-testid="single-attribute-label"
            type={type}
            title={title}
            isRequired={isRequired}
            reference={reference}
          />
          <AttributeInput
            data-testid="single-attribute-input"
            type={type}
            title={title}
            name={name}
            value={value}
            touched={touched}
            errors={errors}
            onChange={onChange}
            onBlur={onBlur}
            isRequired={isRequired}
            isSet={isSet}
            attributes={attributes}
            reference={reference}
            options={selectOptions}
          />
        </Spacings.Stack>
      )}
    </>
  );
};
AttributeField.displayName = 'AttributeField';

export default AttributeField;
