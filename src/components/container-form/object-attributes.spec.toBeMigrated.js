import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { FieldArray } from 'formik';
import kebabCase from 'lodash/kebabCase';
import ObjectAttributes from './object-attributes';

const mocks = {
  object: faker.random.word(),
  name: kebabCase(faker.random.words()),
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
};
const fieldArrayMocks = {
  remove: jest.fn(),
  push: jest.fn(),
};

const emptyValue = {
  name: '',
  type: '',
  set: false,
  required: false,
};

const loadObjectAttributes = ({ value = [emptyValue], touched, errors }) => {
  const wrapper = shallow(
    <ObjectAttributes
      {...mocks}
      value={value}
      touched={touched}
      errors={errors}
    />
  );

  return shallow(wrapper.find(FieldArray).props().render(fieldArrayMocks));
};

const attribute = (index) => `[data-testid='attribute-${index}']`;

describe('object attributes', () => {
  it('when add button clicked, should display an additional attribute', () => {
    const wrapper = loadObjectAttributes({});
    wrapper.find('[data-testid="add-attribute"]').props().onClick();
    expect(fieldArrayMocks.push).toHaveBeenCalledWith(emptyValue);
  });

  it('when remove button clicked, should remove attribute from display', () => {
    const index = 0;
    const wrapper = loadObjectAttributes({});
    wrapper.find(attribute(index)).props().remove();
    expect(fieldArrayMocks.remove).toHaveBeenCalledWith(index);
  });

  it('when one attribute in value, should disable remove button', () => {
    const index = 0;
    const wrapper = loadObjectAttributes({});
    expect(wrapper.find(attribute(index)).prop('removeDisabled')).toEqual(true);
  });

  it('when multiple attributes in value, should enable remove button', () => {
    const index = 0;
    const wrapper = loadObjectAttributes({ value: [emptyValue, emptyValue] });
    expect(wrapper.find(attribute(index)).prop('removeDisabled')).toEqual(
      false
    );
  });
});
