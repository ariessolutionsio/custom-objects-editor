import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import times from 'lodash/times';
import { Formik } from 'formik';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { TYPES } from '../../constants';
import CustomObjectForm from './custom-object-form';

const project = {
  currencies: times(2, () => faker.finance.currencyCode()),
  languages: times(2, () => faker.random.locale()),
};

const ATTRIBUTES = {
  String: faker.random.words(),
  Object: faker.random.words(),
  Nested: faker.random.words(),
};

const container = {
  id: faker.random.uuid(),
  key: kebabCase(faker.random.words()),
  container: kebabCase(faker.random.words()),
  value: {
    attributes: [
      {
        name: ATTRIBUTES.String,
        type: TYPES.String,
        set: false,
        display: faker.random.boolean(),
        required: faker.random.boolean(),
      },
      {
        name: ATTRIBUTES.Object,
        type: TYPES.Object,
        set: false,
        display: faker.random.boolean(),
        required: faker.random.boolean(),
        attributes: [
          {
            name: ATTRIBUTES.Nested,
            type: TYPES.Number,
            set: false,
            display: faker.random.boolean(),
            required: faker.random.boolean(),
          },
        ],
      },
    ],
  },
};
const value = {
  [camelCase(ATTRIBUTES.String)]: faker.random.words(),
  [camelCase(ATTRIBUTES.Object)]: {
    [camelCase(ATTRIBUTES.Nested)]: faker.random.number({
      min: 1,
      max: 5,
    }),
  },
};

const mocks = {
  containers: [container],
  onSubmit: jest.fn(),
};

const loadCustomObjectForm = (customObject) =>
  shallow(<CustomObjectForm {...mocks} customObject={customObject} />);

describe('custom object form', () => {
  beforeAll(() => {
    jest.spyOn(AppContext, 'useApplicationContext').mockImplementation(() => ({
      project,
    }));
  });

  it('when no custom object given, should initialize form with empty values', () => {
    const wrapper = loadCustomObjectForm();
    expect(wrapper.find(Formik).prop('initialValues')).toEqual({
      container: '',
      key: '',
      value: {},
    });
  });

  it('when custom object value matches container schema, should initialize form with custom object', () => {
    const customObject = {
      container: container.key,
      key: kebabCase(faker.random.words()),
      value,
    };
    const wrapper = loadCustomObjectForm(customObject);
    expect(wrapper.find(Formik).prop('initialValues').value).toEqual(value);
  });

  it('when custom object value does not match container schema with missing attribute, should initialize form with missing attribute', () => {
    const stringValue = faker.random.words();
    const customObject = {
      container: container.key,
      key: kebabCase(faker.random.words()),
      value: {
        [camelCase(ATTRIBUTES.String)]: stringValue,
      },
    };
    const wrapper = loadCustomObjectForm(customObject);
    expect(wrapper.find(Formik).prop('initialValues').value).toEqual({
      [camelCase(ATTRIBUTES.String)]: stringValue,
      [camelCase(ATTRIBUTES.Object)]: {
        [camelCase(ATTRIBUTES.Nested)]: '',
      },
    });
  });

  it('when custom object value does not match container schema with extra attribute, should initialize form without extra attribute', () => {
    const customObject = {
      container: container.key,
      key: kebabCase(faker.random.words()),
      value: {
        ...value,
        [camelCase(faker.random.words())]: faker.random.number({
          min: 1,
          max: 5,
        }),
      },
    };
    const wrapper = loadCustomObjectForm(customObject);
    expect(wrapper.find(Formik).prop('initialValues').value).toEqual(value);
  });

  it('when form submitted, should invoke submit callback with submitted custom object value', () => {
    const customObject = {
      container: JSON.stringify(container),
      key: kebabCase(faker.random.words()),
      value,
    };
    const wrapper = loadCustomObjectForm();
    wrapper.find(Formik).props().onSubmit(customObject);
    expect(mocks.onSubmit).toHaveBeenCalledWith({
      container: container.key,
      key: customObject.key,
      value: customObject.value,
    });
  });
});
