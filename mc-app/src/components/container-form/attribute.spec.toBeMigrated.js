import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import camelCase from 'lodash/camelCase';
import useEffectMock from '../../test-utils/use-effect-mock';
import { TYPES } from '../../constants';
import Attribute from './attribute';

const mocks = {
  name: camelCase(faker.random.words()),
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  remove: jest.fn(),
  removeDisabled: faker.random.boolean(),
  isDisplayed: faker.random.boolean(),
};

const mockValue = {
  name: faker.random.words(),
  type: faker.random.arrayElement(Object.values(TYPES)),
  required: faker.random.boolean(),
  set: faker.random.boolean(),
  display: faker.random.boolean(),
};

const loadAttribute = ({ value, touched = {}, errors = {} }) =>
  shallow(
    <Attribute {...mocks} value={value} touched={touched} errors={errors} />
  );

const requiredOption = '[data-testid="attribute-required"]';

describe('attribute', () => {
  beforeAll(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(useEffectMock);
  });

  beforeEach(() => {
    mocks.handleChange.mockClear();
  });

  it('when attribute type is object, should disabled required option', () => {
    const wrapper = loadAttribute({
      value: { ...mockValue, type: TYPES.Object },
    });
    expect(wrapper.find(requiredOption).prop('isDisabled')).toEqual(true);
  });

  it('when attribute type is boolean, should disabled required option', () => {
    const wrapper = loadAttribute({
      value: { ...mockValue, type: TYPES.Boolean },
    });
    expect(wrapper.find(requiredOption).prop('isDisabled')).toEqual(true);
  });

  it('when attribute type changes to object, should set required option to false', () => {
    const wrapper = loadAttribute({
      value: { ...mockValue, type: TYPES.String },
    });
    wrapper.setProps({ value: { ...mockValue, type: TYPES.Object } });
    expect(mocks.handleChange).toHaveBeenCalledWith({
      target: { name: `${mocks.name}.required`, value: false },
    });
  });

  it('when attribute type changes to boolean, should set required option to false', () => {
    const wrapper = loadAttribute({
      value: { ...mockValue, type: TYPES.String },
    });
    wrapper.setProps({ value: { ...mockValue, type: TYPES.Boolean } });
    expect(mocks.handleChange).toHaveBeenCalledWith({
      target: { name: `${mocks.name}.required`, value: false },
    });
  });

  it('when attribute type changes to neither object nor boolean, should not set required option to false', () => {
    const wrapper = loadAttribute({
      value: { ...mockValue, type: TYPES.String },
    });
    wrapper.setProps({ value: { ...mockValue, type: TYPES.Number } });
    expect(mocks.handleChange).not.toHaveBeenCalled();
  });
});
