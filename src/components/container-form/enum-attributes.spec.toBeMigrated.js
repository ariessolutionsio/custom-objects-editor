import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import kebabCase from 'lodash/kebabCase';
import { FieldArray } from 'formik';
import EnumAttributes from './enum-attributes';

const mocks = {
  name: kebabCase(faker.random.words()),
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
};
const fieldArrayMocks = {
  remove: jest.fn(),
  push: jest.fn(),
};

const emptyValue = { value: '', label: '' };

const loadEnumAttributes = ({ value = [emptyValue], touched, errors }) => {
  const wrapper = shallow(
    <EnumAttributes
      {...mocks}
      value={value}
      touched={touched}
      errors={errors}
    />
  );

  return shallow(wrapper.find(FieldArray).props().render(fieldArrayMocks));
};

const removeButton = (index) => `[data-testid="remove-enum-option-${index}"]`;
const valueInput = (index) => `[data-testid="option-value-${index}"]`;
const valueInputError = (index) =>
  `[data-testid="option-value-error-${index}"]`;
const labelInput = (index) => `[data-testid="option-label-${index}"]`;
const labelInputError = (index) =>
  `[data-testid="option-label-error-${index}"]`;

describe('enum attributes', () => {
  it('when add button clicked, should display an additional option', () => {
    const wrapper = loadEnumAttributes({});
    wrapper.find('[data-testid="add-enum-option"]').props().onClick();
    expect(fieldArrayMocks.push).toHaveBeenCalledWith(emptyValue);
  });

  it('when remove button clicked, should remove option from display', () => {
    const index = 0;
    const wrapper = loadEnumAttributes({});
    wrapper.find(removeButton(index)).props().onClick();
    expect(fieldArrayMocks.remove).toHaveBeenCalledWith(index);
  });

  it('when one option in value, should disable remove button', () => {
    const index = 0;
    const wrapper = loadEnumAttributes({});
    expect(wrapper.find(removeButton(index)).prop('isDisabled')).toEqual(true);
  });

  it('when multiple option in value, should enable remove button', () => {
    const index = 0;
    const wrapper = loadEnumAttributes({ value: [emptyValue, emptyValue] });
    expect(wrapper.find(removeButton(index)).prop('isDisabled')).toEqual(false);
  });

  describe('value input', () => {
    const index = 0;

    describe('when input not touched', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = loadEnumAttributes({});
      });

      it('input should not have error styling', () => {
        expect(wrapper.find(valueInput(index)).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(valueInputError(index)).exists()).toEqual(false);
      });
    });

    describe('when input touched and valid', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = loadEnumAttributes({ touched: [{ value: true }] });
      });

      it('input should not have error styling', () => {
        expect(wrapper.find(valueInput(index)).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(valueInputError(index)).exists()).toEqual(false);
      });
    });

    describe('when input touched and invalid', () => {
      const error = 'nope';
      let wrapper;

      beforeEach(() => {
        wrapper = loadEnumAttributes({
          touched: [{ value: true }],
          errors: [{ value: error }],
        });
      });

      it('input should have error styling', () => {
        expect(wrapper.find(valueInput(index)).prop('hasError')).toEqual(true);
      });

      it('should not display error', () => {
        expect(wrapper.find(valueInputError(index)).html()).toContain(error);
      });
    });
  });

  describe('label input', () => {
    const index = 0;

    describe('when input not touched', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = loadEnumAttributes({});
      });

      it('input should not have error styling', () => {
        expect(wrapper.find(labelInput(index)).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(labelInputError(index)).exists()).toEqual(false);
      });
    });

    describe('when input touched and valid', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = loadEnumAttributes({ touched: [{ label: true }] });
      });

      it('input should not have error styling', () => {
        expect(wrapper.find(labelInput(index)).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(labelInputError(index)).exists()).toEqual(false);
      });
    });

    describe('when input touched and invalid', () => {
      const error = 'nope';
      let wrapper;

      beforeEach(() => {
        wrapper = loadEnumAttributes({
          touched: [{ label: true }],
          errors: [{ label: error }],
        });
      });

      it('input should have error styling', () => {
        expect(wrapper.find(labelInput(index)).prop('hasError')).toEqual(true);
      });

      it('should not display error', () => {
        expect(wrapper.find(labelInputError(index)).html()).toContain(error);
      });
    });
  });
});
