/* eslint-disable import/namespace */
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import reduce from 'lodash/reduce';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { IntlShape, MessageDescriptor } from 'react-intl';
import { addMethod, array, object, string, number, date, boolean } from 'yup';
import {
  AttributeValue,
  Reference,
  TYPES,
  TYPES_ENUM,
} from '../container-form/constants';

export const getValue = (
  type: TYPES_ENUM,
  attributes: Array<AttributeValue> | undefined,
  reference: Reference | undefined,
  currencies: Array<string>,
  languages: Array<string>
) => {
  switch (type) {
    case TYPES.String:
    case TYPES.Number:
    case TYPES.Date:
    case TYPES.Time:
    case TYPES.DateTime:
    case TYPES.Enum:
    case TYPES.LocalizedEnum:
      return '';

    case TYPES.LocalizedString:
      return LocalizedTextInput.createLocalizedString(languages);

    case TYPES.Boolean:
      return false;

    case TYPES.Money:
      return {
        amount: '',
        currencyCode: currencies[0],
      };

    case TYPES.Reference:
      return (
        reference && {
          typeId: reference.type,
          [reference.by]: '',
        }
      );

    case TYPES.Object:
      return (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        attributes && getAttributeValues(attributes, currencies, languages)
      );

    default:
      return null;
  }
};

const getInitialValueByType = (
  type: any,
  isSet: any,
  attributes: any,
  reference: any,
  currencies: Array<string>,
  languages: Array<string>
) =>
  isSet
    ? [getValue(type, attributes, reference, currencies, languages)]
    : getValue(type, attributes, reference, currencies, languages);

export const getAttributeValues = (
  attributes: Array<AttributeValue>,
  currencies: Array<string>,
  languages: Array<string>
): { [key: string]: unknown } => {
  return attributes.reduce(
    (value, { name, type, set, attributes: nested, reference }) => {
      return {
        ...value,
        [camelCase(name)]: getInitialValueByType(
          type,
          set,
          nested,
          reference,
          currencies,
          languages
        ),
      };
    },
    {}
  );
};

const getValidation = (
  method: any,
  required: any,
  messages: any,
  intl: IntlShape
) => {
  let validation: any;
  switch (method) {
    case 'string':
      validation = string();
      break;
    case 'number':
      validation = number();
      break;
    case 'date':
      validation = date();
      break;
    case 'boolean':
      validation = boolean();
      break;
    default:
      validation = string();
      break;
  }

  //"<FormattedMessage {...messages.required} />
  return required
    ? validation.required(intl.formatMessage(messages.required))
    : validation.nullable();
};

const getLocalizedStringValidation = (
  languages: Array<string>,
  required: boolean,
  messages: { [key: string]: MessageDescriptor }
) => {
  addMethod(object, 'atLeastOneOf', function (list) {
    return this.test({
      name: 'atLeastOneOf',
      message: messages.required as any, //<FormattedMessage {...messages.required} />,
      exclusive: true,
      test: (value) =>
        value == null || list.some((f: any) => !isNil(get(value, f))),
    });
  });

  const localizedStringSchema = reduce(
    languages,
    (name, lang) => ({ ...name, [lang]: string() }),
    {}
  );
  const validation: any = object(localizedStringSchema);

  return required ? validation.atLeastOneOf(languages) : validation;
};

const getValidationByType = (
  { type, required, attributes, reference }: any,
  languages: Array<string>,
  messages: { [key: string]: MessageDescriptor },
  intl: IntlShape
) => {
  switch (type) {
    case TYPES.String:
    case TYPES.Enum:
    case TYPES.LocalizedEnum:
    case TYPES.Time:
      return getValidation('string', required, messages, intl);

    case TYPES.LocalizedString:
      return getLocalizedStringValidation(languages, required, messages);

    case TYPES.Number:
      return getValidation('number', required, messages, intl);

    case TYPES.Boolean:
      return getValidation('boolean', required, messages, intl);

    case TYPES.Money:
      return object({
        amount: getValidation('string', required, messages, intl),
        currencyCode: string(),
      });

    case TYPES.Date:
    case TYPES.DateTime:
      return getValidation('date', required, messages, intl);

    case TYPES.Reference:
      return object({
        typeId: string(),
        [reference.by]: getValidation('string', required, messages, intl),
      });

    case TYPES.Object:
      return object(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        getAttributeValidation(attributes, languages, messages, intl)
      );

    default:
      return null;
  }
};

const getValidationSpecification = (
  attribute: AttributeValue,
  languages: Array<string>,
  messages: { [key: string]: MessageDescriptor },
  intl: IntlShape
) => {
  const validation = getValidationByType(attribute, languages, messages, intl);
  return attribute.set ? array(validation) : validation;
};

export const getAttributeValidation = (
  attributes: Array<AttributeValue>,
  languages: Array<string>,
  messages: { [key: string]: MessageDescriptor },
  intl: IntlShape
): { [key: string]: any } => {
  return attributes.reduce((result, attribute) => {
    return {
      ...result,
      [camelCase(attribute.name)]: getValidationSpecification(
        attribute,
        languages,
        messages,
        intl
      ),
    };
  }, {});
};