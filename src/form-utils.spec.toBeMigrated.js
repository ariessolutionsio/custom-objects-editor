import React from 'react';
import faker from 'faker';
import camelCase from 'lodash/camelCase';
import reduce from 'lodash/reduce';
import times from 'lodash/times';
import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import {
  REFERENCE_BY,
  REFERENCE_TYPES,
  TYPES,
} from './constants';
import { getAttributeValues, getAttributeValidation } from './form-utils';
import messages from './components/custom-object-form/messages';

const currencies = times(2, () => faker.finance.currencyCode());
const languages = times(2, () => faker.random.locale());

describe('attribute utilities', () => {
  describe('attribute values', () => {
    it('when attribute is a string type, should return empty string as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.String,
        },
      ];
      const values = { [camelCase(name)]: '' };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a localized string type, should return empty localized text input value as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.LocalizedString,
        },
      ];
      const values = {
        [camelCase(name)]: LocalizedTextInput.createLocalizedString(languages),
      };
      expect(getAttributeValues(attributes, currencies, languages)).toEqual(
        values
      );
    });

    it('when attribute is a number type, should return empty string as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Number,
        },
      ];
      const values = { [camelCase(name)]: '' };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a boolean type, should return false as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Boolean,
        },
      ];
      const values = { [camelCase(name)]: false };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is an enum type, should return empty string as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Enum,
        },
      ];
      const values = { [camelCase(name)]: '' };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a localized enum type, should return empty string as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.LocalizedEnum,
        },
      ];
      const values = { [camelCase(name)]: '' };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a money type, should return empty amount and first currency code as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Money,
        },
      ];
      const values = {
        [camelCase(name)]: { amount: '', currencyCode: currencies[0] },
      };
      expect(getAttributeValues(attributes, currencies)).toEqual(values);
    });

    it('when attribute is a date type, should return empty string as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Date,
        },
      ];
      const values = { [camelCase(name)]: '' };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a time type, should return empty string as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Time,
        },
      ];
      const values = { [camelCase(name)]: '' };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a datetime type, should return empty string as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.DateTime,
        },
      ];
      const values = { [camelCase(name)]: '' };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    // commercetools reference type: https://docs.commercetools.com/http-api-types#references
    it('when attribute is a reference type, should return a reference type with reference by as an empty string as initial value', () => {
      const name = faker.random.words();
      const reference = {
        by: faker.random.arrayElement(Object.values(REFERENCE_BY)),
        type: faker.random.arrayElement(Object.values(REFERENCE_TYPES)),
      };
      const attributes = [
        {
          name,
          type: TYPES.Reference,
          reference,
        },
      ];
      const values = {
        [camelCase(name)]: { typeId: reference.type, [reference.by]: '' },
      };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is an object type, should construct an object based on its attributes as initial value', () => {
      const name = faker.random.words();
      const nestedAttributes = [
        {
          name: `${name}-nested`,
          type: TYPES.String,
        },
      ];
      const attributes = [
        {
          name,
          type: TYPES.Object,
          attributes: nestedAttributes,
        },
      ];
      const value = { [camelCase(`${name}-nested`)]: '' };
      const values = {
        [camelCase(name)]: value,
      };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a set, should return an array of values as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.String,
          set: true,
        },
      ];
      const values = { [camelCase(name)]: [''] };
      expect(getAttributeValues(attributes)).toEqual(values);
    });
  });

  describe('attribute validation', () => {
    const errorMessages = {
      required: messages.requiredFieldError,
    };

    it('when attribute is a string type, should return yup string as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.String,
        },
      ];
      const validation = { [camelCase(name)]: yup.string().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a localized string type, should return yup object with language keys as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.LocalizedString,
        },
      ];
      const validation = {
        [camelCase(name)]: yup.object(
          reduce(
            languages,
            (spec, lang) => ({ ...spec, [lang]: yup.string() }),
            {}
          )
        ),
      };
      expect(
        JSON.stringify(getAttributeValidation(attributes, languages))
      ).toEqual(JSON.stringify(validation));
    });

    it('when attribute is a required localized string, should return yup object with at least one language required', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.LocalizedString,
          required: true,
        },
      ];
      expect(
        JSON.stringify(
          getAttributeValidation(attributes, languages, errorMessages)
        )
      ).toContain('atLeastOneOf');
    });

    it('when attribute is an enum type, should return yup string as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Enum,
        },
      ];
      const validation = { [camelCase(name)]: yup.string().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a localized enum type, should return yup string as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.LocalizedEnum,
        },
      ];
      const validation = { [camelCase(name)]: yup.string().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a number type, should return yup number as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Number,
        },
      ];
      const validation = { [camelCase(name)]: yup.number().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a boolean type, should return yup boolean as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Boolean,
        },
      ];
      const validation = { [camelCase(name)]: yup.boolean().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a money type, should return yup object as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Money,
        },
      ];
      const validation = {
        [camelCase(name)]: yup.object({
          amount: yup.string().nullable(),
          currencyCode: yup.string(),
        }),
      };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a date type, should return yup date as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Date,
        },
      ];
      const validation = { [camelCase(name)]: yup.date().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a datetime type, should return yup date as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.DateTime,
        },
      ];
      const validation = { [camelCase(name)]: yup.date().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a time type, should return yup string as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Time,
        },
      ];
      const validation = { [camelCase(name)]: yup.string().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a reference type, should return yup object as validation', () => {
      const name = faker.random.words();
      const reference = {
        by: faker.random.arrayElement(Object.values(REFERENCE_BY)),
        type: faker.random.arrayElement(Object.values(REFERENCE_TYPES)),
      };
      const attributes = [
        {
          name,
          type: TYPES.Reference,
          reference,
        },
      ];
      const validation = {
        [camelCase(name)]: yup.object({
          typeId: yup.string(),
          [reference.by]: yup.string().nullable(),
        }),
      };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is an object type, should construct a yup object based on its attributes as validation', () => {
      const name = faker.random.words();
      const nestedAttributes = [
        {
          name: `${name}-nested`,
          type: TYPES.String,
        },
      ];
      const attributes = [
        {
          name,
          type: TYPES.Object,
          attributes: nestedAttributes,
        },
      ];
      const nestedValidation = {
        [camelCase(`${name}-nested`)]: yup.string().nullable(),
      };
      const validation = {
        [camelCase(name)]: yup.object(nestedValidation),
      };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is an unknown type, should return null as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: 'banana',
        },
      ];
      const validation = { [camelCase(name)]: null };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a set, should return an array of typed validations as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.String,
          set: true,
        },
      ];
      const validation = {
        [camelCase(name)]: yup.array(yup.string().nullable()),
      };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is required, should return yup validation with required message as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.String,
          required: true,
        },
      ];
      const validation = {
        [camelCase(name)]: yup
          .string()
          .required(<FormattedMessage {...errorMessages.requiredFieldError} />),
      };
      expect(
        JSON.stringify(
          getAttributeValidation(attributes, languages, errorMessages)
        )
      ).toEqual(JSON.stringify(validation));
    });
  });
});
