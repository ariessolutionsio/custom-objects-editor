import React, { FC } from 'react';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import map from 'lodash/map';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

import CheckboxInput from '@commercetools-uikit/checkbox-input';
import DateInput from '@commercetools-uikit/date-input';
import TimeInput from '@commercetools-uikit/time-input';
import DateTimeInput from '@commercetools-uikit/date-time-input';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import MoneyInput from '@commercetools-uikit/money-input';
import NumberInput from '@commercetools-uikit/number-input';
import TextInput from '@commercetools-uikit/text-input';
import SelectInput from '@commercetools-uikit/select-input';
import { ErrorMessage } from '@commercetools-uikit/messages';
import Spacings from '@commercetools-uikit/spacings';
import { TYPES } from '../../constants';
import nestedStyles from '../container-form/nested-attributes.module.css';
import AttributeField from './attribute-field'; // eslint-disable-line import/no-cycle

type Props = {
  type: string;
  title: string;
  name: string;
  value?: any;
  touched?: any;
  errors?: any;
  onChange(...args: unknown[]): unknown;
  onBlur(...args: unknown[]): unknown;
  isRequired?: boolean;
  isSet?: boolean;
  isNestedSet?: boolean;
  attributes?: unknown[];
  reference?: {
    by?: string;
    type?: string;
  };
  options?: {
    value: string;
    label: string;
  }[];
};

const AttributeInput: FC<Props> = ({
  type,
  title,
  name,
  value,
  touched,
  errors,
  onChange,
  onBlur,
  isRequired,
  isSet,
  isNestedSet,
  attributes,
  reference,
  options,
}) => {
  const { currencies, dataLocale, timeZone } = useApplicationContext(
    (context) => ({
      currencies: context.project?.currencies ?? [],
      dataLocale: context.dataLocale ?? '',
      timeZone: context.user?.timeZone ?? '',
    })
  );

  switch (type) {
    case TYPES.String:
      return (
        <Spacings.Stack scale="xs">
          <TextInput
            data-testid="field-type-string"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.LocalizedString:
      return (
        <Spacings.Stack scale="xs">
          <LocalizedTextInput
            data-testid="field-type-i18n-string"
            selectedLanguage={dataLocale}
            name={name}
            value={value}
            hasError={!!(LocalizedTextInput.isTouched(touched) && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {LocalizedTextInput.isTouched(touched) && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Number:
      return (
        <Spacings.Stack scale="xs">
          <NumberInput
            data-testid="field-type-number"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Boolean:
      return (
        <Spacings.Stack scale="xs">
          <CheckboxInput
            data-testid="field-type-boolean"
            name={name}
            isChecked={JSON.parse(value)}
            value={JSON.stringify(value)}
            hasError={!!(touched && errors)}
            onChange={onChange}
          >
            {title}
          </CheckboxInput>
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Money:
      return (
        <Spacings.Stack scale="xs">
          <MoneyInput
            data-testid="field-type-money"
            currencies={currencies}
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">
              {get(errors, 'amount')}
            </ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Date:
      return (
        <Spacings.Stack scale="xs">
          <DateInput
            data-testid="field-type-date"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Time:
      return (
        <Spacings.Stack scale="xs">
          <TimeInput
            data-testid="field-type-time"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.DateTime:
      return (
        <Spacings.Stack scale="xs">
          <DateTimeInput
            data-testid="field-type-datetime"
            timeZone={timeZone}
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Enum:
    case TYPES.LocalizedEnum: {
      return (
        <Spacings.Stack scale="xs">
          <SelectInput
            data-testid="field-type-enum"
            name={name}
            options={options}
            value={value}
            isClearable={!isRequired && !isSet}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );
    }

    case TYPES.Reference: {
      const referenceBy: any = get(reference, 'by');
      const refValue = get(value, referenceBy, '');
      const refTouched = get(touched, referenceBy);
      const refErrors = get(errors, referenceBy);
      const hasError = !!(refTouched && refErrors);
      return (
        <Spacings.Stack scale="xs">
          <TextInput
            data-testid="field-type-reference"
            name={`${name}.${referenceBy}`}
            value={refValue}
            hasError={hasError}
            onChange={onChange}
            onBlur={onBlur}
          />
          {hasError && (
            <ErrorMessage data-testid="field-error">{refErrors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );
    }

    case TYPES.Object:
      return (
        <div className={`${nestedStyles.nested}`}>
          <Spacings.Stack scale="s">
            {map(attributes, (attribute: any, index) => {
              const attributeName = camelCase(attribute.name);
              return (
                <AttributeField
                  data-testid={`field-type-object-${index}`}
                  key={index}
                  type={attribute.type}
                  name={`${name}.${attributeName}`}
                  title={attribute.name}
                  attributes={attribute.attributes}
                  reference={attribute.reference}
                  isRequired={attribute.required}
                  isSet={attribute.set}
                  isNestedSet={isNestedSet ? false : isSet}
                  options={attribute.enum || attribute.lenum}
                  value={get(value, attributeName)}
                  touched={get(touched, attributeName)}
                  errors={get(errors, attributeName)}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              );
            })}
          </Spacings.Stack>
        </div>
      );

    default:
      return null;
  }
};
AttributeInput.displayName = 'AttributeInput';

export default AttributeInput;
