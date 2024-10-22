import { AttributeSchema } from '../types/validator';
import { CustomObjectController } from './custom-object.controller';

describe('CustomObjectController', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  describe('validateAttribute', () => {
    describe('String', () => {
      const testCases = [
        {
          schema: { name: 'test', type: 'String', set: false, required: false },
          value: 'test',
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'String', set: false, required: false },
          value: '',
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'String', set: false, required: false },
          value: null,
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'String', set: false, required: true },
          value: null,
          shouldThrowError: true,
        },
        {
          schema: { name: 'test', type: 'String', set: false, required: false },
          value: undefined,
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'String', set: false, required: true },
          value: undefined,
          shouldThrowError: true,
        },
        {
          schema: { name: 'test', type: 'String', set: false, required: false },
          value: ['test'],
          shouldThrowError: true,
        },
        {
          schema: { name: 'test', type: 'String', set: true, required: false },
          value: ['test'],
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'String', set: true, required: false },
          value: [],
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'String', set: true, required: false },
          value: undefined,
          shouldThrowError: true,
        },
        {
          schema: { name: 'test', type: 'String', set: true, required: true },
          value: undefined,
          shouldThrowError: true,
        },
        {
          schema: { name: 'test', type: 'String', set: true, required: true },
          value: [],
          shouldThrowError: true,
        },
        {
          schema: { name: 'test', type: 'String', set: true, required: true },
          value: ['test'],
          shouldThrowError: false,
        },
        {
          schema: { name: 'test', type: 'String', set: true, required: true },
          value: [''],
          shouldThrowError: true,
        },
      ];

      testCases.forEach(({ schema, value, shouldThrowError }) => {
        it(`should ${shouldThrowError ? 'pass' : 'fail'} validation for ${schema.set ? 'set' : 'non-set'}, required ${schema.required ? 'true' : 'false'} and value: ${value} attribute`, async () => {
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
