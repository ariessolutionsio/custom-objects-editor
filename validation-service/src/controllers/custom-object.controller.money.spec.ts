// valication-service/src/controllers/custom-object.controller.money.spec.ts

import { CustomObjectController } from './custom-object.controller';
import { AttributeSchema } from '../types/validator';

describe('CustomObjectController - validateMoney', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  const testCases = [
    // schema.set = false, schema.required = false
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: false,
      },
      value: { amount: '1000', currencyCode: 'USD' },
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: false,
      },
      value: { amount: 1000, currencyCode: 'USD' },
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: false,
      },
      value: null,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: false,
      },
      value: undefined,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: false,
      },
      value: { amount: 'invalid', currencyCode: 'USD' },
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: false,
      },
      value: { amount: '1000' },
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: false,
      },
      value: { currencyCode: 'USD' },
      shouldThrowError: true,
    },

    // schema.set = false, schema.required = true
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: true,
      },
      value: { amount: '1000', currencyCode: 'EUR' },
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: true,
      },
      value: null,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: true,
      },
      value: undefined,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: true,
      },
      value: { amount: 'invalid', currencyCode: 'USD' },
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: true,
      },
      value: { amount: '1000' },
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: false,
        required: true,
      },
      value: { currencyCode: 'USD' },
      shouldThrowError: true,
    },

    // schema.set = true, schema.required = false
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: false,
      },
      value: [
        { amount: '1000', currencyCode: 'USD' },
        { amount: '2000', currencyCode: 'EUR' },
      ],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: false,
      },
      value: [],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: false,
      },
      value: undefined,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: false,
      },
      value: [{ amount: 'invalid', currencyCode: 'USD' }],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: false,
      },
      value: [{ amount: '1000' }],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: false,
      },
      value: [{ currencyCode: 'USD' }],
      shouldThrowError: true,
    },

    // schema.set = true, schema.required = true
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: true,
      },
      value: [
        { amount: '1000', currencyCode: 'USD' },
        { amount: '2000', currencyCode: 'EUR' },
      ],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: true,
      },
      value: [],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: true,
      },
      value: undefined,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: true,
      },
      value: [{ amount: 'invalid', currencyCode: 'USD' }],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Money',
        set: true,
        required: true,
      },
      value: [{ amount: '1000' }],
      shouldThrowError: true,
    },
  ];
  testCases.forEach(({ schema, value, shouldThrowError }) => {
    it(`should ${shouldThrowError ? 'pass' : 'fail'} validation for ${schema.set ? 'set' : 'non-set'}, required ${schema.required ? 'true' : 'false'} and value: ${JSON.stringify(value)} attribute`, async () => {
      try {
        await controller.validateAttribute(schema as AttributeSchema, value);
        expect(shouldThrowError).toBe(false);
      } catch (error) {
        expect(shouldThrowError).toBe(true);
      }
    });
  });
});
