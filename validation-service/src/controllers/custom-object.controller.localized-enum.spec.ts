// valication-service/src/controllers/custom-object.controller.localized-enum.spec.ts

import { AttributeSchema } from '../types/validator';
import { CustomObjectController } from './custom-object.controller';

describe('CustomObjectController', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  describe('validateLocalizedEnum', () => {
    const localizedEnumValues = [
      {
        value: 'option1',
        label: {
          en: 'Option 1',
          de: 'Option 1 (DE)',
        },
      },
      {
        value: 'option2',
        label: {
          en: 'Option 2',
          de: 'Option 2 (DE)',
        },
      },
      {
        value: 'option3',
        label: {
          en: 'Option 3',
          de: 'Option 3 (DE)',
        },
      },
    ];

    const testCases = [
      // schema.set = false, schema.required = false
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: false,
          required: false,
          lenum: localizedEnumValues,
        },
        value: 'option1',
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: false,
          required: false,
          lenum: localizedEnumValues,
        },
        value: 'invalid',
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: false,
          required: false,
          lenum: localizedEnumValues,
        },
        value: undefined,
        shouldThrowError: false,
      },

      // schema.set = false, schema.required = true
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: false,
          required: true,
          lenum: localizedEnumValues,
        },
        value: 'option1',
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: false,
          required: true,
          lenum: localizedEnumValues,
        },
        value: 'invalid',
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: false,
          required: true,
          lenum: localizedEnumValues,
        },
        value: undefined,
        shouldThrowError: true,
      },

      // schema.set = true, schema.required = false
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: true,
          required: false,
          lenum: localizedEnumValues,
        },
        value: ['option1', 'option2'],
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: true,
          required: false,
          lenum: localizedEnumValues,
        },
        value: ['invalid'],
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: true,
          required: false,
          lenum: localizedEnumValues,
        },
        value: undefined,
        shouldThrowError: false,
      },

      // schema.set = true, schema.required = true
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: true,
          required: true,
          lenum: localizedEnumValues,
        },
        value: ['option1', 'option2'],
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: true,
          required: true,
          lenum: localizedEnumValues,
        },
        value: ['invalid'],
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'LocalizedEnum',
          set: true,
          required: true,
          lenum: localizedEnumValues,
        },
        value: undefined,
        shouldThrowError: true,
      },
    ];

    testCases.forEach(({ schema, value, shouldThrowError }) => {
      it(`should ${shouldThrowError ? 'pass' : 'fail'} validation for ${schema.set ? 'set' : 'non-set'}, required ${schema.required ? 'true' : 'false'} and value: ${value} attribute`, async () => {
        try {
          await controller.validateAttribute(schema as AttributeSchema, value);
          expect(shouldThrowError).toBe(false);
        } catch (error) {
          expect(shouldThrowError).toBe(true);
        }
      });
    });
  });
});
