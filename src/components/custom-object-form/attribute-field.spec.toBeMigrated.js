import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import faker from 'faker';
import camelCase from 'lodash/camelCase';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import times from 'lodash/times';
import { FieldArray } from 'formik';
import * as ApplicationContext from '@commercetools-frontend/application-shell-connectors';
import Card from '@commercetools-uikit/card';
import {
  REFERENCE_BY,
  REFERENCE_TYPES,
  TYPES,
} from '../../constants';
import { generateContainer } from '../../test-utils';
import { getValueByType } from '../../helpers';
import AttributeField from './attribute-field';
import AttributeInput from './attribute-input';

configure({adapter: new Adapter()});

const project = {
  currencies: times(2, () => faker.finance.currencyCode()),
  languages: times(2, () => faker.random.locale()),
};
const dataLocale = project.languages[0];

const container = generateContainer();

const mocks = {
  title: faker.random.words(),
  isRequired: faker.random.boolean(),
  name: camelCase(faker.random.words()),
  touched: null,
  errors: null,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  attributes: container.value.attributes,
  reference: {
    by: faker.random.arrayElement(Object.values(REFERENCE_BY)),
    type: faker.random.arrayElement(Object.values(REFERENCE_TYPES)),
  },
};
const mockType = faker.random.arrayElement(Object.values(TYPES));
const fieldArrayMocks = {
  push: jest.fn(),
  remove: jest.fn(),
};
const loadAttributeField = ({
  isSet = faker.random.boolean(),
  isNestedSet = faker.random.boolean(),
  type = mockType,
  options = [],
}) => {
  const value = isSet ? [''] : '';
  return shallow(
    <AttributeField
      {...mocks}
      type={type}
      value={value}
      isSet={isSet}
      isNestedSet={isNestedSet}
      options={options}
    />
  );
};

const loadAttributes = (wrapper) =>
  shallow(wrapper.find(FieldArray).props().render(fieldArrayMocks));

describe('attribute field', () => {
  beforeAll(() => {
    jest
      .spyOn(ApplicationContext, 'useApplicationContext')
      .mockImplementation(() => ({ project, dataLocale }));
  });

  describe('when attribute is a set', () => {
    let attributes;

    beforeEach(() => {
      const wrapper = loadAttributeField({ isSet: true, isNestedSet: false });
      attributes = loadAttributes(wrapper);
    });

    it('should display attribute label', () => {
      expect(
        attributes.find('[data-testid="set-attribute-label"]').exists()
      ).toEqual(true);
    });

    it('should display set of attribute inputs', () => {
      expect(attributes.find(AttributeInput).length).toEqual(1);
    });

    it('should display card with dark theme', () => {
      expect(attributes.find(Card).prop('theme')).toEqual('dark');
    });

    it('when add button clicked, should display an additional attribute', () => {
      attributes.find('[data-testid="add-attribute"]').props().onClick();
      expect(fieldArrayMocks.push).toHaveBeenCalledWith(
        getValueByType(
          mockType,
          mocks.attributes,
          mocks.reference,
          project.currencies,
          project.languages
        )
      );
    });

    it('when remove button clicked, should remove attribute from display', () => {
      const index = 0;
      attributes
        .find(`[data-testid="remove-attribute-${index}"]`)
        .props()
        .onClick();
      expect(fieldArrayMocks.remove).toHaveBeenCalledWith(index);
    });
  });

  it('when attribute is a nested set, should display card with light theme', () => {
    const wrapper = loadAttributeField({ isSet: true, isNestedSet: true });
    const attributes = loadAttributes(wrapper);
    expect(attributes.find(Card).prop('theme')).toEqual('light');
  });

  describe('when attribute is a single item', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = loadAttributeField({ isSet: false });
    });

    it('should display attribute label', () => {
      expect(
        wrapper.find('[data-testid="single-attribute-label"]').exists()
      ).toEqual(true);
    });

    it('should display attribute input', () => {
      expect(
        wrapper.find('[data-testid="single-attribute-input"]').exists()
      ).toEqual(true);
    });
  });

  it('when attribute is enum type, should directly pass options as prop to attribute input', () => {
    const options = times(2, () => ({ value: '', label: faker.random.word() }));
    const wrapper = loadAttributeField({
      isSet: false,
      type: TYPES.Enum,
      options,
    });
    expect(
      wrapper.find('[data-testid="single-attribute-input"]').prop('options')
    ).toEqual(options);
  });

  it('when attribute is localized enum type, should pass options with labels in data locale to attribute input', () => {
    const label = reduce(
      project.languages,
      (labels, language) => ({ ...labels, [language]: faker.random.word() }),
      {}
    );
    const options = times(2, () => ({ value: '', label }));
    const mappedOptions = map(options, (option) => ({
      value: option.value,
      label: option.label[dataLocale],
    }));
    const wrapper = loadAttributeField({
      isSet: false,
      type: TYPES.LocalizedEnum,
      options,
    });
    expect(
      wrapper.find('[data-testid="single-attribute-input"]').prop('options')
    ).toEqual(mappedOptions);
  });
});
