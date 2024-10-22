// valication-service/src/controllers/custom-object.controller.localized-string.spec.ts

import { CustomObjectController } from './custom-object.controller';
import { AttributeSchema } from '../types/validator';

describe('CustomObjectController - validateLocalizedString', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  const testCases = [
    // schema.set = false, schema.required = false
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: false,
        required: false,
      },
      value: {
        en: 'hello',
        de: 'hallo',
      },
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: false,
        required: false,
      },
      value: null,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: false,
        required: false,
      },
      value: undefined,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: false,
        required: false,
      },
      value: {},
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: false,
        required: false,
      },
      value: 'string value',
      shouldThrowError: true,
    },

    // schema.set = false, schema.required = true
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: false,
        required: true,
      },
      value: {
        en: 'hello',
        de: 'hallo',
      },
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: false,
        required: true,
      },
      value: null,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: false,
        required: true,
      },
      value: undefined,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: false,
        required: true,
      },
      value: {},
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: false,
        required: true,
      },
      value: 'string value',
      shouldThrowError: true,
    },

    // schema.set = true, schema.required = false
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: true,
        required: false,
      },
      value: [
        {
          locale: 'en',
          value: 'hello',
        },
        {
          locale: 'de',
          value: 'hallo',
        },
      ],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: true,
        required: false,
      },
      value: [],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: true,
        required: false,
      },
      value: undefined,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: true,
        required: false,
      },
      value: [
        {
          locale: 'en',
          value: 'hello',
        },
        {
          locale: 'en',
          value: 'hello again',
        },
      ],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: true,
        required: false,
      },
      value: 'string value',
      shouldThrowError: true,
    },

    // schema.set = true, schema.required = true
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: true,
        required: true,
      },
      value: [
        {
          en: 'hello',
          de: 'hallo',
        },
      ],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: true,
        required: true,
      },
      value: [],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: true,
        required: true,
      },
      value: undefined,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: true,
        required: true,
      },
      value: [
        {
          en: 123,
        },
      ],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'LocalizedString',
        set: true,
        required: true,
      },
      value: 'string value',
      shouldThrowError: true,
    },
  ];

  testCases.forEach(({ schema, value, shouldThrowError }) => {
    it(`should ${shouldThrowError ? 'pass' : 'fail'} validation for ${schema.set ? 'set' : 'non-set'}, required ${schema.required ? 'true' : 'false'} and value: ${typeof value === 'object' ? JSON.stringify(value) : value} attribute`, async () => {
      try {
        await controller.validateAttribute(schema as AttributeSchema, value);
        expect(shouldThrowError).toBe(false);
      } catch (error) {
        expect(shouldThrowError).toBe(true);
      }
    });
  });
});
