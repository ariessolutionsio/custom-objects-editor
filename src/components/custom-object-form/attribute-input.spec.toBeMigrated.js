import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import camelCase from 'lodash/camelCase';
import times from 'lodash/times';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import * as ApplicationContext from '@commercetools-frontend/application-shell-connectors';
import {
  REFERENCE_BY,
  REFERENCE_TYPES,
  TYPES,
} from '../../constants';
import { generateContainer } from '../../test-utils';
import { getValueByType } from '../../helpers';
import AttributeInput from './attribute-input';
import messages from './messages';
import AttributeField from './attribute-field';

const dataLocale = faker.random.locale();
const project = {
  currencies: times(2, () => faker.finance.currencyCode()),
  languages: times(2, () => faker.random.locale()),
};
const user = {
  timeZone: faker.random.arrayElement(momentTZ.tz.names()),
};

const mocks = {
  name: camelCase(faker.random.words()),
  title: faker.random.words(),
  onChange: jest.fn(),
  onBlur: jest.fn(),
};

const fieldErrors = '[data-testid="field-error"]';

const loadAttributeInput = ({
  type,
  value,
  touched,
  errors,
  attributes,
  reference,
  isRequired,
  isSet,
  isNestedSet,
}) =>
  shallow(
    <AttributeInput
      {...mocks}
      type={type}
      value={value}
      touched={touched}
      errors={errors}
      attributes={attributes}
      reference={reference}
      isRequired={isRequired}
      isSet={isSet}
      isNestedSet={isNestedSet}
    />
  );

describe('attribute input', () => {
  beforeAll(() => {
    jest
      .spyOn(ApplicationContext, 'useApplicationContext')
      .mockImplementation(() => ({ dataLocale, project, user }));
  });

  describe('string type', () => {
    const type = TYPES.String;
    const input = '[data-testid="field-type-string"]';
    const value = faker.random.word();

    it('should display text input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: false,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('localized string type', () => {
    const type = TYPES.LocalizedString;
    const input = '[data-testid="field-type-i18n-string"]';
    const value = { [dataLocale]: '' };

    it('should display localized text input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: { [dataLocale]: true },
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: { [dataLocale]: false },
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: { [dataLocale]: true },
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('number type', () => {
    const type = TYPES.Number;
    const input = '[data-testid="field-type-number"]';
    const value = faker.random.number({ min: 1, max: 10 });

    it('should display number input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: false,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('boolean type', () => {
    const type = TYPES.Boolean;
    const input = '[data-testid="field-type-boolean"]';
    const value = faker.random.boolean();

    it('should display checkbox input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: false,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('money type', () => {
    const type = TYPES.Money;
    const input = '[data-testid="field-type-money"]';
    const value = {
      amount: JSON.stringify(faker.random.number({ min: 1000, max: 2000 })),
      currencyCode: faker.random.arrayElement(project.currencies),
    };

    it('should display money input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when currency input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: {
            currencyCode: true,
          },
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when amount input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: { amount: true },
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          errors: {
            amount: <FormattedMessage {...messages.requiredFieldError} />,
          },
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when amount input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: { amount: true },
          errors: {
            amount: <FormattedMessage {...messages.requiredFieldError} />,
          },
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('date type', () => {
    const type = TYPES.Date;
    const input = '[data-testid="field-type-date"]';
    const value = moment(faker.date.recent()).format('YYYY-MM-DD');

    it('should display date input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: false,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('time type', () => {
    const type = TYPES.Time;
    const input = '[data-testid="field-type-time"]';
    const value = moment(faker.date.recent()).format('h:mm A');

    it('should display time input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: false,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('datetime type', () => {
    const type = TYPES.DateTime;
    const input = '[data-testid="field-type-datetime"]';
    const value = faker.date.recent().toISOString();

    it('should display datetime input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: false,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('enum type', () => {
    const type = TYPES.Enum;
    const input = '[data-testid="field-type-enum"]';
    const value = faker.random.word();

    it('should display enum input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    it('when input is not required and not in a set, should be clearable', () => {
      const wrapper = loadAttributeInput({
        type,
        value,
        isRequired: false,
        isSet: false,
      });
      expect(wrapper.find(input).prop('isClearable')).toEqual(true);
    });

    it('when input is not required and in a set, should not be clearable', () => {
      const wrapper = loadAttributeInput({
        type,
        value,
        isRequired: false,
        isSet: true,
      });
      expect(wrapper.find(input).prop('isClearable')).toEqual(false);
    });

    it('when input is required and in a set, should not be clearable', () => {
      const wrapper = loadAttributeInput({
        type,
        value,
        isRequired: true,
        isSet: true,
      });
      expect(wrapper.find(input).prop('isClearable')).toEqual(false);
    });

    it('when input is required and not in a set, should not be clearable', () => {
      const wrapper = loadAttributeInput({
        type,
        value,
        isRequired: true,
        isSet: false,
      });
      expect(wrapper.find(input).prop('isClearable')).toEqual(false);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('reference type', () => {
    const type = TYPES.Reference;
    const input = '[data-testid="field-type-reference"]';
    const reference = {
      by: faker.random.arrayElement(Object.values(REFERENCE_BY)),
      type: faker.random.arrayElement(Object.values(REFERENCE_TYPES)),
    };
    const value = {
      typeId: reference.type,
      [reference.by]: faker.random.uuid(),
    };

    it('should display reference input', () => {
      const wrapper = loadAttributeInput({ type, reference, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          reference,
          value,
          touched: { [reference.by]: true },
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          reference,
          value,
          touched: {
            [reference.by]: (
              <FormattedMessage {...messages.requiredFieldError} />
            ),
          },
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          reference,
          value,
          touched: { [reference.by]: true },
          errors: {
            [reference.by]: (
              <FormattedMessage {...messages.requiredFieldError} />
            ),
          },
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('object type', () => {
    const type = TYPES.Object;
    const container = generateContainer();
    const { attributes } = container.value;
    const value = getValueByType(
      type,
      attributes,
      faker.random.arrayElement(Object.values(REFERENCE_TYPES)),
      project.currencies,
      project.languages
    );

    const attributeField = (index) =>
      `[data-testid="field-type-object-${index}"]`;

    it('should display attribute fields', () => {
      const wrapper = loadAttributeInput({
        type,
        value,
        attributes,
      });
      expect(wrapper.find(AttributeField).length).toEqual(attributes.length);
    });

    it('when within a nested set, should pass nested set prop as false to attribute fields', () => {
      const index = 0;
      const wrapper = loadAttributeInput({
        type,
        value,
        attributes,
        isNestedSet: true,
      });
      expect(wrapper.find(attributeField(index)).prop('isNestedSet')).toEqual(
        false
      );
    });

    it('when not within a nested set, should pass nested set prop as is set value to attribute fields', () => {
      const index = 0;
      const isSet = faker.random.boolean();
      const wrapper = loadAttributeInput({
        type,
        value,
        attributes,
        isSet,
        isNestedSet: false,
      });
      expect(wrapper.find(attributeField(index)).prop('isNestedSet')).toEqual(
        isSet
      );
    });
  });

  it('unknown type, should display nothing', () => {
    const wrapper = loadAttributeInput({ type: 'banana' });
    expect(wrapper).toEqual({});
  });
});
