import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import faker from 'faker';
import kebabCase from 'lodash/kebabCase';
import times from 'lodash/times';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
//import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { ATTRIBUTES, REFERENCE_BY, TYPES } from '../../constants';
import AttributeGroup from './attribute-group';
import ObjectAttributes from './object-attributes';
import ReferenceAttribute from './reference-attribute';
import Attribute from './attribute';
import EnumAttributes from './enum-attributes';
import LocalizedEnumAttributes from './localized-enum-attributes';

const project = { languages: times(2, faker.random.locale()) };

const mockValue = {
  name: faker.random.words(),
  type: faker.random.arrayElement(Object.values(TYPES)),
  required: faker.random.boolean(),
  set: faker.random.boolean(),
};

const mocks = {
  name: kebabCase(faker.random.words()),
  touched: {},
  errors: {},
  handleBlur: jest.fn(),
  handleChange: jest.fn(),
  remove: jest.fn(),
  removeDisabled: faker.random.boolean(),
};
configure({adapter: new Adapter()});
const loadAttributeGroup = (value = mockValue) =>
  shallow(<AttributeGroup value={value} {...mocks} />);

describe('attribute group', () => {
  beforeEach(() => {
    jest.spyOn(AppContext, 'useApplicationContext').mockImplementation(() => ({
      project,
    }));
    mocks.handleChange.mockClear();
  });

  it('when value type is object, should display object attributes', () => {
    const value = { ...mockValue, type: TYPES.Object, attributes: [mockValue] };
    const wrapper = loadAttributeGroup(value);
    expect(wrapper.find(ObjectAttributes).exists()).toEqual(true);
  });

  it('when value type is reference, should display reference attribute', () => {
    const value = {
      ...mockValue,
      type: TYPES.Reference,
      reference: { by: REFERENCE_BY.Id, type: '' },
    };
    const wrapper = loadAttributeGroup(value);
    expect(wrapper.find(ReferenceAttribute).exists()).toEqual(true);
  });

  it('when value type is enum, should display enum options', () => {
    const value = { ...mockValue, type: TYPES.Enum, enum: [] };
    const wrapper = loadAttributeGroup(value);
    expect(wrapper.find(EnumAttributes).exists()).toEqual(true);
  });

  it('when value type is localized enum, should display enum options', () => {
    const value = { ...mockValue, type: TYPES.LocalizedEnum, lenum: [] };
    const wrapper = loadAttributeGroup(value);
    expect(wrapper.find(LocalizedEnumAttributes).exists()).toEqual(true);
  });

  describe('when attribute value changes', () => {
    const value = { ...mockValue, type: TYPES.String };

    it('with not attribute type, should call handle change', () => {
      const event = {
        target: {
          name: `${mocks.name}.${ATTRIBUTES.Required}`,
          value: faker.random.boolean(),
        },
      };
      const wrapper = loadAttributeGroup(value);
      wrapper.find(Attribute).props().handleChange(event);
      expect(mocks.handleChange).toHaveBeenCalledWith(event);
    });

    it('with attribute type of not object or reference, should call handle change', () => {
      const event = {
        target: {
          name: `${mocks.name}.${ATTRIBUTES.Type}`,
          value: TYPES.Boolean,
        },
      };
      const wrapper = loadAttributeGroup(value);
      wrapper.find(Attribute).props().handleChange(event);
      expect(mocks.handleChange).toHaveBeenCalledWith(event);
    });

    describe('with attribute type of object', () => {
      const event = {
        target: {
          name: `${mocks.name}.${ATTRIBUTES.Type}`,
          value: TYPES.Object,
        },
      };
      let wrapper;

      beforeEach(() => {
        wrapper = loadAttributeGroup(value);
        wrapper.find(Attribute).props().handleChange(event);
      });

      it('should call handle change with empty attribute value', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith({
          target: {
            name: `${mocks.name}.${ATTRIBUTES.Attributes}`,
            value: [
              {
                name: '',
                type: '',
                set: false,
                required: false,
              },
            ],
          },
        });
      });

      it('should call handle change with attribute type change', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith(event);
      });
    });

    describe('with attribute type of reference', () => {
      const event = {
        target: {
          name: `${mocks.name}.${ATTRIBUTES.Type}`,
          value: TYPES.Reference,
        },
      };
      let wrapper;

      beforeEach(() => {
        wrapper = loadAttributeGroup(value);
        wrapper.find(Attribute).props().handleChange(event);
      });

      it('should call handle change with empty reference value', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith({
          target: {
            name: `${mocks.name}.${ATTRIBUTES.Reference}`,
            value: {
              by: REFERENCE_BY.Id,
              type: '',
            },
          },
        });
      });

      it('should call handle change with attribute type change', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith(event);
      });
    });

    describe('with attribute type of enum', () => {
      const event = {
        target: {
          name: `${mocks.name}.${ATTRIBUTES.Type}`,
          value: TYPES.Enum,
        },
      };
      let wrapper;

      beforeEach(() => {
        wrapper = loadAttributeGroup(value);
        wrapper.find(Attribute).props().handleChange(event);
      });

      it('should call handle change with empty enum value', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith({
          target: {
            name: `${mocks.name}.${ATTRIBUTES.Enum}`,
            value: [{ value: '', label: '' }],
          },
        });
      });

      it('should call handle change with attribute type change', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith(event);
      });
    });

    // describe('with attribute type of localized enum', () => {
    //   const event = {
    //     target: {
    //       name: `${mocks.name}.${ATTRIBUTES.Type}`,
    //       value: TYPES.LocalizedEnum,
    //     },
    //   };
    //   let wrapper;

    //   beforeEach(() => {
    //     wrapper = loadAttributeGroup(value);
    //     wrapper.find(Attribute).props().handleChange(event);
    //   });

    //   it('should call handle change with empty enum value', () => {
    //     expect(mocks.handleChange).toHaveBeenCalledWith({
    //       target: {
    //         name: `${mocks.name}.${ATTRIBUTES.LocalizedEnum}`,
    //         value: [
    //           {
    //             value: '',
    //             label: LocalizedTextInput?.createLocalizedString(
    //               project.languages
    //             ),
    //           },
    //         ],
    //       },
    //     });
    //   });

    //   it('should call handle change with attribute type change', () => {
    //     expect(mocks.handleChange).toHaveBeenCalledWith(event);
    //   });
    // });
  });
});
