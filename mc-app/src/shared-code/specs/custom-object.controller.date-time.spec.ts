// valication-service/src/controllers/custom-object.controller.date-time.spec.ts

import { CustomObjectController } from '../custom-object.controller';
import { AttributeSchema } from '../types/validator';

describe('CustomObjectController - validateDateTime', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  const testCases = [
    // schema.set = false, schema.required = false
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: false,
        required: false,
      },
      value: '2022-01-01T12:34:56.999Z',
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: false,
        required: false,
      },
      value: null,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: false,
        required: false,
      },
      value: undefined,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: false,
        required: false,
      },
      value: '2022-01-01T12:34:56Z',
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: false,
        required: false,
      },
      value: 'random string',
      shouldThrowError: true,
    },

    // schema.set = false, schema.required = true
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: false,
        required: true,
      },
      value: '2022-01-01T12:34:56.000Z',
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: false,
        required: true,
      },
      value: null,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: false,
        required: true,
      },
      value: undefined,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: false,
        required: true,
      },
      value: 'invalid date format',
      shouldThrowError: true,
    },

    // schema.set = true, schema.required = false
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: true,
        required: false,
      },
      value: ['2022-01-01T12:34:56.000Z'],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: true,
        required: false,
      },
      value: [],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: true,
        required: false,
      },
      value: undefined,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: true,
        required: false,
      },
      value: ['invalid date format'],
      shouldThrowError: true,
    },

    // schema.set = true, schema.required = true
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: true,
        required: true,
      },
      value: ['2022-01-01T12:34:56.333Z'],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: true,
        required: true,
      },
      value: [],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: true,
        required: true,
      },
      value: ['invalid date'],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: true,
        required: true,
      },
      value: undefined,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'DateTime',
        set: true,
        required: true,
      },
      value: [''],
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
