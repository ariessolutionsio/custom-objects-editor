import { CustomObjectController } from './custom-object.controller';
import { AttributeSchema } from '../types/validator';

const objectSchema: { attributes: AttributeSchema[]; value: any }[] = [
  {
    attributes: [
      {
        name: 'age',
        type: 'Number',
        set: false,
        required: true,
      },
    ],
    value: {
      age: 25,
    },
  },
  {
    attributes: [
      {
        name: 'names',
        type: 'String',
        set: true,
        required: true,
      },
    ],
    value: {
      names: ['John', 'Smith'],
    },
  },
];

describe('CustomObjectController - validateObject', () => {
  let controller: CustomObjectController;

  beforeEach(() => {
    controller = new CustomObjectController();
  });

  const testCases = () =>
    objectSchema
      .map((item) => [
        // schema.set = false, schema.required = false
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: false,
            attributes: item.attributes,
          },
          value: item.value,
          shouldThrowError: false,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: false,
            attributes: item.attributes,
          },
          value: null,
          shouldThrowError: false,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: false,
            attributes: item.attributes,
          },
          value: undefined,
          shouldThrowError: false,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: false,
            attributes: item.attributes,
          },
          value: {},
          shouldThrowError: true, // missing required attribute 'age'
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: false,
            attributes: item.attributes,
          },
          value: 'string value',
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: false,
            attributes: item.attributes,
          },
          value: 123,
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: false,
            attributes: item.attributes,
          },
          value: true,
          shouldThrowError: true,
        },

        // schema.set = false, schema.required = true

        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: true,
            attributes: item.attributes,
          },
          value: item.value,
          shouldThrowError: false,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: true,
            attributes: item.attributes,
          },
          value: null,
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: true,
            attributes: item.attributes,
          },
          value: undefined,
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: true,
            attributes: item.attributes,
          },
          value: {},
          shouldThrowError: true, // missing required attribute 'age'
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: true,
            attributes: item.attributes,
          },
          value: 'string value',
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: true,
            attributes: item.attributes,
          },
          value: 123,
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: false,
            required: true,
            attributes: item.attributes,
          },
          value: true,
          shouldThrowError: true,
        },

        // schema.set = true, schema.required = false
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: false,
            attributes: item.attributes,
          },
          value: [item.value],
          shouldThrowError: false,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: false,
            attributes: item.attributes,
          },
          value: null,
          shouldThrowError: false,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: false,
            attributes: item.attributes,
          },
          value: undefined,
          shouldThrowError: false,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: false,
            attributes: item.attributes,
          },
          value: [],
          shouldThrowError: true, // missing required attribute 'age'
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: false,
            attributes: item.attributes,
          },
          value: ['string value'],
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: false,
            attributes: item.attributes,
          },
          value: [123],
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: false,
            attributes: item.attributes,
          },
          value: [true],
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: false,
            attributes: item.attributes,
          },
          value: [{}],
          shouldThrowError: true,
        },
        // schema.set = true, schema.required = true
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: true,
            attributes: item.attributes,
          },
          value: [item.value],
          shouldThrowError: false,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: true,
            attributes: item.attributes,
          },
          value: null,
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: true,
            attributes: item.attributes,
          },
          value: undefined,
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: true,
            attributes: item.attributes,
          },
          value: [],
          shouldThrowError: true, // missing required attribute 'age'
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: true,
            attributes: item.attributes,
          },
          value: [{}],
          shouldThrowError: true, // missing required attribute 'age'
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: true,
            attributes: item.attributes,
          },
          value: ['string value'],
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: true,
            attributes: item.attributes,
          },
          value: [123],
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: true,
            attributes: item.attributes,
          },
          value: [true],
          shouldThrowError: true,
        },
        {
          schema: {
            name: 'test',
            type: 'Object',
            set: true,
            required: true,
            attributes: item.attributes,
          },
          value: 'string value',
          shouldThrowError: true,
        },
      ])
      .reduce((a, b) => a.concat(b), []);

  testCases().forEach(({ schema, value, shouldThrowError }) => {
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
