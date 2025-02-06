import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import forEach from 'lodash/forEach';
import kebabCase from 'lodash/kebabCase';
import times from 'lodash/times';
import { FieldArray } from 'formik';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import LocalizedEnumAttributes from './localized-enum-attributes';

const languages = times(2, faker.random.locale());
const project = { languages };

const mocks = {
  name: kebabCase(faker.random.words()),
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
};
const fieldArrayMocks = {
  remove: jest.fn(),
  push: jest.fn(),
};

const emptyValue = {
  value: '',
  label: LocalizedTextInput.createLocalizedString(languages),
};

const loadLocalizedEnumAttributes = ({
  value = [emptyValue],
  touched,
  errors,
}) => {
  const wrapper = shallow(
    <LocalizedEnumAttributes
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
const labelInput = (index, language) =>
  `[data-testid="option-label-${index}-${language}"]`;
const labelInputError = (index, language) =>
  `[data-testid="option-label-error-${index}-${language}"]`;

describe('localized enum attributes', () => {
  beforeEach(() => {
    jest.spyOn(AppContext, 'useApplicationContext').mockImplementation(() => ({
      project,
    }));
  });

  it('when add button clicked, should display an additional option', () => {
    const wrapper = loadLocalizedEnumAttributes({});
    wrapper.find('[data-testid="add-enum-option"]').props().onClick();
    expect(fieldArrayMocks.push).toHaveBeenCalledWith(emptyValue);
  });

  it('when remove button clicked, should remove option from display', () => {
    const index = 0;
    const wrapper = loadLocalizedEnumAttributes({});
    wrapper.find(removeButton(index)).props().onClick();
    expect(fieldArrayMocks.remove).toHaveBeenCalledWith(index);
  });

  it('when one option in value, should disable remove button', () => {
    const index = 0;
    const wrapper = loadLocalizedEnumAttributes({});
    expect(wrapper.find(removeButton(index)).prop('isDisabled')).toEqual(true);
  });

  it('when multiple option in value, should enable remove button', () => {
    const index = 0;
    const wrapper = loadLocalizedEnumAttributes({
      value: [emptyValue, emptyValue],
    });
    expect(wrapper.find(removeButton(index)).prop('isDisabled')).toEqual(false);
  });

  describe('value input', () => {
    const index = 0;

    describe('when input not touched', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = loadLocalizedEnumAttributes({});
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
        wrapper = loadLocalizedEnumAttributes({ touched: [{ value: true }] });
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
        wrapper = loadLocalizedEnumAttributes({
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

  it('should display label inputs for each language in project', () => {
    const index = 0;
    const wrapper = loadLocalizedEnumAttributes({});
    forEach(project.languages, (language) => {
      expect(wrapper.find(labelInput(index, language)).exists()).toEqual(true);
    });
  });

  describe('label input', () => {
    const index = 0;
    const language = languages[0];

    describe('when input not touched', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = loadLocalizedEnumAttributes({});
      });

      it('input should not have error styling', () => {
        expect(
          wrapper.find(labelInput(index, language)).prop('hasError')
        ).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(labelInputError(index, language)).exists()).toEqual(
          false
        );
      });
    });

    describe('when input touched and valid', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = loadLocalizedEnumAttributes({
          touched: [{ label: { [language]: true } }],
        });
      });

      it('input should not have error styling', () => {
        expect(
          wrapper.find(labelInput(index, language)).prop('hasError')
        ).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(labelInputError(index, language)).exists()).toEqual(
          false
        );
      });
    });

    describe('when input touched and invalid', () => {
      const error = 'nope';
      let wrapper;

      beforeEach(() => {
        wrapper = loadLocalizedEnumAttributes({
          touched: [{ label: { [language]: true } }],
          errors: [{ label: { [language]: error } }],
        });
      });

      it('input should have error styling', () => {
        expect(
          wrapper.find(labelInput(index, language)).prop('hasError')
        ).toEqual(true);
      });

      it('should not display error', () => {
        expect(wrapper.find(labelInputError(index, language)).html()).toContain(
          error
        );
      });
    });
  });
});
