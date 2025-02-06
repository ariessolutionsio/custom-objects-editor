// valication-service/src/controllers/custom-object.controller.number.spec.ts

import { AttributeSchema } from '../types/validator';
import { CustomObjectController } from '../custom-object.controller';

describe('CustomObjectController', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  describe('validateNumber', () => {
    const testCases = [
      {
        schema: {
          name: 'test',
          type: 'Number',
          set: false,
          required: false,
        },
        value: 42,
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'Number',
          set: false,
          required: false,
        },
        value: 'hello',
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'Number',
          set: false,
          required: true,
        },
        value: undefined,
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'Number',
          set: false,
          required: false,
        },
        value: undefined,
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'Number',
          set: true,
          required: false,
        },
        value: [1, 2, 3],
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'Number',
          set: true,
          required: false,
        },
        value: ['hello', 'world'],
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'Number',
          set: true,
          required: false,
        },
        value: [],
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'Number',
          set: true,
          required: true,
        },
        value: [],
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'Number',
          set: true,
          required: true,
        },
        value: undefined,
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'Number',
          set: true,
          required: true,
        },
        value: [1],
        shouldThrowError: false,
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
