import { IntlShape, MessageDescriptor } from 'react-intl';
import {
  AttributeValue,
} from './constants';
import { getInitialValueByType, getValidationSpecification } from './helpers';

export const getAttributeValues = (
  attributes: Array<AttributeValue>,
  currencies: Array<string>,
  languages: Array<string>
): { [key: string]: unknown } => {
  return attributes.reduce(
    (value, { name, type, set, attributes: nested, reference }) => {
      return {
        ...value,
        [name]: getInitialValueByType(
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
  
export const getAttributeValidation = (
  attributes: Array<AttributeValue>,
  languages: Array<string>,
  messages: { [key: string]: MessageDescriptor },
  intl: IntlShape
): { [key: string]: any } => {
  return attributes.reduce((result, attribute) => {
    return {
      ...result,
      [attribute.name]: getValidationSpecification(
        attribute,
        languages,
        messages,
        intl
      ),
    };
  }, {});
};
