// valication-service/src/controllers/custom-object.controller.enum.spec.ts

import { AttributeSchema } from '../types/validator';
import { CustomObjectController } from '../custom-object.controller';

describe('CustomObjectController', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  describe('validateEnum', () => {
    const enumValues = [
      { value: 'option1' },
      { value: 'option2' },
      { value: 'option3' },
    ];

    const testCases = [
      // schema.set = false, schema.required = false
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: false,
          required: false,
          enum: enumValues,
        },
        value: 'option1',
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: false,
          required: false,
          enum: enumValues,
        },
        value: 'invalid',
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: false,
          required: false,
          enum: enumValues,
        },
        value: undefined,
        shouldThrowError: false,
      },

      // schema.set = false, schema.required = true
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: false,
          required: true,
          enum: enumValues,
        },
        value: 'option1',
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: false,
          required: true,
          enum: enumValues,
        },
        value: 'invalid',
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: false,
          required: true,
          enum: enumValues,
        },
        value: undefined,
        shouldThrowError: true,
      },

      // schema.set = true, schema.required = false
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: true,
          required: false,
          enum: enumValues,
        },
        value: ['option1', 'option2'],
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: true,
          required: false,
          enum: enumValues,
        },
        value: ['invalid'],
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: true,
          required: false,
          enum: enumValues,
        },
        value: undefined,
        shouldThrowError: true,
      },

      // schema.set = true, schema.required = true
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: true,
          required: true,
          enum: enumValues,
        },
        value: ['option1', 'option2'],
        shouldThrowError: false,
      },
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: true,
          required: true,
          enum: enumValues,
        },
        value: ['invalid'],
        shouldThrowError: true,
      },
      {
        schema: {
          name: 'test',
          type: 'Enum',
          set: true,
          required: true,
          enum: enumValues,
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
