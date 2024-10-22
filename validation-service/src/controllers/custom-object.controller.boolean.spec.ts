import { AttributeSchema } from '../types/validator';
import { CustomObjectController } from './custom-object.controller';

describe('CustomObjectController', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  describe('validateAttribute', () => {
    describe('Boolean', () => {
      const testCases = [
        {
          schema: {
            name: 'test',
            type: 'Boolean',
            set: false,
            required: false,
          },
          value: true,
          shouldThrowError: false,
        },
        {
          schema: {
            name: 'test',
            type: 'Boolean',
            set: false,
            required: false,
          },
          value: false,
          shouldThrowError: false,
        },
        {
          schema: {
            name: 'test',
            type: 'Boolean',
            set: false,
            required: false,
          },
          value: undefined,
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: false, required: true },
          value: undefined,
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Boolean',
            set: false,
            required: false,
          },
          value: null,
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: true, required: false },
          value: [true],
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: true, required: false },
          value: [false],
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: true, required: false },
          value: [true, false],
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: true, required: true },
          value: [],
          shouldThrowError: true,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: true, required: true },
          value: undefined,
          shouldThrowError: true,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: true, required: true },
          value: [true],
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: true, required: true },
          value: [false],
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: true, required: true },
          value: [true, false],
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: true, required: true },
          value: [true, true],
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'Boolean', set: true, required: true },
          value: [false, false],
          shouldThrowError: false,
        },
      ];

      testCases.forEach(({ schema, value, shouldThrowError }) => {
        it(`should ${shouldThrowError ? 'fail' : 'pass'} validation for ${schema.set ? 'set' : 'non-set'}, required ${schema.required ? 'true' : 'false'} and value: ${value} attribute`, async () => {
          try {
            await controller.validateAttribute(
              schema as AttributeSchema,
              value
            );
            expect(shouldThrowError).toBe(false);
          } catch (error) {
            expect(shouldThrowError).toBe(true);
          }
        });
      });
    });
  });
});
