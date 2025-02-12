import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';
import * as ApplicationContext from '@commercetools-frontend/application-shell-connectors';
import useEffectMock from '../../test-utils/use-effect-mock';
import { generateContainers } from '../../test-utils';
import { getAttributeValues } from '../../form-utils';
import Form from './form';

const project = {
  currencies: times(2, () => faker.finance.currencyCode()),
  languages: times(2, () => faker.random.locale()),
};

const containers = generateContainers(2);
const emptyValues = {
  container: '',
  key: '',
  value: {},
};

const mocks = {
  containers: containers.customObjects.results.map(({ id, key, value }) => ({
    id,
    key,
    value,
  })),
  touched: {},
  errors: {},
  dirty: faker.random.boolean(),
  isValid: faker.random.boolean(),
  isSubmitting: faker.random.boolean(),
  handleBlur: jest.fn(),
  handleChange: jest.fn(),
  handleSubmit: jest.fn(),
  setFieldValue: jest.fn(),
};

const loadForm = (initialValues = emptyValues, values = emptyValues) =>
  shallow(<Form {...mocks} initialValues={initialValues} values={values} />);

describe('form', () => {
  beforeAll(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(useEffectMock);
    jest
      .spyOn(ApplicationContext, 'useApplicationContext')
      .mockImplementation(() => ({ project }));
  });

  beforeEach(() => {
    mocks.setFieldValue.mockClear();
  });

  describe('when container not selected', () => {
    beforeEach(() => {
      loadForm();
    });

    it('should not set attributes form value', () => {
      expect(mocks.setFieldValue).not.toHaveBeenCalledWith('attributes');
    });

    it('should not set custom object value form value', () => {
      expect(mocks.setFieldValue).not.toHaveBeenCalledWith('value');
    });
  });

  describe('when container selected with empty initial values (create)', () => {
    const container = mocks.containers[0];
    const { attributes } = container.value;

    beforeEach(() => {
      const wrapper = loadForm();
      wrapper.setProps({
        values: { ...emptyValues, container: JSON.stringify(container) },
      });
    });

    it('should reset attribute form values', () => {
      expect(mocks.setFieldValue).toHaveBeenCalledWith('attributes', null);
    });

    it('should set attributes form value based on selected container', () => {
      expect(mocks.setFieldValue).toHaveBeenCalledWith(
        'attributes',
        attributes
      );
    });

    it('should set custom object value form value based on selected container', () => {
      expect(mocks.setFieldValue).toHaveBeenCalledWith(
        'value',
        getAttributeValues(attributes, project.currencies, project.languages)
      );
    });
  });

  describe('when different container selected with initial values (edit)', () => {
    const initialContainer = mocks.containers[0];
    const selectedContainer = mocks.containers[1];
    const { attributes } = selectedContainer.value;

    beforeEach(() => {
      const wrapper = loadForm({
        ...emptyValues,
        container: JSON.stringify(initialContainer),
      });
      wrapper.setProps({
        values: {
          ...emptyValues,
          container: JSON.stringify(selectedContainer),
        },
      });
    });

    it('should reset attribute form values', () => {
      expect(mocks.setFieldValue).toHaveBeenCalledWith('attributes', null);
    });

    it('should set attributes form value based on selected container', () => {
      expect(mocks.setFieldValue).toHaveBeenCalledWith(
        'attributes',
        attributes
      );
    });

    it('should set custom object value form value based on selected container', () => {
      expect(mocks.setFieldValue).toHaveBeenCalledWith(
        'value',
        getAttributeValues(attributes, project.currencies, project.languages)
      );
    });
  });

  describe('when same container selected with initial values (edit)', () => {
    const initialContainer = mocks.containers[0];
    const { attributes } = initialContainer.value;
    const initialValues = {
      id: faker.random.uuid(),
      container: JSON.stringify(initialContainer),
      values: {
        comment: faker.random.words(),
      },
    };

    beforeEach(() => {
      const wrapper = loadForm(initialValues);
      wrapper.setProps({
        values: { ...emptyValues, container: JSON.stringify(initialContainer) },
      });
    });

    it('should reset attribute form values', () => {
      expect(mocks.setFieldValue).toHaveBeenCalledWith('attributes', null);
    });

    it('should set attributes form value based on selected container', () => {
      expect(mocks.setFieldValue).toHaveBeenCalledWith(
        'attributes',
        attributes
      );
    });

    it('should set custom object value form value to initial custom object value', () => {
      expect(mocks.setFieldValue).toHaveBeenCalledWith(
        'value',
        initialValues.value
      );
    });
  });
});
