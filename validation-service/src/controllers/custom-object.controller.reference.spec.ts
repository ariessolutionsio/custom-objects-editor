// valication-service/src/controllers/custom-object.controller.reference.spec.ts

import { CustomObjectController } from './custom-object.controller';
import { AttributeSchema } from '../types/validator';

describe('CustomObjectController - validateReference', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  const testCases = [
    // schema.set = false, schema.required = false
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: false,
        reference: { type: 'product' },
      },
      value: { typeId: 'product', id: '123' },
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: false,
        reference: { type: 'product' },
      },
      value: { typeId: 'product', key: '123' },
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: false,
        reference: { type: 'product' },
      },
      value: null,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: false,
        reference: { type: 'product' },
      },
      value: undefined,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: false,
        reference: { type: 'product' },
      },
      value: { typeId: 'category', id: '123' },
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: false,
        reference: { type: 'product' },
      },
      value: { typeId: 'product', productId: '123' },
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: false,
        reference: { type: 'product' },
      },
      value: [{ typeId: 'product', id: '123' }],
      shouldThrowError: true,
    },

    // schema.set = false, schema.required = true
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: true,
        reference: { type: 'product' },
      },
      value: { typeId: 'product', id: '123' },
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: true,
        reference: { type: 'product' },
      },
      value: { typeId: 'product', key: '123' },
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: true,
        reference: { type: 'product' },
      },
      value: { typeId: 'product', productId: '123' },
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: true,
        reference: { type: 'product' },
      },
      value: null,
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: false,
        required: true,
        reference: { type: 'product' },
      },
      value: undefined,
      shouldThrowError: true,
    },

    // schema.set = true, schema.required = false
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: true,
        required: false,
        reference: { type: 'product' },
      },
      value: [{ typeId: 'product', id: '123' }],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: true,
        required: false,
        reference: { type: 'product' },
      },
      value: [{ typeId: 'product', key: '123' }],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: true,
        required: false,
        reference: { type: 'product' },
      },
      value: [],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: true,
        required: false,
        reference: { type: 'product' },
      },
      value: undefined,
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: true,
        required: false,
        reference: { type: 'product' },
      },
      value: [{ typeId: 'category', id: '123' }],
      shouldThrowError: true,
    },

    // schema.set = true, schema.required = true
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: true,
        required: true,
        reference: { type: 'product' },
      },
      value: [{ typeId: 'product', id: '123' }],
      shouldThrowError: false,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: true,
        required: true,
        reference: { type: 'product' },
      },
      value: [],
      shouldThrowError: true,
    },
    {
      schema: {
        name: 'test',
        type: 'Reference',
        set: true,
        required: true,
        reference: { type: 'product' },
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
