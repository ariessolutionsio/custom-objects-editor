// valication-service/src/controllers/custom-object.controller.time.spec.ts

import { CustomObjectController } from '../custom-object.controller';
import { AttributeSchema } from '../types/validator';

describe('CustomObjectController - validateTime', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  const testCases = [
    // schema.set = false, schema.required = false
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: false,
        required: false,
      },
      value: '12:34 AM',
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: false,
        required: false,
      },
      value: null,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: false,
        required: false,
      },
      value: undefined,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: false,
        required: false,
      },
      value: 'invalid time format',
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: false,
        required: false,
      },
      value: '22:34 AM',
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: false,
        required: false,
      },
      value: '10:34',
      shouldThrowError: true,
    },
    // schema.set = false, schema.required = true
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: false,
        required: true,
      },
      value: '12:34 PM',
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: false,
        required: true,
      },
      value: null,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: false,
        required: true,
      },
      value: undefined,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: false,
        required: true,
      },
      value: 'invalid time format',
      shouldThrowError: true,
    },

    // schema.set = true, schema.required = false
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: true,
        required: false,
      },
      value: ['12:34 AM'],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: true,
        required: false,
      },
      value: [],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: true,
        required: false,
      },
      value: undefined,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: true,
        required: false,
      },
      value: ['55:42 PM'],
      shouldThrowError: true,
    },

    // schema.set = true, schema.required = true
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: true,
        required: true,
      },
      value: ['12:34 PM'],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: true,
        required: true,
      },
      value: [],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: true,
        required: true,
      },
      value: undefined,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Time',
        set: true,
        required: true,
      },
      value: [{ value: 'invalid time format' }],
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
